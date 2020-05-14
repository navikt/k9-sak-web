import moment from 'moment';
import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import OmsorgsdagerGrunnlagDto from './OmsorgsdagerGrunnlagDto';
import FormValues from '../types/FormValues';
import { BarnHentetAutomatisk, BarnLagtTilAvSakbehandler } from '../types/Barn';
import { DagerMottatt, DagerGitt, UtvidetRettDto, AleneOmOmsorgen } from './RammevedtakDto';
import Overføring from '../types/Overføring';
import { InformasjonskildeEnum } from './Informasjonskilde';

export const mapDtoTilFormValues = ({
  barn,
  barnLagtTilAvSakbehandler,
  utvidetRett,
  midlertidigAleneOmOmsorgen,
  aleneOmOmsorgen,
  overføringFår,
  fordelingFår,
  koronaoverføringFår,
  overføringGir,
  fordelingGir,
  koronaoverføringGir,
}: OmsorgsdagerGrunnlagDto): FormValues => {
  const barnHentetAutomatisk: BarnHentetAutomatisk[] = barn.map(({ fødselsnummer }) => ({
    fødselsnummer,
    erKroniskSykt: utvidetRett.some(({ fnrKroniskSyktBarn }) => fnrKroniskSyktBarn === fødselsnummer),
    aleneomsorg: aleneOmOmsorgen.some(({ fnrBarnAleneOm }) => fnrBarnAleneOm === fødselsnummer),
  }));

  const barnLagtTil: BarnLagtTilAvSakbehandler[] = barnLagtTilAvSakbehandler.map(({ id, fødselsdato }) => ({
    id,
    fødselsdato,
    aleneomsorg: aleneOmOmsorgen.some(({ idBarnAleneOm }) => idBarnAleneOm === id),
    erKroniskSykt: utvidetRett.some(({ idKroniskSyktBarn }) => idKroniskSyktBarn === id),
  }));

  return {
    barn: barnHentetAutomatisk,
    barnLagtTilAvSaksbehandler: barnLagtTil,
    midlertidigAleneansvar: {
      fom: midlertidigAleneOmOmsorgen?.fom,
      tom: midlertidigAleneOmOmsorgen?.tom,
      erMidlertidigAlene: !!midlertidigAleneOmOmsorgen?.erMidlertidigAlene,
    },
    overføringGir: overføringGir.map(({ kilde, fom, antallDager, mottakersFnr, tom }) => ({
      antallDager,
      fom,
      tom,
      kilde,
      mottakerAvsenderFnr: mottakersFnr,
    })),
    overføringFår: overføringFår.map(({ kilde, fom, tom, antallDager, avsendersFnr }) => ({
      antallDager,
      fom,
      tom,
      kilde,
      mottakerAvsenderFnr: avsendersFnr,
    })),
    fordelingGir: fordelingGir.map(({ kilde, fom, antallDager, mottakersFnr, tom }) => ({
      antallDager,
      fom,
      tom,
      kilde,
      mottakerAvsenderFnr: mottakersFnr,
    })),
    fordelingFår: fordelingFår.map(({ kilde, fom, tom, antallDager, avsendersFnr }) => ({
      antallDager,
      fom,
      tom,
      kilde,
      mottakerAvsenderFnr: avsendersFnr,
    })),
    koronaoverføringGir: koronaoverføringGir.map(({ kilde, fom, antallDager, mottakersFnr, tom }) => ({
      antallDager,
      fom,
      tom,
      kilde,
      mottakerAvsenderFnr: mottakersFnr,
    })),
    koronaoverføringFår: koronaoverføringFår.map(({ kilde, fom, tom, antallDager, avsendersFnr }) => ({
      antallDager,
      fom,
      tom,
      kilde,
      mottakerAvsenderFnr: avsendersFnr,
    })),
    begrunnelse: '',
  };
};

const førsteDagIÅr = () => moment().date(1).month(0).format(ISO_DATE_FORMAT);
const sisteDagIAar = () => moment().date(31).month(11).format(ISO_DATE_FORMAT);

const sisteDagIAaretBarnFyller18 = fødselsdato => {
  const fødeår = moment(fødselsdato).year();

  return moment()
    .year(fødeår + 18)
    .date(31)
    .month(11)
    .format(ISO_DATE_FORMAT);
};

const mapOverføringFår = (overføringer: Overføring[]): DagerMottatt[] =>
  overføringer.map(({ antallDager, kilde, mottakerAvsenderFnr, tom, fom }) => ({
    antallDager,
    kilde,
    avsendersFnr: mottakerAvsenderFnr,
    fom: fom || førsteDagIÅr(),
    tom: tom || sisteDagIAar(),
  }));

const mapOverføringGir = (overføringer: Overføring[]): DagerGitt[] =>
  overføringer.map(({ antallDager, kilde, mottakerAvsenderFnr, tom, fom }) => ({
    antallDager,
    kilde,
    mottakersFnr: mottakerAvsenderFnr,
    fom: fom || førsteDagIÅr(),
    tom: tom || sisteDagIAar(),
  }));

// Kun gjeldende for barn
const fødselsdatoFraFødselsnummer = fødselsnummer => {
  const dag = fødselsnummer.substring(0, 2);
  const måned = fødselsnummer.substring(2, 4);
  const år = `20${fødselsnummer.substring(4, 6)}`;

  return `${år}-${måned}-${dag}`;
};

export const mapFormValuesTilDto = (
  {
    barn,
    barnLagtTilAvSaksbehandler,
    overføringFår,
    overføringGir,
    fordelingFår,
    fordelingGir,
    koronaoverføringFår,
    koronaoverføringGir,
    midlertidigAleneansvar,
  }: FormValues,
  initialValues: OmsorgsdagerGrunnlagDto,
): OmsorgsdagerGrunnlagDto => {
  const aleneOmOmsorgenBarn: AleneOmOmsorgen[] = barn
    .filter(b => b.aleneomsorg)
    .map(b => initialValues.aleneOmOmsorgen.find(alene => alene.fnrBarnAleneOm === b.fødselsnummer));

  const aleneOmOmsorgenBarnLagtTilManuelt: AleneOmOmsorgen[] = barnLagtTilAvSaksbehandler
    .filter(b => b.aleneomsorg)
    .map(b => {
      const tilhørendeRammevetdakLagtTilTidligere: AleneOmOmsorgen = initialValues.aleneOmOmsorgen.find(
        alene => alene.idBarnAleneOm === b.id,
      );

      return (
        tilhørendeRammevetdakLagtTilTidligere || {
          idBarnAleneOm: b.id,
          kilde: InformasjonskildeEnum.LAGT_TIL_MANUELT,
          fødselsdato: b.fødselsdato,
          fom: førsteDagIÅr(),
          tom: sisteDagIAar(),
        }
      );
    });

  const utvidetRettBarn: UtvidetRettDto[] = barn
    .filter(b => b.erKroniskSykt)
    .map(b => {
      const tilhørendeUtvidetRettLagtTilTidligere = initialValues.utvidetRett.find(
        ur => ur.fnrKroniskSyktBarn === b.fødselsnummer,
      );

      return (
        tilhørendeUtvidetRettLagtTilTidligere || {
          fnrKroniskSyktBarn: b.fødselsnummer,
          kilde: InformasjonskildeEnum.LAGT_TIL_MANUELT,
          fom: førsteDagIÅr(),
          tom: sisteDagIAaretBarnFyller18(fødselsdatoFraFødselsnummer(b.fødselsnummer)),
        }
      );
    });

  const utvidetRettBarnLagtTilAvSaksbehandler: UtvidetRettDto[] = barnLagtTilAvSaksbehandler
    .filter(b => b.erKroniskSykt)
    .map(b => {
      const tilhørendeUtvidetRettLagtTilTidligere: UtvidetRettDto = initialValues.utvidetRett.find(
        ur => ur.idKroniskSyktBarn === b.id,
      );
      return (
        tilhørendeUtvidetRettLagtTilTidligere || {
          idKroniskSyktBarn: b.id,
          kilde: InformasjonskildeEnum.LAGT_TIL_MANUELT,
          fødselsdato: b.fødselsdato,
          fom: førsteDagIÅr(),
          tom: sisteDagIAaretBarnFyller18(b.fødselsdato),
        }
      );
    });

  return {
    barn: barn.map(({ fødselsnummer }) => ({ fødselsnummer })),
    barnLagtTilAvSakbehandler: barnLagtTilAvSaksbehandler.map(({ id, fødselsdato }) => ({
      id,
      fødselsdato,
    })),
    utvidetRett: utvidetRettBarn.concat(...utvidetRettBarnLagtTilAvSaksbehandler),
    aleneOmOmsorgen: aleneOmOmsorgenBarn.concat(...aleneOmOmsorgenBarnLagtTilManuelt),
    overføringFår: mapOverføringFår(overføringFår),
    overføringGir: mapOverføringGir(overføringGir),
    fordelingFår: mapOverføringFår(fordelingFår),
    fordelingGir: mapOverføringGir(fordelingGir),
    koronaoverføringFår: mapOverføringFår(koronaoverføringFår),
    koronaoverføringGir: mapOverføringGir(koronaoverføringGir),
    midlertidigAleneOmOmsorgen:
      midlertidigAleneansvar?.erMidlertidigAlene !== initialValues.midlertidigAleneOmOmsorgen?.erMidlertidigAlene
        ? {
            fom: midlertidigAleneansvar.fom,
            tom: midlertidigAleneansvar.tom,
            kilde: InformasjonskildeEnum.LAGT_TIL_MANUELT,
            erMidlertidigAlene: midlertidigAleneansvar.erMidlertidigAlene,
          }
        : initialValues.midlertidigAleneOmOmsorgen,
    uidentifiserteRammevedtak: [],
  };
};
