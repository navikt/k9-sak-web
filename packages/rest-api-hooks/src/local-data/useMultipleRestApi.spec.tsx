import { AbstractRequestApi } from '@k9-sak-web/rest-api';
import { act, renderHook, waitFor } from '@testing-library/react';
import RestApiState from '../RestApiState';
import getUseMultipleRestApi from './useMultipleRestApi';

describe('useMultipleRestApi', () => {
  it('skal ikke la svar fra et utdatert kall overskrive svar fra et nyere kall', async () => {
    let avvisFørsteKall: (error: Error) => void = () => undefined;
    const førsteKall = new Promise((_resolve, reject) => {
      avvisFørsteKall = reject;
    });
    const startRequest = vi
      .fn()
      .mockReturnValueOnce(førsteKall)
      .mockReturnValueOnce(Promise.resolve({ payload: 'nye data' }));
    const requestApi = { hasPath: () => true, startRequest } as unknown as AbstractRequestApi;
    const useMultipleRestApi = getUseMultipleRestApi(requestApi);

    const { result, rerender } = renderHook(
      ({ trigger }) => useMultipleRestApi<{ test: string }>([{ key: 'TEST' }], { updateTriggers: [trigger] }),
      { initialProps: { trigger: 1 } },
    );

    rerender({ trigger: 2 });
    await waitFor(() => expect(result.current.state).toEqual(RestApiState.SUCCESS));

    await act(async () => {
      avvisFørsteKall(new Error('utdatert'));
      await førsteKall.catch(() => undefined);
    });

    expect(result.current.state).toEqual(RestApiState.SUCCESS);
    expect(result.current.data).toEqual({ test: 'nye data' });
  });
});
