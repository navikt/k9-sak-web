import React, { useCallback } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';

import NyBehandlingModal, { BehandlingOppretting, FormValues } from './components/NyBehandlingModal';

const TILBAKEKREVING_BEHANDLINGSTYPER = [BehandlingType.TILBAKEKREVING, BehandlingType.TILBAKEKREVING_REVURDERING];

// Intl brukes ikke lenger i denne komponenten, men kan ikke fjernes fordi redux-form wrapperne krever en intlProvider
const intl = createIntl(
  {
    locale: 'nb-NO',
    messages: {},
  },
  createIntlCache(),
);

export const getMenytekst = (): string => 'Opprett ny behandling';

interface OwnProps {
  ytelseType: Kodeverk;
  saksnummer: string;
  behandlingId?: number;
  behandlingUuid?: string;
  behandlingVersjon?: number;
  behandlingType?: Kodeverk;
  lagNyBehandling: (behandlingTypeKode: string, data: any) => void;
  behandlingstyper: KodeverkMedNavn[];
  tilbakekrevingRevurderingArsaker: KodeverkMedNavn[];
  revurderingArsaker: KodeverkMedNavn[];
  behandlingOppretting: BehandlingOppretting[];
  kanTilbakekrevingOpprettes: {
    kanBehandlingOpprettes: boolean;
    kanRevurderingOpprettes: boolean;
  };
  uuidForSistLukkede?: string;
  erTilbakekrevingAktivert: boolean;
  sjekkOmTilbakekrevingKanOpprettes: (params: { saksnummer: number; uuid: string }) => void;
  sjekkOmTilbakekrevingRevurderingKanOpprettes: (params: { uuid: string }) => void;
  lukkModal: () => void;
  aktorId?: string;
  gjeldendeVedtakBehandlendeEnhetId?: string;
}

const MenyNyBehandlingIndex = ({
  ytelseType,
  saksnummer,
  behandlingId,
  behandlingUuid,
  behandlingVersjon,
  behandlingType,
  lagNyBehandling,
  behandlingstyper,
  tilbakekrevingRevurderingArsaker,
  revurderingArsaker,
  behandlingOppretting,
  kanTilbakekrevingOpprettes,
  uuidForSistLukkede,
  erTilbakekrevingAktivert,
  sjekkOmTilbakekrevingKanOpprettes,
  sjekkOmTilbakekrevingRevurderingKanOpprettes,
  lukkModal,
  aktorId,
  gjeldendeVedtakBehandlendeEnhetId,
}: OwnProps) => {
  const submit = useCallback(
    (formValues: FormValues) => {
      const isTilbakekreving = TILBAKEKREVING_BEHANDLINGSTYPER.includes(formValues.behandlingType);
      const tilbakekrevingBehandlingId = behandlingId && isTilbakekreving ? { behandlingId } : {};
      const params = {
        saksnummer: saksnummer.toString(),
        ...tilbakekrevingBehandlingId,
        ...formValues,
      };

      lagNyBehandling(formValues.behandlingType, params);

      lukkModal();
    },
    [behandlingId, behandlingVersjon],
  );
  return (
    <RawIntlProvider value={intl}>
      <NyBehandlingModal
        ytelseType={ytelseType}
        saksnummer={saksnummer}
        cancelEvent={lukkModal}
        submitCallback={submit}
        behandlingOppretting={behandlingOppretting}
        behandlingstyper={behandlingstyper}
        tilbakekrevingRevurderingArsaker={tilbakekrevingRevurderingArsaker}
        revurderingArsaker={revurderingArsaker}
        kanTilbakekrevingOpprettes={kanTilbakekrevingOpprettes}
        behandlingType={behandlingType}
        behandlingId={behandlingId}
        behandlingUuid={behandlingUuid}
        uuidForSistLukkede={uuidForSistLukkede}
        erTilbakekrevingAktivert={erTilbakekrevingAktivert}
        sjekkOmTilbakekrevingKanOpprettes={sjekkOmTilbakekrevingKanOpprettes}
        sjekkOmTilbakekrevingRevurderingKanOpprettes={sjekkOmTilbakekrevingRevurderingKanOpprettes}
        aktorId={aktorId}
        gjeldendeVedtakBehandlendeEnhetId={gjeldendeVedtakBehandlendeEnhetId}
      />
    </RawIntlProvider>
  );
};

export default MenyNyBehandlingIndex;
