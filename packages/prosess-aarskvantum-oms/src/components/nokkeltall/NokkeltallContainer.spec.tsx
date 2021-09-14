import React from 'react';
import { shallowWithIntl } from '../../../i18n';
import NokkeltallContainer from './NokkeltallContainer';
import ForbrukteDager from './ForbrukteDager';

describe('<NokkeltallContainer>', () => {
  describe('Forbrukte dager', () => {
    const forbrukteDagerPropsForRestTidOgPeriode = (restTid: string, periode: string, smitteverndager?: string) => {
      const nøkkeltallContainer = shallowWithIntl(
        <NokkeltallContainer
          totaltAntallDager={20}
          antallDagerArbeidsgiverDekker={3}
          forbrukteDager={4.4}
          restTid={restTid}
          benyttetRammemelding
          antallDagerInfotrygd={0}
          smitteverndager={smitteverndager}
          visEllerSkjulNokkeltalldetaljer={() => undefined}
          migrertData={false}
          ar="2020"
        />,
      );

      const forbrukteDagerBoks = nøkkeltallContainer.find(ForbrukteDager);
      expect(forbrukteDagerBoks).toHaveLength(1);

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

      expect(smittevernDagerTimer).toEqual({ dager: 1, timer: 3 });
      expect(utbetaltForMangeDagerTimer).toEqual(null);
    });

    it('rendrer for mange utbetalte dager dersom restdager er negative smitteverndager ikke finnes', () => {
      const negativRestTid = 'PT-10H-30M';
      const periodeUtenomSmittevernstiden = '2020-02-05/2020-02-31';
      const { smittevernDagerTimer, utbetaltForMangeDagerTimer } = forbrukteDagerPropsForRestTidOgPeriode(
        negativRestTid,
        periodeUtenomSmittevernstiden,
      );

      expect(utbetaltForMangeDagerTimer).toEqual({ dager: 1, timer: 3 });
      expect(smittevernDagerTimer).toEqual(null);
    });
  });
});
