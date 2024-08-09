import avslattImage from '@fpsak-frontend/assets/images/avslaatt.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/check.svg';
import {
  FlexColumn,
  FlexContainer,
  FlexRow,
  Image,
  VerticalSpacer,
  useSaksbehandlerOppslag,
} from '@fpsak-frontend/shared-components';
import { initializeDate } from '@fpsak-frontend/utils';
import { DokumentStatus } from '@k9-sak-web/types';
import { BodyShort, Button } from '@navikt/ds-react';
import { Datepicker, RadioGroupPanel, TextAreaField } from '@navikt/ft-form-hooks';
import {
  dateAfterOrEqual,
  dateBeforeOrEqual,
  hasValidDate,
  hasValidText,
  maxLength,
  minLength,
  required,
} from '@navikt/ft-form-validators';
import { AssessedBy } from '@navikt/ft-plattform-komponenter';
import React, { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { formatDate } from '../utils';
import { FormState } from './FormState';
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
  toggleEditForm: React.Dispatch<React.SetStateAction<boolean>>;
  erOverstyrt?: boolean;
  redigerVurdering?: boolean;
  dokumentErVurdert: boolean;
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
  skalViseBegrunnelse = true,
  dokument,
  erAktivtDokument,
  dokumentIndex,
  toggleEditForm,
  erOverstyrt,
  redigerVurdering,
  dokumentErVurdert,
}: SoknadsfristVilkarDokumentProps) => {
  const { getValues } = useFormContext<FormState>();
  const harBegrunnelse = !!getValues('avklarteKrav')[dokumentIndex]?.begrunnelse;
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();
  const opprettetAv = hentSaksbehandlerNavn(dokument?.avklarteOpplysninger?.opprettetAv);
  const opprettetTidspunkt = dokument?.avklarteOpplysninger?.opprettetTidspunkt;
  const minDate = useMemo(
    () =>
      dokument.status.reduce(
        (acc, curr) => (!acc || initializeDate(curr.periode.fom) < initializeDate(acc) ? curr.periode.fom : acc),
        '',
      ),
    [dokument.journalpostId],
  );
  const maxDate = useMemo(
    () =>
      dokument.status.reduce(
        (acc, curr) => (!acc || initializeDate(curr.periode.tom) > initializeDate(acc) ? curr.periode.tom : acc),
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
        <div className={`flex max-w-[50%] ${redigerVurdering ? 'items-baseline' : ''}`}>
          <div>
            <VerticalSpacer eightPx />
            <TextAreaField
              name={`avklarteKrav.${dokumentIndex}.begrunnelse`}
              label="Vurder om det har vært fristavbrytende kontakt"
              validate={[required, minLength3, maxLength1500, hasValidText]}
              maxLength={1500}
              readOnly={readOnly}
              placeholder="Begrunn vurderingen din"
            />
            <AssessedBy name={opprettetAv} date={opprettetTidspunkt} />
          </div>
          {!erOverstyrt && dokumentErVurdert && harBegrunnelse && !redigerVurdering && (
            <div className="ml-2 flex-[1_0_auto]">
              <VerticalSpacer eightPx />
              <Button
                className={styles.editButton}
                variant="tertiary"
                size="xsmall"
                onClick={() => {
                  toggleEditForm(true);
                }}
              >
                Rediger vurdering
              </Button>
            </div>
          )}
        </div>
      )}
      <VerticalSpacer sixteenPx />
      {readOnly && erVilkarOk !== undefined && (
        <FlexContainer>
          <FlexRow>
            <FlexColumn>
              <Image className={styles.image} src={erVilkarOk ? innvilgetImage : avslattImage} />
            </FlexColumn>
            <FlexColumn>
              {erVilkarOk && <BodyShort size="small">Vilkåret er oppfylt for hele perioden</BodyShort>}
              {!erVilkarOk && (
                <BodyShort size="small">
                  Vilkåret er <b>ikke</b> oppfylt for denne perioden
                </BodyShort>
              )}
            </FlexColumn>
          </FlexRow>
          <VerticalSpacer eightPx />
        </FlexContainer>
      )}
      {(!readOnly || erVilkarOk === undefined) && (
        <RadioGroupPanel
          name={`avklarteKrav.${dokumentIndex}.erVilkarOk`}
          validate={[required]}
          isHorizontal={false}
          isReadOnly={readOnly}
          radios={[
            {
              value: 'true',
              label: 'Vilkåret er oppfylt for hele perioden',
            },
            {
              value: DELVIS_OPPFYLT,
              label: 'Vilkåret er oppfylt for deler av perioden',
              element: (
                <div className="my-2">
                  <Datepicker
                    name={`avklarteKrav.${dokumentIndex}.fraDato`}
                    label="Oppgi dato søknadsfristvilkåret er oppfylt fra"
                    validate={[required, hasValidDate, isAtleastDate, isAtmostDate]}
                    isReadOnly={readOnly}
                    disabledDays={{
                      fromDate: initializeDate(minDate).toDate(),
                      toDate: initializeDate(maxDate).toDate(),
                    }}
                  />
                </div>
              ),
            },
            {
              value: 'false',
              label: (
                <>
                  Vilkåret er <b>ikke</b> oppfylt for denne perioden
                </>
              ),
            },
          ]}
        />
      )}
      <VerticalSpacer eightPx />
    </div>
  );
};

export default SoknadsfristVilkarDokument;
