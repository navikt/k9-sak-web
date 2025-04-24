import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
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
import type { VilkårPeriodeDto } from '@navikt/k9-sak-typescript-client';
import { useCallback, useMemo } from 'react';
import RadioGroupPanel from '../../../shared/hook-form/RadioGroupPanel';
import type { KravDokument } from '../types/KravDokumentStatus';
import { formatDate } from '../utils';
import styles from './SoknadsfristVilkarDokument.module.css';
import type { Dayjs } from 'dayjs';
import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';
const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
interface SoknadsfristVilkarDokumentProps {
  readOnly: boolean;
  skalViseBegrunnelse?: boolean;
  dokument: KravDokument;
  dokumentIndex: number;
  erAktivtDokument: boolean;
  toggleEditForm: (shouldEdit: boolean) => void;
  erOverstyrt?: boolean;
  redigerVurdering?: boolean;
  dokumentErVurdert: boolean;
  periode: VilkårPeriodeDto;
  kanEndrePåSøknadsopplysninger: boolean;
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
  kanEndrePåSøknadsopplysninger,
}: SoknadsfristVilkarDokumentProps) => {
  const erVilkarOk = readOnly && dokumentErVurdert && periode.vilkarStatus === 'OPPFYLT';
  const opprettetTidspunkt = dokument?.avklarteOpplysninger?.opprettetTidspunkt;
  const minDate = useMemo(
    () =>
      dokument.status?.reduce(
        (acc, curr) => (!acc || initializeDate(curr.periode.fom) < initializeDate(acc) ? curr.periode.fom : acc),
        '',
      ),
    [dokument.journalpostId],
  );
  const maxDate = useMemo(
    () =>
      dokument.status?.reduce(
        (acc, curr) => (!acc || initializeDate(curr.periode.tom) > initializeDate(acc) ? curr.periode.tom : acc),
        '',
      ),
    [dokument.innsendingstidspunkt, dokument.journalpostId],
  );

  const isAtleastDate = useCallback((v: string | Dayjs | undefined) => dateAfterOrEqual(minDate)(v), [minDate]);
  const isAtmostDate = useCallback((v: string | Dayjs | undefined) => dateBeforeOrEqual(maxDate)(v), [maxDate]);
  const showRedigerVurderingButton =
    !erOverstyrt && dokumentErVurdert && !redigerVurdering && kanEndrePåSøknadsopplysninger;

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
              <VurdertAv ident={dokument?.avklarteOpplysninger?.opprettetAv} date={opprettetTidspunkt} />
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
        <RadioGroupPanel
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
      {showRedigerVurderingButton && (
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
