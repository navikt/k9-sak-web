import Uttaksperiode from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Uttaksperiode';
import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '../../i18n/intl-enzyme-test-helper-nøkkeltall';
import NøkkeltallContainer from './NøkkeltallContainer';
import Nøkkeltall, { Nøkkeltalldetalj } from './Nøkkeltall';

describe('<NøkkeltallContainer>', () => {
  const wrapperForRestdager = restdager => {
    // @ts-ignore
    const periodeISmittevernsperioden: Uttaksperiode = {
      periode: '2020-05-05/2020-05-31',
    };
    // @ts-ignore
    const periodeUtenforSmittevernsperioden: Uttaksperiode = {
      periode: '2020-03-01/2020-03-31',
    };
    return shallowWithIntl(
      <NøkkeltallContainer
        totaltAntallDager={20}
        antallDagerArbeidsgiverDekker={3}
        forbrukteDager={4.4}
        restdager={restdager}
        benyttetRammemelding
        antallDagerInfotrygd={0}
        uttaksperioder={[periodeISmittevernsperioden, periodeUtenforSmittevernsperioden]}
      />,
    );
  };

  it('rendrer smittevern hvis restdager er negative og i smittevernsperioden', () => {
    const antallForbrukteDager = 12;
    const bokserMedSmittevern = wrapperForRestdager(-antallForbrukteDager).find(Nøkkeltall);
    const restdagerBoks = bokserMedSmittevern.findWhere(boks => {
      return boks.prop('overskrift')?.overskrifttekstId === 'Nøkkeltall.ForbrukteDager';
    });

    expect(restdagerBoks).to.have.length(1);

    const forbrukteDagerDetaljer: Nøkkeltalldetalj[] = restdagerBoks.prop('detaljer');
    const { antallDager } = forbrukteDagerDetaljer.find(detalj => detalj.overskrifttekstId === 'Nøkkeltall.Smittevern');

    expect(antallDager).to.eql(antallForbrukteDager);
  });

  it('rendrer ikke smittevern hvis restdager er positive, selv om det er i smittevernsperioden', () => {
    const antallForbrukteDager = 12;
    const bokserUtenSmittevern = wrapperForRestdager(antallForbrukteDager).find(Nøkkeltall);
    const restdagerBoks = bokserUtenSmittevern.findWhere(boks => {
      return boks.prop('overskrift')?.overskrifttekstId === 'Nøkkeltall.ForbrukteDager';
    });

    expect(restdagerBoks).to.have.length(1);

    const forbrukteDagerDetaljer: Nøkkeltalldetalj[] = restdagerBoks.prop('detaljer');
    const smittevernsdetaljer = forbrukteDagerDetaljer.find(
      detalj => detalj.overskrifttekstId === 'Nøkkeltall.Smittevern',
    );

    expect(smittevernsdetaljer).to.be.undefined;
  });
});
