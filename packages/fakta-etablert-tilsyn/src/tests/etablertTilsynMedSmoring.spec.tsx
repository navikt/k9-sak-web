import { render, screen } from '@testing-library/react';
import React from 'react';
import { dagOverstyrt, toPerioderSammeUke, toSmøringer, treEnkeltdager } from '../mock/etablertTilsynMock';
import EtablertTilsynMedSmoring from '../ui/components/etablertTilsyn/EtablertTilsynMedSmoring';

describe('Etablert tilsyn med smøring', () => {
  test('Kan vise etablert tilsyn med to smøringer', () => {
    const data = toPerioderSammeUke();
    render(
      <EtablertTilsynMedSmoring
        etablertTilsynData={data.etablertTilsynData}
        smurtEtablertTilsynPerioder={data.smurtEtablertTilsynPerioder}
        sykdomsperioderSomIkkeErOppfylt={data.avslaattePerioder}
        perioderSomOverstyrerTilsyn={data.innleggelsesperioder}
      />,
    );

    expect(screen.getByText('Uke 36 - A')).toBeDefined();
    expect(screen.getByText('Uke 36 - B')).toBeDefined();
  });

  test('Kan vise etablert tilsyn med tre enkeltdager', async () => {
    const data = treEnkeltdager();
    render(
      <EtablertTilsynMedSmoring
        etablertTilsynData={data.etablertTilsynData}
        smurtEtablertTilsynPerioder={data.smurtEtablertTilsynPerioder}
        sykdomsperioderSomIkkeErOppfylt={data.avslaattePerioder}
        perioderSomOverstyrerTilsyn={data.innleggelsesperioder}
      />,
    );

    expect(screen.getByText('Uke 38 - A')).toBeDefined();
    expect(screen.getByText('Uke 38 - B')).toBeDefined();
    expect(screen.getByText('Uke 38 - C')).toBeDefined();

    expect(screen.getAllByText('= 5.5 t per dag (73%)').length).toEqual(3);
  });

  test('Kan vise etablert tilsyn med to smøringer og forskjellig prosent', async () => {
    const data = toSmøringer();
    render(
      <EtablertTilsynMedSmoring
        etablertTilsynData={data.etablertTilsynData}
        smurtEtablertTilsynPerioder={data.smurtEtablertTilsynPerioder}
        sykdomsperioderSomIkkeErOppfylt={data.avslaattePerioder}
        perioderSomOverstyrerTilsyn={data.innleggelsesperioder}
      />,
    );

    expect(screen.getByText('Uke 40 - A')).toBeDefined();
    expect(screen.getByText('Uke 40 - B')).toBeDefined();

    expect(screen.getByText('= 4.25 t per dag (57%)')).toBeDefined();
    expect(screen.getByText('= 4.28 t per dag (57%)')).toBeDefined();
  });

  test('Uke med innleggelse skal ikke deles opp', async () => {
    const data = dagOverstyrt();
    render(
      <EtablertTilsynMedSmoring
        etablertTilsynData={data.etablertTilsynData}
        smurtEtablertTilsynPerioder={data.smurtEtablertTilsynPerioder}
        sykdomsperioderSomIkkeErOppfylt={data.avslaattePerioder}
        perioderSomOverstyrerTilsyn={data.innleggelsesperioder}
      />,
    );
    expect(screen.getByText('Uke 36')).toBeDefined();
    expect(screen.getByText('= 2.6 t per dag (35%)')).toBeDefined();
  });
});
