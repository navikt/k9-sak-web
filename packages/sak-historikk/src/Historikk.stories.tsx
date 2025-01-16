import { FC, ReactNode } from 'react';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import HistorikkSakIndex from './HistorikkSakIndex';
import defaultHistorikk from './mock/defaultHistorikk';
import overlappendeSakHistorikk from './mock/OverlappendeSak';
import { Meta, StoryObj } from '@storybook/react';
import { Historikkinnslag } from '@k9-sak-web/types';
import {
  BehandlingStartet,
  InnsynOpprettet,
  NyeRegisteropplysninger,
  OverlappendeSak,
} from './HistorikkSakIndex.stories';

const locationMock = {
  key: '1',
  pathname: 'test',
  search: 'test',
  state: {},
  hash: 'test',
};

type HistorikkWrapperProps = { children?: ReactNode[] };
const HistorikkWrapper = (props: HistorikkWrapperProps) => {
  const { children } = props;
  return (
    <div style={{ width: '600px', backgroundColor: 'white', padding: '30px' }}>
      <div className="grid gap-5">{children}</div>
    </div>
  );
};

const meta = {
  title: 'sak/sak-historikk',
  component: HistorikkWrapper,
} satisfies Meta<typeof HistorikkWrapper>;

type Story = StoryObj<typeof meta>;

export const VisHistorikk: Story = {
  args: {},
  // play: async ({ args, canvasElement, step }) => {},
  render: args => (
    <HistorikkWrapper>
      <HistorikkSakIndex {...NyeRegisteropplysninger.args} />
      <HistorikkSakIndex {...InnsynOpprettet.args} />
      <HistorikkSakIndex {...BehandlingStartet.args} />
      <HistorikkSakIndex {...OverlappendeSak.args} />
    </HistorikkWrapper>
  ),
};

// export const OverlappendeSak: Story = {
//   args: { historikkinnslag: overlappendeSakHistorikk },
//   play: async ({ args, canvasElement, step }) => {},
//   render: props => <HistorikkWrapper {...props} />,
// };

// export default {
//   title: 'sak/sak-historikk',
//   component: HistorikkSakIndex,
// };

// export const visHistorikk = () => (
//   <div
//     style={{
//       width: '600px',
//       backgroundColor: 'white',
//       padding: '30px',
//     }}
//   >
//     <div className="grid gap-5">
//       {defaultHistorikk.map(h => (
//         <HistorikkSakIndex
//           key={h.behandlingId}
//           historikkinnslag={h}
//           saksnummer="2"
//           getBehandlingLocation={() => locationMock}
//           alleKodeverk={alleKodeverk as any}
//           createLocationForSkjermlenke={() => locationMock}
//           erTilbakekreving={false}
//         />
//       ))}
//     </div>
//   </div>
// );

// export const OverlappendeSak = () => (
//   <div
//     style={{
//       width: '600px',
//       backgroundColor: 'white',
//       padding: '30px',
//     }}
//   >
//     <div className="grid gap-5">
//       {overlappendeSakHistorikk.map(h => (
//         <HistorikkSakIndex
//           key={h.behandlingId}
//           historikkinnslag={h}
//           saksnummer="3"
//           getBehandlingLocation={() => locationMock}
//           alleKodeverk={alleKodeverk as any}
//           createLocationForSkjermlenke={() => locationMock}
//           erTilbakekreving={false}
//         />
//       ))}
//     </div>
//   </div>
// );

export default meta;

// const canvas = within(canvasElement);
// await step('skal ha skjema for å sette uttaksgrad for overlappende saker', async () => {
//   await expect(canvas.getByText('Uttaksgrad for overlappende perioder'));
//   await expect(await canvas.findByLabelText(feltEnLabel));
//   await expect(await canvas.findByLabelText(feltToLabel));
// });
// await step('skal kunne løse aksjonspunkt for overlappende saker', async () => {
//   /**
//    * .type() ser ikke ut til å oppdatere value på elementene riktig, bruker fireEvent isteden
//    * await userEvent.type(canvas.getByLabelText(feltEnLabel), '40');
//    *  */
//   await fireEvent.change(await canvas.getByLabelText(feltEnLabel), {
//     target: { value: bekreftAksjonspunktRequest.bekreftedeAksjonspunktDtoer[0]?.perioder[0]?.søkersUttaksgrad },
//   });
//   await fireEvent.change(await canvas.getByLabelText(feltToLabel), {
//     target: { value: bekreftAksjonspunktRequest.bekreftedeAksjonspunktDtoer[0]?.perioder[1]?.søkersUttaksgrad },
//   });
//   await fireEvent.change(await canvas.getByLabelText('Begrunnelse'), {
//     target: {
//       value: 'Dette er en grundig begrunnelse',
//     },
//   });
//   await userEvent.click(await canvas.getByRole('button'));
//   await expect(args.oppdaterBehandling).toHaveBeenCalled();
//   await expect(api.sisteBekreftAksjonspunktResultat).toEqual(bekreftAksjonspunktRequest);
// });
