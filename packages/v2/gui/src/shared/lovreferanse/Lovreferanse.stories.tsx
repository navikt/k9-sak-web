import type { Meta, StoryObj } from '@storybook/react';

import { expect, within } from '@storybook/test';
import { Lovreferanse } from './Lovreferanse';

const meta = {
  title: 'gui/shared/lovreferanse/Lovreferanse.tsx',
  component: Lovreferanse,
} satisfies Meta<typeof Lovreferanse>;
export default meta;

const elemsfinder = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  return {
    canvas,
    root: () => canvasElement,
    linkEls: () => canvas.queryAllByRole('link'),
  };
};

type Story = StoryObj<typeof meta>;
export const DefaultStory: Story = {
  args: {
    children: '§ 9-1',
  },
  play: async ({ canvasElement, step }) => {
    const { linkEls } = elemsfinder(canvasElement);
    await step('Enkeltparagrafer blir riktig lenket', async () => {
      await expect(linkEls()).toHaveLength(1);
      await expect(linkEls()[0]).toHaveTextContent('9-1');
      await expect(linkEls()[0]).toHaveAttribute('href', 'https://lovdata.no/lov/1997-02-28-19/§9-1');
    });
  },
};

export const JamførParagraferBlirRiktigLenket: Story = {
  args: {
    children: '§ 9-1 jf 21-22',
  },
  play: async ({ canvasElement, step }) => {
    const { linkEls } = elemsfinder(canvasElement);
    await step('Enkeltparagrafer blir riktig lenket', async () => {
      await expect(linkEls()).toHaveLength(2);
      const [firstLink, secondLink] = linkEls();
      await expect(firstLink).toHaveTextContent('9-1');
      await expect(firstLink).toHaveAttribute('href', 'https://lovdata.no/lov/1997-02-28-19/§9-1');

      await expect(secondLink).toHaveTextContent('21-22');
      await expect(secondLink).toHaveAttribute('href', 'https://lovdata.no/lov/1997-02-28-19/§21-22');
    });
  },
};

export const TekstUtenParagraftegnBlirIkkeLenket: Story = {
  args: {
    children: '9-1 jf 21-22',
  },
  play: async ({ canvasElement, step }) => {
    const { linkEls, root } = elemsfinder(canvasElement);
    await step('Tekst uten paragraftegn blir ikke lenket', async () => {
      await expect(linkEls()).toHaveLength(0);
      await expect(root()).toHaveTextContent('9-1 jf 21-22');
    });
  },
};

export const DobbelparagraferBlirLenketRiktig: Story = {
  args: {
    children: '§§ 9-1 og 9-2',
  },
  play: async ({ canvasElement, step }) => {
    const { linkEls } = elemsfinder(canvasElement);
    await step('Dobbeltparagrafer blir lenket riktig', async () => {
      await expect(linkEls()).toHaveLength(2);
      const [firstLink, secondLink] = linkEls();
      await expect(firstLink).toHaveTextContent('9-1');
      await expect(firstLink).toHaveAttribute('href', 'https://lovdata.no/lov/1997-02-28-19/§9-1');

      await expect(secondLink).toHaveTextContent('9-2');
      await expect(secondLink).toHaveAttribute('href', 'https://lovdata.no/lov/1997-02-28-19/§9-2');
    });
  },
};

export const ParagrafUtenMellomromEtter: Story = {
  args: {
    children: '§9-1',
  },
  play: async ({ canvasElement, step }) => {
    const { linkEls, root } = elemsfinder(canvasElement);
    await step('§ uten mellomrom etter blir korrekt', async () => {
      await expect(linkEls()).toHaveLength(1);
      const [firstLink] = linkEls();
      await expect(firstLink).toHaveTextContent('9-1');
      await expect(firstLink).toHaveAttribute('href', 'https://lovdata.no/lov/1997-02-28-19/§9-1');
      await expect(root()).toHaveTextContent('§ 9-1');
    });
  },
};

export const SaligKaosFungererOgså: Story = {
  args: {
    children: '§§9-1, 9-2 og §9-3',
  },
  play: async ({ canvasElement, step }) => {
    const { linkEls, root } = elemsfinder(canvasElement);
    await step('§ uten mellomrom etter blir korrekt', async () => {
      await expect(linkEls()).toHaveLength(3);
      const [firstLink, secondLink, thirdLink] = linkEls();
      await expect(firstLink).toHaveTextContent('9-1');
      await expect(firstLink).toHaveAttribute('href', 'https://lovdata.no/lov/1997-02-28-19/§9-1');

      await expect(secondLink).toHaveTextContent('9-2');
      await expect(secondLink).toHaveAttribute('href', 'https://lovdata.no/lov/1997-02-28-19/§9-2');

      await expect(thirdLink).toHaveTextContent('9-3');
      await expect(thirdLink).toHaveAttribute('href', 'https://lovdata.no/lov/1997-02-28-19/§9-3');

      await expect(root()).toHaveTextContent('§§ 9-1, 9-2 og § 9-3');
    });
  },
};
