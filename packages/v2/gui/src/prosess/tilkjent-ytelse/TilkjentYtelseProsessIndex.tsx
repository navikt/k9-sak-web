import type {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
  k9_sak_kontrakt_person_PersonopplysningDto as PersonopplysningDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import { use } from 'react';
import { assertDefined } from '../../utils/validation/assertDefined.js';
import { TilkjentYtelseApiContext } from './api/TilkjentYtelseApiContext.js';
import type { FeriepengerPrÅr } from './components/feriepenger/FeriepengerPanel.tsx';
import TilkjentYtelsePanel from './components/TilkjentYtelsePanel';
import type { ArbeidsgiverOpplysningerPerId } from './types/arbeidsgiverOpplysningerType';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from './types/BeregningsresultatMedUtbetaltePeriode';

interface OwnProps {
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId | undefined;
  behandling: Pick<BehandlingDto, 'uuid'>;
  beregningsresultat: BeregningsresultatMedUtbetaltePeriodeDto;
  aksjonspunkter: AksjonspunktDto[];
  isReadOnly: boolean;
  submitCallback: (data: any) => Promise<any>;
  readOnlySubmitButton: boolean;
  personopplysninger: PersonopplysningDto;
  showAndelDetails?: boolean;
}

const emptyResult: FeriepengerPrÅr = new Map();

/**
 * @experimental Denne komponenten er ikke klar for produksjon.
 */
export const TilkjentYtelseProsessIndex = ({
  beregningsresultat,
  aksjonspunkter,
  isReadOnly,
  submitCallback,
  readOnlySubmitButton,
  arbeidsgiverOpplysningerPerId,
  personopplysninger,
  showAndelDetails,
  behandling,
}: OwnProps) => {
  const tilkjentYtelseBackendClient = assertDefined(use(TilkjentYtelseApiContext));
  const featureToggles = use(FeatureTogglesContext);

  const { data: feriepengerPrÅr } = useSuspenseQuery({
    queryKey: ['feriepengegrunnlag', behandling?.uuid],
    queryFn: async () => {
      return behandling?.uuid != null
        ? await tilkjentYtelseBackendClient.hentFeriepengegrunnlagPrÅr(behandling.uuid)
        : null;
    },
    select: data => (data != null ? data : emptyResult),
  });

  if (!arbeidsgiverOpplysningerPerId) {
    return null;
  }

  return (
    <TilkjentYtelsePanel
      beregningsresultat={beregningsresultat}
      aksjonspunkter={aksjonspunkter}
      readOnly={isReadOnly}
      submitCallback={submitCallback}
      readOnlySubmitButton={readOnlySubmitButton}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      featureToggles={featureToggles}
      personopplysninger={personopplysninger}
      showAndelDetails={showAndelDetails}
      feriepengerPrÅr={feriepengerPrÅr}
    />
  );
};
