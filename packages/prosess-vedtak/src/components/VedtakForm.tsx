import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAvslag, isDelvisInnvilget, isInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { decodeHtmlEntity, safeJSONParse } from '@fpsak-frontend/utils';
import {
  TilgjengeligeVedtaksbrev,
  TilgjengeligeVedtaksbrevMedMaler,
  filterInformasjonsbehov,
  harMellomLagretMedIngenBrev,
  harMellomlagretFritekstbrev,
  harMellomlagretRedusertUtbetalingArsak,
  harPotensieltFlereInformasjonsbehov,
  harSattDokumentdataType,
  kanHaAutomatiskVedtaksbrev,
  kanHaFritekstbrevV1,
  kanHaManueltFritekstbrev,
  kanHindreUtsending,
  kanKunVelge,
} from '@fpsak-frontend/utils/src/formidlingUtils';
import { FagsakYtelsesType, fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/gui/utils/formidling.js';
import { dokumentdatatype } from '@k9-sak-web/konstanter';
import { Checkbox, Label } from '@navikt/ds-react';
import {
  AksjonspunktDto,
  AvslagsårsakPrPeriodeDto,
  BehandlingsresultatDto,
  BehandlingÅrsakDto,
  DokumentMedUstrukturerteDataDto,
  OverlappendeYtelseDto,
  PersonopplysningDto,
  TilbakekrevingValgDto,
  VilkårMedPerioderDto,
} from '@navikt/k9-sak-typescript-client';
import { Formik, FormikProps } from 'formik';
import React, { useContext, useState } from 'react';
import { IntlShape, injectIntl } from 'react-intl';
import * as Yup from 'yup';
import redusertUtbetalingArsak from '../kodeverk/redusertUtbetalingArsak';
import { fieldnames } from '../konstanter';
import { DokumentDataType, LagreDokumentdataType } from '../types/Dokumentdata';
import VedtakSimuleringResultat from '../types/VedtakSimuleringResultat';
import { VedtakVarsel } from '../types/VedtakVarsel';
import { validerManueltRedigertBrev } from './FritekstRedigering/RedigeringUtils';
import LagreVedtakFormIContext, {
  filtrerVerdierSomSkalNullstilles,
  settMalerVedtakContext,
} from './LagreVedtakFormIContext';
import SakGårIkkeTilBeslutterModal from './SakGårIkkeTilBeslutterModal';
import UstrukturerteDokumenter from './UstrukturerteDokumenter';
import VedtakAksjonspunktPanel from './VedtakAksjonspunktPanel';
import VedtakAvslagPanel from './VedtakAvslagPanel';
import VedtakInnvilgetPanel from './VedtakInnvilgetPanel';
import VedtakSubmit from './VedtakSubmit';
import BrevPanel, { manuellBrevPreview } from './brev/BrevPanel';
import { InformasjonsbehovVedtaksbrev } from './brev/InformasjonsbehovAutomatiskVedtaksbrev';
import RevurderingPaneler from './revurdering/RevurderingPaneler';
import VedtakRevurderingSubmitPanel from './revurdering/VedtakRevurderingSubmitPanel';
import styles from './vedtakForm.module.css';

const isVedtakSubmission = true;

const transformRedusertUtbetalingÅrsaker = formikValues =>
  Object.values(redusertUtbetalingArsak).filter(name =>
    Object.keys(formikValues).some(key => key === name && formikValues[key]),
  );

interface Props {
  aksjonspunkter: AksjonspunktDto[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  behandlingPaaVent: boolean;
  behandlingresultat: BehandlingsresultatDto;
  behandlingStatus: string;
  behandlingÅrsaker?: BehandlingÅrsakDto[];
  bgPeriodeMedAvslagsårsak?: AvslagsårsakPrPeriodeDto;
  dokumentdata: DokumentDataType;
  erRevurdering: boolean;
  fritekstdokumenter: DokumentMedUstrukturerteDataDto[];
  hentFritekstbrevHtmlCallback: () => void;
  informasjonsbehovVedtaksbrev: InformasjonsbehovVedtaksbrev;
  intl: IntlShape;
  lagreDokumentdata: LagreDokumentdataType;
  medlemskapFom: string;
  overlappendeYtelser: Array<OverlappendeYtelseDto>;
  personopplysninger: PersonopplysningDto;
  previewCallback: (values, aapneINyttVindu) => void;
  readOnly: boolean;
  simuleringResultat: VedtakSimuleringResultat;
  sprakkode: string;
  submitCallback: (object: any) => void;
  tilbakekrevingvalg: TilbakekrevingValgDto;
  tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev & TilgjengeligeVedtaksbrevMedMaler;
  vedtakVarsel: VedtakVarsel;
  vilkar: VilkårMedPerioderDto[];
  ytelseTypeKode: FagsakYtelsesType;
}

export const VedtakForm: React.FC<Props> = ({
  intl,
  readOnly,
  behandlingStatus,
  behandlingresultat,
  aksjonspunkter,
  behandlingPaaVent,
  vedtakVarsel,
  previewCallback,
  hentFritekstbrevHtmlCallback,
  sprakkode,
  ytelseTypeKode,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  tilbakekrevingvalg,
  vilkar,
  tilgjengeligeVedtaksbrev,
  informasjonsbehovVedtaksbrev,
  dokumentdata,
  submitCallback,
  fritekstdokumenter,
  lagreDokumentdata,
  overlappendeYtelser,
  simuleringResultat,
  bgPeriodeMedAvslagsårsak,
  medlemskapFom,
  erRevurdering,
  behandlingÅrsaker,
}) => {
  const vedtakContext = useContext(VedtakFormContext);
  const { kodeverkNavnFraKode, behandlingType } = useKodeverkContext();

  const [erSendtInnUtenArsaker, setErSendtInnUtenArsaker] = useState(false);
  const [errorOnSubmit, setErrorOnSubmit] = useState('');
  const [harVurdertOverlappendeYtelse, setHarVurdertOverlappendeYtelse] = useState(false);
  const [visSakGårIkkeTilBeslutterModal, setVisSakGårIkkeTilBeslutterModal] = useState(false);

  const harOverlappendeYtelser = overlappendeYtelser && overlappendeYtelser.length > 0;

  const onToggleOverstyring = (e, setFieldValue) => {
    setErrorOnSubmit('');
    const isChecked = e.target.checked;
    setFieldValue(fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV, isChecked);
    if (isChecked) {
      setFieldValue(fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV, false);
    }
  };

  const onToggleHindreUtsending = (e, setFieldValue) => {
    setErrorOnSubmit('');
    const isChecked = e.target.checked;
    setFieldValue(fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV, isChecked);

    if (isChecked) {
      setFieldValue(fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV, false);
    }
  };

  const payloadMedEkstraInformasjon = values => {
    const begrunnelser = informasjonsbehovVedtaksbrev?.informasjonsbehov.map(({ kode }) => ({
      kode,
      begrunnelse: values[kode],
    }));
    return aksjonspunkter
      .filter(ap => ap.kanLoses)
      .map(aksjonspunkt => ({
        kode: aksjonspunkt.definisjon,
        overstyrtMottaker: safeJSONParse(values?.[fieldnames.OVERSTYRT_MOTTAKER]),
        fritekstbrev: values?.[fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV]
          ? {
              brødtekst: values?.[fieldnames.BRØDTEKST],
              overskrift: values?.[fieldnames.OVERSKRIFT],
              inkluderKalender: values?.[fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING],
            }
          : {},
        redigertbrev: values?.[fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV]
          ? {
              originalHtml: values?.[fieldnames.ORIGINAL_HTML],
              redigertHtml: values?.[fieldnames.REDIGERT_HTML],
              inkluderKalender: values?.[fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING],
              redigertMal: values?.[fieldnames.REDIGERT_MAL],
            }
          : {},
        skalBrukeOverstyrendeFritekstBrev: values?.[fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV],
        skalUndertrykkeBrev: values?.[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV],
        isVedtakSubmission,
        begrunnelserMedInformasjonsbehov: begrunnelser,
        redusertUtbetalingÅrsaker:
          aksjonspunkt.definisjon === aksjonspunktCodes.FORESLA_VEDTAK_MANUELT
            ? transformRedusertUtbetalingÅrsaker(values)
            : null,
        tilgjengeligeVedtaksbrev,
      }));
  };

  const payload = values =>
    aksjonspunkter
      .filter(ap => ap.kanLoses)
      .map(aksjonspunkt => {
        const tranformedValues = {
          kode: aksjonspunkt.definisjon,
          begrunnelse: values?.[fieldnames.BEGRUNNELSE],
          overstyrtMottaker: safeJSONParse(values?.[fieldnames.OVERSTYRT_MOTTAKER]),
          fritekstbrev: {
            brødtekst: values?.[fieldnames.BRØDTEKST],
            overskrift: values?.[fieldnames.OVERSKRIFT],
            inkluderKalender: values?.[fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING],
          },
          redigertbrev: {
            originalHtml: values?.[fieldnames.ORIGINAL_HTML],
            redigertHtml: values?.[fieldnames.REDIGERT_HTML],
            inkluderKalender: values?.[fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING],
            redigertMal: values?.[fieldnames.REDIGERT_MAL],
          },
          skalBrukeOverstyrendeFritekstBrev: values?.[fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV],
          skalUndertrykkeBrev: values?.[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV],
          isVedtakSubmission,
          tilgjengeligeVedtaksbrev,
          redusertUtbetalingÅrsaker: undefined,
        };
        if (aksjonspunkt.definisjon === aksjonspunktCodes.FORESLA_VEDTAK_MANUELT) {
          tranformedValues.redusertUtbetalingÅrsaker = transformRedusertUtbetalingÅrsaker(values);
        }
        return tranformedValues;
      });

  const createPayload = values =>
    harPotensieltFlereInformasjonsbehov(informasjonsbehovVedtaksbrev)
      ? payloadMedEkstraInformasjon(values)
      : payload(values);

  const setInitialValues = initialValues => {
    // Hvis vi har maler i contexten,
    // sjekk om de er forskjellige fra maler som er tilgjengelige i API
    if (vedtakContext.vedtakFormState?.maler) {
      if (
        tilgjengeligeVedtaksbrev &&
        JSON.stringify(vedtakContext?.vedtakFormState?.maler) !== JSON.stringify(tilgjengeligeVedtaksbrev?.maler)
      ) {
        // Hvis det er diff tilgjengelige vedtaksbrev og kontekst
        // nullstill valg som har blitt gjort med tidligere tilgjengelige vedtaksbrev
        const nyVedtakState = filtrerVerdierSomSkalNullstilles({
          ...vedtakContext.vedtakFormState,
          maler: tilgjengeligeVedtaksbrev?.maler,
        });
        vedtakContext.setVedtakFormState(nyVedtakState);
        return { ...initialValues, ...nyVedtakState };
      }
    } else {
      // Hvis vi ikke har en mal i konteksten fra før av, så setter vi det nå
      settMalerVedtakContext(vedtakContext, tilgjengeligeVedtaksbrev?.maler);
    }

    return { ...initialValues, ...vedtakContext.vedtakFormState };
  };

  const harRedusertUtbetaling = ytelseTypeKode === fagsakYtelsesType.FRISINN;

  const aktiverteInformasjonsbehov = (informasjonsbehovVedtaksbrev?.informasjonsbehov || []).filter(
    ({ type }) => type === 'FRITEKST',
  );

  const harFritekstILokalState =
    vedtakContext?.vedtakFormState?.brødtekst || vedtakContext?.vedtakFormState?.overskrift;
  const mellomlagredeInformasjonsbehov = aktiverteInformasjonsbehov.map(informasjonsbehov => ({
    [informasjonsbehov.kode]: dokumentdata?.[informasjonsbehov.kode] || '',
  }));

  const initialValues = Object.assign(
    {},
    {
      [fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV]:
        kanKunVelge(tilgjengeligeVedtaksbrev, vedtaksbrevtype.FRITEKST) ||
        kanKunVelge(tilgjengeligeVedtaksbrev, vedtaksbrevtype.MANUELL) ||
        (kanHaFritekstbrevV1(tilgjengeligeVedtaksbrev) &&
          harSattDokumentdataType(dokumentdata, vedtakVarsel, vedtaksbrevtype.FRITEKST)) ||
        (harFritekstILokalState && kanHaFritekstbrevV1(tilgjengeligeVedtaksbrev)) ||
        (kanHaFritekstbrevV1(tilgjengeligeVedtaksbrev) &&
          !kanHaAutomatiskVedtaksbrev(tilgjengeligeVedtaksbrev) &&
          !harMellomLagretMedIngenBrev(dokumentdata, vedtakVarsel)) ||
        (kanHaManueltFritekstbrev(tilgjengeligeVedtaksbrev) &&
          harSattDokumentdataType(dokumentdata, vedtakVarsel, vedtaksbrevtype.MANUELL)) ||
        (kanHaManueltFritekstbrev(tilgjengeligeVedtaksbrev) &&
          !kanHaAutomatiskVedtaksbrev(tilgjengeligeVedtaksbrev) &&
          !harMellomLagretMedIngenBrev(dokumentdata, vedtakVarsel)),
      [fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV]:
        kanKunVelge(tilgjengeligeVedtaksbrev, vedtaksbrevtype.INGEN) ||
        (harMellomLagretMedIngenBrev(dokumentdata, vedtakVarsel) &&
          kanHindreUtsending(tilgjengeligeVedtaksbrev) &&
          !harMellomlagretFritekstbrev(dokumentdata, vedtakVarsel)),
      [fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING]:
        dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.inkluderKalender ||
        dokumentdata?.[dokumentdatatype.REDIGERTBREV]?.inkluderKalender ||
        false,
      [fieldnames.OVERSKRIFT]: decodeHtmlEntity(dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.overskrift) || '',
      [fieldnames.BRØDTEKST]: decodeHtmlEntity(dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.brødtekst) || '',
      [fieldnames.REDIGERT_HTML]: dokumentdata?.[dokumentdatatype.REDIGERTBREV]?.redigertHtml || '',
      [fieldnames.ORIGINAL_HTML]: dokumentdata?.[dokumentdatatype.REDIGERTBREV]?.originalHtml || '',
      [fieldnames.REDIGERT_MAL]: dokumentdata?.[dokumentdatatype.REDIGERTBREV]?.redigertMal || '',
      [fieldnames.OVERSTYRT_MOTTAKER]: JSON.stringify(dokumentdata?.[dokumentdatatype.OVERSTYRT_MOTTAKER]),
      [fieldnames.BEGRUNNELSE]: dokumentdata?.[dokumentdatatype.BEREGNING_FRITEKST],
    },
    ...[
      ...mellomlagredeInformasjonsbehov,
      ...Object.values(redusertUtbetalingArsak).map(key => ({
        [key]: harMellomlagretRedusertUtbetalingArsak(key, dokumentdata, vedtakVarsel),
      })),
    ],
  );

  const redusertUtbetalingÅrsakerFunc = values => {
    if (harRedusertUtbetaling) {
      return readOnly ? vedtakVarsel?.redusertUtbetalingÅrsaker : transformRedusertUtbetalingÅrsaker(values);
    }
    return null;
  };

  const erToTrinn = aksjonspunkter && aksjonspunkter.some(ap => ap.erAktivt === true && ap.toTrinnsBehandling === true);

  const handleErEntrinnSubmit = (event, formikProps: FormikProps<any>) => {
    if (formikProps.values[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV]) {
      formikProps.handleSubmit();
    } else {
      event.preventDefault();
      setVisSakGårIkkeTilBeslutterModal(true);
    }
  };

  const vedtakformPartialValidation = Yup.object().shape({
    [fieldnames.REDIGERT_HTML]: Yup.string().when(
      [fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV, fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV],
      {
        is: (overstyr, hindre) => overstyr && !hindre,
        then: schema =>
          schema.test(
            'validate-redigert-html',
            intl.formatMessage({ id: 'RedigeringAvFritekstBrev.ManueltBrevIkkeEndret' }),
            value => {
              if (kanHaManueltFritekstbrev(tilgjengeligeVedtaksbrev)) {
                return validerManueltRedigertBrev(value);
              }
              return true;
            },
          ),
      },
    ),
  });

  const automatiskVedtaksbrevParams = ({
    fritekst,
    redusertUtbetalingÅrsaker,
    overstyrtMottaker,
    informasjonsbehovValues = [],
  }) => ({
    dokumentdata: {
      fritekst: fritekst || ' ',
      redusertUtbetalingÅrsaker,
      ...Object.assign({}, ...informasjonsbehovValues),
    },

    // Bruker UTLED som fallback til lenken ikke vises for avsluttede behandlinger
    dokumentMal: tilgjengeligeVedtaksbrev?.vedtaksbrevmaler?.[vedtaksbrevtype.AUTOMATISK] ?? dokumentMalType.UTLED,
    ...(overstyrtMottaker ? { overstyrtMottaker: safeJSONParse(overstyrtMottaker) } : {}),
  });

  const getPreviewAutomatiskBrevCallback =
    values =>
    ({ aapneINyttVindu = true }: { aapneINyttVindu: boolean }) =>
    e => {
      e?.preventDefault();
      return previewCallback(
        automatiskVedtaksbrevParams({
          fritekst: values[fieldnames.BEGRUNNELSE],
          redusertUtbetalingÅrsaker: redusertUtbetalingÅrsakerFunc(values),
          overstyrtMottaker: values.overstyrtMottaker,
          informasjonsbehovValues: filterInformasjonsbehov(values, aktiverteInformasjonsbehov),
        }),
        aapneINyttVindu,
      );
    };

  const getPreviewManuellBrevCallback = (values: any) =>
    manuellBrevPreview({
      tilgjengeligeVedtaksbrev,
      previewCallback,
      values,
      redigertHtml: values[fieldnames.REDIGERT_HTML],
      overstyrtMottaker: values.overstyrtMottaker,
      brødtekst: values[fieldnames.BRØDTEKST],
      overskrift: values[fieldnames.OVERSKRIFT],
      aapneINyttVindu: false,
    });

  const submit = async (values, actions) => {
    const manueltBrev = values[fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV];
    const hindreUtsending = values[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV];

    if (manueltBrev) {
      try {
        await getPreviewManuellBrevCallback(values);
        submitCallback(createPayload(values));
        return;
      } catch {
        setErrorOnSubmit('Noe gikk galt ved innsending.');
        actions.setSubmitting(false);
        return;
      }
    }

    if (hindreUtsending) {
      submitCallback(createPayload(values));
      return;
    }

    if (!hindreUtsending && !manueltBrev) {
      // Tillater at automatisk brev eventuelt feiler i saker hvor man ikke kan undertrykke brev.
      // Dette er fordi det er bedre at søker får utbetalt, men ikke noe brev, enn at det blir umulig å få gjennom saken.
      if (!kanHindreUtsending(tilgjengeligeVedtaksbrev)) {
        submitCallback(createPayload(values));
        return;
      }

      try {
        await getPreviewAutomatiskBrevCallback(values)({ aapneINyttVindu: false })(undefined);
        submitCallback(createPayload(values));
        return;
      } catch {
        setErrorOnSubmit('Noe gikk galt ved innsending.');
        actions.setSubmitting(false);
        return;
      }
    }
    setErrorOnSubmit('');
  };
  return (
    <Formik
      initialValues={setInitialValues(initialValues)}
      validationSchema={vedtakformPartialValidation}
      validateOnMount={false}
      validateOnChange={false}
      onSubmit={async (values, actions) => {
        if ((harOverlappendeYtelser && harVurdertOverlappendeYtelse) || !harOverlappendeYtelser) {
          await submit(values, actions);
        } else {
          actions.setSubmitting(false);
        }
      }}
    >
      {formikProps => (
        <form className={styles.form}>
          <LagreVedtakFormIContext />
          {(kanHaFritekstbrevV1(tilgjengeligeVedtaksbrev) ||
            kanHaManueltFritekstbrev(tilgjengeligeVedtaksbrev) ||
            kanHindreUtsending(tilgjengeligeVedtaksbrev)) && (
            <div className={styles.knappContainer}>
              <fieldset>
                <Label size="small" as="legend">
                  {intl.formatMessage({ id: 'VedtakForm.ValgForBrev' })}
                </Label>
                {(kanHaFritekstbrevV1(tilgjengeligeVedtaksbrev) ||
                  kanHaManueltFritekstbrev(tilgjengeligeVedtaksbrev)) && (
                  <Checkbox
                    checked={formikProps.values.skalBrukeOverstyrendeFritekstBrev}
                    onChange={e => onToggleOverstyring(e, formikProps.setFieldValue)}
                    disabled={
                      readOnly ||
                      kanKunVelge(tilgjengeligeVedtaksbrev, vedtaksbrevtype.FRITEKST) ||
                      (formikProps.values.skalBrukeOverstyrendeFritekstBrev &&
                        !kanHaAutomatiskVedtaksbrev(tilgjengeligeVedtaksbrev))
                    }
                    value={fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV}
                    size="small"
                  >
                    {intl.formatMessage({ id: 'VedtakForm.ManuellOverstyring' })}
                  </Checkbox>
                )}
                {kanHindreUtsending(tilgjengeligeVedtaksbrev) && (
                  <Checkbox
                    onChange={e => onToggleHindreUtsending(e, formikProps.setFieldValue)}
                    disabled={
                      readOnly ||
                      kanKunVelge(tilgjengeligeVedtaksbrev, vedtaksbrevtype.INGEN) ||
                      (formikProps.values.skalHindreUtsendingAvBrev &&
                        !kanHaAutomatiskVedtaksbrev(tilgjengeligeVedtaksbrev))
                    }
                    checked={formikProps.values.skalHindreUtsendingAvBrev}
                    value={fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV}
                    size="small"
                  >
                    {intl.formatMessage({ id: 'VedtakForm.HindreUtsending' })}
                  </Checkbox>
                )}
              </fieldset>
            </div>
          )}
          <div className={styles.aksjonspunktContainer}>
            <VedtakAksjonspunktPanel
              behandlingStatusKode={behandlingStatus}
              aksjonspunktKoder={aksjonspunkter.map(ap => ap.definisjon)}
              readOnly={readOnly}
              overlappendeYtelser={overlappendeYtelser}
              viseFlereSjekkbokserForBrev={
                (kanHaFritekstbrevV1(tilgjengeligeVedtaksbrev) || kanHaManueltFritekstbrev(tilgjengeligeVedtaksbrev)) &&
                kanHindreUtsending(tilgjengeligeVedtaksbrev)
              }
              harVurdertOverlappendeYtelse={harVurdertOverlappendeYtelse}
              setHarVurdertOverlappendeYtelse={setHarVurdertOverlappendeYtelse}
              submitCallback={submitCallback}
            >
              {!erRevurdering ? (
                <>
                  {fritekstdokumenter?.length > 0 && (
                    <UstrukturerteDokumenter fritekstdokumenter={fritekstdokumenter} />
                  )}

                  {(isInnvilget(behandlingresultat.type) || isDelvisInnvilget(behandlingresultat.type)) && (
                    <VedtakInnvilgetPanel
                      intl={intl}
                      behandlingsresultat={behandlingresultat}
                      ytelseTypeKode={ytelseTypeKode}
                      tilbakekrevingvalg={tilbakekrevingvalg}
                      simuleringResultat={simuleringResultat}
                      kodeverkNavnFraKode={kodeverkNavnFraKode}
                      behandlingType={behandlingType}
                    />
                  )}

                  {isAvslag(behandlingresultat.type) && (
                    <VedtakAvslagPanel
                      behandlingsresultat={behandlingresultat}
                      ytelseTypeKode={ytelseTypeKode}
                      tilbakekrevingvalg={tilbakekrevingvalg}
                      simuleringResultat={simuleringResultat}
                      vilkar={vilkar}
                      kodeverkNavnFraKode={kodeverkNavnFraKode}
                    />
                  )}
                </>
              ) : (
                <RevurderingPaneler
                  ytelseTypeKode={ytelseTypeKode}
                  behandlingresultat={behandlingresultat}
                  tilbakekrevingvalg={tilbakekrevingvalg}
                  simuleringResultat={simuleringResultat}
                  bgPeriodeMedAvslagsårsak={bgPeriodeMedAvslagsårsak}
                  vilkar={vilkar}
                  readOnly={readOnly}
                  vedtakVarsel={vedtakVarsel}
                  medlemskapFom={medlemskapFom}
                  harRedusertUtbetaling={harRedusertUtbetaling}
                  redusertUtbetalingArsak={redusertUtbetalingArsak}
                  formikValues={formikProps.values}
                  erSendtInnUtenArsaker={erSendtInnUtenArsaker}
                />
              )}

              <BrevPanel
                readOnly={readOnly}
                sprakkode={sprakkode}
                personopplysninger={personopplysninger}
                arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
                tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
                informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
                informasjonsbehovValues={filterInformasjonsbehov(formikProps.values, aktiverteInformasjonsbehov)}
                skalBrukeOverstyrendeFritekstBrev={formikProps.values.skalBrukeOverstyrendeFritekstBrev}
                begrunnelse={formikProps.values.begrunnelse}
                previewCallback={previewCallback}
                hentFritekstbrevHtmlCallback={hentFritekstbrevHtmlCallback}
                brødtekst={formikProps.values.brødtekst}
                overskrift={formikProps.values.overskrift}
                overstyrtMottaker={formikProps.values.overstyrtMottaker}
                formikProps={formikProps}
                ytelseTypeKode={ytelseTypeKode}
                behandlingResultat={behandlingresultat}
                dokumentdata={dokumentdata}
                lagreDokumentdata={lagreDokumentdata}
                aktiverteInformasjonsbehov={aktiverteInformasjonsbehov}
                getPreviewAutomatiskBrevCallback={getPreviewAutomatiskBrevCallback}
              />
              {!erRevurdering ? (
                <VedtakSubmit
                  behandlingStatusKode={behandlingStatus}
                  readOnly={readOnly}
                  behandlingPaaVent={behandlingPaaVent}
                  isSubmitting={formikProps.isSubmitting}
                  aksjonspunkter={aksjonspunkter}
                  errorOnSubmit={errorOnSubmit}
                  handleSubmit={
                    erToTrinn ? formikProps.handleSubmit : event => handleErEntrinnSubmit(event, formikProps)
                  }
                />
              ) : (
                <VedtakRevurderingSubmitPanel
                  formikValues={formikProps.values}
                  isSubmitting={formikProps.isSubmitting}
                  handleSubmit={
                    erToTrinn ? formikProps.handleSubmit : event => handleErEntrinnSubmit(event, formikProps)
                  }
                  readOnly={readOnly}
                  behandlingStatusKode={behandlingStatus}
                  harRedusertUtbetaling={harRedusertUtbetaling}
                  visFeilmeldingFordiArsakerMangler={() => setErSendtInnUtenArsaker(true)}
                  aksjonspunkter={aksjonspunkter}
                  errorOnSubmit={errorOnSubmit}
                  behandlingÅrsaker={behandlingÅrsaker}
                />
              )}
              {visSakGårIkkeTilBeslutterModal && (
                <SakGårIkkeTilBeslutterModal
                  onClose={() => setVisSakGårIkkeTilBeslutterModal(false)}
                  onSubmit={() => {
                    formikProps.handleSubmit();
                    setVisSakGårIkkeTilBeslutterModal(false);
                  }}
                />
              )}
            </VedtakAksjonspunktPanel>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default injectIntl(VedtakForm);
