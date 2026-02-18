import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import KombinertBarnOgRammevedtak from '../dto/KombinertBarnOgRammevedtak';
import BarnRammevedtakVisning from './BarnRammevedtakVisning';

it('rendrer panel om barnet med rett info', () => {
  const periode = {
    fom: '2020-01-01',
    tom: '2020-12-31',
  };
  const barn: KombinertBarnOgRammevedtak = {
    personIdent: '',
    rammevedtak: {
      personIdent: '12312312312',
      kroniskSykdom: [periode],
      fosterbarn: periode,
    },
  };

  renderWithIntl(<BarnRammevedtakVisning barnet={barn} />, { messages });

  expect(screen.getByText('Rammevedtak')).toBeInTheDocument();
  expect(screen.getByText('Utvidet rett')).toBeInTheDocument();
  expect(screen.getByText('Fosterbarn')).toBeInTheDocument();
  expect(screen.queryByText('Alene om omsorgen')).not.toBeInTheDocument();
});
