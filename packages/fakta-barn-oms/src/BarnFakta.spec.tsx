import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BarnType } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/BarnDto.js';
import { screen } from '@testing-library/react';
import messages from '../i18n/nb_NO.json';
import BarnFakta from './BarnFakta';

describe('<BarnFakta>', () => {
  it('hvis ingen barn, rendres info om dette', () => {
    renderWithIntl(<BarnFakta barn={[]} rammevedtak={[]} />, { messages });

    expect(screen.getByText('Det er ikke registrert noen barn på søkeren')).toBeInTheDocument();
  });

  it('viser vanlige barn og rammevedtaksbarn', () => {
    renderWithIntl(
      <BarnFakta
        barn={[
          { personIdent: '123', barnType: BarnType.VANLIG },
          { personIdent: '456', barnType: BarnType.UTENLANDSK_BARN },
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
      <BarnFakta
        barn={[
          { personIdent: '123', barnType: BarnType.VANLIG },
          { personIdent: '456', barnType: BarnType.UTENLANDSK_BARN },
        ]}
        rammevedtak={[]}
        fagsaksType={fagsakYtelsesType.OMSORGSPENGER_KS}
      />,
      { messages },
    );

    expect(screen.getByText('Barnet søknaden gjelder for')).toBeInTheDocument();
    expect(screen.getByText('Det er ikke registrert midlertidig aleneomsorg')).toBeInTheDocument();
  });

  it('viser barn fra fagsak midlertidig alene', () => {
    renderWithIntl(
      <BarnFakta
        barn={[
          { personIdent: '123', barnType: BarnType.VANLIG },
          { personIdent: '456', barnType: BarnType.UTENLANDSK_BARN },
        ]}
        rammevedtak={[]}
        fagsaksType={fagsakYtelsesType.OMSORGSPENGER_MA}
      />,
      { messages },
    );

    expect(screen.getByText('Disse barna er søkerens folkeregistrerte barn')).toBeInTheDocument();
    expect(screen.getByText('Det er ikke registrert midlertidig aleneomsorg')).toBeInTheDocument();
  });
});
