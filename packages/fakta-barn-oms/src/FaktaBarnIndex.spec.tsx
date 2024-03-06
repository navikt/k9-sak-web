import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import FaktaBarnIndex from './FaktaBarnIndex';

describe('<FaktaBarnIndex>', () => {
  it('hvis ingen barn, rendres info om dette', () => {
    renderWithIntl(<FaktaBarnIndex barn={[]} rammevedtak={[]} />, { messages });

    expect(screen.getByText('Det er ikke registrert noen barn på søkeren')).toBeInTheDocument();
  });

  it('viser vanlige barn og rammevedtaksbarn', () => {
    renderWithIntl(
      <FaktaBarnIndex
        barn={[
          {
            personIdent: '123',
            barnType: BarnType.VANLIG,
            harSammeBosted: true,
          },
          {
            personIdent: '456',
            barnType: BarnType.UTENLANDSK_BARN,
            harSammeBosted: false,
          },
        ]}
        rammevedtak={[
          {
            type: 'Fosterbarn',
            vedtatt: '2021-03-17',
            lengde: 'PT0S',
            gyldigFraOgMed: '2021-03-17',
            gyldigTilOgMed: '2033-12-31',
            mottaker: '150915',
          },
          {
            type: 'UtvidetRett',
            vedtatt: '2021-03-17',
            lengde: 'PT0S',
            gyldigFraOgMed: '2021-03-17',
            gyldigTilOgMed: '2033-12-31',
            utvidetRettFor: '150915 #2',
          },
        ]}
      />,
      { messages },
    );

    expect(
      screen.getByText(
        'Disse barna er søkerens folkeregistrerte barn slik det var ved tidspunktet for beregning av dager',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Det er ikke registrert midlertidig aleneomsorg')).toBeInTheDocument();
  });

  it('viser barn fra fagsak kronisk syk', () => {
    renderWithIntl(
      <FaktaBarnIndex
        barn={[
          {
            personIdent: '123',
            barnType: BarnType.VANLIG,
            harSammeBosted: true,
          },
          {
            personIdent: '456',
            barnType: BarnType.UTENLANDSK_BARN,
            harSammeBosted: false,
          },
        ]}
        rammevedtak={[
          {
            type: 'Fosterbarn',
            vedtatt: '2021-03-17',
            lengde: 'PT0S',
            gyldigFraOgMed: '2021-03-17',
            gyldigTilOgMed: '2033-12-31',
            mottaker: '150915',
          },
          {
            type: 'UtvidetRett',
            vedtatt: '2021-03-17',
            lengde: 'PT0S',
            gyldigFraOgMed: '2021-03-17',
            gyldigTilOgMed: '2033-12-31',
            utvidetRettFor: '150915 #2',
          },
        ]}
        fagsaksType={FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN}
      />,
      { messages },
    );

    expect(screen.getByText('Barnet søknaden gjelder for')).toBeInTheDocument();
    expect(screen.getByText('Det er ikke registrert midlertidig aleneomsorg')).toBeInTheDocument();
  });

  it('viser barn fra fagsak midlertidig alene', () => {
    renderWithIntl(
      <FaktaBarnIndex
        barn={[
          {
            personIdent: '123',
            barnType: BarnType.VANLIG,
            harSammeBosted: true,
          },
          {
            personIdent: '456',
            barnType: BarnType.UTENLANDSK_BARN,
            harSammeBosted: false,
          },
        ]}
        rammevedtak={[
          {
            type: 'Fosterbarn',
            vedtatt: '2021-03-17',
            lengde: 'PT0S',
            gyldigFraOgMed: '2021-03-17',
            gyldigTilOgMed: '2033-12-31',
            mottaker: '150915',
          },
          {
            type: 'UtvidetRett',
            vedtatt: '2021-03-17',
            lengde: 'PT0S',
            gyldigFraOgMed: '2021-03-17',
            gyldigTilOgMed: '2033-12-31',
            utvidetRettFor: '150915 #2',
          },
        ]}
        fagsaksType={FagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE}
      />,
      { messages },
    );

    expect(screen.getByText('Disse barna er søkerens folkeregistrerte barn')).toBeInTheDocument();
    expect(screen.getByText('Det er ikke registrert midlertidig aleneomsorg')).toBeInTheDocument();
  });
});
