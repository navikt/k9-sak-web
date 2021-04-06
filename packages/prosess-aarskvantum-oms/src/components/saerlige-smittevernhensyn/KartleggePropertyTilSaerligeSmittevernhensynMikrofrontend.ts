import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { Aksjonspunkt, Behandling, UtfallEnum } from '@k9-sak-web/types';
import MikrofrontendKomponenter from './types/MikrofrontendKomponenter';
import { SaerligSmittevernhensynProps } from './types/SaerligSmittevernhensynProps';
import Aktivitet from '../../dto/Aktivitet';

const KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend = (
  submitCallback,
  behandling: Behandling,
  aksjonspunkter: Aksjonspunkt[],
  isAksjonspunktOpen: boolean,
  aktiviteter: Aktivitet[],
) => {
  let objektTilMikrofrontend = {};
  const aksjonspunkt = aksjonspunkter[0];
  const smittevernAktiviteter = aktiviteter[0]?.uttaksperioder.filter(
    period => period.vurderteVilkår.vilkår.SMITTEVERN !== undefined,
  );
  const erFravaerSaerligSmittevern =
    smittevernAktiviteter[0]?.vurderteVilkår.vilkår.SMITTEVERN === UtfallEnum.INNVILGET;

  if (aksjonspunkt && aksjonspunkt.definisjon.kode === aksjonspunktCodes.VURDER_ÅRSKVANTUM_DOK) {
    const aksjonspunktLost = behandling.status.kode === behandlingStatus.BEHANDLING_UTREDES && !isAksjonspunktOpen;

    objektTilMikrofrontend = {
      visKomponent: MikrofrontendKomponenter.KORRIGERE_PERIODER,
      props: {
        aksjonspunktLost,
        lesemodus: !isAksjonspunktOpen,
        årsakFraSoknad: 'Årsak',
        informasjonTilLesemodus: {
          begrunnelse: aksjonspunkt.begrunnelse,
          vilkarOppfylt: erFravaerSaerligSmittevern,
        },
        losAksjonspunkt: (fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse) => {
          submitCallback([
            {
              kode: aksjonspunkt.definisjon.kode,
              innvilgePeriodene: fravaerGrunnetSmittevernhensynEllerStengt,
              begrunnelse,
              fortsettBehandling: true,
            },
          ]);
        },
      } as SaerligSmittevernhensynProps,
    };
  }
  return objektTilMikrofrontend;
};

export default KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend;
