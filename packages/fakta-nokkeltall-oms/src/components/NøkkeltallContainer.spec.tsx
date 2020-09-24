import { Uttaksperiode } from '@k9-sak-web/types';
import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '../../i18n';
import NøkkeltallContainer from './NøkkeltallContainer';
import ForbrukteDager from './ForbrukteDager';

describe('<NøkkeltallContainer>', () => {
  describe('Forbrukte dager', () => {
    const forbrukteDagerPropsForRestTidOgPeriode = (restTid: string, periode: string, smitteverndager?: string) => {
      // @ts-ignore
      const uttaksperiode: Uttaksperiode = {
        periode,
      };
      const nøkkeltallContainer = shallowWithIntl(
        <NøkkeltallContainer
          totaltAntallDager={20}
          antallDagerArbeidsgiverDekker={3}
          forbrukteDager={4.4}
          restTid={restTid}
          benyttetRammemelding
          antallDagerInfotrygd={0}
          smitteverndager={smitteverndager}
          uttaksperioder={[uttaksperiode]}
        />,
      );

      const forbrukteDagerBoks = nøkkeltallContainer.find(ForbrukteDager);
      expect(forbrukteDagerBoks).to.have.length(1);

      return forbrukteDagerBoks.props();
    };

    it('rendrer smittevern dersom smitteverndager finnes', () => {
      const negativRestTid = 'PT-10H-30M';
      const smitteverndager = 'PT10H30M';
      const periodeISmittevernstiden = '2020-05-05/2020-05-31';

      const { smittevernDagerTimer, utbetaltForMangeDagerTimer } = forbrukteDagerPropsForRestTidOgPeriode(
        negativRestTid,
        periodeISmittevernstiden,
        smitteverndager,
      );

      expect(smittevernDagerTimer).to.eql({ dager: 1, timer: 3 });
      expect(utbetaltForMangeDagerTimer).to.eql(null);
    });

    it('rendrer for mange utbetalte dager dersom restdager er negative smitteverndager ikke finnes', () => {
      const negativRestTid = 'PT-10H-30M';
      const periodeUtenomSmittevernstiden = '2020-02-05/2020-02-31';
      const { smittevernDagerTimer, utbetaltForMangeDagerTimer } = forbrukteDagerPropsForRestTidOgPeriode(
        negativRestTid,
        periodeUtenomSmittevernstiden,
      );

      expect(utbetaltForMangeDagerTimer).to.eql({ dager: 1, timer: 3 });
      expect(smittevernDagerTimer).to.eql(null);
    });
  });
});
