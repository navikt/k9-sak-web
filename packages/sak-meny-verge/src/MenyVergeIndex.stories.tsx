import { action } from 'storybook/actions';
import MenyVergeIndex from './MenyVergeIndex';

export default {
  title: 'sak/sak-meny-verge',
  component: MenyVergeIndex,
};

export const visMenyForÅLeggeTilVerge = () => (
  <MenyVergeIndex opprettVerge={action('button-click')} lukkModal={action('button-click')} />
);

export const visMenyForÅFjerneVerge = () => (
  <MenyVergeIndex fjernVerge={action('button-click')} lukkModal={action('button-click')} />
);
