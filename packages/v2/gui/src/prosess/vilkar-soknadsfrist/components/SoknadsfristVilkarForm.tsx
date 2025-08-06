import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { aksjonspunktType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktType.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Alert, Button, HStack, Label } from '@navikt/ds-react';
import { decodeHtmlEntity } from '@navikt/ft-utils';
import type { Periode, VilkårPeriodeDto } from '@navikt/k9-sak-typescript-client';
import { Dayjs } from 'dayjs';
import hash from 'object-hash';
import { useState, type SetStateAction } from 'react';
import { useForm } from 'react-hook-form';

import OverstyrBekreftKnappPanel from '@k9-sak-web/gui/shared/overstyrBekreftKnappPanel/OverstyrBekreftKnappPanel.js';
import { RhfForm } from '@navikt/ft-form-hooks';
import type { KravDokument } from '../types/KravDokumentStatus';
import type { SoknadsfristAksjonspunktType } from '../types/SoknadsfristAksjonspunktType';
import type { SubmitData } from '../types/submitCallback';
import { utledInnsendtSoknadsfrist } from '../utils';
import type { FormState } from './FormState';
import SoknadsfristVilkarDokument, { DELVIS_OPPFYLT } from './SoknadsfristVilkarDokument';
import styles from './SoknadsfristVilkarForm.module.css';

/**
 * Temporær fiks for saksbehandlere som setter dato og forventer at
 * backend skal telle fra og meg datoen de setter.
 *
 * Backend teller fra dagen etter..
 */
const minusEnDag = (dato: string | Dayjs) => initializeDate(dato).subtract(1, 'days').format('YYYY-MM-DD');
const plusEnDag = (dato: string | Dayjs) => initializeDate(dato).add(1, 'days').format('YYYY-MM-DD');

const buildInitialValues = (
  aksjonspunkter: SoknadsfristAksjonspunktType[],
  alleDokumenter: KravDokument[],
  status: string,
): FormState => {
  const overstyrtAksjonspunkt = aksjonspunkter.find(
    ap => ap.definisjon === aksjonspunktkodeDefinisjonType.OVERSTYR_SOKNADSFRISTVILKAR,
  );

  return {
    isOverstyrt: overstyrtAksjonspunkt !== undefined,
    avklarteKrav: alleDokumenter.map(dokument => {
      const fraDato = dokument.overstyrteOpplysninger?.fraDato || dokument.avklarteOpplysninger?.fraDato;
      const innsendtSoknadsfrist = dokument.innsendingstidspunkt
        ? utledInnsendtSoknadsfrist(dokument.innsendingstidspunkt)
        : '';

      const erAvklartEllerOverstyrt = !!fraDato;

      const erDelvisOppfylt = status !== vilkårStatus.OPPFYLT && fraDato && plusEnDag(fraDato) !== innsendtSoknadsfrist;
      const erVilkarOk = erDelvisOppfylt ? DELVIS_OPPFYLT : status === vilkårStatus.OPPFYLT ? 'true' : 'false';
      return {
        erVilkarOk: erAvklartEllerOverstyrt ? erVilkarOk : null,
        begrunnelse: decodeHtmlEntity(
          dokument.overstyrteOpplysninger?.begrunnelse || dokument.avklarteOpplysninger?.begrunnelse || '',
        ),
        journalpostId: dokument.journalpostId,
        fraDato: fraDato ? plusEnDag(fraDato) : '',
      };
    }),
  };
};

const transformValues = (
  values: FormState,
  alleDokumenter: KravDokument[],
  apKode: string,
  periodeFom: string,
  periodeTom: string,
): {
  kode: string;
  begrunnelse: string;
  avklarteKrav: FormState['avklarteKrav'];
  erVilkarOk: boolean;
  periode?: Periode;
} => ({
  kode: apKode,
  begrunnelse: values.avklarteKrav.map(krav => krav.begrunnelse).join('\n'),
  avklarteKrav: values.avklarteKrav.map(krav => {
    const dokumentStatus = alleDokumenter.find(d => d.journalpostId === krav.journalpostId);
    const erVilkarOk = `${krav.erVilkarOk}` === 'true' || krav.erVilkarOk === DELVIS_OPPFYLT;

    const fraDato = (() => {
      switch (krav.erVilkarOk) {
        case 'true':
          return dokumentStatus?.status?.reduce(
            (acc, curr) =>
              !acc || (curr.periode.fom && initializeDate(curr.periode.fom).isBefore(initializeDate(acc)))
                ? curr.periode.fom
                : acc,
            dokumentStatus.status?.[0]?.periode.fom,
          );

        case DELVIS_OPPFYLT:
          return krav.fraDato;

        default:
          return dokumentStatus?.innsendingstidspunkt
            ? utledInnsendtSoknadsfrist(dokumentStatus.innsendingstidspunkt)?.toString()
            : '';
      }
    })();
    return {
      ...krav,
      erVilkarOk,
      godkjent: erVilkarOk,
      // fjern 'minusEnDag' hvis backend oppdateres..
      fraDato: fraDato ? minusEnDag(fraDato) : '',
    };
  }),
  erVilkarOk: !values.avklarteKrav.some(krav => !krav.erVilkarOk || krav.erVilkarOk === 'false'),
  periode: periodeFom && periodeTom ? { fom: periodeFom, tom: periodeTom } : undefined,
});

interface SoknadsfristVilkarFormProps {
  aksjonspunkter: SoknadsfristAksjonspunktType[];
  submitCallback: (props: SubmitData[]) => void;
  periode: VilkårPeriodeDto;
  erOverstyrt?: boolean;
  harÅpentAksjonspunkt: boolean;
  overrideReadOnly: boolean;
  status: string;
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  alleDokumenter: KravDokument[];
  dokumenterIAktivPeriode?: KravDokument[];
  kanEndrePåSøknadsopplysninger: boolean;
}

/**
 * VilkarresultatForm
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const SoknadsfristVilkarForm = ({
  erOverstyrt,
  harÅpentAksjonspunkt,
  overrideReadOnly,
  toggleOverstyring,
  alleDokumenter,
  dokumenterIAktivPeriode,
  aksjonspunkter,
  periode,
  status,
  submitCallback,
  kanEndrePåSøknadsopplysninger,
}: SoknadsfristVilkarFormProps) => {
  const formMethods = useForm<FormState>({
    defaultValues: buildInitialValues(aksjonspunkter, alleDokumenter, status),
  });
  const [editForm, setEditForm] = useState(false);

  const toggleEditForm = (shouldEdit: boolean) => {
    setEditForm(shouldEdit);
    if (!shouldEdit) {
      formMethods.reset(buildInitialValues(aksjonspunkter, alleDokumenter, status));
    }
  };
  const aksjonspunkt = erOverstyrt
    ? aksjonspunkter.find(ap => ap.definisjon === aksjonspunktkodeDefinisjonType.OVERSTYR_SOKNADSFRISTVILKAR)
    : aksjonspunkter.find(
        ap => ap.definisjon === aksjonspunktkodeDefinisjonType.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
      );

  const harAksjonspunkt = aksjonspunkt !== undefined;
  const periodeFom = periode?.periode?.fom ?? '';
  const periodeTom = periode?.periode?.tom ?? '';
  const aksjonspunktCode =
    erOverstyrt || !harAksjonspunkt
      ? aksjonspunktkodeDefinisjonType.OVERSTYR_SOKNADSFRISTVILKAR
      : aksjonspunktkodeDefinisjonType.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST;

  const harLøstManueltAksjonspunkt = aksjonspunkter.some(
    ap =>
      ap.definisjon === aksjonspunktkodeDefinisjonType.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST &&
      ap.aksjonspunktType === aksjonspunktType.MANUELL &&
      ap.status === aksjonspunktStatus.UTFØRT,
  );

  const isSolvable =
    erOverstyrt ||
    (harÅpentAksjonspunkt || harLøstManueltAksjonspunkt || harAksjonspunkt
      ? !(aksjonspunkt?.status && aksjonspunkt.status === aksjonspunktStatus.OPPRETTET && !aksjonspunkt.kanLoses)
      : false);

  const isReadOnly = overrideReadOnly || !periode?.vurderesIBehandlingen;

  const toggleAv = () => {
    formMethods.reset();
    toggleOverstyring(oldArray =>
      oldArray.filter(code => code !== aksjonspunktkodeDefinisjonType.OVERSTYR_SOKNADSFRISTVILKAR),
    );
  };

  const handleSubmit = (values: FormState) => {
    submitCallback([transformValues(values, alleDokumenter, aksjonspunktCode, periodeFom, periodeTom)]);
  };

  const AksjonspunktText = () => {
    if (harLøstManueltAksjonspunkt && !editForm) {
      return (
        <Label className="mt-2" size="small" as="p">
          Vurder om søknadsfristvilkåret er oppfylt
        </Label>
      );
    }
    if (!isReadOnly) {
      if (harÅpentAksjonspunkt || editForm) {
        return (
          <div className="mt-2">
            <Alert variant="warning" size="small">
              Vurder om søknadsfristvilkåret er oppfylt
            </Alert>
          </div>
        );
      }
      if (erOverstyrt) {
        return (
          <Label className="mt-2" size="small" as="p">
            Manuell overstyring av automatisk vurdering
          </Label>
        );
      }
    }
    return <></>;
  };

  return (
    <RhfForm formMethods={formMethods} onSubmit={handleSubmit}>
      {Array.isArray(dokumenterIAktivPeriode) && dokumenterIAktivPeriode.length > 0 && (
        <div
          className={`${styles.aksjonspunkt} ${erOverstyrt || harÅpentAksjonspunkt || editForm ? styles.apentAksjonspunkt : ''}`}
        >
          {(erOverstyrt || harÅpentAksjonspunkt || editForm) && <AksjonspunktText />}
          {Array.isArray(alleDokumenter) && alleDokumenter.length > 0
            ? alleDokumenter.map((dokument, index) => {
                const documentHash = hash(dokument);
                return (
                  <SoknadsfristVilkarDokument
                    key={documentHash}
                    erAktivtDokument={dokumenterIAktivPeriode.findIndex(d => hash(d) === documentHash) > -1}
                    skalViseBegrunnelse={erOverstyrt || harAksjonspunkt || editForm}
                    readOnly={(isReadOnly || (!erOverstyrt && !harÅpentAksjonspunkt)) && !editForm}
                    dokumentIndex={index}
                    dokument={dokument}
                    toggleEditForm={toggleEditForm}
                    erOverstyrt={erOverstyrt}
                    redigerVurdering={editForm}
                    dokumentErVurdert={status !== vilkårStatus.IKKE_VURDERT}
                    periode={periode}
                    kanEndrePåSøknadsopplysninger={kanEndrePåSøknadsopplysninger}
                  />
                );
              })
            : 'Det finnes ingen dokumenter knyttet til denne behandlingen'}
          <div className="mt-4" />

          {erOverstyrt && (
            <>
              <div className="flex gap-2 items-center">
                <ExclamationmarkTriangleFillIcon
                  title="Aksjonspunkt"
                  fontSize="1.5rem"
                  className="text-[var(--ac-alert-icon-warning-color,var(--a-icon-warning))] text-2xl"
                />
                <Label size="small" as="p">
                  Overstyring skal kun gjøres i unntakstilfeller
                </Label>
              </div>
              <div className="mt-4" />
              <HStack gap="space-16">
                <OverstyrBekreftKnappPanel
                  disabled={!formMethods.formState.isValid}
                  submitting={formMethods.formState.isSubmitting}
                  pristine={!isSolvable || !formMethods.formState.isDirty}
                  overrideReadOnly={overrideReadOnly}
                />
                <Button
                  size="small"
                  variant="secondary"
                  type="button"
                  loading={formMethods.formState.isSubmitting}
                  disabled={formMethods.formState.isSubmitting}
                  onClick={toggleAv}
                >
                  Avbryt
                </Button>
              </HStack>
            </>
          )}
          {(harÅpentAksjonspunkt || editForm) && !erOverstyrt && (
            <HStack gap="space-16">
              <Button
                variant="primary"
                size="small"
                loading={formMethods.formState.isSubmitting}
                disabled={!formMethods.formState.isValid || formMethods.formState.isSubmitting}
              >
                Bekreft og gå videre
              </Button>
              {editForm && (
                <Button
                  size="small"
                  variant="secondary"
                  type="button"
                  loading={formMethods.formState.isSubmitting}
                  disabled={formMethods.formState.isSubmitting}
                  onClick={() => {
                    toggleEditForm(false);
                  }}
                >
                  Avbryt
                </Button>
              )}
            </HStack>
          )}
        </div>
      )}
    </RhfForm>
  );
};

export default SoknadsfristVilkarForm;
