import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { Aksjonspunkt, Behandling, UtfallEnum, Uttaksperiode } from '@k9-sak-web/types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import MikrofrontendKomponenter from './types/MikrofrontendKomponenter';
import { SaerligSmittevernhensynProps } from './types/SaerligSmittevernhensynProps';
import Aktivitet from '../../dto/Aktivitet';
import { antallDager } from '../AktivitetTabell';
import Soknadsårsak from "../../dto/Soknadsårsak";
import PeriodeBekreftetStatus from "../../dto/PeriodeBekreftetStatus";

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

  const harAktivitetPeriodeMedSoknadsarsakKonflikt: boolean[] = aktiviteter.map(aktivitet =>
    aktivitet.uttaksperioder.some(periode => typeof periode.søknadÅrsak !== 'undefined' && periode.søknadÅrsak === Soknadsårsak.KONFLIKT_MED_ARBEIDSGIVER)
  );

  const visKonfliktMedArbeidsgiverAksjonspunkt: boolean = harAktivitetPeriodeMedSoknadsarsakKonflikt.find(
    harAktivitetEnPeriodeMedSoknadsårsakKonflikt => harAktivitetEnPeriodeMedSoknadsårsakKonflikt
  );

  const perioderFilterFn = (period: Uttaksperiode, vilkarsUtfall: string): boolean =>
    period.vurderteVilkår.vilkår[visKonfliktMedArbeidsgiverAksjonspunkt ? 'NOK_DAGER' : 'SMITTEVERN'] === vilkarsUtfall
    && !!period.bekreftet
    && period.bekreftet === PeriodeBekreftetStatus.MANUELTBEKREFTET;

  let perioderInnvilget: Uttaksperiode[] = [];
  let perioderAvslått: Uttaksperiode[] = [];

  aktiviteter.forEach(aktivitet => {
    perioderInnvilget = perioderInnvilget.concat(aktivitet.uttaksperioder.filter(p => perioderFilterFn(p, UtfallEnum.INNVILGET)));
    perioderAvslått = perioderAvslått.concat(aktivitet.uttaksperioder.filter(p => perioderFilterFn(p, UtfallEnum.AVSLÅTT)));
  });

  const eksistererInnvilgetPeriode: boolean = perioderInnvilget.length > 0;
  let dagerDelvisInnvilget = 0;

  if (eksistererInnvilgetPeriode && perioderAvslått.length > 0) {
    perioderInnvilget.forEach(period => {
      dagerDelvisInnvilget += parseInt(antallDager(period.periode), 10);
    });
  }

  const behandlingsID: string = behandling.id.toString();

  if (typeof aksjonspunkt !== 'undefined' && aksjonspunkt.definisjon === aksjonspunktCodes.VURDER_ÅRSKVANTUM_DOK) {
    const isAksjonspunktOpen = aksjonspunkt.status === aksjonspunktStatus.OPPRETTET && aksjonspunkt.kanLoses;
    const aksjonspunktLost = behandling.status === behandlingStatus.BEHANDLING_UTREDES && !isAksjonspunktOpen;

    objektTilMikrofrontend = {
      visKomponent: MikrofrontendKomponenter.KORRIGERE_PERIODER,
      props: {
        behandlingsID,
        aksjonspunktLost,
        lesemodus: !isAksjonspunktOpen || behandling.behandlingPaaVent,
        informasjonTilLesemodus: {
          begrunnelse: aksjonspunkt.begrunnelse ? aksjonspunkt.begrunnelse : '',
          vilkarOppfylt: eksistererInnvilgetPeriode,
          antallDagerDelvisInnvilget: dagerDelvisInnvilget > 0 ? dagerDelvisInnvilget : null,
        },
        konfliktMedArbeidsgiver: visKonfliktMedArbeidsgiverAksjonspunkt,
        losAksjonspunkt: (fravaerGrunnetSmittevernhensynEllerStengt, begrunnelse, antallDagerDelvisInnvilget) => {
          submitCallback([
            formatereLosAksjonspunktObjekt(
              aksjonspunkt.definisjon,
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
