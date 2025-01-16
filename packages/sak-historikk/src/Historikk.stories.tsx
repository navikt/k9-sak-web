import { ReactNode } from 'react';
import HistorikkSakIndex from './HistorikkSakIndex';
import { Meta, StoryObj } from '@storybook/react';
import {
  BehandlingStartet,
  InnsynOpprettet,
  NyeRegisteropplysninger,
  OverlappendeSak,
} from './HistorikkSakIndex.stories';

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
  render: () => (
    <HistorikkWrapper>
      <HistorikkSakIndex {...NyeRegisteropplysninger.args} />
      <HistorikkSakIndex {...InnsynOpprettet.args} />
      <HistorikkSakIndex {...BehandlingStartet.args} />
      <HistorikkSakIndex {...OverlappendeSak.args} />
    </HistorikkWrapper>
  ),
};

export default meta;
