import { useEffect } from 'react';

const useSetBehandlingVedEndring = (behandling, setBehandling) => {
  useEffect(() => {
    if (behandling) {
      setBehandling(behandling);
    }
  }, [behandling]);
};

export default useSetBehandlingVedEndring;
