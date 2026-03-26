import {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto,
  k9_sak_kontrakt_beregningsresultat_BeregningsresultatMedUtbetaltePeriodeDto as BeregningsresultatMedUtbetaltePeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { Fagsak } from '@k9-sak-web/types';
import { useQuery } from '@tanstack/react-query';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { useContext } from 'react';
import TilkjentYtelsePanel from './components/TilkjentYtelsePanel';
import { hentFeriepengegrunnlagPrÅr } from './api/tilkjentYtelseApi.js';
import { TilkjentYtelseV1ApiContext } from './api/TilkjentYtelseApiContext.js';

interface OwnProps {
  arbeidsgiverOpplysningerPerId: k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto['arbeidsgivere'];
  beregningsresultat: BeregningsresultatMedUtbetaltePeriodeDto;
  fagsak: Fagsak;
  behandlingUuid: string;
  aksjonspunkter: AksjonspunktDto[];
  isReadOnly: boolean;
  submitCallback: (data: any) => Promise<any>;
  readOnlySubmitButton: boolean;
}

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
  },
  cache,
);

const TilkjentYtelseProsessIndexImpl = ({
  beregningsresultat,
  behandlingUuid,
  aksjonspunkter,
  isReadOnly,
  submitCallback,
  readOnlySubmitButton,
  arbeidsgiverOpplysningerPerId,
  fagsak,
}: OwnProps) => {
  const featureToggles = useContext(FeatureTogglesContext);
  const VIS_FERIEPENGER_PANEL = featureToggles?.['VIS_FERIEPENGER_PANEL'];

  const apiOverride = useContext(TilkjentYtelseV1ApiContext);
  const fetchFn = apiOverride?.hentFeriepengegrunnlagPrÅr ?? hentFeriepengegrunnlagPrÅr;

  const { data: feriepengerPrÅr = new Map() } = useQuery({
    queryKey: ['feriepengegrunnlag', behandlingUuid],
    queryFn: () => fetchFn(behandlingUuid),
    enabled: !!VIS_FERIEPENGER_PANEL,
    staleTime: Infinity,
  });

  return (
    <TilkjentYtelsePanel
      beregningsresultat={beregningsresultat}
      aksjonspunkter={aksjonspunkter}
      readOnly={isReadOnly}
      submitCallback={submitCallback}
      readOnlySubmitButton={readOnlySubmitButton}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      isUngdomsytelseFagsak={fagsak.sakstype === fagsakYtelsesType.UNGDOMSYTELSE}
      feriepengerPrÅr={VIS_FERIEPENGER_PANEL ? feriepengerPrÅr : undefined}
    />
  );
};

const TilkjentYtelseProsessIndex = (props: OwnProps) => (
  <RawIntlProvider value={intl}>
    <TilkjentYtelseProsessIndexImpl {...props} />
  </RawIntlProvider>
);

export default TilkjentYtelseProsessIndex;
