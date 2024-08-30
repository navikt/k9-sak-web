import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { AksjonspunktBox, AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity, initializeDate } from '@fpsak-frontend/utils';
import { Aksjonspunkt, DokumentStatus, Periode, SubmitCallback } from '@k9-sak-web/types';
import Vilkarperiode from '@k9-sak-web/types/src/vilkarperiode';
import { Button, Label } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';
import { Dayjs } from 'dayjs';
import hash from 'object-hash';
import { SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';

import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { utledInnsendtSoknadsfrist } from '../utils';
import { FormState } from './FormState';
import OverstyrBekreftKnappPanel from './OverstyrBekreftKnappPanel';
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
  aksjonspunkter: Aksjonspunkt[],
  alleDokumenter: DokumentStatus[],
  status: string,
): FormState => {
  const overstyrtAksjonspunkt = aksjonspunkter.find(
    ap => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR,
  );

  return {
    isOverstyrt: overstyrtAksjonspunkt !== undefined,
    avklarteKrav: alleDokumenter.map(dokument => {
      const fraDato = dokument.overstyrteOpplysninger?.fraDato || dokument.avklarteOpplysninger?.fraDato;
      const innsendtSoknadsfrist = utledInnsendtSoknadsfrist(dokument.innsendingstidspunkt);

      const erAvklartEllerOverstyrt = !!fraDato;

      const erDelvisOppfylt =
        status !== vilkarUtfallType.OPPFYLT && fraDato && plusEnDag(fraDato) !== innsendtSoknadsfrist;
      const erVilkarOk = erDelvisOppfylt ? DELVIS_OPPFYLT : status === vilkarUtfallType.OPPFYLT ? 'true' : 'false';
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
  alleDokumenter: DokumentStatus[],
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
          return dokumentStatus.status.reduce(
            (acc, curr) =>
              !acc || initializeDate(curr.periode.fom).isBefore(initializeDate(acc)) ? curr.periode.fom : acc,
            dokumentStatus.status[0].periode.fom,
          );

        case DELVIS_OPPFYLT:
          return krav.fraDato;

        default:
          return utledInnsendtSoknadsfrist(dokumentStatus.innsendingstidspunkt);
      }
    })();
    return {
      ...krav,
      erVilkarOk,
      godkjent: erVilkarOk,
      // fjern 'minusEnDag' hvis backend oppdateres..
      fraDato: minusEnDag(fraDato),
    };
  }),
  erVilkarOk: !values.avklarteKrav.some(krav => !krav.erVilkarOk || krav.erVilkarOk === 'false'),
  periode: periodeFom && periodeTom ? { fom: periodeFom, tom: periodeTom } : undefined,
});

interface SoknadsfristVilkarFormProps {
  aksjonspunkter: Aksjonspunkt[];
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (props: SubmitCallback[]) => void;
  periode?: Vilkarperiode;
  erOverstyrt?: boolean;
  harÅpentAksjonspunkt: boolean;
  overrideReadOnly: boolean;
  status: string;
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  alleDokumenter?: DokumentStatus[];
  dokumenterIAktivPeriode?: DokumentStatus[];
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
}: SoknadsfristVilkarFormProps) => {
  const formMethods = useForm<FormState>({ defaultValues: buildInitialValues(aksjonspunkter, alleDokumenter, status) });
  const [editForm, setEditForm] = useState(false);

  const toggleEditForm = (shouldEdit: boolean) => {
    setEditForm(shouldEdit);
    if (!shouldEdit) {
      formMethods.reset(buildInitialValues(aksjonspunkter, alleDokumenter, status));
    }
  };
  const aksjonspunkt = harÅpentAksjonspunkt
    ? aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST)
    : aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR);

  const harAksjonspunkt = aksjonspunkt !== undefined;
  const periodeFom = periode?.periode?.fom;
  const periodeTom = periode?.periode?.tom;
  const aksjonspunktCode = harÅpentAksjonspunkt
    ? aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST
    : aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR;

  const isSolvable =
    erOverstyrt ||
    (harÅpentAksjonspunkt || aksjonspunkt !== undefined
      ? !(aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && !aksjonspunkt.kanLoses)
      : false);

  const isReadOnly = overrideReadOnly || !periode?.vurderesIBehandlingen;

  const toggleAv = () => {
    formMethods.reset();
    toggleOverstyring(oldArray => oldArray.filter(code => code !== aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR));
  };

  const handleSubmit = (values: FormState) => {
    submitCallback([transformValues(values, alleDokumenter, aksjonspunktCode, periodeFom, periodeTom)]);
  };

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit}>
      {!erOverstyrt && !harAksjonspunkt && dokumenterIAktivPeriode.length > 0 && !editForm && (
        <div>
          {Array.isArray(alleDokumenter) &&
            alleDokumenter.length > 0 &&
            alleDokumenter.map((field, index) => {
              const dokument = alleDokumenter.find(dok => dok.journalpostId === field.journalpostId);
              const documentHash = hash(dokument);
              return (
                <SoknadsfristVilkarDokument
                  key={documentHash}
                  erAktivtDokument={dokumenterIAktivPeriode.findIndex(d => hash(d) === documentHash) > -1}
                  skalViseBegrunnelse
                  readOnly
                  dokumentIndex={index}
                  dokument={dokument}
                  toggleEditForm={toggleEditForm}
                  dokumentErVurdert={status !== vilkarUtfallType.IKKE_VURDERT}
                  periode={periode}
                />
              );
            })}
        </div>
      )}

      {(erOverstyrt || harAksjonspunkt || editForm) && dokumenterIAktivPeriode.length > 0 && (
        <AksjonspunktBox
          className={styles.aksjonspunktMargin}
          erAksjonspunktApent={erOverstyrt || harÅpentAksjonspunkt}
        >
          {!isReadOnly &&
            (harÅpentAksjonspunkt ? (
              <AksjonspunktHelpText isAksjonspunktOpen>Vurder om søknadsfristvilkåret er oppfylt</AksjonspunktHelpText>
            ) : (
              <Label size="small" as="p">
                Manuell overstyring av automatisk vurdering
              </Label>
            ))}
          <div className="mt-2" />
          {Array.isArray(alleDokumenter) && alleDokumenter.length > 0
            ? alleDokumenter.map((field, index) => {
                const dokument = alleDokumenter.find(dok => dok.journalpostId === field.journalpostId);
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
                    dokumentErVurdert={status !== vilkarUtfallType.IKKE_VURDERT}
                    periode={periode}
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
              <div className="flex gap-4">
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
              </div>
            </>
          )}
          {(harÅpentAksjonspunkt || editForm) && !erOverstyrt && (
            <div className="flex gap-4">
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
            </div>
          )}
        </AksjonspunktBox>
      )}
    </Form>
  );
};

export default SoknadsfristVilkarForm;
