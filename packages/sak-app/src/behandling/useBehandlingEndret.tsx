import { usePrevious } from '@fpsak-frontend/shared-components';

const useBehandlingEndret = (behandlingId: number, behandlingVersjon: number): boolean => {
  const erBehandlingIdEndretFraUndefined = !usePrevious(behandlingId) && !!behandlingId;
  const erBehandlingVersjonEndretFraUndefined = !usePrevious(behandlingVersjon) && !!behandlingVersjon;
  return erBehandlingIdEndretFraUndefined || erBehandlingVersjonEndretFraUndefined;
};

export default useBehandlingEndret;
