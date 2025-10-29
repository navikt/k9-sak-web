import { Venteaarsak } from '@k9-sak-web/types';
import messages from '../i18n/nb_NO.json';
import SettPaVentModal from './components/SettPaVentModal';

interface OwnProps {
  cancelEvent: () => void;
  submitCallback: (formData: any) => void;
  showModal: boolean;
  ventearsaker: Venteaarsak[];
  frist?: string;
  ventearsak?: string;
  visBrevErBestilt?: boolean;
  hasManualPaVent: boolean;
  erTilbakekreving?: boolean;
  ventearsakVariant?: string;
  isSubmitting: boolean;
}

const SettPaVentModalIndex = ({
  cancelEvent,
  submitCallback,
  showModal,
  ventearsaker,
  frist,
  ventearsak,
  visBrevErBestilt,
  hasManualPaVent,
  erTilbakekreving,
  ventearsakVariant,
  isSubmitting,
}: OwnProps) => (
      <SettPaVentModal
      cancelEvent={cancelEvent}
      onSubmit={submitCallback}
      showModal={showModal}
      ventearsaker={ventearsaker}
      frist={frist}
      ventearsak={ventearsak}
      visBrevErBestilt={visBrevErBestilt}
      hasManualPaVent={hasManualPaVent}
      erTilbakekreving={erTilbakekreving}
      ventearsakVariant={ventearsakVariant}
      isSubmitting={isSubmitting}
    />);

export default SettPaVentModalIndex;
