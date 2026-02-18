import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { screen } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import KombinertBarnOgRammevedtak from '../dto/KombinertBarnOgRammevedtak';
import BarnVisning from './BarnVisning';

it('<BarnVisning>', () => {
  // Calculate birth date to ensure the test person is always 12 years old
  const fødselsdato = dayjs().subtract(12, 'years').format('YYYY-MM-DD');

  const barn: KombinertBarnOgRammevedtak = {
    personIdent: '150915',
    barnRelevantIBehandling: {
      personIdent: '150915',
      fødselsdato: fødselsdato,
      dødsdato: undefined,
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

  // The child should now always be 12 years old
  const barnetsAlderIdag = dayjs().diff(barn.barnRelevantIBehandling?.fødselsdato, 'years').toString();
  expect(barnetsAlderIdag).toBe('12');

  renderWithIntl(<BarnVisning barnet={barn} index={0} />, { messages });
  expect(screen.getByText('Barn #1')).toBeInTheDocument();
  expect(screen.getByText(`${barnetsAlderIdag} år`, { exact: false })).toBeInTheDocument();
  expect(screen.getByText('Rammevedtak')).toBeInTheDocument();
});
