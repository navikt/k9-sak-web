import type { k9_klage_kontrakt_klage_KlagebehandlingDto as KlagebehandlingDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { BodyShort, Detail, ErrorMessage, Fieldset, HStack, Link, Radio, VStack } from '@navikt/ds-react';
import { RhfCheckbox, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { ArrowBox } from '@navikt/ft-ui-komponenter';
import { useContext } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { NavLink, useLocation } from 'react-router';
import { type TotrinnskontrollBehandling } from '../types/TotrinnskontrollBehandling.js';
import styles from './aksjonspunktGodkjenningFieldArray.module.css';
import getAksjonspunkttekst from './aksjonspunktTekster/aksjonspunktTekstUtleder';
import { type FormState } from './FormState';
import { createPathForSkjermlenke } from '../../../utils/skjermlenke/createPathForSkjermlenke.js';
import type { TotrinnskontrollData } from '../../../behandling/support/totrinnskontroll/TotrinnskontrollApi.js';
import { K9KodeverkoppslagContext } from '../../../kodeverk/oppslag/K9KodeverkoppslagContext.js';
import { SkjermlenkeType } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/SkjermlenkeType.js';

export type AksjonspunktGodkjenningData = {
  aksjonspunktKode: AksjonspunktDefinisjon;
  annet?: boolean;
  besluttersBegrunnelse?: string;
  feilFakta?: boolean;
  feilLov?: boolean;
  feilRegel?: boolean;
  totrinnskontrollGodkjent?: boolean;
};

interface OwnProps {
  totrinnskontrollData: TotrinnskontrollData;
  readOnly: boolean;
  klagebehandlingVurdering?: KlagebehandlingDto;
  behandlingStatus: TotrinnskontrollBehandling['status'];
}

export const AksjonspunktGodkjenningFieldArray = ({
  totrinnskontrollData,
  readOnly,
  klagebehandlingVurdering,
  behandlingStatus,
}: OwnProps) => {
  const location = useLocation();
  const featureToggles = useContext(FeatureTogglesContext);
  const { control, getFieldState, trigger } = useFormContext<FormState>();
  const { fields } = useFieldArray({ control, name: 'aksjonspunktGodkjenning' });
  const aksjonspunktGodkjenning = useWatch({ control, name: 'aksjonspunktGodkjenning' });
  const kodeverkoppslag = useContext(K9KodeverkoppslagContext);
  return (
    <>
      {fields.map((field, index) => {
        const { aksjonspunktKode, totrinnskontrollGodkjent } = aksjonspunktGodkjenning[index] || {};
        const data = aksjonspunktKode != null ? totrinnskontrollData.forAksjonspunkt(aksjonspunktKode) : undefined;

        // klageVurderingResultatNK ser ut til å vere satt viss klage på gitt behandling har blitt vurdert av "NAV Klageenhet K9" (NK) eller "NAV Klageenhet Kabal" (NKK)
        const erGodkjentKlageMedVurderingsresultatFraKlageenhet: boolean =
          klagebehandlingVurdering?.klageVurderingResultatNK != null && totrinnskontrollGodkjent == true;

        const visAvslagsårsakKryssbokser = totrinnskontrollGodkjent === false;
        // I nokre tilfeller skal godkjenning av klage begrunnast med tekst
        const visBegrunnelseTekstfelt =
          totrinnskontrollGodkjent === false || erGodkjentKlageMedVurderingsresultatFraKlageenhet;

        const aksjonspunktText =
          data != null
            ? getAksjonspunkttekst(behandlingStatus, data.aksjonspunkt, klagebehandlingVurdering, kodeverkoppslag)
            : undefined;

        const isNyInntektEgetPanel =
          featureToggles?.['NY_INNTEKT_EGET_PANEL'] &&
          data?.skjermlenke?.kilde === SkjermlenkeType.FAKTA_OM_FORDELING &&
          aksjonspunktKode === AksjonspunktDefinisjon.VURDER_NYTT_INNTEKTSFORHOLD;

        const { error } = getFieldState(`aksjonspunktGodkjenning.${index}`);
        const checkboxValidationError = error?.message; // formState.errors.aksjonspunktGodkjenning?.[index]?.message
        const reValidateAksjonspunktGodkjenning = () => trigger(`aksjonspunktGodkjenning.${index}`);

        const skjermlenkePath = isNyInntektEgetPanel
          ? createPathForSkjermlenke(location, 'FAKTA_OM_NY_INNTEKT')
          : data != null
            ? createPathForSkjermlenke(location, data.skjermlenke.kilde)
            : '';

        const skjermlenkeTekst =
          data?.skjermlenke?.kilde === SkjermlenkeType.VEDTAK
            ? 'Brev'
            : isNyInntektEgetPanel
              ? 'Ny inntekt'
              : data?.skjermlenke?.navn;

        return (
          <div className={index > 0 ? 'mt-2' : ''} key={field.id}>
            <Link as={NavLink} to={skjermlenkePath} onClick={() => window.scroll(0, 0)} className={styles.lenke}>
              {skjermlenkeTekst}
            </Link>
            <div className={styles.approvalItemContainer}>
              {aksjonspunktText
                ?.filter(text => !!text)
                .map((formattedMessage, i) => (
                  <div
                    key={aksjonspunktKode?.concat('_'.concat(i.toString()))}
                    className={styles.aksjonspunktTextContainer}
                  >
                    <BodyShort size="small">{formattedMessage}</BodyShort>
                  </div>
                ))}
              <Fieldset legend="" hideLegend>
                <RhfRadioGroup
                  control={control}
                  name={`aksjonspunktGodkjenning.${index}.totrinnskontrollGodkjent`}
                  isReadOnly={readOnly}
                >
                  <HStack gap="space-16">
                    <Radio value={true}>Godkjent</Radio>
                    <Radio value={false}>Vurder på nytt</Radio>
                  </HStack>
                </RhfRadioGroup>
                {visBegrunnelseTekstfelt && (
                  <ArrowBox alignOffset={erGodkjentKlageMedVurderingsresultatFraKlageenhet ? 1 : 110}>
                    {visAvslagsårsakKryssbokser && (
                      <VStack gap="space-8">
                        <Detail className="blokk-xs">Årsak</Detail>
                        <Fieldset legend="" hideLegend>
                          <HStack gap="space-80">
                            <div>
                              <RhfCheckbox
                                control={control}
                                name={`aksjonspunktGodkjenning.${index}.feilFakta`}
                                label="Feil fakta"
                                readOnly={readOnly}
                                onChange={reValidateAksjonspunktGodkjenning}
                              />
                              <RhfCheckbox
                                control={control}
                                name={`aksjonspunktGodkjenning.${index}.feilRegel`}
                                label="Feil regelforståelse"
                                readOnly={readOnly}
                                onChange={reValidateAksjonspunktGodkjenning}
                              />
                            </div>
                            <div>
                              <RhfCheckbox
                                control={control}
                                name={`aksjonspunktGodkjenning.${index}.feilLov`}
                                label="Feil lovanvendelse"
                                readOnly={readOnly}
                                onChange={reValidateAksjonspunktGodkjenning}
                              />
                              <RhfCheckbox
                                control={control}
                                name={`aksjonspunktGodkjenning.${index}.annet`}
                                label="Annet"
                                readOnly={readOnly}
                                onChange={reValidateAksjonspunktGodkjenning}
                              />
                            </div>
                          </HStack>
                          {checkboxValidationError && <ErrorMessage>{checkboxValidationError}</ErrorMessage>}
                        </Fieldset>
                      </VStack>
                    )}
                    <div className="mt-4">
                      <RhfTextarea
                        control={control}
                        name={`aksjonspunktGodkjenning.${index}.besluttersBegrunnelse`}
                        label="Begrunnelse"
                        readOnly={readOnly}
                      />
                    </div>
                  </ArrowBox>
                )}
              </Fieldset>
            </div>
          </div>
        );
      })}
    </>
  );
};
