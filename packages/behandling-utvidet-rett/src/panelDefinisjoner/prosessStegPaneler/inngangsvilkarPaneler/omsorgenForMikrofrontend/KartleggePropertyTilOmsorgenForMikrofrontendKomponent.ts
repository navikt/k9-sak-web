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
import {
  AksjonspunktInformasjon,
  VilkarInformasjon,
} from '../../../../types/utvidetRettMikrofrontend/KartleggePropertyTilMikrofrontendTypes';

interface PropTypes {
  isReadOnly: boolean;
  submitCallback: any;
  angitteBarn: { personIdent: string }[];
  behandling: Behandling;
  aksjonspunktInformasjon: AksjonspunktInformasjon;
  vilkarInformasjon: VilkarInformasjon;
  fagsaksType: fagsakTsType;
  FormState: FormStateType;
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
}: PropTypes) => {
  let objektTilMikrofrontend = {};
  const { aksjonspunkter, isAksjonspunktOpen } = aksjonspunktInformasjon;
  const { vilkar, status } = vilkarInformasjon;

  const aksjonspunkt = aksjonspunkter[0];
  const vilkarKnyttetTilAksjonspunkt = vilkar[0];

  if (aksjonspunkt && vilkarKnyttetTilAksjonspunkt && aksjonspunkt.definisjon.kode === aksjonspunktCodes.OMSORGEN_FOR) {
    const skalVilkarsUtfallVises = behandling.status.kode === behandlingStatus.AVSLUTTET;
    const aksjonspunktLost = behandling.status.kode === behandlingStatus.BEHANDLING_UTREDES && !isAksjonspunktOpen;
    const behandlingsID = behandling.id.toString();

    objektTilMikrofrontend = {
      visKomponent: UtvidetRettMikrofrontendVisning.OMSORG,
      props: {
        behandlingsID,
        fagytelseType: fagsaksType,
        aksjonspunktLost,
        lesemodus: isReadOnly || !isAksjonspunktOpen,
        informasjonTilLesemodus: {
          begrunnelse: aksjonspunkt.begrunnelse,
          vilkarOppfylt: status === vilkarUtfallType.OPPFYLT,
        } as InformasjonTilLesemodus,
        barn: angitteBarn.map(barn => barn.personIdent),
        vedtakFattetVilkarOppfylt: skalVilkarsUtfallVises,
        informasjonOmVilkar: generereInfoForVurdertVilkar(
          skalVilkarsUtfallVises,
          vilkarKnyttetTilAksjonspunkt,
          aksjonspunkt.begrunnelse,
          'Omsorgen for',
        ),
        losAksjonspunkt: (harOmsorgen, begrunnelse) => {
          submitCallback([
            {
              kode: aksjonspunkt.definisjon.kode,
              harOmsorgenFor: harOmsorgen,
              begrunnelse,
            },
          ]);
        },
        formState: FormState,
      } as OmsorgenForProps,
    };
  }
  return objektTilMikrofrontend;
};

export default KartleggePropertyTilOmsorgenForMikrofrontendKomponent;
