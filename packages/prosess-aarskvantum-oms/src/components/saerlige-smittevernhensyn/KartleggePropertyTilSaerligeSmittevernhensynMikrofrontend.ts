import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { Aksjonspunkt, Behandling, UtfallEnum } from '@k9-sak-web/types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import MikrofrontendKomponenter from './types/MikrofrontendKomponenter';
import { SaerligSmittevernhensynProps } from './types/SaerligSmittevernhensynProps';
import Aktivitet from '../../dto/Aktivitet';
import { antallDager } from '../AktivitetTabell';

interface LosAksjonspunktSaerligSmittevern {
  kode: string;
  innvilgePeriodene: boolean;
  begrunnelse: string;
  antallDager?: number;
  fortsettBehandling: boolean;
}

const formatereLosAksjonspunktObjekt = (
  aksjonspunktKode: string,
  fravaerGrunnetSmittevernhensynEllerStengt: boolean,
  begrunnelse: string,
  antallDagerDelvisInnvilget: number,
) => {
  const losAksjonspunktObjekt = {
    kode: aksjonspunktKode,
    innvilgePeriodene: fravaerGrunnetSmittevernhensynEllerStengt,
    begrunnelse,
    fortsettBehandling: true,
  } as LosAksjonspunktSaerligSmittevern;

  if (antallDagerDelvisInnvilget !== null && fravaerGrunnetSmittevernhensynEllerStengt) {
    losAksjonspunktObjekt.antallDager = antallDagerDelvisInnvilget;
  }

  return losAksjonspunktObjekt;
};

const KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend = (
  submitCallback,
  behandling: Behandling,
  aksjonspunkt: Aksjonspunkt,
  aktiviteter: Aktivitet[],
  FormState: FormStateType,
) => {
  let objektTilMikrofrontend = {};

  const innvilgetSmittevernPeriode = aktiviteter[0]?.uttaksperioder.filter(
    period => period.vurderteVilkår.vilkår.SMITTEVERN === UtfallEnum.INNVILGET,
  );

  const avslåttSmittevernPeriode = aktiviteter[0]?.uttaksperioder.filter(
    period => period.vurderteVilkår.vilkår.SMITTEVERN === UtfallEnum.AVSLÅTT,
  );

  const eksistererInnvilgetSmittevernPeriode = innvilgetSmittevernPeriode.length > 0;
  let dagerDelvisInnvilget = 0;

  if (eksistererInnvilgetSmittevernPeriode && avslåttSmittevernPeriode.length > 0) {
    innvilgetSmittevernPeriode.forEach(period => {
      dagerDelvisInnvilget += parseInt(antallDager(period.periode), 10);
    });
  }

  const behandlingsID = behandling.id.toString();

  if (typeof aksjonspunkt !== 'undefined' && aksjonspunkt.definisjon.kode === aksjonspunktCodes.VURDER_ÅRSKVANTUM_DOK) {
    const isAksjonspunktOpen = aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && aksjonspunkt.kanLoses;
    const aksjonspunktLost = behandling.status.kode === behandlingStatus.BEHANDLING_UTREDES && !isAksjonspunktOpen;

    objektTilMikrofrontend = {
      visKomponent: MikrofrontendKomponenter.KORRIGERE_PERIODER,
      props: {
        behandlingsID,
        aksjonspunktLost,
        lesemodus: !isAksjonspunktOpen,
        informasjonTilLesemodus: {
          begrunnelse: aksjonspunkt.begrunnelse ? aksjonspunkt.begrunnelse : '',
          vilkarOppfylt: eksistererInnvilgetSmittevernPeriode,
          antallDagerDelvisInnvilget: dagerDelvisInnvilget > 0 ? dagerDelvisInnvilget : null,
        },
        losAksjonspunkt: (fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse, antallDagerDelvisInnvilget) => {
          submitCallback([
            formatereLosAksjonspunktObjekt(
              aksjonspunkt.definisjon.kode,
              fravaerGrunnetSmittevernhensynEllerStengt,
              begrunnelse,
              antallDagerDelvisInnvilget,
            ),
          ]);
        },
        formState: FormState,
      } as SaerligSmittevernhensynProps,
    };
  }
  return objektTilMikrofrontend;
};

export default KartleggePropertyTilSaerligeSmittevernhensynMikrofrontend;
