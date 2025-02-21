import SettPaVentModalIndex from '@k9-sak-web/modal-sett-pa-vent';
import { goToLos } from '@k9-sak-web/sak-app/src/app/paths';
import { Venteaarsak } from '@k9-sak-web/types';
import { useCallback, useState } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

export const getMenytekst = (): string => intl.formatMessage({ id: 'MenySettPaVentIndex.BehandlingOnHold' });

interface OwnProps {
  behandlingId?: number;
  behandlingVersjon?: number;
  settBehandlingPaVent: (params: {
    behandlingVersjon: number;
    behandlingId: number;
    frist: string;
    ventearsak: string;
  }) => Promise<any>;
  ventearsaker: Venteaarsak[];
  lukkModal: () => void;
  erTilbakekreving: boolean;
}

const MenySettPaVentIndex = ({
  behandlingId,
  behandlingVersjon,
  settBehandlingPaVent,
  ventearsaker,
  lukkModal,
  erTilbakekreving,
}: OwnProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = useCallback(
    async formValues => {
      setIsSubmitting(true);
      const values = {
        behandlingVersjon,
        behandlingId,
        frist: formValues.frist,
        ventearsak: formValues.ventearsak,
        ventearsakVariant: formValues.ventearsakVariant,
      };
      try {
        await settBehandlingPaVent(values);
        goToLos();
      } finally {
        setIsSubmitting(false);
      }
    },
    [behandlingId, behandlingVersjon],
  );

  return (
    <RawIntlProvider value={intl}>
      <SettPaVentModalIndex
        showModal
        submitCallback={submit}
        cancelEvent={lukkModal}
        ventearsaker={ventearsaker}
        erTilbakekreving={erTilbakekreving}
        hasManualPaVent
        isSubmitting={isSubmitting}
      />
    </RawIntlProvider>
  );
};

export default MenySettPaVentIndex;
