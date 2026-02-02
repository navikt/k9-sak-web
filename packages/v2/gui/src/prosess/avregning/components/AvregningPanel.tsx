import questionHoverUrl from '@fpsak-frontend/assets/images/question_hover.svg';
import questionNormalUrl from '@fpsak-frontend/assets/images/question_normal.svg';
import {
  RadioGroupField,
  TextAreaField,
  behandlingForm,
  behandlingFormValueSelector,
  getBehandlingFormPrefix,
} from '@fpsak-frontend/form';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import { AksjonspunktHelpText, ArrowBox, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDtoDefinisjon } from '@k9-sak-web/backend/k9sak/generated/types.js';
import KontrollerEtterbetalingAlert from '@k9-sak-web/gui/prosess/avregning/kontroller-etterbetaling/KontrollerEtterbetalingAlert.js';
import KontrollerEtterbetalingIndex from '@k9-sak-web/gui/prosess/avregning/kontroller-etterbetaling/KontrollerEtterbetalingIndex.js';
import { BodyShort, Button, Detail, HGrid, Heading, Label, Link, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clearFields } from 'redux-form';
import { createSelector } from 'reselect';
import AvregningSummary from './AvregningSummary';
import AvregningTable from './AvregningTable';

import styles from './avregningPanel.module.css';
import { isUngWeb } from '../../../utils/urlUtils';
import type { SimuleringDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/SimuleringDto.js';

// TODO Denne komponenten må refaktorerast! Er frykteleg stor

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const maxLength12000 = maxLength(12000);
const simuleringAksjonspunkter = [
  AksjonspunktDtoDefinisjon.VURDER_FEILUTBETALING,
  AksjonspunktDtoDefinisjon.SJEKK_HØY_ETTERBETALING,
];
const formName = 'AvregnigForm';
const IKKE_SEND = 'IKKE_SEND';

interface AvregningPanelImplProps {
  simuleringResultat: SimuleringDto;
  readOnly: boolean;
  språkkode: string;
  featureUtvidetVarselfelt: boolean;
  previewCallback: (a: string, b: string, c: string, d: string) => void;
}
export function AvregningPanelImpl(props: AvregningPanelImplProps) {
  const [showDetails, setShowDetails] = useState<Array<{ id: number; show: boolean }>>([]);
  const [feilutbetaling, setFeilutbetaling] = useState<boolean | undefined>(undefined);
  const {
    simuleringResultat,
    readOnly,
    featureUtvidetVarselfelt,
    previewCallback,
    hasOpenTilbakekrevingsbehandling,
    aksjonspunkter,
    harVurderFeilutbetalingAP,
    harSjekkHøyEtterbetalingAP,
    behandling,
    fagsak,
    ...formProps
  } = props;
  console.log(simuleringResultat);
  const previewMessage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    previewCallback('', dokumentMalType.TBKVAR, formProps.values.varseltekst || ' ', formProps.values.saksnummer);
    e.preventDefault();
  };
  const toggleDetails = (id: number) => {
    const tableIndex = showDetails.findIndex(table => table.id === id);

    if (tableIndex !== -1) {
      const updatedTable = {
        id,
        show: !showDetails?.[tableIndex]?.show,
      };
      setShowDetails(showDetails.map((table, index) => (index === tableIndex ? updatedTable : table)));
    } else {
      setShowDetails([...showDetails, { id, show: true }]);
    }
  };

  const getSimuleringResult = () => {
    if (!simuleringResultat) {
      return simuleringResultat;
    }
    return feilutbetaling === undefined || feilutbetaling
      ? simuleringResultat.simuleringResultat
      : simuleringResultat.simuleringResultatUtenInntrekk;
  };

  const simuleringResultatOption = getSimuleringResult();
  return (
    <>
      <VStack gap="space-32">
        <Heading size="small" level="2">
          Simulering
        </Heading>
        {harSjekkHøyEtterbetalingAP && <KontrollerEtterbetalingAlert />}
        {simuleringResultatOption && (
          <VStack gap="space-8">
            <AksjonspunktHelpText isAksjonspunktOpen={harVurderFeilutbetalingAP}>
              {['Vurder videre behandling av tilbakekreving']}
            </AksjonspunktHelpText>

            <AvregningSummary
              fom={simuleringResultatOption.periode?.fom}
              tom={simuleringResultatOption.periode?.tom}
              feilutbetaling={simuleringResultatOption.sumFeilutbetaling}
              etterbetaling={simuleringResultatOption.sumEtterbetaling}
              inntrekk={simuleringResultatOption.sumInntrekk}
              ingenPerioderMedAvvik={simuleringResultatOption.ingenPerioderMedAvvik}
            />

            <AvregningTable
              showDetails={showDetails}
              toggleDetails={toggleDetails}
              simuleringResultat={simuleringResultatOption}
              ingenPerioderMedAvvik={simuleringResultatOption.ingenPerioderMedAvvik}
            />
            {hasOpenTilbakekrevingsbehandling && (
              <Label size="small" as="p">
                Det foreligger en åpen tilbakekrevingsbehandling, endringer i vedtaket vil automatisk oppdatere
                eksisterende feilutbetalte perioder og beløp.
              </Label>
            )}
          </VStack>
        )}
        {!simuleringResultat && <>Ingen informasjon om simulering mottatt fra økonomiløsningen.</>}
        {harVurderFeilutbetalingAP && (
          <VStack gap="space-8">
            <form onSubmit={formProps.handleSubmit}>
              <HGrid gap="space-4" columns={{ xs: '6fr 6fr' }}>
                <TextAreaField
                  name="begrunnelse"
                  label="Forklar hva feilutbetalingen skyldes og valget av videre behandling"
                  validate={[required, minLength3, maxLength1500, hasValidText]}
                  maxLength={1500}
                  readOnly={readOnly}
                  id="avregningVurdering"
                />
                {harVurderFeilutbetalingAP && (
                  <div>
                    <Detail>Fastsett videre behandling</Detail>
                    <VerticalSpacer eightPx />
                    <RadioGroupField
                      name="videreBehandling"
                      validate={[required]}
                      isVertical
                      readOnly={readOnly}
                      radios={[
                        {
                          value: tilbakekrevingVidereBehandling.TILBAKEKR_OPPRETT,
                          label: 'Opprett tilbakekreving, send varsel',
                          element: (
                            <div className={styles.varsel}>
                              <ArrowBox alignOffset={20}>
                                <HGrid gap="space-4" columns={{ xs: '10fr 2fr' }}>
                                  <BodyShort size="small" className={styles.bold}>
                                    Send varsel om tilbakekreving
                                  </BodyShort>
                                  <div>
                                    <Image
                                      tabIndex="0"
                                      src={questionNormalUrl}
                                      srcHover={questionHoverUrl}
                                      alt="Her skal du oppgi hvorfor brukeren ikke skulle fått utbetalt ytelsen i perioden(e). Du må også oppgi hvordan feilutbetalingen ble oppdaget, hvem som oppdaget den og når den ble oppdaget eller meldt til NAV. Eksempel på tekst: «Vi mottok melding fra deg [dato]om at du hadde jobbet heltid. Du kan ikke jobbe og motta pleiepenger samtidig. Da vi mottok meldingen fra deg, var det allerede utbetalt pleiepenger for perioden du har jobbet."
                                      tooltip="Her skal du oppgi hvorfor brukeren ikke skulle fått utbetalt ytelsen i perioden(e). Du må også oppgi hvordan feilutbetalingen ble oppdaget, hvem som oppdaget den og når den ble oppdaget eller meldt til NAV. Eksempel på tekst: «Vi mottok melding fra deg [dato]om at du hadde jobbet heltid. Du kan ikke jobbe og motta pleiepenger samtidig. Da vi mottok meldingen fra deg, var det allerede utbetalt pleiepenger for perioden du har jobbet."
                                    />
                                  </div>
                                </HGrid>
                                <VerticalSpacer eightPx />
                                <TextAreaField
                                  name="varseltekst"
                                  label="Fritekst i varselet"
                                  validate={[
                                    required,
                                    minLength3,
                                    featureUtvidetVarselfelt ? maxLength12000 : maxLength1500,
                                    hasValidText,
                                  ]}
                                  maxLength={featureUtvidetVarselfelt ? 12000 : 1500}
                                  readOnly={readOnly}
                                  badges={[
                                    {
                                      type: 'warning',
                                      textId: 'Malform.Bokmal',
                                      title: 'Foretrukket språk',
                                    },
                                  ]}
                                />
                                <VerticalSpacer fourPx />
                                <Link href="" onClick={previewMessage}>
                                  Forhåndsvis varselbrev
                                </Link>
                              </ArrowBox>
                            </div>
                          ),
                        },
                        {
                          value: `${tilbakekrevingVidereBehandling.TILBAKEKR_OPPRETT}${IKKE_SEND}`,
                          label: 'Opprett tilbakekreving, ikke send varsel',
                        },
                        ...(!isUngWeb()
                          ? [
                              {
                                value: tilbakekrevingVidereBehandling.TILBAKEKR_IGNORER,
                                label: 'Avvent samordning, ingen tilbakekreving',
                              },
                            ]
                          : []),
                      ]}
                    />
                  </div>
                )}
              </HGrid>
              <HGrid className="mt-4" gap="space-4" columns={{ xs: '6fr 6fr' }}>
                <div>
                  <Button
                    variant="primary"
                    size="small"
                    type="button"
                    onClick={formProps.handleSubmit}
                    disabled={formProps.invalid || formProps.pristine || formProps.submitting}
                    loading={formProps.submitting}
                  >
                    Bekreft og fortsett
                  </Button>
                </div>
              </HGrid>
            </form>
          </VStack>
        )}
        {harSjekkHøyEtterbetalingAP && (
          <KontrollerEtterbetalingIndex
            aksjonspunkt={aksjonspunkter.find(
              ap => ap.definisjon === AksjonspunktDtoDefinisjon.SJEKK_HØY_ETTERBETALING,
            )}
            behandling={behandling}
            readOnly={readOnly}
          />
        )}
      </VStack>
    </>
  );
}

export const transformValues = (values, ap) => {
  const { videreBehandling, varseltekst, begrunnelse } = values;
  const info = {
    kode: ap,
    begrunnelse,
    videreBehandling,
  };

  return videreBehandling.endsWith(IKKE_SEND)
    ? {
        ...info,
        videreBehandling: tilbakekrevingVidereBehandling.TILBAKEKR_OPPRETT,
      }
    : {
        ...info,
        varseltekst,
      };
};

const buildInitialValues = createSelector(
  [(state, ownProps) => ownProps.tilbakekrevingvalg, (state, ownProps) => ownProps.aksjonspunkter],
  (tilbakekrevingvalg, aksjonspunkter) => {
    const aksjonspunkt = aksjonspunkter.find(ap => simuleringAksjonspunkter.includes(ap.definisjon));
    if (!aksjonspunkt || !tilbakekrevingvalg) {
      return undefined;
    }

    const harTypeIkkeSendt =
      !tilbakekrevingvalg.varseltekst &&
      tilbakekrevingvalg.videreBehandling.kode === tilbakekrevingVidereBehandling.TILBAKEKR_OPPRETT;

    return {
      videreBehandling: harTypeIkkeSendt
        ? tilbakekrevingvalg.videreBehandling.kode + IKKE_SEND
        : tilbakekrevingvalg.videreBehandling.kode,
      varseltekst: tilbakekrevingvalg.varseltekst,
      begrunnelse: aksjonspunkt.begrunnelse,
      aksjonspunkter,
    };
  },
);

const mapStateToPropsFactory = (initialState, ownPropsStatic) => {
  const onSubmit = values => ownPropsStatic.submitCallback([transformValues(values, ownPropsStatic.apCodes[0])]);

  return (state, ownProps) => {
    const { språkkode, tilbakekrevingvalg, simuleringResultat, fagsak, featureToggles, behandling } = ownProps;
    const hasOpenTilbakekrevingsbehandling =
      tilbakekrevingvalg !== undefined &&
      tilbakekrevingvalg.videreBehandling.kode === tilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER;
    return {
      harVurderFeilutbetalingAP: ownProps.apCodes.includes(AksjonspunktDtoDefinisjon.VURDER_FEILUTBETALING),
      harSjekkHøyEtterbetalingAP: ownProps.apCodes.includes(AksjonspunktDtoDefinisjon.SJEKK_HØY_ETTERBETALING),
      behandling,
      varseltekst: behandlingFormValueSelector(formName, behandling.id, behandling.versjon)(state, 'varseltekst'),
      initialValues: buildInitialValues(state, ownProps),
      behandlingFormPrefix: getBehandlingFormPrefix(behandling.id, behandling.versjon),
      featureUtvidetVarselfelt: featureToggles?.UTVIDET_VARSELFELT,
      saksnummer: fagsak.saksnummer,
      hasOpenTilbakekrevingsbehandling,
      språkkode,
      simuleringResultat,
      onSubmit,
    };
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      clearFields,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  behandlingForm({
    form: formName,
    enableReinitialize: true,
  })(AvregningPanelImpl),
);
