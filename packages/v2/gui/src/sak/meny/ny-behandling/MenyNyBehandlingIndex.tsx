import { behandlingType as BehandlingTypeK9Klage } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import type { KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import { useCallback } from 'react';
import NyBehandlingModal, { type BehandlingOppretting, type FormValues } from './components/NyBehandlingModal';

const TILBAKEKREVING_BEHANDLINGSTYPER = [
  BehandlingTypeK9Klage.TILBAKEKREVING,
  BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING,
];

interface OwnProps {
  ytelseType: string;
  saksnummer: string;
  behandlingId?: number;
  behandlingUuid?: string;
  behandlingType?: string;
  lagNyBehandling: (behandlingTypeKode: string, data: any) => void;
  behandlingstyper: KodeverkObject[];
  tilbakekrevingRevurderingArsaker: KodeverkObject[];
  revurderingArsaker: KodeverkObject[];
  behandlingOppretting: BehandlingOppretting[];
  kanTilbakekrevingOpprettes: {
    kanBehandlingOpprettes: boolean;
    kanRevurderingOpprettes: boolean;
  };
  uuidForSistLukkede?: string;
  erTilbakekrevingAktivert: boolean;
  sjekkOmTilbakekrevingKanOpprettes: (params: { saksnummer: string; uuid: string }) => void;
  sjekkOmTilbakekrevingRevurderingKanOpprettes: (params: { uuid: string }) => void;
  lukkModal: () => void;
  aktorId?: string;
  gjeldendeVedtakBehandlendeEnhetId?: string;
}

const MenyNyBehandlingIndexV2 = ({
  ytelseType,
  saksnummer,
  behandlingId,
  behandlingUuid,
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
      const isTilbakekreving = TILBAKEKREVING_BEHANDLINGSTYPER.some(b => b === formValues.behandlingType);
      const tilbakekrevingBehandlingId = behandlingId && isTilbakekreving ? { behandlingId } : {};
      const filteredFormValues = Object.fromEntries(Object.entries(formValues).filter(([, v]) => v !== ''));
      const params = {
        saksnummer: saksnummer.toString(),
        ...tilbakekrevingBehandlingId,
        ...filteredFormValues,
      };

      lagNyBehandling(formValues.behandlingType, params);

      lukkModal();
    },
    [behandlingId, saksnummer, lagNyBehandling, lukkModal],
  );
  return (
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
  );
};

export default MenyNyBehandlingIndexV2;
