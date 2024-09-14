import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { KomponenterEnum } from '@k9-sak-web/prosess-omsorgsdager';
import { Aksjonspunkt, Behandling, UtfallEnum, Uttaksperiode } from '@k9-sak-web/types';
import { isAfter, parse } from 'date-fns';
import Aktivitet from '../../dto/Aktivitet';
import PeriodeBekreftetStatus from '../../dto/PeriodeBekreftetStatus';
import Soknadsårsak from '../../dto/Soknadsårsak';
import { antallDager } from '../AktivitetTabell';
import { SaerligSmittevernhensynProps } from './types/SaerligSmittevernhensynProps';
import {useFeatureToggles} from "@fpsak-frontend/shared-components";

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
): {
  visKomponent: KomponenterEnum.KORRIGERE_PERIODER;
  props: SaerligSmittevernhensynProps;
} => {
  let objektTilMikrofrontend;

  const harAktivitetPeriodeMedSoknadsarsakKonflikt: boolean[] = aktiviteter.map(aktivitet =>
    aktivitet.uttaksperioder.some(
      periode =>
        typeof periode.søknadÅrsak !== 'undefined' && periode.søknadÅrsak === Soknadsårsak.KONFLIKT_MED_ARBEIDSGIVER,
    ),
  );

  const visKonfliktMedArbeidsgiverAksjonspunkt: boolean = harAktivitetPeriodeMedSoknadsarsakKonflikt.find(
    harAktivitetEnPeriodeMedSoknadsårsakKonflikt => harAktivitetEnPeriodeMedSoknadsårsakKonflikt,
  );

  const harVilkårsPeriodeI2023EllerSenere: boolean = aktiviteter.some(aktivitet =>
    aktivitet.uttaksperioder.some(uttaksperiode =>
      isAfter(parse(uttaksperiode.periode.split('/')[0], 'yyyy-MM-dd', new Date()), new Date(2023, 0, 0)),
    ),
  );

  const perioderFilterFn = (period: Uttaksperiode, vilkarsUtfall: string): boolean => {
    if (harVilkårsPeriodeI2023EllerSenere) {
      return (
        period.vurderteVilkår.vilkår.NOK_DAGER === vilkarsUtfall &&
        !!period.bekreftet &&
        period.bekreftet === PeriodeBekreftetStatus.MANUELTBEKREFTET
      );
    }
    return (
      period.vurderteVilkår.vilkår[visKonfliktMedArbeidsgiverAksjonspunkt ? 'NOK_DAGER' : 'SMITTEVERN'] ===
        vilkarsUtfall &&
      !!period.bekreftet &&
      period.bekreftet === PeriodeBekreftetStatus.MANUELTBEKREFTET
    );
  };

  let perioderInnvilget: Uttaksperiode[] = [];
  let perioderAvslått: Uttaksperiode[] = [];

  aktiviteter.forEach(aktivitet => {
    perioderInnvilget = perioderInnvilget.concat(
      aktivitet.uttaksperioder.filter(p => perioderFilterFn(p, UtfallEnum.INNVILGET)),
    );
    perioderAvslått = perioderAvslått.concat(
      aktivitet.uttaksperioder.filter(p => perioderFilterFn(p, UtfallEnum.AVSLÅTT)),
    );
  });

  const eksistererInnvilgetPeriode: boolean = perioderInnvilget.length > 0;
  let dagerDelvisInnvilget = 0;

  if (eksistererInnvilgetPeriode && perioderAvslått.length > 0) {
    perioderInnvilget.forEach(period => {
      const daysToAdd = antallDager(period.periode);
      if (typeof daysToAdd === 'string') {
        dagerDelvisInnvilget += parseInt(daysToAdd, 10);
      } else {
        dagerDelvisInnvilget += daysToAdd;
      }
    });
  }

  const behandlingsID: string = behandling.id.toString();

  const [ featureToggles ] = useFeatureToggles()
  const årskvantumDokEllerKvote = aksjonspunkt =>
    aksjonspunkt.definisjon.kode === aksjonspunktCodes.VURDER_ÅRSKVANTUM_DOK
    || (featureToggles?.NYTT_SKJEMA_FOR_9003 && aksjonspunkt.definisjon.kode === aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE)

  if (typeof aksjonspunkt !== 'undefined' && årskvantumDokEllerKvote(aksjonspunkt)) {
    const isAksjonspunktOpen = aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && aksjonspunkt.kanLoses;
    const aksjonspunktLost = behandling.status.kode === behandlingStatus.BEHANDLING_UTREDES && !isAksjonspunktOpen;

    objektTilMikrofrontend = {
      visKomponent: KomponenterEnum.KORRIGERE_PERIODER,
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
