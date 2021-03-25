import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { Aksjonspunkt } from '@k9-sak-web/types';
import MikrofrontendKomponenter from './types/MikrofrontendKomponenter';
import { SaerligSmittevernhensynProps } from './types/SaerligSmittevernhensynProps';

const KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend = (
  submitCallback,
  behandling,
  aksjonspunkter: Aksjonspunkt[],
  isAksjonspunktOpen,
) => {
  let objektTilMikrofrontend = {};
  const aksjonspunkt = aksjonspunkter[0];

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
          vilkarOppfylt: true,
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
