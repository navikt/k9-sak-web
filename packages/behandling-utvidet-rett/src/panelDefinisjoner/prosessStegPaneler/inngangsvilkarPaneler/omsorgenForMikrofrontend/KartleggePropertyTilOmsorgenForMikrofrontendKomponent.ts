import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Behandling } from '@k9-sak-web/types';
import fagsakTsType from '@k9-sak-web/types/src/fagsakTsType';
import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import UtvidetRettMikrofrontendVisning from '../../../../types/MikrofrontendKomponenter';
import { generereInfoForVurdertVilkar } from '../../UtvidetRettOmsorgenForMikrofrontendFelles';
import { OmsorgenForProps } from '../../../../types/utvidetRettMikrofrontend/OmsorgProps';
import { InformasjonTilLesemodus } from '../../../../types/utvidetRettMikrofrontend/informasjonTilLesemodus';
import { AksjonspunktInformasjon, VilkarInformasjon, } from '../../../../types/utvidetRettMikrofrontend/KartleggePropertyTilMikrofrontendTypes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';

interface PropTypes {
  isReadOnly: boolean;
  submitCallback: any;
  angitteBarn: { personIdent: string }[];
  behandling: Behandling;
  aksjonspunktInformasjon?: AksjonspunktInformasjon;
  vilkarInformasjon: VilkarInformasjon;
  fagsaksType: fagsakTsType;
  FormState: FormStateType;
  harBarnSoktForRammevedtakOmKroniskSyk: boolean;
}

const KartleggePropertyTilOmsorgenForMikrofrontendKomponent = ({
  isReadOnly,
  submitCallback,
  behandling,
  angitteBarn,
  aksjonspunktInformasjon,
  vilkarInformasjon,
  fagsaksType,
  FormState,
  harBarnSoktForRammevedtakOmKroniskSyk
}: PropTypes) => {
  const { aksjonspunkter, isAksjonspunktOpen } = aksjonspunktInformasjon;
  const { vilkar, status } = vilkarInformasjon;
  const omsorgenForVilkar = vilkar.find(v => v.vilkarType === vilkarType.OMSORGENFORVILKARET);
  const behandlingsID = behandling.id.toString();
  let aksjonspunkt;

  if (aksjonspunkter) {
    aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon === aksjonspunktCodes.OMSORGEN_FOR);
  }

  const vilkaretVurderesManuelltMedAksjonspunkt = aksjonspunkt && omsorgenForVilkar;
  // Vilkåret kan kun bli automatisk innvilget. Dersom det blir automatiskt avslått resulterer det i manuell vurdering via aksjonspunkt.
  const vilkaretErAutomatiskInnvilget = !aksjonspunkt && omsorgenForVilkar && omsorgenForVilkar.perioder[0]?.vilkarStatus === vilkarUtfallType.OPPFYLT;

  if (vilkaretVurderesManuelltMedAksjonspunkt) {
    const skalVilkarsUtfallVises = behandling.status === behandlingStatus.AVSLUTTET;
    const aksjonspunktLost = behandling.status === behandlingStatus.BEHANDLING_UTREDES && !isAksjonspunktOpen;

    return {
      visKomponent: UtvidetRettMikrofrontendVisning.OMSORG,
      props: {
        behandlingsID,
        fagytelseType: fagsaksType,
        aksjonspunktLost,
        lesemodus: isReadOnly || !isAksjonspunktOpen,
        informasjonTilLesemodus: {
          begrunnelse: aksjonspunkt.begrunnelse ? aksjonspunkt.begrunnelse : '',
          vilkarOppfylt: status === vilkarUtfallType.OPPFYLT,
        } as InformasjonTilLesemodus,
        barn: angitteBarn.map(barn => barn.personIdent),
        harBarnSoktForRammevedtakOmKroniskSyk,
        vedtakFattetVilkarOppfylt: skalVilkarsUtfallVises,
        informasjonOmVilkar: generereInfoForVurdertVilkar(
          skalVilkarsUtfallVises,
          omsorgenForVilkar,
          aksjonspunkt.begrunnelse,
          'Omsorgen for',
        ),
        losAksjonspunkt: (harOmsorgen, begrunnelse) => {
          submitCallback([
            {
              kode: aksjonspunkt.definisjon,
              harOmsorgenFor: harOmsorgen,
              begrunnelse,
            },
          ]);
        },
        formState: FormState,
      } as OmsorgenForProps,
    }
  }

  if (vilkaretErAutomatiskInnvilget) {
    return {
      visKomponent: UtvidetRettMikrofrontendVisning.OMSORG,
      props: {
        behandlingsID,
        fagytelseType: fagsaksType,
        aksjonspunktLost: false,
        barn: angitteBarn.map(barn => barn.personIdent),
        harBarnSoktForRammevedtakOmKroniskSyk,
        vedtakFattetVilkarOppfylt: true,
        informasjonOmVilkar: generereInfoForVurdertVilkar(
          true,
          omsorgenForVilkar,
          '',
          'Omsorgen for',
        ),
        formState: FormState,
      } as OmsorgenForProps,
    }
  }

  return {};
};

export default KartleggePropertyTilOmsorgenForMikrofrontendKomponent;
