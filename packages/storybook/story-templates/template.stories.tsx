import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { userEvent, expect } from 'storybook/test';
import { Button, TextField } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

// Eksempel-komponent for mal. Bytt til din komponent ved bruk av malen.
type ExampleProps = {
  label: string;
  onSubmit?: (value: string) => void;
  // Valgfri injeksjon av API-klient for test/mocking i stories
  apiClient?: {
    getNavn: () => Promise<{ fornavn: string; etternavn: string }>;
  };
};

const ExampleComponent = ({ label, onSubmit, apiClient }: ExampleProps) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [navn, setNavn] = useState<{ fornavn: string; etternavn: string }>({ fornavn: '', etternavn: '' });

  useEffect(() => {
    void (apiClient ?? { getNavn: async () => ({ fornavn: 'Fornavn', etternavn: 'Etternavn' }) })
      ?.getNavn()
      .then(navn => setNavn(navn));
  }, [apiClient]);
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

// Fornuftig standardmock for eksemplene i denne malen
const defaultDecorator = (): Decorator => Story => <Story />;

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
  play: async ({ canvas, step, args }) => {
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
  play: async ({ canvas, step }) => {
    await step('Forsøk å sende uten verdi for å trigge validering', async () => {
      await userEvent.click(await canvas.findByRole('button', { name: 'Send' }));
      await expect(canvas.findByText('Feltet må fylles ut')).resolves.toBeInTheDocument();
    });
  },
};

// 4) API-client mock
export const ApiClientMock: Story = {
  decorators: [defaultDecorator()],
  args: {
    label: 'Skriv inn verdi',
    apiClient: {
      getNavn: async () => ({ fornavn: 'Pål', etternavn: 'Opel' }),
    },
  },
  play: async ({ canvas, step }) => {
    await step('Verifiser at mock-et navn vises fra injisert API-klient', async () => {
      await expect(canvas.findByText('Navn: Pål Opel')).resolves.toBeInTheDocument();
    });
  },
};
