import { useCallback, useContext } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import messages from './i18n/nb_NO.json';

import { VilkårMedPerioderDtoVilkarType } from '@k9-sak-web/backend/k9sak/generated';
import { K9SakClientContext } from '@k9-sak-web/gui/app/K9SakClientContext.js';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import NyBehandlingModal, { BehandlingOppretting, FormValues } from './components/NyBehandlingModal';
import VilkårBackendClient from './VilkårBackendClient';

const TILBAKEKREVING_BEHANDLINGSTYPER = [BehandlingType.TILBAKEKREVING, BehandlingType.TILBAKEKREVING_REVURDERING];

// Intl brukes ikke lenger i denne komponenten, men kan ikke fjernes fordi redux-form wrapperne krever en intlProvider
const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  createIntlCache(),
);

export const getMenytekst = (): string => 'Opprett ny behandling';

interface LagNyBehandlingPayload extends FormValues {
  saksnummer: string;
  behandlingId?: number;
}

interface OwnProps {
  ytelseType: FagsakYtelsesType;
  saksnummer: string;
  behandlingId?: number;
  behandlingUuid?: string;
  behandlingVersjon?: number;
  behandlingType?: Kodeverk;
  lagNyBehandling: (behandlingTypeKode: string, data: LagNyBehandlingPayload) => Promise<void>;
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
  const k9SakClient = useContext(K9SakClientContext);
  const vilkårBackendClient = new VilkårBackendClient(k9SakClient);
  const { data: vilkår } = useQuery({
    queryKey: ['vilkar', behandlingUuid],
    queryFn: () => (behandlingUuid ? vilkårBackendClient.getVilkår(behandlingUuid) : undefined),
    enabled: !!behandlingUuid,
  });

  const sisteDagISøknadsperiode = vilkår
    ?.find(v => v.vilkarType === VilkårMedPerioderDtoVilkarType.SØKNADSFRIST)
    ?.perioder?.reduce((senesteDatoFunnet, current) => {
      const tomDato = dayjs(current.periode.tom);
      return !senesteDatoFunnet || tomDato.isAfter(senesteDatoFunnet) ? tomDato.toDate() : senesteDatoFunnet;
    }, null);

  const submit = useCallback(
    async (formValues: FormValues) => {
      const isTilbakekreving = TILBAKEKREVING_BEHANDLINGSTYPER.includes(formValues.behandlingType);
      const tilbakekrevingBehandlingId = behandlingId && isTilbakekreving ? { behandlingId } : {};
      const params = {
        saksnummer: saksnummer.toString(),
        ...tilbakekrevingBehandlingId,
        ...formValues,
      };

      await lagNyBehandling(formValues.behandlingType, params);

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
        sisteDagISøknadsperiode={sisteDagISøknadsperiode}
      />
    </RawIntlProvider>
  );
};

export default MenyNyBehandlingIndex;
