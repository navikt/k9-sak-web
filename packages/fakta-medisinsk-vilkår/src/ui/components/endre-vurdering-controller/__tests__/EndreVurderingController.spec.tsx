import { httpUtils, Period } from '@fpsak-frontend/utils';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import LinkRel from '../../../../constants/LinkRel';
import type { Vurderingsversjon } from '../../../../types/Vurdering';
import Vurderingsresultat from '../../../../types/Vurderingsresultat';
import ContainerContext from '../../../context/ContainerContext';
import EndreVurderingController from '../EndreVurderingController';

const noOverlapResponse = { perioderMedEndringer: [] };
const overlapResponse = {
  perioderMedEndringer: [
    {
      periode: { fom: '2024-01-01', tom: '2024-01-31' },
      endrerVurderingSammeBehandling: true,
      endrerAnnenVurdering: false,
    },
  ],
};
const vurderingsversjon: Vurderingsversjon = {
  endretAv: 'Saksbehandler',
  endretTidspunkt: '2024-01-01T00:00:00',
  resultat: Vurderingsresultat.OPPFYLT,
  tekst: 'Fast vurderingstekst',
  perioder: [new Period('2024-01-01', '2024-01-31')],
  dokumenter: [],
};
const endreVurderingLink = {
  href: '/vurdering',
  rel: LinkRel.ENDRE_VURDERING,
  type: 'POST',
  versjon: '1',
  requestPayload: { behandlingUuid: 'abc' },
};
const feilmelding = 'Noe gikk galt ved lagring av vurderingen, vennligst prøv igjen senere.';
const vurderingsid = 'vurdering-123';
const vurderingsversjonId = 'vurderingsversjon-1';

const renderController = (onVurderingLagret: () => void) =>
  render(
    <ContainerContext.Provider
      value={{
        endpoints: {
          vurderingsoversiktKontinuerligTilsynOgPleie: '',
          vurderingsoversiktBehovForToOmsorgspersoner: '',
          vurderingsoversiktLivetsSluttfase: undefined,
          vurderingsoversiktLangvarigSykdom: undefined,
          dokumentoversikt: '',
          innleggelsesperioder: '',
          diagnosekoder: '',
          dataTilVurdering: '',
          status: '',
          nyeDokumenter: '',
          perioderMedVilkar: undefined,
        },
        behandlingUuid: 'abc',
        readOnly: false,
        onFinished: vi.fn(),
        errorNotifier: vi.fn(),
        visFortsettknapp: false,
      }}
    >
      <EndreVurderingController
        endreVurderingLink={endreVurderingLink}
        dataTilVurderingUrl="/data-til-vurdering"
        onVurderingLagret={onVurderingLagret}
        vurderingsid={vurderingsid}
        vurderingsversjonId={vurderingsversjonId}
        formRenderer={(_dokumenter, onSubmit) => (
          <button type="button" onClick={() => onSubmit(vurderingsversjon)}>
            Send inn
          </button>
        )}
      />
    </ContainerContext.Provider>,
  );

describe('EndreVurderingController', () => {
  beforeEach(() => {
    vi.spyOn(httpUtils, 'get').mockResolvedValue([]);
    vi.spyOn(httpUtils, 'post').mockImplementation((_url, body) =>
      Promise.resolve(body.dryRun ? noOverlapResponse : {}),
    );
    vi.spyOn(window, 'scroll').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lagrer vurderingen direkte når dry-run ikke finner overlapp', async () => {
    const user = userEvent.setup();
    const onVurderingLagret = vi.fn();
    renderController(onVurderingLagret);

    await user.click(await screen.findByRole('button', { name: 'Send inn' }));

    await waitFor(() => {
      expect(vi.mocked(httpUtils.post)).toHaveBeenCalledTimes(2);
      expect(onVurderingLagret).toHaveBeenCalledTimes(1);
    });
    expect(screen.queryByRole('heading', { name: 'Overlappende periode' })).not.toBeInTheDocument();
    expect(vi.mocked(httpUtils.post).mock.calls.map(([, body]) => body)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: vurderingsid,
          versjon: vurderingsversjonId,
          dryRun: true,
        }),
        expect.objectContaining({
          id: vurderingsid,
          versjon: vurderingsversjonId,
          dryRun: false,
        }),
      ]),
    );
  });

  it('viser overlappende perioder og avbryter uten å lagre', async () => {
    vi.mocked(httpUtils.post).mockImplementation((_url, body) => Promise.resolve(body.dryRun ? overlapResponse : {}));
    const user = userEvent.setup();
    const onVurderingLagret = vi.fn();
    renderController(onVurderingLagret);

    await user.click(await screen.findByRole('button', { name: 'Send inn' }));
    expect(await screen.findByRole('heading', { name: 'Overlappende periode' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Avbryt' }));

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Overlappende periode' })).not.toBeInTheDocument();
    });
    expect(vi.mocked(httpUtils.post)).toHaveBeenCalledTimes(1);
    expect(onVurderingLagret).not.toHaveBeenCalled();
  });

  it('lagrer vurderingen etter at overlappende perioder er bekreftet', async () => {
    vi.mocked(httpUtils.post).mockImplementation((_url, body) => Promise.resolve(body.dryRun ? overlapResponse : {}));
    const user = userEvent.setup();
    const onVurderingLagret = vi.fn();
    renderController(onVurderingLagret);

    await user.click(await screen.findByRole('button', { name: 'Send inn' }));
    await user.click(await screen.findByRole('button', { name: 'Bekreft' }));

    await waitFor(() => {
      expect(vi.mocked(httpUtils.post)).toHaveBeenCalledTimes(2);
      expect(onVurderingLagret).toHaveBeenCalledTimes(1);
    });
    expect(vi.mocked(httpUtils.post).mock.calls.map(([, body]) => body)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: vurderingsid, versjon: vurderingsversjonId, dryRun: true }),
        expect.objectContaining({ id: vurderingsid, versjon: vurderingsversjonId, dryRun: false }),
      ]),
    );
  });

  it('viser feilmelding når lagringskallet avvises', async () => {
    vi.mocked(httpUtils.post).mockImplementation((_url, body) =>
      body.dryRun ? Promise.resolve(noOverlapResponse) : Promise.reject(new Error('Lagring feilet')),
    );
    const user = userEvent.setup();
    const onVurderingLagret = vi.fn();
    renderController(onVurderingLagret);

    await user.click(await screen.findByRole('button', { name: 'Send inn' }));

    await waitFor(() => {
      expect(screen.getAllByText(feilmelding).length).toBeGreaterThan(0);
    });
    expect(onVurderingLagret).not.toHaveBeenCalled();
  });

  it('viser feilmelding og lagrer ikke når dry-run avvises', async () => {
    vi.mocked(httpUtils.post).mockRejectedValue(new Error('Dry-run feilet'));
    const user = userEvent.setup();
    const onVurderingLagret = vi.fn();
    renderController(onVurderingLagret);

    await user.click(await screen.findByRole('button', { name: 'Send inn' }));

    await waitFor(() => {
      expect(screen.getAllByText(feilmelding).length).toBeGreaterThan(0);
    });
    expect(vi.mocked(httpUtils.post)).toHaveBeenCalledTimes(1);
    expect(onVurderingLagret).not.toHaveBeenCalled();
  });
});
