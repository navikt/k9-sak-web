import React, { useMemo, useCallback } from 'react';
import moment from 'moment';
import { FormattedMessage, useIntl } from 'react-intl';
import { DatepickerField, RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import {
  hasValidText,
  hasValidDate,
  dateAfterOrEqual,
  dateBeforeOrEqual,
  maxLength,
  minLength,
  requiredIfNotPristine,
  required,
} from '@fpsak-frontend/utils';

import { DokumentStatus } from '@k9-sak-web/types';
import {
  VerticalSpacer,
  FlexContainer,
  FlexRow,
  FlexColumn,
  Image,
  useFeatureToggles,
} from '@fpsak-frontend/shared-components';
import avslattImage from '@fpsak-frontend/assets/images/avslaatt.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/check.svg';

import { Normaltekst } from 'nav-frontend-typografi';

import { utledInnsendtSoknadsfrist, formatDate } from '../utils';

import styles from './SoknadsfristVilkarDokument.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
interface SoknadsfristVilkarDokumentProps {
  erVilkarOk?: boolean | string;
  readOnly: boolean;
  skalViseBegrunnelse?: boolean;
  dokument: DokumentStatus;
  dokumentIndex: number;
  erAktivtDokument: boolean;
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
}: SoknadsfristVilkarDokumentProps) => {
  const intl = useIntl();
  const [featureToggles] = useFeatureToggles();
  const minDate = useMemo(
    () =>
      dokument.status.reduce(
        (acc, curr) => (!acc || moment(curr.periode.fom) < moment(acc) ? curr.periode.fom : acc),
        '',
      ),
    [dokument.journalpostId],
  );
  const maxDate = useMemo(() => {
    if (featureToggles?.FIX_SOKNADSFRIST_KALENDER_OG_READONLY) {
      return dokument.status.reduce(
        (acc, curr) => (!acc || moment(curr.periode.tom) > moment(acc) ? curr.periode.tom : acc),
        '',
      );
    }
    return utledInnsendtSoknadsfrist(dokument.innsendingstidspunkt);
  }, [dokument.innsendingstidspunkt, dokument.journalpostId]);

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
                <Normaltekst>
                  <FormattedMessage id="SoknadsfristVilkarForm.ErOppfylt" values={{ b: chunks => <b>{chunks}</b> }} />
                </Normaltekst>
              )}
              {!erVilkarOk && (
                <Normaltekst>
                  <FormattedMessage
                    id="SoknadsfristVilkarForm.VilkarIkkeOppfylt"
                    values={{ b: chunks => <b>{chunks}</b> }}
                  />
                </Normaltekst>
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
          direction="vertical"
          readOnly={readOnly}
        >
          {({ value, optionProps }) => (
            <FlexContainer>
              <FlexColumn className={styles.fullBreddeIE}>
                <FlexRow spaceBetween={false}>
                  <RadioOption
                    label={
                      <FormattedMessage
                        id="SoknadsfristVilkarForm.ErOppfylt"
                        values={{ b: chunks => <b>{chunks}</b> }}
                      />
                    }
                    value
                    {...optionProps}
                  />
                </FlexRow>
                <FlexRow spaceBetween={false}>
                  <RadioOption
                    label={
                      <FormattedMessage
                        id="SoknadsfristVilkarForm.ErDelvisOppfylt"
                        values={{ b: chunks => <b>{chunks}</b> }}
                      />
                    }
                    value={DELVIS_OPPFYLT}
                    {...optionProps}
                  />
                </FlexRow>
                {value === DELVIS_OPPFYLT && (
                  <FlexRow spaceBetween={false}>
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
                  </FlexRow>
                )}
                <FlexRow spaceBetween={false}>
                  <RadioOption
                    label={
                      <FormattedMessage
                        id="SoknadsfristVilkarForm.VilkarIkkeOppfylt"
                        values={{ b: chunks => <b>{chunks}</b> }}
                      />
                    }
                    value={false}
                    {...optionProps}
                  />
                </FlexRow>
              </FlexColumn>
            </FlexContainer>
          )}
        </RadioGroupField>
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
