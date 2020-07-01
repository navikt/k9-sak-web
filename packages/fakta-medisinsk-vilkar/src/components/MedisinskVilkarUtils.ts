import {
  Periode,
  PeriodeMedTilsynOgPleieResponse,
  TransformValues,
} from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkår';
import { Sykdom } from '@k9-sak-web/types';
import MedisinskVilkårConsts from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkårConstants';
import moment, { Moment } from 'moment';

export const getHelePerioder = (values: TransformValues) =>
  values.perioderMedKontinuerligTilsynOgPleie
    ?.filter(
      periodeMedKontinuerligTilsynOgPleie =>
        periodeMedKontinuerligTilsynOgPleie.harBehovForKontinuerligTilsynOgPleie &&
        !!periodeMedKontinuerligTilsynOgPleie.fom &&
        !!periodeMedKontinuerligTilsynOgPleie.tom &&
        periodeMedKontinuerligTilsynOgPleie.behovForToOmsorgspersoner === MedisinskVilkårConsts.JA_HELE,
    )
    .map(periodeMedKontinuerligTilsynOgPleie => ({
      periode: {
        fom: periodeMedKontinuerligTilsynOgPleie.fom,
        tom: periodeMedKontinuerligTilsynOgPleie.tom,
      },
      begrunnelse: periodeMedKontinuerligTilsynOgPleie.begrunnelseUtvidet,
    }));

export const getDelvisePerioder = (values: TransformValues) => {
  const delvisePerioder = [];
  values.perioderMedKontinuerligTilsynOgPleie
    .filter(
      periodeMedKontinuerligTilsynOgPleie => periodeMedKontinuerligTilsynOgPleie.harBehovForKontinuerligTilsynOgPleie,
    )
    .forEach(periodeMedKontinuerligTilsynOgPleie => {
      if (periodeMedKontinuerligTilsynOgPleie.perioderMedUtvidetKontinuerligTilsynOgPleie?.fom) {
        delvisePerioder.push({
          periode: {
            fom: periodeMedKontinuerligTilsynOgPleie.perioderMedUtvidetKontinuerligTilsynOgPleie.fom,
            tom: periodeMedKontinuerligTilsynOgPleie.perioderMedUtvidetKontinuerligTilsynOgPleie.tom,
          },
          begrunnelse: periodeMedKontinuerligTilsynOgPleie.begrunnelseUtvidet,
        });
      }
    });
  return delvisePerioder;
};

export const getPerioderMedUtvidetKontinuerligTilsynOgPleie = (values: TransformValues) => {
  /** Finn alle perioder med utvidet kontinuerlig tilsyn hele perioden */
  const helePerioder = getHelePerioder(values);

  /** Finn alle perioder med utvidet kontinuerlig tilsyn deler av perioden */
  const delvisePerioder = getDelvisePerioder(values);

  return helePerioder.concat(delvisePerioder);
};

export const buildPerioderMedUtvidetKontinuerligTilsynOgPleie = (
  periodeMedKontinuerligTilsynOgPleie: PeriodeMedTilsynOgPleieResponse,
  sykdom: Sykdom,
) => {
  const utvidetPeriode = sykdom.perioderMedUtvidetKontinuerligTilsynOgPleie.find(
    pUtvidet =>
      moment(pUtvidet.periode.fom).isBetween(
        periodeMedKontinuerligTilsynOgPleie.periode.fom,
        periodeMedKontinuerligTilsynOgPleie.periode.tom,
        null,
        '[]',
      ) &&
      moment(pUtvidet.periode.tom).isBetween(
        periodeMedKontinuerligTilsynOgPleie.periode.fom,
        periodeMedKontinuerligTilsynOgPleie.periode.tom,
        null,
        '[]',
      ),
  );
  if (utvidetPeriode) {
    return {
      ...utvidetPeriode.periode,
    };
  }
  return undefined;
};

export const getBehovForToOmsorgspersoner = (
  periodeMedKontinuerligTilsynOgPleie: PeriodeMedTilsynOgPleieResponse,
  sykdom: Sykdom,
) => {
  if (
    sykdom.perioderMedUtvidetKontinuerligTilsynOgPleie.some(
      pUtvidet =>
        pUtvidet.periode.fom === periodeMedKontinuerligTilsynOgPleie.periode.fom &&
        pUtvidet.periode.tom === periodeMedKontinuerligTilsynOgPleie.periode.tom,
    )
  ) {
    return MedisinskVilkårConsts.JA_HELE;
  }

  if (
    sykdom.perioderMedUtvidetKontinuerligTilsynOgPleie.some(
      pUtvidet =>
        moment(pUtvidet.periode.fom).isBetween(
          periodeMedKontinuerligTilsynOgPleie.periode.fom,
          periodeMedKontinuerligTilsynOgPleie.periode.tom,
          null,
          '[]',
        ) &&
        moment(pUtvidet.periode.tom).isBetween(
          periodeMedKontinuerligTilsynOgPleie.periode.fom,
          periodeMedKontinuerligTilsynOgPleie.periode.tom,
          null,
          '[]',
        ),
    )
  ) {
    return MedisinskVilkårConsts.JA_DELER;
  }
  return MedisinskVilkårConsts.NEI;
};

export const getBegrunnelseForUtvidetTilsyn = (
  periodeMedKontinuerligTilsynOgPleie: PeriodeMedTilsynOgPleieResponse,
  sykdom: Sykdom,
) => {
  const overlappendePeriodeMedUtvidetTilsyn = sykdom.perioderMedUtvidetKontinuerligTilsynOgPleie.find(
    pUtvidet =>
      moment(pUtvidet.periode.fom).isBetween(
        periodeMedKontinuerligTilsynOgPleie.periode.fom,
        periodeMedKontinuerligTilsynOgPleie.periode.tom,
        null,
        '[]',
      ) &&
      moment(pUtvidet.periode.tom).isBetween(
        periodeMedKontinuerligTilsynOgPleie.periode.fom,
        periodeMedKontinuerligTilsynOgPleie.periode.tom,
        null,
        '[]',
      ),
  );
  return overlappendePeriodeMedUtvidetTilsyn?.begrunnelse;
};

export const getPerioderMedKontinuerligTilsynOgPleie = (sykdom: Sykdom) =>
  sykdom.perioderMedKontinuerligTilsynOgPleie.map(p => ({
    fom: p.periode.fom,
    tom: p.periode.tom,
    begrunnelse: p.begrunnelse,
    behovForToOmsorgspersoner: getBehovForToOmsorgspersoner(p, sykdom),
    perioderMedUtvidetKontinuerligTilsynOgPleie: buildPerioderMedUtvidetKontinuerligTilsynOgPleie(p, sykdom),
    begrunnelseUtvidet: getBegrunnelseForUtvidetTilsyn(p, sykdom),
    harBehovForKontinuerligTilsynOgPleie: !!p.periode.fom,
    sammenhengMellomSykdomOgTilsyn: p.årsaksammenheng,
    sammenhengMellomSykdomOgTilsynBegrunnelse: p.årsaksammenhengBegrunnelse,
  }));

export const getMomentConvertedDate = (date: string | Date | Moment) => {
  const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/gm;
  if (typeof date === 'string') {
    if (regex.test(date)) {
      return moment(date, 'YYYY-MM-DD').toDate();
    }
    return moment(new Date(date)).toDate();
  }
  if (moment.isMoment(date)) {
    return date.toDate();
  }

  // fungerer, men blir deprecated i senere versjoner av moment
  return moment(date).toDate();
};

export const isHeleSokandsperiodenInnlegelse = (innleggelsesperiode: Periode, periodeTilVurdering: Periode) =>
  !!innleggelsesperiode?.fom &&
  !!innleggelsesperiode?.tom &&
  moment(innleggelsesperiode.fom).isSame(moment(periodeTilVurdering.fom)) &&
  moment(innleggelsesperiode.tom).isSame(moment(periodeTilVurdering.tom));
