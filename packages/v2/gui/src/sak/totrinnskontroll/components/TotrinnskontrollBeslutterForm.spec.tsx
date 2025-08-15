import { k9_kodeverk_behandling_BehandlingStatus as BehandlingDtoStatus } from '@navikt/k9-sak-typescript-client';
import { render, screen } from '@testing-library/react';
import type { Behandling } from '../types/Behandling';
import type { TotrinnskontrollSkjermlenkeContext } from '../types/TotrinnskontrollSkjermlenkeContext';
import { TotrinnskontrollBeslutterForm } from './TotrinnskontrollBeslutterForm';

const location = {
  pathname: '',
  search: '',
  state: {},
  hash: '',
  key: '',
};

describe('<TotrinnskontrollBeslutterForm>', () => {
  const behandling: Behandling = {
    type: 'BT-002',
    status: BehandlingDtoStatus.FATTER_VEDTAK,
    toTrinnsBehandling: true,
    behandlingsresultat: undefined,
  };

  it('skal ikke vise preview brev link for tilbakekreving', () => {
    const totrinnskontrollSkjermlenkeContext = [
      {
        skjermlenkeType: 'test',
        totrinnskontrollAksjonspunkter: [],
      },
    ] as TotrinnskontrollSkjermlenkeContext[];

    render(
      <TotrinnskontrollBeslutterForm
        handleSubmit={vi.fn()}
        behandling={behandling}
        totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
        readOnly={false}
        lagLenke={() => location}
        arbeidsforholdHandlingTyper={[]}
        skjermlenkeTyper={[]}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Forhåndsvis' })).not.toBeInTheDocument();
  });
});
