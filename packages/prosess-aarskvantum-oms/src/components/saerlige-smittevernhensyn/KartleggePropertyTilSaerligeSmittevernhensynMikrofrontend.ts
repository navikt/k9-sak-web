import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { Aksjonspunkt, Behandling, UtfallEnum } from '@k9-sak-web/types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import MikrofrontendKomponenter from './types/MikrofrontendKomponenter';
import { SaerligSmittevernhensynProps } from './types/SaerligSmittevernhensynProps';
import Aktivitet from '../../dto/Aktivitet';

const KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend = (
  submitCallback,
  behandling: Behandling,
  aksjonspunkt: Aksjonspunkt,
  aktiviteter: Aktivitet[],
  FormState: FormStateType,
) => {
  let objektTilMikrofrontend = {};
  const smittevernAktiviteter = aktiviteter[0]?.uttaksperioder.filter(
    period => period.vurderteVilkår.vilkår.SMITTEVERN !== undefined,
  );
  const erFravaerSaerligSmittevern =
    smittevernAktiviteter[0]?.vurderteVilkår.vilkår.SMITTEVERN === UtfallEnum.INNVILGET;
  const behandlingsID = behandling.id.toString();

  if (aksjonspunkt !== undefined && aksjonspunkt.definisjon.kode === aksjonspunktCodes.VURDER_ÅRSKVANTUM_DOK) {
    const isAksjonspunktOpen = aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && aksjonspunkt.kanLoses;
    const aksjonspunktLost = behandling.status.kode === behandlingStatus.BEHANDLING_UTREDES && !isAksjonspunktOpen;

    objektTilMikrofrontend = {
      visKomponent: MikrofrontendKomponenter.KORRIGERE_PERIODER,
      props: {
        behandlingsID,
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
        formState: FormState,
      } as SaerligSmittevernhensynProps,
    };
  }
  return objektTilMikrofrontend;
};

export default KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend;
