import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAvslag, isDelvisInnvilget, isInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { decodeHtmlEntity, safeJSONParse } from '@fpsak-frontend/utils';
import {
  filterInformasjonsbehov,
  harMellomlagretFritekstbrev,
  harMellomLagretMedIngenBrev,
  harMellomlagretRedusertUtbetalingArsak,
  harPotensieltFlereInformasjonsbehov,
  harSattDokumentdataType,
  kanHaAutomatiskVedtaksbrev,
  kanHaFritekstbrevV1,
  kanHaManueltFritekstbrev,
  kanHindreUtsending,
  kanKunVelge,
  TilgjengeligeVedtaksbrev,
  TilgjengeligeVedtaksbrevMedMaler,
} from '@fpsak-frontend/utils/src/formidlingUtils';
import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { dokumentdatatype } from '@k9-sak-web/konstanter';
import {
  Aksjonspunkt,
  ArbeidsgiverOpplysningerPerId,
  Behandlingsresultat,
  BehandlingStatusType,
  Kodeverk,
  KodeverkMedNavn,
  Personopplysninger,
  Vilkar,
} from '@k9-sak-web/types';
import { DokumentDataType, LagreDokumentdataType } from '@k9-sak-web/types/src/dokumentdata';
import { Checkbox, Label, Modal } from '@navikt/ds-react';
import { Formik, FormikProps } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import redusertUtbetalingArsak from '../kodeverk/redusertUtbetalingArsak';
import { fieldnames } from '../konstanter';
import BrevPanel from './brev/BrevPanel';
import LagreFormikStateLokalt from './LagreFormikStateLokalt';
import RevurderingPaneler from './revurdering/RevurderingPaneler';
import VedtakRevurderingSubmitPanel from './revurdering/VedtakRevurderingSubmitPanel';
import SakGårIkkeTilBeslutterModal from './SakGårIkkeTilBeslutterModal';
import UstrukturerteDokumenter, { UstrukturerteDokumenterType } from './UstrukturerteDokumenter';
import VedtakAksjonspunktPanel from './VedtakAksjonspunktPanel';
import VedtakAvslagPanel from './VedtakAvslagPanel';
import styles from './vedtakForm.less';
import VedtakInnvilgetPanel from './VedtakInnvilgetPanel';
import VedtakSubmit from './VedtakSubmit';
import { InformasjonsbehovVedtaksbrev } from './brev/InformasjonsbehovAutomatiskVedtaksbrev';

const isVedtakSubmission = true;

const transformRedusertUtbetalingÅrsaker = formikValues =>
  Object.values(redusertUtbetalingArsak).filter(name =>
    Object.keys(formikValues).some(key => key === name && formikValues[key]),
  );

interface Props {
  intl: IntlShape;
  behandlingStatus: BehandlingStatusType;
  aksjonspunkter: Aksjonspunkt[];
  behandlingresultat: Behandlingsresultat;
  behandlingPaaVent: boolean;
  previewCallback: () => void;
  hentFritekstbrevHtmlCallback: () => void;
  readOnly: boolean;
  sprakkode: Kodeverk;
  ytelseTypeKode: string;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  personopplysninger: Personopplysninger;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  tilbakekrevingvalg: {
    videreBehandling: {
      kode: string;
    };
  };
  vilkar: Vilkar[];
  tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev & TilgjengeligeVedtaksbrevMedMaler;
  informasjonsbehovVedtaksbrev: InformasjonsbehovVedtaksbrev;
  dokumentdata: DokumentDataType;
  fritekstdokumenter: UstrukturerteDokumenterType[];
  vedtakVarsel: {
    avslagsarsak: object;
    avslagsarsakFritekst: string;
    id: number;
    overskrift: string;
    fritekstbrev: string;
    skjæringstidspunkt: {
      dato: string;
    };
    redusertUtbetalingÅrsaker: string[];
    vedtaksbrev: Kodeverk;
    vedtaksdato: string;
  };
  submitCallback: (object: any) => void;
  lagreDokumentdata: LagreDokumentdataType;
  overlappendeYtelser: object[];
  resultatstruktur: string;
  simuleringResultat: object;
  resultatstrukturOriginalBehandling: object;
  bgPeriodeMedAvslagsårsak: object;
  medlemskapFom: string;
  erRevurdering: boolean;
  behandlingArsaker: object[];
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
  alleKodeverk,
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
  resultatstruktur,
  simuleringResultat,
  resultatstrukturOriginalBehandling,
  bgPeriodeMedAvslagsårsak,
  medlemskapFom,
  erRevurdering,
  behandlingArsaker,
}) => {
  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);
  const [erSendtInnUtenArsaker, setErSendtInnUtenArsaker] = useState(false);
  const [harVurdertOverlappendeYtelse, setHarVurdertOverlappendeYtelse] = useState(false);
  const [visSakGårIkkeTilBeslutterModal, setVisSakGårIkkeTilBeslutterModal] = useState(false);
  const [editorHarLagret, setEditorHarLagret] = useState<boolean>(false);
  const [editorErTilbakestilt, setEditorErTilbakestilt] = useState<boolean>(false);
  const harOverlappendeYtelser = overlappendeYtelser && overlappendeYtelser.length > 0;
  const vedtakContext = useContext(VedtakFormContext);
  const onToggleOverstyring = (e, setFieldValue) => {
    const isChecked = e.target.checked;
    setFieldValue(fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV, isChecked);
    if (isChecked) {
      setFieldValue(fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV, false);
    }
  };

  const onToggleHindreUtsending = (e, setFieldValue) => {
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
        kode: aksjonspunkt.definisjon.kode,
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
          aksjonspunkt.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK_MANUELT
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
          kode: aksjonspunkt.definisjon.kode,
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
        if (aksjonspunkt.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK_MANUELT) {
          tranformedValues.redusertUtbetalingÅrsaker = transformRedusertUtbetalingÅrsaker(values);
        }
        return tranformedValues;
      });

  const createPayload = values =>
    harPotensieltFlereInformasjonsbehov(informasjonsbehovVedtaksbrev)
      ? payloadMedEkstraInformasjon(values)
      : payload(values);

  const harRedusertUtbetaling = ytelseTypeKode === fagsakYtelseType.FRISINN;

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

  const redusertUtbetalingÅrsaker = formikProps => {
    if (harRedusertUtbetaling) {
      return readOnly
        ? vedtakVarsel?.redusertUtbetalingÅrsaker
        : transformRedusertUtbetalingÅrsaker(formikProps.values);
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

  return (
    <Formik
      initialValues={{ ...initialValues, ...vedtakContext?.vedtakFormState }}
      onSubmit={(values, actions) => {
        if ((harOverlappendeYtelser && harVurdertOverlappendeYtelse) || !harOverlappendeYtelser) {
          submitCallback(createPayload(values));
        } else {
          actions.setSubmitting(false);
        }
      }}
    >
      {formikProps => (
        <form className={styles.form}>
          <LagreFormikStateLokalt />
          {(kanHaFritekstbrevV1(tilgjengeligeVedtaksbrev) ||
            kanHaManueltFritekstbrev(tilgjengeligeVedtaksbrev) ||
            kanHindreUtsending(tilgjengeligeVedtaksbrev)) && (
            <div className={styles.knappContainer}>
              <fieldset>
                <Label size="small" as="legend">
                  Valg for brev
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
                    size="medium"
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
                    size="medium"
                  >
                    {intl.formatMessage({ id: 'VedtakForm.HindreUtsending' })}
                  </Checkbox>
                )}
              </fieldset>
            </div>
          )}
          <div className={styles.aksjonspunktContainer}>
            <VedtakAksjonspunktPanel
              behandlingStatusKode={behandlingStatus?.kode}
              aksjonspunktKoder={aksjonspunkter.map(ap => ap.definisjon.kode)}
              readOnly={readOnly}
              overlappendeYtelser={overlappendeYtelser}
              alleKodeverk={alleKodeverk}
              viseFlereSjekkbokserForBrev={
                (kanHaFritekstbrevV1(tilgjengeligeVedtaksbrev) || kanHaManueltFritekstbrev(tilgjengeligeVedtaksbrev)) &&
                kanHindreUtsending(tilgjengeligeVedtaksbrev)
              }
              harVurdertOverlappendeYtelse={harVurdertOverlappendeYtelse}
              setHarVurdertOverlappendeYtelse={setHarVurdertOverlappendeYtelse}
            >
              {!erRevurdering ? (
                <>
                  {fritekstdokumenter?.length > 0 && (
                    <UstrukturerteDokumenter fritekstdokumenter={fritekstdokumenter} />
                  )}

                  {(isInnvilget(behandlingresultat.type.kode) || isDelvisInnvilget(behandlingresultat.type.kode)) && (
                    <VedtakInnvilgetPanel
                      intl={intl}
                      behandlingsresultat={behandlingresultat}
                      ytelseTypeKode={ytelseTypeKode}
                      tilbakekrevingvalg={tilbakekrevingvalg}
                      simuleringResultat={simuleringResultat}
                      alleKodeverk={alleKodeverk}
                    />
                  )}

                  {isAvslag(behandlingresultat.type.kode) && (
                    <VedtakAvslagPanel
                      aksjonspunkter={aksjonspunkter}
                      behandlingsresultat={behandlingresultat}
                      ytelseTypeKode={ytelseTypeKode}
                      alleKodeverk={alleKodeverk}
                      tilbakekrevingvalg={tilbakekrevingvalg}
                      simuleringResultat={simuleringResultat}
                      vilkar={vilkar}
                    />
                  )}
                </>
              ) : (
                <RevurderingPaneler
                  ytelseTypeKode={ytelseTypeKode}
                  behandlingresultat={behandlingresultat}
                  resultatstruktur={resultatstruktur}
                  tilbakekrevingvalg={tilbakekrevingvalg}
                  simuleringResultat={simuleringResultat}
                  alleKodeverk={alleKodeverk}
                  resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
                  bgPeriodeMedAvslagsårsak={bgPeriodeMedAvslagsårsak}
                  behandlingStatusKode={behandlingStatus?.kode}
                  vilkar={vilkar}
                  aksjonspunkter={aksjonspunkter}
                  sprakkode={sprakkode}
                  readOnly={readOnly}
                  vedtakVarsel={vedtakVarsel}
                  medlemskapFom={medlemskapFom}
                  harRedusertUtbetaling={harRedusertUtbetaling}
                  redusertUtbetalingArsak={redusertUtbetalingArsak}
                  formikValues={formikProps.values}
                  erSendtInnUtenArsaker={erSendtInnUtenArsaker}
                  behandlingArsaker={behandlingArsaker}
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
                redusertUtbetalingÅrsaker={redusertUtbetalingÅrsaker(formikProps)}
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
                setEditorHarLagret={setEditorHarLagret}
                setEditorErTilbakestilt={setEditorErTilbakestilt}
              />
              {!erRevurdering ? (
                <VedtakSubmit
                  behandlingStatusKode={behandlingStatus?.kode}
                  readOnly={readOnly}
                  behandlingPaaVent={behandlingPaaVent}
                  isSubmitting={formikProps.isSubmitting}
                  aksjonspunkter={aksjonspunkter}
                  handleSubmit={
                    erToTrinn ? formikProps.handleSubmit : event => handleErEntrinnSubmit(event, formikProps)
                  }
                  dokumentdata={dokumentdata}
                  lagreDokumentdata={lagreDokumentdata}
                  brødtekst={formikProps.values.brødtekst}
                  overskrift={formikProps.values.overskrift}
                  redigertHtml={formikProps.values.redigertHtml}
                  originalHtml={formikProps.values.originalHtml}
                  inkluderKalender={formikProps.values[fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING]}
                  tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
                  editorHarLagret={editorHarLagret}
                  editorErTilbakestilt={editorErTilbakestilt}
                  setEditorErTilbakestilt={setEditorErTilbakestilt}
                />
              ) : (
                <VedtakRevurderingSubmitPanel
                  formikValues={formikProps.values}
                  isSubmitting={formikProps.isSubmitting}
                  skalBrukeOverstyrendeFritekstBrev={formikProps.values.skalBrukeOverstyrendeFritekstBrev}
                  handleSubmit={
                    erToTrinn ? formikProps.handleSubmit : event => handleErEntrinnSubmit(event, formikProps)
                  }
                  ytelseTypeKode={ytelseTypeKode}
                  readOnly={readOnly}
                  behandlingStatusKode={behandlingStatus?.kode}
                  harRedusertUtbetaling={harRedusertUtbetaling}
                  dokumentdata={dokumentdata}
                  lagreDokumentdata={lagreDokumentdata}
                  brødtekst={formikProps.values.brødtekst}
                  overskrift={formikProps.values.overskrift}
                  redigertHtml={formikProps.values.redigertHtml}
                  originalHtml={formikProps.values.originalHtml}
                  visFeilmeldingFordiArsakerMangler={() => setErSendtInnUtenArsaker(true)}
                  aksjonspunkter={aksjonspunkter}
                  tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
                  editorHarLagret={editorHarLagret}
                  editorErTilbakestilt={editorErTilbakestilt}
                  setEditorErTilbakestilt={setEditorErTilbakestilt}
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
