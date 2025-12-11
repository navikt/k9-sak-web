import type { AksjonspunktDto } from '@k9-sak-web/backend/combined/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
import type { FagsakDto } from '@k9-sak-web/backend/combined/kontrakt/fagsak/FagsakDto.js';
import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDtoDefinisjon,
  k9_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling,
  type k9_oppdrag_kontrakt_simulering_v1_SimuleringDto,
  type k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { AksjonspunktDto as K9SakAksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { ung_kodeverk_behandling_FagsakYtelseType } from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { AksjonspunktDto as UngSakAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import KontrollerEtterbetalingAlert from '@k9-sak-web/gui/prosess/avregning/kontroller-etterbetaling/KontrollerEtterbetalingAlert.js';
import KontrollerEtterbetalingIndex from '@k9-sak-web/gui/prosess/avregning/kontroller-etterbetaling/KontrollerEtterbetalingIndex.js';
import AksjonspunktHelpText from '@k9-sak-web/gui/shared/aksjonspunktHelpText/AksjonspunktHelpText.js';
import ArrowBox from '@k9-sak-web/gui/shared/arrowBox/ArrowBox.js';
import {
  BodyShort,
  BoxNew,
  Button,
  HGrid,
  HStack,
  Heading,
  HelpText,
  Label,
  Link,
  Radio,
  VStack,
} from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './avregningPanel.module.css';
import { AvregningSummary } from './AvregningSummary';
import { AvregningTable } from './AvregningTable';
import type { FormValues } from './FormValues';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const maxLength12000 = maxLength(12000);
const simuleringAksjonspunkter = [
  AksjonspunktDtoDefinisjon.VURDER_FEILUTBETALING,
  AksjonspunktDtoDefinisjon.SJEKK_HØY_ETTERBETALING,
];
const IKKE_SEND = 'IKKE_SEND';
const hjelpetekst =
  'Her skal du oppgi hvorfor brukeren ikke skulle fått utbetalt ytelsen i perioden(e). Du må også oppgi hvordan feilutbetalingen ble oppdaget, hvem som oppdaget den og når den ble oppdaget eller meldt til NAV. Eksempel på tekst: «Vi mottok melding fra deg [dato]om at du hadde jobbet heltid. Du kan ikke jobbe og motta pleiepenger samtidig. Da vi mottok meldingen fra deg, var det allerede utbetalt pleiepenger for perioden du har jobbet.';

const getSimuleringResult = (simuleringResultat: k9_oppdrag_kontrakt_simulering_v1_SimuleringDto) => {
  if (!simuleringResultat) {
    return simuleringResultat;
  }
  return simuleringResultat.simuleringResultat;
};

const buildInitialValues = (
  tilbakekrevingvalg: k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto,
  aksjonspunkter: K9SakAksjonspunktDto[] | UngSakAksjonspunktDto[],
): FormValues => {
  const aksjonspunkt = aksjonspunkter.find(ap =>
    simuleringAksjonspunkter.some(simuleringsAksjonspunkt => simuleringsAksjonspunkt === ap.definisjon),
  );

  const harTypeIkkeSendt =
    !tilbakekrevingvalg.varseltekst &&
    tilbakekrevingvalg.videreBehandling ===
      k9_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling.OPPRETT_TILBAKEKREVING;

  return {
    videreBehandling: harTypeIkkeSendt ? IKKE_SEND : (tilbakekrevingvalg.videreBehandling ?? ''),
    varseltekst: tilbakekrevingvalg.varseltekst ?? '',
    begrunnelse: aksjonspunkt?.begrunnelse ?? '',
    aksjonspunkter,
  };
};

interface TransformValues {
  kode: string;
  begrunnelse: string;
  videreBehandling: string;
  varseltekst?: string;
}

export const transformValues = (values: FormValues, ap: AksjonspunktDto['definisjon']): TransformValues => {
  const { videreBehandling, varseltekst, begrunnelse } = values;
  const info = {
    kode: ap ?? '',
    begrunnelse,
    videreBehandling,
  };

  return videreBehandling === IKKE_SEND
    ? {
        ...info,
        videreBehandling: k9_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling.OPPRETT_TILBAKEKREVING,
      }
    : {
        ...info,
        varseltekst,
      };
};

const dokumentMalType = {
  TBKVAR: 'TBKVAR',
};

interface OwnProps {
  simuleringResultat: k9_oppdrag_kontrakt_simulering_v1_SimuleringDto;
  readOnly: boolean;
  previewCallback: (mottaker: string, brevmalkode: string, fritekst: string, saksnummer: string) => void;
  fagsak: FagsakDto;
  behandling: BehandlingDto;
  apCodes: AksjonspunktDto['definisjon'][];
  tilbakekrevingvalg: k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto;
  aksjonspunkter: K9SakAksjonspunktDto[] | UngSakAksjonspunktDto[];
  submitCallback: (values: TransformValues) => void;
}

export const AvregningPanel = ({
  simuleringResultat,
  readOnly,
  previewCallback,
  aksjonspunkter,
  behandling,
  fagsak,
  apCodes,
  tilbakekrevingvalg,
  submitCallback,
}: OwnProps) => {
  const formHook = useForm<FormValues>({
    defaultValues: buildInitialValues(tilbakekrevingvalg, aksjonspunkter),
  });
  const { formState } = formHook;
  const featureToggles = use(FeatureTogglesContext);
  const featureUtvidetVarselfelt = featureToggles?.UTVIDET_VARSELFELT;
  const harVurderFeilutbetalingAP = apCodes.includes(AksjonspunktDtoDefinisjon.VURDER_FEILUTBETALING);
  const sjekkHøyEtterbetalingAP = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDtoDefinisjon.SJEKK_HØY_ETTERBETALING,
  );
  const hasOpenTilbakekrevingsbehandling =
    tilbakekrevingvalg !== undefined &&
    tilbakekrevingvalg.videreBehandling ===
      k9_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER;
  const [showDetails, setShowDetails] = useState<{ id: number; show: boolean }[]>([]);
  const varseltekst = formHook.watch('varseltekst');

  const toggleDetails = (id: number) => {
    const tableIndex = showDetails.findIndex(table => table.id === id);
    let newShowDetailsArray = [];

    if (tableIndex !== -1) {
      const updatedTable = {
        id,
        show: !showDetails?.[tableIndex]?.show,
      };

      newShowDetailsArray = [
        ...showDetails.slice(0, tableIndex),
        updatedTable,
        ...showDetails.slice(tableIndex + 1, showDetails.length - 1),
      ];
    } else {
      newShowDetailsArray = showDetails.concat({
        id,
        show: true,
      });
    }
    setShowDetails(newShowDetailsArray);
  };

  const previewMessage = () => {
    previewCallback('', dokumentMalType.TBKVAR, varseltekst || ' ', fagsak?.saksnummer);
  };

  const simuleringResultatOption = getSimuleringResult(simuleringResultat);
  const isUngFagsak = fagsak?.sakstype === ung_kodeverk_behandling_FagsakYtelseType.UNGDOMSYTELSE;

  const handleSubmit = (values: FormValues) => {
    submitCallback(transformValues(values, apCodes[0]));
  };

  const radioButtons = [
    {
      value: k9_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling.OPPRETT_TILBAKEKREVING,
      label: 'Opprett tilbakekreving, send varsel',
      element: (
        <div className={styles.varsel}>
          <ArrowBox alignOffset={20}>
            <HGrid gap="space-4" columns={{ xs: '10fr 2fr' }}>
              <BodyShort size="small" className={styles.bold}>
                Send varsel om tilbakekreving
              </BodyShort>
              <div>
                <HelpText title="Vis hjelpetekst for varsel om tilbakekreving">{hjelpetekst}</HelpText>
              </div>
            </HGrid>
            <BoxNew marginBlock="space-8 0">
              <RhfTextarea
                control={formHook.control}
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
                id="avregningFritekst"
              />
            </BoxNew>
            <BoxNew marginBlock="space-4 0">
              <Link href="" onClick={previewMessage}>
                Forhåndsvis varselbrev
              </Link>
            </BoxNew>
          </ArrowBox>
        </div>
      ),
    },
    {
      value: IKKE_SEND,
      label: 'Opprett tilbakekreving, ikke send varsel',
    },
    ...(!isUngFagsak
      ? [
          {
            value: k9_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling.IGNORER_TILBAKEKREVING,
            label: 'Avvent samordning, ingen tilbakekreving',
          },
        ]
      : []),
  ];

  return (
    <>
      <VStack gap="space-32">
        <Heading size="small" level="2">
          Simulering
        </Heading>
        {sjekkHøyEtterbetalingAP && <KontrollerEtterbetalingAlert />}
        {simuleringResultatOption && (
          <VStack gap="space-8">
            <AksjonspunktHelpText isAksjonspunktOpen={harVurderFeilutbetalingAP}>
              Vurder videre behandling av tilbakekreving
            </AksjonspunktHelpText>

            <AvregningSummary
              fom={simuleringResultatOption.periode?.fom}
              tom={simuleringResultatOption.periode?.tom}
              feilutbetaling={simuleringResultatOption.sumFeilutbetaling}
              etterbetaling={simuleringResultatOption.sumEtterbetaling}
              inntrekk={simuleringResultatOption.sumInntrekk}
              ingenPerioderMedAvvik={!!simuleringResultatOption.ingenPerioderMedAvvik}
              isUngFagsak={isUngFagsak}
            />

            <AvregningTable
              showDetails={showDetails}
              toggleDetails={toggleDetails}
              simuleringResultat={simuleringResultatOption}
              ingenPerioderMedAvvik={!!simuleringResultatOption.ingenPerioderMedAvvik}
              isUngFagsak={isUngFagsak}
            />
            {hasOpenTilbakekrevingsbehandling && (
              <Label size="small" as="p">
                Det foreligger en åpen tilbakekrevingsbehandling, endringer i vedtaket vil automatisk oppdatere
                eksisterende feilutbetalte perioder og beløp.
              </Label>
            )}
          </VStack>
        )}
        {!simuleringResultat && 'Ingen informasjon om simulering mottatt fra økonomiløsningen.'}
        {harVurderFeilutbetalingAP && (
          <VStack gap="space-8">
            <RhfForm formMethods={formHook} onSubmit={handleSubmit}>
              <HGrid gap="space-4" columns={{ xs: '6fr 6fr' }}>
                <RhfTextarea
                  control={formHook.control}
                  name="begrunnelse"
                  label="Forklar hva feilutbetalingen skyldes og valget av videre behandling"
                  validate={[required, minLength3, maxLength1500, hasValidText]}
                  maxLength={1500}
                  readOnly={readOnly}
                />
                <div>
                  <BoxNew marginBlock="space-8 0">
                    <RhfRadioGroup
                      control={formHook.control}
                      name="videreBehandling"
                      validate={[required]}
                      readOnly={readOnly}
                      legend="Fastsett videre behandling"
                    >
                      {radioButtons.map(radio => (
                        <Radio key={radio.value} value={radio.value}>
                          {radio.label}
                          {radio.element}
                        </Radio>
                      ))}
                    </RhfRadioGroup>
                  </BoxNew>
                </div>
              </HGrid>
              <HStack marginBlock="space-16 0">
                <Button variant="primary" size="small" type="submit" loading={formState.isSubmitting}>
                  Bekreft og fortsett
                </Button>
              </HStack>
            </RhfForm>
          </VStack>
        )}
        {sjekkHøyEtterbetalingAP && (
          <KontrollerEtterbetalingIndex
            aksjonspunkt={sjekkHøyEtterbetalingAP}
            behandling={behandling}
            readOnly={readOnly}
          />
        )}
      </VStack>
    </>
  );
};
