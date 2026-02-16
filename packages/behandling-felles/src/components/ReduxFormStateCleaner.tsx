import { getBehandlingFormPrefix } from '@fpsak-frontend/form';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import type { Action } from 'redux';
import { destroy } from 'redux-form';

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
}

const ReduxFormStateCleaner = ({ behandlingId, behandlingVersjon }: OwnProps) => {
  const dispatch = useDispatch();
  const ref = useRef<number>(undefined);

  useEffect(() => {
    if (ref.current && ref.current !== behandlingVersjon) {
      dispatch(destroy(getBehandlingFormPrefix(behandlingId, ref.current)) as unknown as Action);
    }
    ref.current = behandlingVersjon;
    return () => {
      dispatch(destroy(getBehandlingFormPrefix(behandlingId, ref.current)) as unknown as Action);
      dispatch(destroy(getBehandlingFormPrefix(behandlingId, behandlingVersjon)) as unknown as Action);
    };
  }, [behandlingVersjon]);

  return null;
};

export default ReduxFormStateCleaner;
