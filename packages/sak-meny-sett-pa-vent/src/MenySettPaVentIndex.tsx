import SettPaVentModalIndex from '@k9-sak-web/modal-sett-pa-vent';
import { goToLos } from '@k9-sak-web/sak-app/src/app/paths';
import React, { useCallback } from 'react';
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
  lukkModal: () => void;
  erTilbakekreving: boolean;
}

const MenySettPaVentIndex = ({
  behandlingId,
  behandlingVersjon,
  settBehandlingPaVent,
  lukkModal,
  erTilbakekreving,
}: OwnProps) => {
  const submit = useCallback(
    formValues => {
      const values = {
        behandlingVersjon,
        behandlingId,
        frist: formValues.frist,
        ventearsak: formValues.ventearsak,
        ventearsakVariant: formValues.ventearsakVariant,
      };
      settBehandlingPaVent(values).then(() => goToLos());
    },
    [behandlingId, behandlingVersjon],
  );

  return (
    <RawIntlProvider value={intl}>
      <SettPaVentModalIndex
        showModal
        submitCallback={submit}
        cancelEvent={lukkModal}
        erTilbakekreving={erTilbakekreving}
        hasManualPaVent
      />
    </RawIntlProvider>
  );
};

export default MenySettPaVentIndex;
