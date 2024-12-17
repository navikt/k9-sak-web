import { renderWithIntlAndReactQueryClient } from '@fpsak-frontend/utils-test/test-utils';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach } from 'vitest';
import messages from '../../../i18n/nb_NO.json';
import NokkeltallContainer, { Nokkeltalltype } from './NokkeltallContainer';

describe('<NokkeltallContainer>', () => {
  beforeEach(() => requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []));

  describe('Forbrukte dager', () => {
    const forbrukteDagerPropsForRestTidOgPeriode = (restTid: string, periode: string, smitteverndager?: string) => {
      renderWithIntlAndReactQueryClient(
        <MemoryRouter>
          <NokkeltallContainer
            totaltAntallDager={20}
            antallDagerArbeidsgiverDekker={3}
            antallDagerFraværRapportertSomNyoppstartet={0}
            forbrukteDager={4.4}
            restTid={restTid}
            benyttetRammemelding
            antallDagerInfotrygd={0}
            smitteverndager={smitteverndager}
            visEllerSkjulNokkeltalldetaljer={() => undefined}
            migrertData={false}
            ar="2020"
            apneNokkeltall={[Nokkeltalltype.FORBRUKTE_DAGER]}
          />
        </MemoryRouter>,
        { messages },
      );
    };

    it('rendrer smittevern dersom smitteverndager finnes', () => {
      const negativRestTid = 'PT-10H-30M';
      const smitteverndager = 'PT10H30M';
      const periodeISmittevernstiden = '2020-05-05/2020-05-31';

      forbrukteDagerPropsForRestTidOgPeriode(negativRestTid, periodeISmittevernstiden, smitteverndager);

      expect(screen.getByText('Smitteverndager')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Dager gitt pga. dokumentert særlige smittevernhensyn i perioden fra og med 20.04.2020 til og med 31.12.2020.',
        ),
      ).toBeInTheDocument();
    });

    it('rendrer for mange utbetalte dager dersom restdager er negative smitteverndager ikke finnes', () => {
      const negativRestTid = 'PT-10H-30M';
      const periodeUtenomSmittevernstiden = '2020-02-05/2020-02-31';
      forbrukteDagerPropsForRestTidOgPeriode(negativRestTid, periodeUtenomSmittevernstiden);

      expect(screen.getByText('Utbetalt for mye.')).toBeInTheDocument();
      expect(screen.getByText('Det er utbetalt 1 dager og 3 timer mer enn brukeren har rett på.')).toBeInTheDocument();
    });
  });
});
