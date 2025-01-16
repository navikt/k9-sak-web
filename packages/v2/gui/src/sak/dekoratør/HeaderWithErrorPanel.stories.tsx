import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import HeaderWithErrorPanel from './HeaderWithErrorPanel';

const meta = {
  title: 'gui/sak/dekoratør',
  component: HeaderWithErrorPanel,
} satisfies Meta<typeof HeaderWithErrorPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VisDekoratorUtenFeilmeldinger: Story = {
  args: {
    navAnsattName: 'Espen Utvikler',
    removeErrorMessage: () => undefined,
    setSiteHeight: () => undefined,
    getPathToLos: () => '',
    getPathToK9Punsj: () => '',
    ainntektPath: 'test',
    aaregPath: 'tast',
    ytelse: 'Pleiepenger og omsorgspenger',
    headerTitleHref: '/k9/web',
  },
  render: args => <HeaderWithErrorPanel {...args} />,
};

export const VisDekoratorMedFeilmeldinger: Story = {
  args: {
    navAnsattName: 'Espen Utvikler',
    removeErrorMessage: () => undefined,
    setSiteHeight: () => undefined,
    getPathToLos: () => '',
    getPathToK9Punsj: () => '',
    ainntektPath: 'test',
    aaregPath: 'tast',
    ytelse: 'Pleiepenger og omsorgspenger',
    headerTitleHref: '/k9/web',
  },
  render: args => {
    const [errorMessages, removeErrorMessages] = useState([
      { message: 'Feilmelding 1' },
      {
        message: 'En lang feilmelding som også har ekstra informasjon som kan åpnes i en popup.',
        additionalInfo: { feilmelding: 'Detaljert feilmelding', url: '' },
      },
    ]);
    return (
      <HeaderWithErrorPanel
        {...args}
        removeErrorMessage={() => removeErrorMessages([])}
        errorMessages={errorMessages}
      />
    );
  },
};
