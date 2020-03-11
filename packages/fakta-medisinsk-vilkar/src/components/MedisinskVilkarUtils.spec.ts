import { expect } from 'chai';
import MedisinskVilkårConsts from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkårConstants';
import moment from 'moment';
import {
  getPerioderMedKontinuerligTilsynOgPleie,
  getBegrunnelseForUtvidetTilsyn,
  getBehovForToOmsorgspersoner,
  buildPerioderMedUtvidetKontinuerligTilsynOgPleie,
  getHelePerioder,
  getDelvisePerioder,
  getPerioderMedUtvidetKontinuerligTilsynOgPleie,
  getMomentConvertedDate,
} from './MedisinskVilkarUtils';

const partialFormState = {
  perioderMedKontinuerligTilsynOgPleie: [
    {
      fom: '2020-02-01',
      tom: '2020-02-05',
      behovForToOmsorgspersoner: 'jaHele',
      begrunnelse: 'hei',
      harBehovForKontinuerligTilsynOgPleie: true,
      begrunnelseUtvidet: 'begrunnelseEn',
      sammenhengMellomSykdomOgTilsyn: true,
      sammenhengMellomSykdomOgTilsynBegrunnelse: 'begrunnelseEn',
    },
    {
      fom: '2020-02-06',
      tom: '2020-02-10',
      behovForToOmsorgspersoner: 'jaHele',
      begrunnelse: 'hei',
      harBehovForKontinuerligTilsynOgPleie: true,
      begrunnelseUtvidet: 'begrunnelseTo',
      sammenhengMellomSykdomOgTilsyn: true,
      sammenhengMellomSykdomOgTilsynBegrunnelse: 'begrunnelseTo',
    },
    {
      fom: '2020-02-11',
      tom: '2020-02-20',
      behovForToOmsorgspersoner: 'jaDeler',
      begrunnelse: 'hei',
      harBehovForKontinuerligTilsynOgPleie: true,
      begrunnelseUtvidet: 'begrunnelseTre',
      perioderMedUtvidetKontinuerligTilsynOgPleie: {
        fom: '2020-02-12',
        tom: '2020-02-19',
      },
      sammenhengMellomSykdomOgTilsyn: true,
      sammenhengMellomSykdomOgTilsynBegrunnelse: 'begrunnelseTre',
    },
    {
      fom: '2020-02-21',
      tom: '2020-02-28',
      behovForToOmsorgspersoner: 'jaDeler',
      begrunnelse: 'hei',
      harBehovForKontinuerligTilsynOgPleie: true,
      begrunnelseUtvidet: 'begrunnelseFire',
      perioderMedUtvidetKontinuerligTilsynOgPleie: {
        fom: '2020-02-22',
        tom: '2020-02-27',
      },
      sammenhengMellomSykdomOgTilsyn: true,
      sammenhengMellomSykdomOgTilsynBegrunnelse: 'begrunnelseFire',
    },
  ],
  legeerklaeringkilde: 'SPESIALISTHELSETJENESTE',
  legeerklæringFom: '2020-02-01',
  diagnosekode: {
    key: 'F909',
    value: 'F909 - Uspesifisert hyperkinetisk forstyrrelse',
  },
  innleggelsesperiode: {
    fom: '2019-12-31',
    tom: '2020-01-31',
  },
};

const sykdomRequestResponse = {
  periodeTilVurdering: { fom: '2019-12-31', tom: '2020-02-25' },
  legeerklæringer: [
    {
      diagnosekode: 'F909',
      fom: '2020-02-01',
      identifikator: '217a1447-a50e-46de-bb6d-8666c5fc033e',
      innleggelsesperioder: [{ fom: '2019-12-31', tom: '2020-01-31' }],
      kilde: 'SPESIALISTHELSETJENESTE',
      tom: '2020-02-01',
    },
  ],
  perioderMedKontinuerligTilsynOgPleie: [
    {
      begrunnelse: 'hei',
      periode: { fom: '2020-02-01', tom: '2020-02-25' },
      årsaksammenheng: true,
      årsaksammenhengBegrunnelse: 'begrunnelse',
    },
    {
      begrunnelse: 'hei',
      periode: { fom: '2020-03-01', tom: '2020-03-25' },
      årsaksammenheng: true,
      årsaksammenhengBegrunnelse: 'begrunnelse',
    },
    {
      begrunnelse: 'hei',
      periode: { fom: '2020-02-02', tom: '2020-02-24' },
      årsaksammenheng: true,
      årsaksammenhengBegrunnelse: 'begrunnelse',
    },
  ],
  perioderMedUtvidetKontinuerligTilsynOgPleie: [
    { begrunnelse: 'hallo', periode: { fom: '2020-02-02', tom: '2020-02-24' } },
  ],
};

describe('medisinskVilkarUtils', () => {
  it('skal returnere utvidede perioder som dekker hele perioden med kontinuerlig tilsyn', () => {
    const result = getHelePerioder(partialFormState);
    const expectedResult = [
      {
        periode: {
          fom: '2020-02-01',
          tom: '2020-02-05',
        },
        begrunnelse: 'begrunnelseEn',
      },
      {
        periode: {
          fom: '2020-02-06',
          tom: '2020-02-10',
        },
        begrunnelse: 'begrunnelseTo',
      },
    ];
    expect(result).to.deep.equal(expectedResult);
  });

  it('skal returnere utvidede perioder som dekker deler av perioden med kontinuerlig tilsyn', () => {
    const result = getDelvisePerioder(partialFormState);
    const expectedResult = [
      {
        periode: {
          fom: '2020-02-12',
          tom: '2020-02-19',
        },
        begrunnelse: 'begrunnelseTre',
      },
      {
        periode: {
          fom: '2020-02-22',
          tom: '2020-02-27',
        },
        begrunnelse: 'begrunnelseFire',
      },
    ];
    expect(result).to.deep.equal(expectedResult);
  });

  it('skal slå sammen hele og delvise perioder med utvidet kontinuerlig tilsyn', () => {
    const helePerioder = getHelePerioder(partialFormState);
    const delvisePerioder = getDelvisePerioder(partialFormState);
    const kombinertePerioder = helePerioder.concat(delvisePerioder);
    const result = getPerioderMedUtvidetKontinuerligTilsynOgPleie(partialFormState);
    expect(kombinertePerioder).to.deep.equal(result);
  });

  it('skal bygge periode med utvidet kontinuerlig tilsyn', () => {
    const result = buildPerioderMedUtvidetKontinuerligTilsynOgPleie(
      sykdomRequestResponse.perioderMedKontinuerligTilsynOgPleie[0],
      sykdomRequestResponse,
    );
    const expectedResult = { fom: '2020-02-02', tom: '2020-02-24' };
    expect(expectedResult).to.deep.equal(result);
  });

  it('skal finne ut om det er behov for to omsorgspersoner', () => {
    const result1 = getBehovForToOmsorgspersoner(
      sykdomRequestResponse.perioderMedKontinuerligTilsynOgPleie[0],
      sykdomRequestResponse,
    );
    const result2 = getBehovForToOmsorgspersoner(
      sykdomRequestResponse.perioderMedKontinuerligTilsynOgPleie[1],
      sykdomRequestResponse,
    );
    const result3 = getBehovForToOmsorgspersoner(
      sykdomRequestResponse.perioderMedKontinuerligTilsynOgPleie[2],
      sykdomRequestResponse,
    );
    expect(result1).to.eql(MedisinskVilkårConsts.JA_DELER);
    expect(result2).to.eql(MedisinskVilkårConsts.NEI);
    expect(result3).to.eql(MedisinskVilkårConsts.JA_HELE);
  });

  it('skal finne begrunnelse for utvidet tilsyn', () => {
    const result = getBegrunnelseForUtvidetTilsyn(
      sykdomRequestResponse.perioderMedKontinuerligTilsynOgPleie[0],
      sykdomRequestResponse,
    );
    expect(result).to.eql('hallo');
  });

  it('skal lage en liste med perioder med kontinuerlig tilsyn', () => {
    const result = getPerioderMedKontinuerligTilsynOgPleie(sykdomRequestResponse);
    const expectedResult = [
      {
        fom: '2020-02-01',
        tom: '2020-02-25',
        begrunnelse: 'hei',
        behovForToOmsorgspersoner: 'jaDeler',
        perioderMedUtvidetKontinuerligTilsynOgPleie: { fom: '2020-02-02', tom: '2020-02-24' },
        begrunnelseUtvidet: 'hallo',
        harBehovForKontinuerligTilsynOgPleie: true,
        sammenhengMellomSykdomOgTilsyn: true,
        sammenhengMellomSykdomOgTilsynBegrunnelse: 'begrunnelse',
      },
      {
        fom: '2020-03-01',
        tom: '2020-03-25',
        begrunnelse: 'hei',
        behovForToOmsorgspersoner: 'nei',
        perioderMedUtvidetKontinuerligTilsynOgPleie: undefined,
        begrunnelseUtvidet: undefined,
        harBehovForKontinuerligTilsynOgPleie: true,
        sammenhengMellomSykdomOgTilsyn: true,
        sammenhengMellomSykdomOgTilsynBegrunnelse: 'begrunnelse',
      },
      {
        fom: '2020-02-02',
        tom: '2020-02-24',
        begrunnelse: 'hei',
        behovForToOmsorgspersoner: 'jaHele',
        perioderMedUtvidetKontinuerligTilsynOgPleie: { fom: '2020-02-02', tom: '2020-02-24' },
        begrunnelseUtvidet: 'hallo',
        harBehovForKontinuerligTilsynOgPleie: true,
        sammenhengMellomSykdomOgTilsyn: true,
        sammenhengMellomSykdomOgTilsynBegrunnelse: 'begrunnelse',
      },
    ];
    expect(result).to.deep.equal(expectedResult);
  });

  // TODO (Hallvard): Finn en bedre måte å teste dette på
  it('skal formatere en dato likt med ulik input', () => {
    const expectedResult = new Date('2020-02-20').toLocaleString('nb-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const result1 = getMomentConvertedDate('2020-02-20');
    expect(result1.toLocaleString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' })).to.deep.equal(
      expectedResult,
    );
    const result2 = getMomentConvertedDate(moment('2020-02-20'));
    expect(result2.toLocaleString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' })).to.deep.equal(
      expectedResult,
    );
    const result3 = getMomentConvertedDate(moment('2020-02-20').toDate());
    expect(result3.toLocaleString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' })).to.deep.equal(
      expectedResult,
    );
    const result4 = getMomentConvertedDate(
      moment('2020-02-20')
        .toDate()
        .toString(),
    );
    expect(result4.toLocaleString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' })).to.deep.equal(
      expectedResult,
    );
  });
});
