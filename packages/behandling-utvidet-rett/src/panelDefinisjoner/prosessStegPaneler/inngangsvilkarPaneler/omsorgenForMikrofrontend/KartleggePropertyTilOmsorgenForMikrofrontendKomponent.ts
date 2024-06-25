import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Aksjonspunkt, Behandling } from '@k9-sak-web/types';
import { KomponenterEnum } from '@k9-sak-web/prosess-omsorgsdager';

import {
  AksjonspunktInformasjon,
  VilkarInformasjon,
} from '../../../../types/utvidetRettMikrofrontend/KartleggePropertyTilMikrofrontendTypes';
import { OmsorgenForProps } from '../../../../types/utvidetRettMikrofrontend/OmsorgProps';
import { InformasjonTilLesemodus } from '../../../../types/utvidetRettMikrofrontend/informasjonTilLesemodus';
import { generereInfoForVurdertVilkar } from '../../UtvidetRettOmsorgenForMikrofrontendFelles';

interface PropTypes {
  isReadOnly: boolean;
  submitCallback: any;
  angitteBarn: { personIdent: string }[];
  behandling: Behandling;
  aksjonspunktInformasjon?: AksjonspunktInformasjon;
  vilkarInformasjon: VilkarInformasjon;
  fagsaksType: string;
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
  harBarnSoktForRammevedtakOmKroniskSyk,
}: PropTypes): {
  visKomponent: KomponenterEnum.OMSORG;
  props: OmsorgenForProps;
} => {
  const { aksjonspunkter, isAksjonspunktOpen } = aksjonspunktInformasjon;
  const { vilkar, status } = vilkarInformasjon;
  const omsorgenForVilkar = vilkar.find(v => v.vilkarType === vilkarType.OMSORGENFORVILKARET);
  const behandlingsID = behandling.id.toString();
  let aksjonspunkt: Aksjonspunkt;

  if (aksjonspunkter) {
    aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon === aksjonspunktCodes.OMSORGEN_FOR);
  }

  const vilkaretVurderesManuelltMedAksjonspunkt = aksjonspunkt && omsorgenForVilkar;
  // Vilkåret kan kun bli automatisk innvilget. Dersom det blir automatiskt avslått resulterer det i manuell vurdering via aksjonspunkt.
  const vilkaretErAutomatiskInnvilget =
    !aksjonspunkt && omsorgenForVilkar && omsorgenForVilkar.perioder[0]?.vilkarStatus === vilkarUtfallType.OPPFYLT;

  if (vilkaretVurderesManuelltMedAksjonspunkt) {
    const skalVilkarsUtfallVises = behandling.status === behandlingStatus.AVSLUTTET;
    const aksjonspunktLost = behandling.status === behandlingStatus.BEHANDLING_UTREDES && !isAksjonspunktOpen;

    return {
      visKomponent: KomponenterEnum.OMSORG,
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
      },
    };
  }

  if (vilkaretErAutomatiskInnvilget) {
    return {
      visKomponent: KomponenterEnum.OMSORG,
      props: {
        behandlingsID,
        fagytelseType: fagsaksType,
        aksjonspunktLost: false,
        barn: angitteBarn.map(barn => barn.personIdent),
        harBarnSoktForRammevedtakOmKroniskSyk,
        vedtakFattetVilkarOppfylt: true,
        informasjonOmVilkar: generereInfoForVurdertVilkar(true, omsorgenForVilkar, '', 'Omsorgen for'),
        formState: FormState,
      },
    };
  }

  return null;
};

export default KartleggePropertyTilOmsorgenForMikrofrontendKomponent;
