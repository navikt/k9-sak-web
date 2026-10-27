import type { RammevedtakDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/RammevedtakDto.js';
import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import {
  beregnAlder,
  finnMidlertidigAleneomsorg,
  finnUidentifiserteRammevedtak,
  formaterDatoEllerStrek,
  grupperRammevedtakPerNøkkel,
  koblBarnOgRammevedtak,
  utolkbarTekst,
} from './barnOgRammevedtak.js';

const periode = { gyldigFraOgMed: '2021-01-01', gyldigTilOgMed: '2021-12-31' };

describe('grupperRammevedtakPerNøkkel', () => {
  it('samler alle perioder med utvidet rett for samme barn i rekkefølge', () => {
    const grupper = grupperRammevedtakPerNøkkel([
      {
        type: 'UtvidetRett',
        utvidetRettFor: '12345678901',
        gyldigFraOgMed: '2021-01-01',
        gyldigTilOgMed: '2021-12-31',
      },
      { type: 'UtvidetRett', utvidetRettFor: '99999999999', ...periode },
      {
        type: 'UtvidetRett',
        utvidetRettFor: '12345678901',
        gyldigFraOgMed: '2022-01-01',
        gyldigTilOgMed: '2022-12-31',
      },
    ]);

    expect(grupper).toEqual([
      {
        nøkkel: '12345678901',
        kroniskSykdom: [
          { fom: '2021-01-01', tom: '2021-12-31' },
          { fom: '2022-01-01', tom: '2022-12-31' },
        ],
      },
      { nøkkel: '99999999999', kroniskSykdom: [{ fom: '2021-01-01', tom: '2021-12-31' }] },
    ]);
  });

  it('beholder bare siste periode for andre typer med samme nøkkel', () => {
    const [gruppe] = grupperRammevedtakPerNøkkel([
      { type: 'AleneOmOmsorgen', aleneOmOmsorgenFor: '12345678901', gyldigFraOgMed: '2020-01-01' },
      { type: 'AleneOmOmsorgen', aleneOmOmsorgenFor: '12345678901', gyldigFraOgMed: '2021-01-01' },
    ]);

    expect(gruppe?.aleneomsorg).toEqual({ fom: '2021-01-01', tom: undefined });
  });

  it('slår sammen ulike typer med samme nøkkel', () => {
    const grupper = grupperRammevedtakPerNøkkel([
      { type: 'AleneOmOmsorgen', aleneOmOmsorgenFor: '12345678901', ...periode },
      { type: 'Fosterbarn', mottaker: '12345678901', ...periode },
      { type: 'UtenlandskBarn', fødselsdato: '12345678901', ...periode },
      { type: 'DeltBosted', deltBostedMed: '12345678901', ...periode },
      { type: 'UtvidetRett', utvidetRettFor: '12345678901', ...periode },
    ]);

    const fomTom = { fom: '2021-01-01', tom: '2021-12-31' };
    expect(grupper).toEqual([
      {
        nøkkel: '12345678901',
        aleneomsorg: fomTom,
        fosterbarn: fomTom,
        utenlandskBarn: fomTom,
        deltBosted: fomTom,
        kroniskSykdom: [fomTom],
      },
    ]);
  });

  it('ignorerer rammevedtak uten kobling og typer som ikke vises per barn', () => {
    expect(
      grupperRammevedtakPerNøkkel([
        { type: 'UtvidetRett', ...periode },
        { type: 'AleneOmOmsorgen', aleneOmOmsorgenFor: '', ...periode },
        { type: 'Fosterbarn', ...periode },
        { type: 'UtenlandskBarn', barnetsFødselsdato: '2015-09-15', ...periode },
        { type: 'DeltBosted', ...periode },
        { type: 'MidlertidigAleneOmOmsorgen', ...periode },
        { type: 'UidentifisertRammevedtak', fritekst: 'tekst' },
        { type: 'Smittevern', ...periode },
        { type: 'OverføringFår', ...periode },
        { type: 'FordelingGir', ...periode },
        { type: 'KoronaOverføringGir', ...periode },
      ]),
    ).toEqual([]);
  });

  it('gir heltallsnøkler først i numerisk rekkefølge, deretter øvrige nøkler i innsettingsrekkefølge', () => {
    const grupper = grupperRammevedtakPerNøkkel([
      { type: 'AleneOmOmsorgen', aleneOmOmsorgenFor: '15091512345', ...periode },
      { type: 'Fosterbarn', mottaker: '150915 #2', ...periode },
      { type: 'DeltBosted', deltBostedMed: '150915', ...periode },
      { type: 'UtvidetRett', utvidetRettFor: '010116', ...periode },
      { type: 'UtvidetRett', utvidetRettFor: '120315', ...periode },
    ]);

    expect(grupper.map(gruppe => gruppe.nøkkel)).toEqual(['120315', '150915', '15091512345', '150915 #2', '010116']);
  });
});

describe('koblBarnOgRammevedtak', () => {
  const nøkkelFor = (personIdent: string | undefined, rammevedtak: RammevedtakDto[]) =>
    koblBarnOgRammevedtak([{ personIdent }], rammevedtak)[0]?.rammevedtak?.nøkkel;

  it('kobler på lik identifikator', () => {
    expect(nøkkelFor('12345678901', [{ type: 'UtvidetRett', utvidetRettFor: '12345678901' }])).toBe('12345678901');
  });

  it('kobler når barnets identifikator er de seks første tegnene i nøkkelen', () => {
    expect(nøkkelFor('150915', [{ type: 'UtvidetRett', utvidetRettFor: '150915 #2' }])).toBe('150915 #2');
  });

  it('kobler når nøkkelen er de seks første tegnene i barnets identifikator', () => {
    expect(nøkkelFor('15091512345', [{ type: 'UtvidetRett', utvidetRettFor: '150915' }])).toBe('150915');
  });

  it('kobler ikke to fulle identifikatorer med samme seks første tegn', () => {
    expect(nøkkelFor('15091512345', [{ type: 'UtvidetRett', utvidetRettFor: '15091599999' }])).toBeUndefined();
    expect(nøkkelFor('15091512345', [{ type: 'UtvidetRett', utvidetRettFor: '150915 #2' }])).toBeUndefined();
  });

  it('kobler samme kortnøkkel til flere barn', () => {
    const resultat = koblBarnOgRammevedtak(
      [{ personIdent: '15091511111' }, { personIdent: '15091522222' }],
      [{ type: 'UtvidetRett', utvidetRettFor: '150915' }],
    );

    expect(resultat.map(barnet => barnet.rammevedtak?.nøkkel)).toEqual(['150915', '150915']);
  });

  it('kobler ikke barn uten identifikator', () => {
    expect(nøkkelFor(undefined, [{ type: 'UtvidetRett', utvidetRettFor: '150915' }])).toBeUndefined();
    expect(nøkkelFor('', [{ type: 'UtvidetRett', utvidetRettFor: '150915' }])).toBeUndefined();
  });

  it('lar siste gruppe i Object.values-rekkefølge vinne, ikke siste innsatte', () => {
    // Kortnøkkelen 150915 er en heltallsnøkkel og kommer først, selv om den er satt inn sist.
    // Den fulle identifikatoren kommer derfor sist og vinner, som i v1.
    const rammevedtak: RammevedtakDto[] = [
      { type: 'AleneOmOmsorgen', aleneOmOmsorgenFor: '15091512345', ...periode },
      { type: 'UtvidetRett', utvidetRettFor: '150915', ...periode },
    ];
    const [barnet] = koblBarnOgRammevedtak([{ personIdent: '15091512345' }], rammevedtak);

    expect(barnet?.rammevedtak?.nøkkel).toBe('15091512345');
    expect(barnet?.rammevedtak?.aleneomsorg).toBeDefined();
    expect(barnet?.rammevedtak?.kroniskSykdom).toBeUndefined();
  });

  it('lar siste innsatte vinne når ingen nøkler er heltallsnøkler', () => {
    const rammevedtak: RammevedtakDto[] = [
      { type: 'AleneOmOmsorgen', aleneOmOmsorgenFor: '15091512345', ...periode },
      { type: 'UtvidetRett', utvidetRettFor: '150915 #2', ...periode },
    ];

    expect(nøkkelFor('150915', rammevedtak)).toBe('150915 #2');
  });

  it('beholder rekkefølgen på barna', () => {
    const resultat = koblBarnOgRammevedtak([{ personIdent: '3' }, { personIdent: '1' }, { personIdent: '2' }], []);

    expect(resultat.map(barnet => barnet.barn.personIdent)).toEqual(['3', '1', '2']);
  });
});

describe('finnUidentifiserteRammevedtak', () => {
  it('teller rammevedtak i de fire gruppene', () => {
    const grupper = finnUidentifiserteRammevedtak([
      { type: 'UidentifisertRammevedtak', fritekst: 'a' },
      { type: 'UtvidetRett' },
      { type: 'UtvidetRett' },
      { type: 'UtvidetRett', utvidetRettFor: '150915' },
      { type: 'AleneOmOmsorgen' },
      { type: 'Fosterbarn' },
      { type: 'Fosterbarn' },
      { type: 'Fosterbarn' },
      { type: 'Fosterbarn', mottaker: '150915' },
      { type: 'DeltBosted' },
      { type: 'UtenlandskBarn' },
    ]);

    expect(grupper.map(gruppe => [gruppe.type, gruppe.rammevedtak.length])).toEqual([
      ['UidentifisertRammevedtak', 1],
      ['UtvidetRett', 2],
      ['AleneOmOmsorgen', 1],
      ['Fosterbarn', 3],
    ]);
    expect(grupper[1]?.tekst(2)).toBe(
      'Det finnes 2 rammevedtak om utvidet rett fra Infotrygd som ikke automatisk kan kobles til et barn. Vennligst korriger i Infotrygd.',
    );
  });

  it('gir utolkbar tekst bare for uidentifiserte rammevedtak med innhold', () => {
    expect(utolkbarTekst({ type: 'UidentifisertRammevedtak', fritekst: '@9-6 2 L' })).toBe('@9-6 2 L');
    expect(utolkbarTekst({ type: 'UidentifisertRammevedtak', fritekst: '' })).toBeUndefined();
    expect(utolkbarTekst({ type: 'UidentifisertRammevedtak', fritekst: '  ' })).toBeUndefined();
    expect(utolkbarTekst({ type: 'UidentifisertRammevedtak' })).toBeUndefined();
    expect(utolkbarTekst({ type: 'UtvidetRett' })).toBeUndefined();
  });
});

describe('finnMidlertidigAleneomsorg', () => {
  it('velger første rammevedtak om midlertidig aleneomsorg', () => {
    expect(
      finnMidlertidigAleneomsorg([
        { type: 'UtvidetRett' },
        { type: 'MidlertidigAleneOmOmsorgen', gyldigFraOgMed: '2021-01-01' },
        { type: 'MidlertidigAleneOmOmsorgen', gyldigFraOgMed: '2022-01-01' },
      ])?.gyldigFraOgMed,
    ).toBe('2021-01-01');
  });
});

describe('formaterDatoEllerStrek', () => {
  it('formaterer gyldige datoer og gir strek ellers', () => {
    expect(formaterDatoEllerStrek('2020-11-26')).toBe('26.11.2020');
    expect(formaterDatoEllerStrek('2020-13-37')).toBe('-');
    expect(formaterDatoEllerStrek('')).toBe('-');
    expect(formaterDatoEllerStrek(undefined)).toBe('-');
  });
});

describe('beregnAlder', () => {
  it('beregner alder bare for gyldig fødselsdato', () => {
    expect(beregnAlder(dayjs().subtract(12, 'years').format('YYYY-MM-DD'))).toBe(12);
    expect(beregnAlder(undefined)).toBeUndefined();
    expect(beregnAlder('ugyldig')).toBeUndefined();
  });
});
