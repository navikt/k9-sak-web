import { usePrevious } from '@fpsak-frontend/shared-components';

const useBehandlingEndret = (behandlingId: number | undefined, behandlingVersjon: number | undefined): boolean => {
  const erBehandlingIdEndretFraUndefined = !usePrevious(behandlingId) && !!behandlingId;
  const erBehandlingVersjonEndretFraUndefined = !usePrevious(behandlingVersjon) && !!behandlingVersjon;
  return erBehandlingIdEndretFraUndefined || erBehandlingVersjonEndretFraUndefined;
};

export default useBehandlingEndret;
