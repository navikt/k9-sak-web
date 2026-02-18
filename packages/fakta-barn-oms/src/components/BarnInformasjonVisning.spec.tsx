import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import KombinertBarnOgRammevedtak from '../dto/KombinertBarnOgRammevedtak';
import BarnInformasjonVisning from './BarnInformasjonVisning';

it('<BarnInformasjonVisning> med rett info', () => {
  const barn: KombinertBarnOgRammevedtak = {
    personIdent: '',
    barnRelevantIBehandling: {
      personIdent: '12312312312',
      fødselsdato: '2014-08-31',
      dødsdato: null,
      harSammeBosted: true,
      barnType: BarnType.FOSTERBARN,
    },
  };

  renderWithIntl(<BarnInformasjonVisning barnet={barn} />, { messages });

  expect(screen.getByText('Barnet bor med søker')).toBeInTheDocument();
  expect(screen.getByText('Barnet er fosterbarn')).toBeInTheDocument();
  expect(screen.queryByText('Barnet bor i utlandet')).not.toBeInTheDocument();
});
