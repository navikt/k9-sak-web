import { RadioGroupPanelRHF } from '@fpsak-frontend/form';
import { useSaksbehandlerOppslag } from '@fpsak-frontend/shared-components';
import { initializeDate } from '@fpsak-frontend/utils';
import { DokumentStatus, Vilkarperiode } from '@k9-sak-web/types';
import { CheckmarkIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { BodyShort, Button } from '@navikt/ds-react';
import { Datepicker, TextAreaField } from '@navikt/ft-form-hooks';
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
  readOnly: boolean;
  skalViseBegrunnelse?: boolean;
  dokument: DokumentStatus;
  dokumentIndex: number;
  erAktivtDokument: boolean;
  toggleEditForm: React.Dispatch<React.SetStateAction<boolean>>;
  erOverstyrt?: boolean;
  redigerVurdering?: boolean;
  dokumentErVurdert: boolean;
  periode?: Vilkarperiode;
}

export const DELVIS_OPPFYLT = 'DELVIS_OPPFYLT';

/**
 * SoknadsfristVilkarDokument
 *
 * Presentasjonskomponent. Viser resultat av søknadsfristvilkåret når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const SoknadsfristVilkarDokument = ({
  readOnly,
  skalViseBegrunnelse = true,
  dokument,
  erAktivtDokument,
  dokumentIndex,
  toggleEditForm,
  erOverstyrt,
  redigerVurdering,
  dokumentErVurdert,
  periode,
}: SoknadsfristVilkarDokumentProps) => {
  const { getValues } = useFormContext<FormState>();
  const harBegrunnelse = !!getValues('avklarteKrav')[dokumentIndex]?.begrunnelse;
  const erVilkarOk = readOnly && dokumentErVurdert && periode.vilkarStatus.kode === 'OPPFYLT';
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
        <>
          <div>
            <div>
              <div className="mt-2" />
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
          </div>
        </>
      )}
      <div className="mt-4" />
      {readOnly && erVilkarOk !== undefined && (
        <>
          <div className="flex">
            <div className="px-2">
              {erVilkarOk ? (
                <CheckmarkIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
              ) : (
                <XMarkOctagonIcon fontSize={20} style={{ color: 'var(--a-surface-danger)' }} />
              )}
            </div>
            <div className="px-2">
              {erVilkarOk && <BodyShort size="small">Vilkåret er oppfylt for hele perioden</BodyShort>}
              {!erVilkarOk && (
                <BodyShort size="small">
                  Vilkåret er <b>ikke</b> oppfylt for denne perioden
                </BodyShort>
              )}
            </div>
          </div>
          <div className="mt-2" />
        </>
      )}
      {(!readOnly || erVilkarOk === undefined) && (
        <RadioGroupPanelRHF
          name={`avklarteKrav.${dokumentIndex}.erVilkarOk`}
          validators={{ required }}
          readOnly={readOnly}
          question="Er vilkåret oppfylt for perioden?"
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
                    disabledDays={[
                      {
                        before: initializeDate(minDate).toDate(),
                        after: initializeDate(maxDate).toDate(),
                      },
                    ]}
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
      {!erOverstyrt && dokumentErVurdert && harBegrunnelse && !redigerVurdering && (
        <div>
          <div className="mt-2" />
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
      <div className="mt-2" />
    </div>
  );
};

export default SoknadsfristVilkarDokument;