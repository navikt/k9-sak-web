import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { InnslagLinje } from './InnslagLinje.js';

const meta = {
  title: 'gui/sak/historikk/innslag/InnslagLinje',
  component: InnslagLinje,
} satisfies Meta<typeof InnslagLinje>;

export default meta;

type Story = StoryObj<typeof meta>;

const testTekst = (unEscapedTekst: string, escapedTekst: string) => ({
  unEscapedTekst,
  escapedTekst,
});

const testTekster = [
  testTekst('aa bb', 'aa bb'),
  testTekst('_a', '_a'),
  testTekst('__a', '\\__a'),
  testTekst('_', '_'),
  testTekst('__', '\\__'),
  testTekst('\\_', '\\\\_'),
  testTekst('\\__', '\\\\\\__'),
  testTekst('\\', '\\\\'),
  testTekst('a__b', 'a\\__b'),
  testTekst('__a b_ c__', '\\__a b_ c\\__'),
];

export const LinjeMedUthevaOgEscaped: Story = {
  args: {
    behandlingLocation: {
      key: 'k',
      hash: 'h',
      pathname: 'pn',
      search: 's',
      state: 'st',
    },
    linje: {
      type: 'TEKST',
      tekst: 'start __utheva tekst__, så enkel underscore:_, så dobbel underscore:\\__, så backslash:\\\\.',
    },
  },
  play: async ({ canvas }) => {
    const linjeEl = canvas.getByText('start', { exact: false });
    await expect(linjeEl).toBeVisible();
    const boldEl = linjeEl.querySelector('b');
    await expect(boldEl).toHaveTextContent('utheva tekst');
    await expect(linjeEl).toHaveTextContent(
      'start utheva tekst, så enkel underscore:_, så dobbel underscore:__, så backslash:\\.',
    );
  },
};

export const DiverseTeksterTest = {
  args: {
    ...LinjeMedUthevaOgEscaped.args,
  },
  play: async ({ mount, args, step }) => {
    for (const testTekst of testTekster) {
      await step(`test rendering tekst "${testTekst.unEscapedTekst}"`, async () => {
        const linje = {
          ...args.linje,
          tekst: testTekst.escapedTekst,
        };
        const canvas = await mount(<InnslagLinje linje={linje} behandlingLocation={args.behandlingLocation} />);
        const linjeEl = canvas.getByText(testTekst.unEscapedTekst);
        await expect(linjeEl).toHaveTextContent(testTekst.unEscapedTekst);
      });
    }
  },
} satisfies Story;
