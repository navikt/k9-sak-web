import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel_ny.svg';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import {
  AksjonspunktBox,
  AksjonspunktHelpText,
  EditedIcon,
  FlexColumn,
  FlexContainer,
  FlexRow,
  Image,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity, initializeDate } from '@fpsak-frontend/utils';
import { Aksjonspunkt, DokumentStatus, Periode, SubmitCallback } from '@k9-sak-web/types';
import Vilkarperiode from '@k9-sak-web/types/src/vilkarperiode';
import { BodyShort, Button, Label } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';
import { Dayjs } from 'dayjs';
import hash from 'object-hash';
import React, { SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { utledInnsendtSoknadsfrist } from '../utils';
import { FormState } from './FormState';
import OverstyrBekreftKnappPanel from './OverstyrBekreftKnappPanel';
import SoknadsfristVilkarDokument, { DELVIS_OPPFYLT } from './SoknadsfristVilkarDokument';
import styles from './SoknadsfristVilkarForm.module.css';

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
      const erVilkarOk = erDelvisOppfylt ? DELVIS_OPPFYLT : status === vilkarUtfallType.OPPFYLT;

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
    const erVilkarOk = krav.erVilkarOk === 'true' || krav.erVilkarOk === DELVIS_OPPFYLT;

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
  erVilkarOk?: boolean;
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
  erVilkarOk,
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
  // const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
  //   control: formMethods.control, // control props comes from useForm (optional: if you are using FormContext)
  //   name: 'avklarteKrav', // unique name for your Field Array
  // });
  const [redigerVurdering, setRedigerVurdering] = useState(false);
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

  if (!erOverstyrt && !harAksjonspunkt && dokumenterIAktivPeriode.length > 0 && !redigerVurdering) {
    return (
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
                erVilkarOk={erVilkarOk}
                dokumentIndex={index}
                dokument={dokument}
                setRedigerVurdering={setRedigerVurdering}
              />
            );
          })}
      </div>
    );
  }

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit}>
      {(erOverstyrt || harAksjonspunkt || redigerVurdering) && dokumenterIAktivPeriode.length > 0 && (
        <AksjonspunktBox
          className={styles.aksjonspunktMargin}
          erAksjonspunktApent={erOverstyrt || harÅpentAksjonspunkt}
        >
          {!isReadOnly &&
            (harÅpentAksjonspunkt ? (
              <AksjonspunktHelpText isAksjonspunktOpen>
                {[<FormattedMessage key={1} id="SoknadsfristVilkarForm.AvklarVurdering" />]}
              </AksjonspunktHelpText>
            ) : (
              <Label size="small" as="p">
                <FormattedMessage id="SoknadsfristVilkarForm.AutomatiskVurdering" />
              </Label>
            ))}
          <VerticalSpacer eightPx />
          {Array.isArray(alleDokumenter) && alleDokumenter.length > 0 ? (
            alleDokumenter.map((field, index) => {
              const dokument = alleDokumenter.find(dok => dok.journalpostId === field.journalpostId);
              const documentHash = hash(dokument);
              return (
                <SoknadsfristVilkarDokument
                  key={documentHash}
                  erAktivtDokument={dokumenterIAktivPeriode.findIndex(d => hash(d) === documentHash) > -1}
                  skalViseBegrunnelse={erOverstyrt || harAksjonspunkt || redigerVurdering}
                  readOnly={(isReadOnly || (!erOverstyrt && !harÅpentAksjonspunkt)) && !redigerVurdering}
                  erVilkarOk={erVilkarOk}
                  dokumentIndex={index}
                  dokument={dokument}
                  setRedigerVurdering={setRedigerVurdering}
                  erOverstyrt={erOverstyrt}
                  redigerVurdering={redigerVurdering}
                />
              );
            })
          ) : (
            <FormattedMessage id="SoknadsfristVilkarForm.IngenDokumenter" />
          )}
          <VerticalSpacer sixteenPx />
          {!erOverstyrt && erVilkarOk !== undefined && (
            <>
              <VerticalSpacer fourPx />
              <FlexRow>
                <FlexColumn>
                  <EditedIcon />
                </FlexColumn>
                <FlexColumn>
                  <BodyShort size="small">
                    <FormattedMessage id="SoknadsfristVilkarForm.Endret" />
                  </BodyShort>
                </FlexColumn>
              </FlexRow>
            </>
          )}
          {erOverstyrt && (
            <FlexContainer>
              <FlexRow>
                <FlexColumn>
                  <Image src={advarselIkonUrl} />
                </FlexColumn>
                <FlexColumn>
                  <Label size="small" as="p">
                    <FormattedMessage id="SoknadsfristVilkarForm.Unntakstilfeller" />
                  </Label>
                </FlexColumn>
              </FlexRow>
              <VerticalSpacer sixteenPx />
              <FlexRow>
                <FlexColumn>
                  <OverstyrBekreftKnappPanel
                    disabled={!formMethods.formState.isValid}
                    submitting={formMethods.formState.isSubmitting}
                    pristine={!isSolvable || !formMethods.formState.isDirty}
                    overrideReadOnly={overrideReadOnly}
                  />
                </FlexColumn>
                <FlexColumn>
                  <Button
                    size="small"
                    variant="secondary"
                    type="button"
                    loading={formMethods.formState.isSubmitting}
                    disabled={formMethods.formState.isSubmitting}
                    onClick={toggleAv}
                  >
                    <FormattedMessage id="SoknadsfristVilkarForm.Avbryt" />
                  </Button>
                </FlexColumn>
              </FlexRow>
            </FlexContainer>
          )}
          {(harÅpentAksjonspunkt || redigerVurdering) && !erOverstyrt && (
            <Button
              variant="primary"
              size="small"
              loading={formMethods.formState.isSubmitting}
              disabled={!formMethods.formState.isValid || formMethods.formState.isSubmitting}
            >
              <FormattedMessage id="SoknadsfristVilkarForm.ConfirmInformation" />
            </Button>
          )}
        </AksjonspunktBox>
      )}
    </Form>
  );
};

/**
 * Temporær fiks for saksbehandlere som setter dato og forventer at
 * backend skal telle fra og meg datoen de setter.
 *
 * Backend teller fra dagen etter..
 */

// const mapStateToPropsFactory = (_initialState, initialOwnProps: SoknadsfristVilkarFormProps) => {
//   const { submitCallback, alleDokumenter, periode } = initialOwnProps;
//   const periodeFom = periode?.periode?.fom;
//   const periodeTom = periode?.periode?.tom;

//   return (state, ownProps) => {
//     const { behandlingId, behandlingVersjon, aksjonspunkter, harÅpentAksjonspunkt, erOverstyrt, overrideReadOnly } =
//       ownProps;

//     const aksjonspunkt = harÅpentAksjonspunkt
//       ? aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST)
//       : aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR);

//     const isSolvable =
//       harÅpentAksjonspunkt || aksjonspunkt !== undefined
//         ? !(aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && !aksjonspunkt.kanLoses)
//         : false;

//     const aksjonspunktCode = harÅpentAksjonspunkt
//       ? aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST
//       : aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR;

//     const onSubmit = values =>
//       submitCallback([transformValues(values, alleDokumenter, aksjonspunktCode, periodeFom, periodeTom)]);

//     const initialValues = buildInitialValues(ownProps);

//     return {
//       // onSubmit,
//       // initialValues,
//       // harÅpentAksjonspunkt,
//       // harAksjonspunkt: aksjonspunkt !== undefined,
//       // isSolvable: erOverstyrt || isSolvable,
//       // isReadOnly: overrideReadOnly || !periode?.vurderesIBehandlingen,
//       // ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(
//       //   state,
//       //   'isOverstyrt',
//       //   'erVilkarOk',
//       //   'avklarteKrav',
//       // ),
//     };
//   };
// };

// const form = behandlingForm({
//   form: formName,
//   enableReinitialize: true,
//   destroyOnUnmount: false,
//   forceUnregisterOnUnmount: true,
// })(SoknadsfristVilkarForm);

export default SoknadsfristVilkarForm;
