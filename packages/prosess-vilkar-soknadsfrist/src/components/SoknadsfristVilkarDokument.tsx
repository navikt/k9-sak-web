import avslattImage from '@fpsak-frontend/assets/images/avslaatt.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/check.svg';
import { DatepickerField, RadioGroupField, TextAreaField } from '@fpsak-frontend/form';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  dateAfterOrEqual,
  dateBeforeOrEqual,
  hasValidDate,
  hasValidText,
  maxLength,
  minLength,
  required,
  requiredIfNotPristine,
} from '@fpsak-frontend/utils';
import { DokumentStatus } from '@k9-sak-web/types';
import { BodyShort } from '@navikt/ds-react';
import { AssessedBy } from '@navikt/ft-plattform-komponenter';
import moment from 'moment';
import React, { useCallback, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { formatDate } from '../utils';

import styles from './SoknadsfristVilkarDokument.module.css';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
interface SoknadsfristVilkarDokumentProps {
  erVilkarOk?: boolean | string;
  readOnly: boolean;
  skalViseBegrunnelse?: boolean;
  dokument: DokumentStatus;
  dokumentIndex: number;
  erAktivtDokument: boolean;
  saksbehandlere: { [key: string]: string };
}

export const DELVIS_OPPFYLT = 'DELVIS_OPPFYLT';

/**
 * SoknadsfristVilkarDokument
 *
 * Presentasjonskomponent. Viser resultat av søknadsfristvilkåret når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const SoknadsfristVilkarDokument = ({
  erVilkarOk,
  readOnly,
  skalViseBegrunnelse,
  dokument,
  erAktivtDokument,
  dokumentIndex,
  saksbehandlere,
}: SoknadsfristVilkarDokumentProps) => {
  const intl = useIntl();
  const opprettetAv = dokument?.avklarteOpplysninger?.opprettetAv;
  const opprettetTidspunkt = dokument?.avklarteOpplysninger?.opprettetTidspunkt;
  const minDate = useMemo(
    () =>
      dokument.status.reduce(
        (acc, curr) => (!acc || moment(curr.periode.fom) < moment(acc) ? curr.periode.fom : acc),
        '',
      ),
    [dokument.journalpostId],
  );
  const maxDate = useMemo(
    () =>
      dokument.status.reduce(
        (acc, curr) => (!acc || moment(curr.periode.tom) > moment(acc) ? curr.periode.tom : acc),
        '',
      ),
    [dokument.innsendingstidspunkt, dokument.journalpostId],
  );

  const isAtleastDate = useCallback(v => dateAfterOrEqual(minDate)(v), [minDate]);
  const isAtmostDate = useCallback(v => dateBeforeOrEqual(maxDate)(v), [maxDate]);
  return (
    <div style={{ display: erAktivtDokument ? 'block' : 'none' }}>
      <p>
        {dokument.type} innsendt {formatDate(dokument.innsendingstidspunkt)}{' '}
        <small>(journalpostId: {dokument.journalpostId})</small>
      </p>
      {skalViseBegrunnelse && (
        <>
          <VerticalSpacer eightPx />
          <TextAreaField
            name={`avklarteKrav.${dokumentIndex}.begrunnelse`}
            label={intl.formatMessage({ id: 'VilkarBegrunnelse.Vilkar' })}
            validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
            placeholder={intl.formatMessage({ id: 'VilkarBegrunnelse.BegrunnVurdering' })}
          />
          <AssessedBy name={saksbehandlere[opprettetAv] || opprettetAv} date={opprettetTidspunkt} />
        </>
      )}
      <VerticalSpacer sixteenPx />
      {readOnly && erVilkarOk !== undefined && (
        <FlexContainer>
          <FlexRow>
            <FlexColumn>
              <Image className={styles.image} src={erVilkarOk ? innvilgetImage : avslattImage} />
            </FlexColumn>
            <FlexColumn>
              {erVilkarOk && (
                <BodyShort size="small">
                  <FormattedMessage id="SoknadsfristVilkarForm.ErOppfylt" values={{ b: chunks => <b>{chunks}</b> }} />
                </BodyShort>
              )}
              {!erVilkarOk && (
                <BodyShort size="small">
                  <FormattedMessage
                    id="SoknadsfristVilkarForm.VilkarIkkeOppfylt"
                    values={{ b: chunks => <b>{chunks}</b> }}
                  />
                </BodyShort>
              )}
            </FlexColumn>
          </FlexRow>
          <VerticalSpacer eightPx />
        </FlexContainer>
      )}
      {(!readOnly || erVilkarOk === undefined) && (
        <RadioGroupField
          name={`avklarteKrav.${dokumentIndex}.erVilkarOk`}
          validate={[required]}
          bredde="XXL"
          isVertical
          readOnly={readOnly}
          radios={[
            {
              value: true,
              label: (
                <FormattedMessage id="SoknadsfristVilkarForm.ErOppfylt" values={{ b: chunks => <b>{chunks}</b> }} />
              ),
            },
            {
              value: DELVIS_OPPFYLT,
              label: (
                <FormattedMessage
                  id="SoknadsfristVilkarForm.ErDelvisOppfylt"
                  values={{ b: chunks => <b>{chunks}</b> }}
                />
              ),
              element: (
                <div className="my-2">
                  <DatepickerField
                    name={`avklarteKrav.${dokumentIndex}.fraDato`}
                    label={{ id: 'SoknadsfristVilkarForm.Dato' }}
                    validate={[required, hasValidDate, isAtleastDate, isAtmostDate]}
                    readOnly={readOnly}
                    disabledDays={{
                      before: moment(minDate, 'YYYY-MM-DD').toDate(),
                      after: moment(maxDate, 'YYYY-MM-DD').toDate(),
                    }}
                  />
                </div>
              ),
            },
            {
              value: false,
              label: (
                <FormattedMessage
                  id="SoknadsfristVilkarForm.VilkarIkkeOppfylt"
                  values={{ b: chunks => <b>{chunks}</b> }}
                />
              ),
            },
          ]}
        />
      )}
      <VerticalSpacer eightPx />
    </div>
  );
};

SoknadsfristVilkarDokument.defaultProps = {
  erVilkarOk: undefined,
  skalViseBegrunnelse: true,
};

export default SoknadsfristVilkarDokument;
