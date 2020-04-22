import OmsorgsdagerGrunnlagDto from './OmsorgsdagerGrunnlagDto';
import FormValues from '../types/FormValues';
import { BarnHentetAutomatisk, BarnLagtTilAvSakbehandler } from '../types/Barn';
import { OverføringFår, OverføringGir, UtvidetRettDto } from './RammevedtakDto';
import Overføring from '../types/Overføring';

export const mapDtoTilFormValues = ({
  barn,
  barnLagtTilAvSakbehandler,
  utvidetRett,
  midlertidigAleneOmOmsorgen,
}: OmsorgsdagerGrunnlagDto): FormValues => {
  const barnHentetAutomatisk: BarnHentetAutomatisk[] = barn.map(({ fødselsnummer, aleneomsorg }) => ({
    fødselsnummer,
    erKroniskSykt: utvidetRett.some(({ fnrKroniskSyktBarn }) => fnrKroniskSyktBarn === fødselsnummer),
    aleneomsorg,
  }));

  const barnLagtTil: BarnLagtTilAvSakbehandler[] = barnLagtTilAvSakbehandler.map(
    ({ id, fødselsdato, aleneomsorg }) => ({
      id,
      fødselsdato,
      aleneomsorg,
      erKroniskSykt: utvidetRett.some(({ idKroniskSyktBarn }) => idKroniskSyktBarn === id),
    }),
  );

  return {
    barn: barnHentetAutomatisk,
    barnLagtTilAvSaksbehandler: barnLagtTil,
    midlertidigAleneansvar: midlertidigAleneOmOmsorgen
      ? {
          fom: midlertidigAleneOmOmsorgen.fom,
          tom: midlertidigAleneOmOmsorgen.tom,
          erMidlertidigAlene: midlertidigAleneOmOmsorgen.erMidlertidigAlene,
        }
      : null,
    overføringGir: [],
    overføringFår: [],
    koronaoverføringGir: [],
    koronaoverføringFår: [],
  };
};

const mapOverføringFår = (overføringer: Overføring[]): OverføringFår[] =>
  overføringer.map(({ antallDager }) => ({
    antallDager,
    kilde: 'lagtTilAvSaksbehandler',
  }));

const mapOverføringGir = (overføringer: Overføring[]): OverføringGir[] =>
  overføringer.map(({ antallDager }) => ({
    antallDager,
    kilde: 'lagtTilAvSaksbehandler',
  }));

export const mapFormValuesTilDto = (
  {
    barn,
    barnLagtTilAvSaksbehandler,
    overføringFår,
    overføringGir,
    koronaoverføringFår,
    koronaoverføringGir,
    midlertidigAleneansvar,
  }: FormValues,
  initialValues: OmsorgsdagerGrunnlagDto,
): OmsorgsdagerGrunnlagDto => {
  const utvidetRettBarn: UtvidetRettDto[] = barn
    .filter(b => b.erKroniskSykt)
    .map(b => initialValues.utvidetRett.find(ur => ur.fnrKroniskSyktBarn === b.fødselsnummer));

  const utvidetRettBarnLagtTilAvSaksbehandler: UtvidetRettDto[] = barnLagtTilAvSaksbehandler
    .filter(b => b.erKroniskSykt)
    .map(b => {
      const tilhørendeUtvidetRettLagtTilTidligere: UtvidetRettDto = initialValues.utvidetRett.find(
        ur => ur.idKroniskSyktBarn === b.id,
      );
      return (
        tilhørendeUtvidetRettLagtTilTidligere || {
          idKroniskSyktBarn: b.id,
          kilde: 'lagtTilAvSaksbehandler',
        }
      );
    });

  return {
    barn: barn.map(({ fødselsnummer, aleneomsorg }) => ({ aleneomsorg, fødselsnummer })),
    barnLagtTilAvSakbehandler: barnLagtTilAvSaksbehandler.map(({ id, aleneomsorg, fødselsdato }) => ({
      id,
      fødselsdato,
      aleneomsorg,
    })),
    utvidetRett: utvidetRettBarn.concat(...utvidetRettBarnLagtTilAvSaksbehandler),
    overføringFår: mapOverføringFår(overføringFår).concat(...initialValues.overføringFår),
    overføringGir: mapOverføringGir(overføringGir).concat(...initialValues.overføringGir),
    koronaoverføringFår: mapOverføringFår(koronaoverføringFår).concat(...initialValues.koronaoverføringFår),
    koronaoverføringGir: mapOverføringGir(koronaoverføringGir).concat(...initialValues.koronaoverføringGir),
    midlertidigAleneOmOmsorgen:
      midlertidigAleneansvar?.erMidlertidigAlene !== initialValues.midlertidigAleneOmOmsorgen.erMidlertidigAlene
        ? {
            fom: midlertidigAleneansvar.fom,
            tom: midlertidigAleneansvar.tom,
            kilde: 'lagtTilAvSaksbehandler',
            erMidlertidigAlene: midlertidigAleneansvar.erMidlertidigAlene,
          }
        : initialValues.midlertidigAleneOmOmsorgen,
  };
};
