import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import moment from 'moment';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import KombinertBarnOgRammevedtak from '../dto/KombinertBarnOgRammevedtak';
import BarnVisning from './BarnVisning';

it('<BarnVisning>', () => {
  const barn: KombinertBarnOgRammevedtak = {
    personIdent: '150915',
    barnRelevantIBehandling: {
      personIdent: '150915',
      fødselsdato: '2013-08-31',
      dødsdato: null,
      harSammeBosted: true,
      barnType: BarnType.VANLIG,
    },
    rammevedtak: {
      personIdent: '150915',
      kroniskSykdom: [
        {
          fom: '2021-03-17',
          tom: '2033-12-31',
        },
        {
          fom: '2033-03-17',
          tom: '2066-12-31',
        },
      ],
    },
  };

  const barnetsAlderVedValgtDato = moment('2014-09-01')
    .diff(barn.barnRelevantIBehandling.fødselsdato, 'years')
    .toString();
  expect(barnetsAlderVedValgtDato).toBe('1');

  const barnetsAlderIdag = moment().diff(barn.barnRelevantIBehandling.fødselsdato, 'years').toString();

  renderWithIntl(<BarnVisning barnet={barn} index={0} />, { messages });
  expect(screen.getByText('Barn #1')).toBeInTheDocument();
  expect(screen.getByText(barnetsAlderIdag, { exact: false })).toBeInTheDocument();
  expect(screen.getByText('Rammevedtak')).toBeInTheDocument();
});
