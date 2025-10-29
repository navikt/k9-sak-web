import { action } from 'storybook/actions';
import OkAvbrytModal from './OkAvbrytModal';

export default {
  title: 'sharedComponents/OkAvbrytModal',
  component: OkAvbrytModal,
};

export const visModal = () => (
  <OkAvbrytModal textCode="Test.Test" showModal submit={action('button-click')} cancel={action('button-click')} />);
