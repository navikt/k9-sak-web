import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from 'storybook/test';
import { Button, TextField } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

// Eksempel-komponent for mal. Bytt til din komponent ved bruk av malen.
type ExampleProps = {
  label: string;
  onSubmit?: (value: string) => void;
};

// Eksempel på klasse-basert API-klient som komponenten bruker internt
class ExampleApiClient {
  async getNavn(): Promise<{ fornavn: string; etternavn: string }> {
    // I ekte kode hadde dette gjort fetch/axios-kall
    return { fornavn: 'Førnavn', etternavn: 'Etternavn' };
  }
}

const client = new ExampleApiClient();
const ExampleComponent = ({ label, onSubmit }: ExampleProps) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [navn, setNavn] = useState<{ fornavn: string; etternavn: string }>({ fornavn: '', etternavn: '' });

  useEffect(() => {
    void client.getNavn().then(navn => setNavn(navn));
  }, []);
  const handleSubmit = async () => {
    if (!value) {
      setError('Feltet må fylles ut');
      return;
    }
    setError(undefined);
    onSubmit?.(value);
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <p>Kall mot API for å hente navn</p>
      <p>
        Navn: {navn.fornavn} {navn.etternavn}
      </p>
      <TextField label={label} value={value} onChange={e => setValue(e.currentTarget.value)} error={error} />
      <div style={{ marginTop: 16 }}>
        <Button onClick={handleSubmit}>Send</Button>
      </div>
    </div>
  );
};

const defaultDecorator = (): Decorator => Story => {
  ExampleApiClient.prototype.getNavn = async () => ({ fornavn: 'Førnavn', etternavn: 'Etternavn' });
  return <Story />;
};

const prototypeMockDecorator = (): Decorator => Story => {
  ExampleApiClient.prototype.getNavn = async () => ({ fornavn: 'Pål', etternavn: 'Opel' });
  return <Story />;
};

const meta = {
  title: 'Template/ExampleComponent',
  component: ExampleComponent,
  parameters: {
    // Default story skal være interaktiv (controls), men uten automatisk play
    controls: { expanded: true },
  },
  args: {
    label: 'Skriv inn verdi',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ExampleComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1) Default: interaktiv, ingen play
export const Default: Story = {};

// 2) Test stories med play: flere stories for å teste ulike aspekter
export const SuccessfulSubmission: Story = {
  decorators: [defaultDecorator()],
  args: {
    label: 'Skriv inn verdi',
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    await step('Fyll inn tekst og send inn', async () => {
      await userEvent.type(await canvas.findByLabelText(args.label as string), 'ABC');
      await userEvent.click(await canvas.findByRole('button', { name: 'Send' }));
      // Forvent ingen feilmelding
      await expect(canvas.findByText('Feltet må fylles ut')).rejects.toThrow();
    });
  },
};

// 3) Validation: samler validering i én story
export const Validation: Story = {
  decorators: [defaultDecorator()],
  args: {
    label: 'Skriv inn verdi',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Forsøk å sende uten verdi for å trigge validering', async () => {
      await userEvent.click(await canvas.findByRole('button', { name: 'Send' }));
      await expect(canvas.findByText('Feltet må fylles ut')).resolves.toBeInTheDocument();
    });
  },
};

// 4) Prototype-mock: vis hvordan man mocker klasse-klient via prototype
export const PrototypeMock: Story = {
  decorators: [prototypeMockDecorator()],
  args: {
    label: 'Skriv inn verdi',
  },
  play: async ({ canvasElement, step }) => {
    // Mock klasse-klient via prototype
    ExampleApiClient.prototype.getNavn = async () => ({ fornavn: 'Pål', etternavn: 'Opel' });
    const canvas = within(canvasElement);
    await step('Verifiser at mock-et navn vises fra API-klienten', async () => {
      await expect(canvas.findByText('Navn: Pål Opel')).resolves.toBeInTheDocument();
    });
  },
};
