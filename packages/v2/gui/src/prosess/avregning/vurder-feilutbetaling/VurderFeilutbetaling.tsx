import { TilbakekrevingVidereBehandling } from '@k9-sak-web/backend/k9sak/kodeverk/økonomi/tilbakekreving/TilbakekrevingVidereBehandling.js';
import type { TilbakekrevingVidereBehandling as TilbakekrevingVidereBehandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/økonomi/tilbakekreving/TilbakekrevingVidereBehandling.js';
import { BodyShort, Button, HelpText, HGrid, HStack, Radio, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';

import { isUngWeb } from '../../../utils/urlUtils';
import { useContext } from 'react';
import FeatureTogglesContext from '../../../featuretoggles/FeatureTogglesContext';
import ArrowBox from '../../../shared/arrowBox/ArrowBox';
import type { AksjonspunktDto as K9SakAksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { AksjonspunktDto as UngSakAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { TilbakekrevingValgDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/økonomi/tilbakekreving/TilbakekrevingValgDto.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { useAvregningBackendClient } from '../AvregningBackendClientContext.js';
import type { FagsakYtelseType } from '@k9-sak-web/backend/combined/kodeverk/behandling/FagsakYtelseType.js';
import { foreldrepenger_tilbakekreving_behandlingslager_fagsak_FagsakYtelseType as FagsakYtelseTypeK9Tilbake } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
import { isValueOfConstObject } from '@k9-sak-web/backend/typecheck/isValueOfConstObject.js';

const IKKE_SEND_SUFFIX = `${TilbakekrevingVidereBehandling.OPPRETT_TILBAKEKREVING}IKKE_SEND` as const;
interface VurderFeilutbetalingFormValues {
  videreBehandling: TilbakekrevingVidereBehandlingType | typeof IKKE_SEND_SUFFIX;
  varseltekst: string;
  begrunnelse: string;
}

interface VurderFeilutbetalingProps {
  readOnly: boolean;
  aksjonspunkter: K9SakAksjonspunktDto[] | UngSakAksjonspunktDto[];
  tilbakekrevingvalg: TilbakekrevingValgDto;
  behandling: BehandlingDto;
  fagsakYtelseType: FagsakYtelseType;
}

const buildInitialValues = (
  aksjonspunkter: K9SakAksjonspunktDto[] | UngSakAksjonspunktDto[],
  tilbakekrevingvalg: TilbakekrevingValgDto,
) => {
  if (!tilbakekrevingvalg || !aksjonspunkter) {
    return undefined;
  }
  const aksjonspunkt = aksjonspunkter.find(
    ap =>
      ap.definisjon === AksjonspunktDefinisjon.VURDER_FEILUTBETALING ||
      ap.definisjon === AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
  );

  const harTypeIkkeSendt =
    !tilbakekrevingvalg.varseltekst &&
    tilbakekrevingvalg.videreBehandling === TilbakekrevingVidereBehandling.OPPRETT_TILBAKEKREVING;

  const videreBehandling: TilbakekrevingVidereBehandlingType | typeof IKKE_SEND_SUFFIX = harTypeIkkeSendt
    ? IKKE_SEND_SUFFIX
    : (tilbakekrevingvalg.videreBehandling ?? TilbakekrevingVidereBehandling.OPPRETT_TILBAKEKREVING);

  return {
    videreBehandling,
    varseltekst: tilbakekrevingvalg.varseltekst ?? '',
    begrunnelse: aksjonspunkt?.begrunnelse ?? '',
  };
};

export const VurderFeilutbetaling = ({
  readOnly,
  behandling,
  fagsakYtelseType,
  aksjonspunkter,
  tilbakekrevingvalg,
}: VurderFeilutbetalingProps) => {
  const formMethods = useForm<VurderFeilutbetalingFormValues>({
    defaultValues: buildInitialValues(aksjonspunkter, tilbakekrevingvalg),
  });
  const featureToggles = useContext(FeatureTogglesContext);
  const avregningBackendClient = useAvregningBackendClient();
  const utvidetVarseltekst = featureToggles?.UTVIDET_VARSELFELT;
  const maxLengthVarseltekst = utvidetVarseltekst ? 12000 : 1500;

  const forhåndsvisVarselbrev = async () => {
    if (!behandling.uuid) {
      throw new Error('Utviklerfeil: Behandling UUID er påkrevd for forhåndsvisning varselbrev. Meld fra i porten.');
    }

    if (!isValueOfConstObject(fagsakYtelseType, FagsakYtelseTypeK9Tilbake)) {
      throw new Error('Utviklerfeil: Ugyldig fagsak ytelse type');
    }
    const blob = await avregningBackendClient.hentForhåndsvisningVarselbrev(
      behandling.uuid,
      fagsakYtelseType,
      formMethods.watch('varseltekst'),
    );
    window.open(URL.createObjectURL(blob), '_blank');
  };

  const submit = async () => {
    void formMethods.handleSubmit(async () => {
      if (!behandling.id || !behandling.versjon || !behandling.uuid) {
        throw new Error(
          'Utviklerfeil: Behandling ID, versjon og UUID er påkrevd for å løse aksjonspunkt. Meld fra i porten.',
        );
      }

      const videreBehandling =
        formMethods.watch('videreBehandling') === IKKE_SEND_SUFFIX
          ? TilbakekrevingVidereBehandling.OPPRETT_TILBAKEKREVING
          : formMethods.watch('videreBehandling');

      if (videreBehandling === IKKE_SEND_SUFFIX) {
        throw new Error(`Utviklerfeil: Videre behandling er ikke gyldig ${videreBehandling}`);
      }

      await avregningBackendClient.bekreftAksjonspunktVurderFeilutbetaling(
        behandling.id,
        behandling.versjon,
        formMethods.watch('begrunnelse') ?? '',
        videreBehandling,
        formMethods.watch('varseltekst'),
      );
      /// trenger polling
      window.location.reload();
    })();
  };
  return (
    <RhfForm formMethods={formMethods}>
      <VStack gap="space-8">
        <HGrid gap="space-32" columns={{ xs: '6fr 6fr' }}>
          <RhfTextarea
            control={formMethods.control}
            name="begrunnelse"
            label="Forklar hva feilutbetalingen skyldes og valget av videre behandling"
            validate={[required, minLength(3), maxLength(1500), hasValidText]}
            maxLength={1500}
            disabled={readOnly}
          />
          <VStack gap="space-8">
            <RhfRadioGroup
              control={formMethods.control}
              name="videreBehandling"
              validate={[required]}
              legend="Fastsett videre behandling"
              disabled={readOnly}
            >
              <Radio value={TilbakekrevingVidereBehandling.OPPRETT_TILBAKEKREVING}>
                Opprett tilbakekreving, send varsel
              </Radio>
              <>
                {formMethods.watch('videreBehandling') === TilbakekrevingVidereBehandling.OPPRETT_TILBAKEKREVING && (
                  <div className="min-w-[350px] top-[70px] mt-2">
                    <ArrowBox alignOffset={20}>
                      <VStack gap="space-8">
                        <HStack gap="space-4">
                          <BodyShort size="small" className="font-bold">
                            Send varsel om tilbakekreving
                          </BodyShort>
                          <HelpText placement="right-start">
                            <VStack gap="space-8">
                              <BodyShort size="small">
                                Her skal du oppgi hvorfor brukeren ikke skulle fått utbetalt ytelsen i perioden(e).
                              </BodyShort>
                              <BodyShort size="small">
                                Du må også oppgi hvordan feilutbetalingen ble oppdaget, hvem som oppdaget den og når den
                                ble oppdaget eller meldt til NAV.
                              </BodyShort>
                              <BodyShort size="small">
                                Eksempel på tekst: «Vi mottok melding fra deg [dato]om at du hadde jobbet heltid. Du kan
                                ikke jobbe og motta pleiepenger samtidig. Da vi mottok meldingen fra deg, var det
                                allerede utbetalt pleiepenger for perioden du har jobbet.
                              </BodyShort>
                            </VStack>
                          </HelpText>
                        </HStack>
                        <RhfTextarea
                          control={formMethods.control}
                          name="varseltekst"
                          label="Fritekst i varselet"
                          validate={[required, minLength(3), maxLength(maxLengthVarseltekst), hasValidText]}
                          maxLength={maxLengthVarseltekst}
                          readOnly={readOnly}
                        />
                        <div>
                          <Button variant="secondary" size="small" type="button" onClick={forhåndsvisVarselbrev}>
                            Forhåndsvis varselbrev
                          </Button>
                        </div>
                      </VStack>
                    </ArrowBox>
                  </div>
                )}
              </>
              <Radio value={IKKE_SEND_SUFFIX}>Opprett tilbakekreving, ikke send varsel</Radio>
              <>
                {!isUngWeb() && (
                  <Radio value={TilbakekrevingVidereBehandling.IGNORER_TILBAKEKREVING}>
                    Avvent samordning, ingen tilbakekreving
                  </Radio>
                )}
              </>
            </RhfRadioGroup>
          </VStack>
        </HGrid>
        <HGrid className="mt-4" gap="space-4" columns={{ xs: '6fr 6fr' }}>
          <div>
            <Button
              variant="primary"
              size="small"
              type="button"
              onClick={() => void submit()}
              disabled={formMethods.formState.isSubmitting}
              loading={formMethods.formState.isSubmitting}
            >
              Bekreft og fortsett
            </Button>
          </div>
        </HGrid>
      </VStack>
    </RhfForm>
  );
};
