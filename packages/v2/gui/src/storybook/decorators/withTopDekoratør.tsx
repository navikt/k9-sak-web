import type { Decorator } from '@storybook/react-vite';
import HeaderWithErrorPanel from '../../sak/dekoratør/HeaderWithErrorPanel.js';

interface TopDekoratørProps {
  readonly ytelseNavn: string;
}

/**
 * Viser dekoratør på toppen av sida, så ein kan lage story som ser ut som vanleg systemskjermbilde.
 */
export const withTopDekoratør =
  ({ ytelseNavn }: TopDekoratørProps = { ytelseNavn: 'Demo dekoratør' }): Decorator =>
  Story => {
    return (
      <>
        <HeaderWithErrorPanel
          removeErrorMessage={() => undefined}
          setSiteHeight={() => undefined}
          aaregPath="/aaregPath"
          ytelse={ytelseNavn}
          headerTitleHref="/k9/web"
        />
        <Story />
      </>
    );
  };

/**
 * Denne kan leggast til etter withTopDekoratør viss ein ønsker noko innhald under story komponenten, for syns skuld.
 */
export const withContentBelowStory = (): Decorator => Story => {
  return (
    <>
      <Story />
      <h3>Saksdata...</h3>
    </>
  );
};
