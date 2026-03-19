import { describe, expect, it, vi } from 'vitest';
import { pollLocation } from './pollLocation';

// Verdier fra AsyncPollingStatusStatus-enum
const PENDING = 'PENDING';
const COMPLETE = 'COMPLETE';
const DELAYED = 'DELAYED';
const HALTED = 'HALTED';
const CANCELLED = 'CANCELLED';

/** Hjelpefunksjon for å lage mock poll-svar med JSON content-type */
const jsonResponse = (data: unknown): { data: unknown; response: Response } => ({
  data,
  response: new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  }),
});

/** Hjelpefunksjon for poll-svar uten JSON content-type */
const nonJsonResponse = (): { data: unknown; response: Response } => ({
  data: undefined,
  response: new Response('OK', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  }),
});

describe('pollLocation', () => {
  // Bruk fake timers for å unngå faktisk venting i tester
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  /** Kjører pollLocation med fake timers slik at await wait() løses umiddelbart. */
  const runWithFakeTimers = async <T>(promise: Promise<T>): Promise<T> => {
    let settled = false;
    let result: T;
    let rejection: unknown;
    const p = promise.then(
      r => {
        settled = true;
        result = r;
      },
      e => {
        settled = true;
        rejection = e;
      },
    );
    while (!settled) {
      await vi.advanceTimersByTimeAsync(2000);
    }
    await p;
    if (rejection) throw rejection;
    return result!;
  };

  it('returnerer endelig ressurs når poll ikke returnerer polling-status', async () => {
    const behandling = { id: 1, versjon: 2, uuid: 'test-uuid' };
    const poll = vi.fn().mockResolvedValueOnce(jsonResponse(behandling));

    const result = await runWithFakeTimers(pollLocation('http://localhost/poll', poll));

    expect(result).toEqual(behandling);
    expect(poll).toHaveBeenCalledTimes(1);
    expect(poll).toHaveBeenCalledWith('http://localhost/poll', undefined);
  });

  it('poller videre ved PENDING-status og returnerer endelig ressurs', async () => {
    const pendingResponse = jsonResponse({
      status: PENDING,
      message: 'Prosessering pågår...',
      pollIntervalMillis: 500,
    });
    const endeligRessurs = { id: 42, versjon: 3 };

    const poll = vi
      .fn()
      .mockResolvedValueOnce(pendingResponse)
      .mockResolvedValueOnce(pendingResponse)
      .mockResolvedValueOnce(jsonResponse(endeligRessurs));

    const onPollingMessage = vi.fn();

    const result = await runWithFakeTimers(pollLocation('http://localhost/poll', poll, onPollingMessage));

    expect(result).toEqual(endeligRessurs);
    expect(poll).toHaveBeenCalledTimes(3);
    expect(onPollingMessage).toHaveBeenCalledWith('Prosessering pågår...');
    // Siste kall skal sende undefined (polling ferdig)
    expect(onPollingMessage).toHaveBeenLastCalledWith(undefined);
  });

  it('bruker default intervall (1000ms) når pollIntervalMillis ikke er satt', async () => {
    const pendingUtenIntervall = jsonResponse({
      status: PENDING,
      message: 'Venter...',
      // pollIntervalMillis mangler — skal bruke default
    });
    const endeligRessurs = { id: 1 };

    const poll = vi
      .fn()
      .mockResolvedValueOnce(pendingUtenIntervall)
      .mockResolvedValueOnce(jsonResponse(endeligRessurs));

    const result = await runWithFakeTimers(pollLocation('http://localhost/poll', poll));

    expect(result).toEqual(endeligRessurs);
    expect(poll).toHaveBeenCalledTimes(2);
  });

  it('returnerer undefined ved COMPLETE-status', async () => {
    const poll = vi.fn().mockResolvedValueOnce(
      jsonResponse({
        status: COMPLETE,
        message: 'Ferdig',
      }),
    );
    const onPollingMessage = vi.fn();

    const result = await runWithFakeTimers(pollLocation('http://localhost/poll', poll, onPollingMessage));

    expect(result).toBeUndefined();
    expect(onPollingMessage).toHaveBeenCalledWith('Ferdig');
  });

  it('returnerer undefined ved CANCELLED-status', async () => {
    const poll = vi.fn().mockResolvedValueOnce(
      jsonResponse({
        status: CANCELLED,
        message: 'Avbrutt av bruker',
      }),
    );
    const onPollingMessage = vi.fn();

    const result = await runWithFakeTimers(pollLocation('http://localhost/poll', poll, onPollingMessage));

    expect(result).toBeUndefined();
    expect(onPollingMessage).toHaveBeenCalledWith('Avbrutt av bruker');
  });

  it('følger ny location ved DELAYED-status med location', async () => {
    const delayedMedLocation = jsonResponse({
      status: DELAYED,
      message: 'Forsinket, prøver ny URL',
      location: 'http://localhost/poll/ny-location',
    });
    const endeligRessurs = { id: 99 };

    const poll = vi.fn().mockResolvedValueOnce(delayedMedLocation).mockResolvedValueOnce(jsonResponse(endeligRessurs));

    const result = await runWithFakeTimers(pollLocation('http://localhost/poll', poll));

    expect(result).toEqual(endeligRessurs);
    expect(poll).toHaveBeenCalledTimes(2);
    // Andre kall skal bruke ny location
    expect(poll.mock.calls[1]![0]).toBe('http://localhost/poll/ny-location');
  });

  it('returnerer undefined ved DELAYED-status uten location', async () => {
    const poll = vi.fn().mockResolvedValueOnce(
      jsonResponse({
        status: DELAYED,
        message: 'Forsinket, ingen ny location',
      }),
    );

    const result = await runWithFakeTimers(pollLocation('http://localhost/poll', poll));

    expect(result).toBeUndefined();
  });

  it('følger ny location ved HALTED-status med location', async () => {
    const haltedMedLocation = jsonResponse({
      status: HALTED,
      message: 'Stoppet, ny URL',
      location: 'http://localhost/poll/halted-location',
    });
    const endeligRessurs = { id: 77 };

    const poll = vi.fn().mockResolvedValueOnce(haltedMedLocation).mockResolvedValueOnce(jsonResponse(endeligRessurs));

    const result = await runWithFakeTimers(pollLocation('http://localhost/poll', poll));

    expect(result).toEqual(endeligRessurs);
    expect(poll.mock.calls[1]![0]).toBe('http://localhost/poll/halted-location');
  });

  it('returnerer undefined ved HALTED-status uten location', async () => {
    const poll = vi.fn().mockResolvedValueOnce(
      jsonResponse({
        status: HALTED,
        message: 'Stoppet, ingen ny location',
      }),
    );

    const result = await runWithFakeTimers(pollLocation('http://localhost/poll', poll));

    expect(result).toBeUndefined();
  });

  it('returnerer undefined ved ikke-JSON content-type', async () => {
    const poll = vi.fn().mockResolvedValueOnce(nonJsonResponse());

    const result = await runWithFakeTimers(pollLocation('http://localhost/poll', poll));

    expect(result).toBeUndefined();
  });

  it('kaster feil ved maks antall forsøk', async () => {
    // Lager en poll som alltid returnerer PENDING
    const alwaysPending = jsonResponse({
      status: PENDING,
      message: 'Pågår...',
      pollIntervalMillis: 0,
    });
    const poll = vi.fn().mockResolvedValue(alwaysPending);

    await expect(runWithFakeTimers(pollLocation('http://localhost/poll', poll))).rejects.toThrow(
      'nådde maks antall forsøk (150)',
    );

    expect(poll).toHaveBeenCalledTimes(150);
  });

  it('avbryter polling når signal er aborted før start', async () => {
    const controller = new AbortController();
    controller.abort();

    const poll = vi.fn();

    const result = await runWithFakeTimers(pollLocation('http://localhost/poll', poll, undefined, controller.signal));

    expect(result).toBeUndefined();
    expect(poll).not.toHaveBeenCalled();
  });

  it('avbryter polling når signal aborteres under venting', async () => {
    const controller = new AbortController();

    const pendingResponse = jsonResponse({
      status: PENDING,
      message: 'Pågår...',
      pollIntervalMillis: 5000, // Lang ventetid
    });
    const poll = vi.fn().mockResolvedValue(pendingResponse);

    const promise = pollLocation('http://localhost/poll', poll, undefined, controller.signal);

    // La første poll fullføre
    await vi.advanceTimersByTimeAsync(0);

    // Abort under ventetiden
    controller.abort();

    // Avanserer forbi venteperioden slik at aborten oppdages
    await vi.advanceTimersByTimeAsync(6000);

    const result = await promise;

    expect(result).toBeUndefined();
    // Skal ha pollet én gang (PENDING), deretter abortert under wait
    expect(poll).toHaveBeenCalledTimes(1);
  });

  it('videresender signal til poll-funksjonen', async () => {
    const controller = new AbortController();
    const endeligRessurs = { id: 1 };
    const poll = vi.fn().mockResolvedValueOnce(jsonResponse(endeligRessurs));

    await runWithFakeTimers(pollLocation('http://localhost/poll', poll, undefined, controller.signal));

    expect(poll).toHaveBeenCalledWith('http://localhost/poll', controller.signal);
  });

  it('kaller onPollingMessage med undefined når endelig ressurs returneres', async () => {
    const poll = vi.fn().mockResolvedValueOnce(jsonResponse({ id: 1 }));
    const onPollingMessage = vi.fn();

    await runWithFakeTimers(pollLocation('http://localhost/poll', poll, onPollingMessage));

    expect(onPollingMessage).toHaveBeenCalledWith(undefined);
  });
});
