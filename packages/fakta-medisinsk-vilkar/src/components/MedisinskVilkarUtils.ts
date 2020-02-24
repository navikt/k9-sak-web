import {
  TransformValues,
  PeriodeMedTilsynOgPleieResponse,
  Sykdom,
} from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkår';
import MedisinskVilkårConsts from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkårConstants';
import moment from 'moment';

const getHelePerioder = (values: TransformValues) =>
  values.perioderMedKontinuerligTilsynOgPleie
    ?.filter(
      periodeMedKontinuerligTilsynOgPleie =>
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

const getDelvisePerioder = (values: TransformValues) => {
  let delvisePerioder = [];
  values.perioderMedKontinuerligTilsynOgPleie.forEach(periodeMedKontinuerligTilsynOgPleie => {
    const res = periodeMedKontinuerligTilsynOgPleie.perioderMedUtvidetKontinuerligTilsynOgPleie
      ?.filter(
        periodeMedUtvidetKontinuerligTilsynOgPleie =>
          !!periodeMedUtvidetKontinuerligTilsynOgPleie.fom && !!periodeMedUtvidetKontinuerligTilsynOgPleie.tom,
      )
      .map(periodeMedUtvidetKontinuerligTilsynOgPleie => ({
        periode: {
          fom: periodeMedUtvidetKontinuerligTilsynOgPleie.fom,
          tom: periodeMedUtvidetKontinuerligTilsynOgPleie.tom,
        },
        begrunnelse: periodeMedKontinuerligTilsynOgPleie.begrunnelseUtvidet,
      }));
    if (res) {
      delvisePerioder = delvisePerioder.concat(res);
    }
  });
  return delvisePerioder;
};

// eslint-disable-next-line import/prefer-default-export
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
) =>
  sykdom.perioderMedUtvidetKontinuerligTilsynOgPleie
    .filter(
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
    .map(pUtvidet => pUtvidet.periode);

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

const getBegrunnelseForUtvidetTilsyn = (
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
  }));
