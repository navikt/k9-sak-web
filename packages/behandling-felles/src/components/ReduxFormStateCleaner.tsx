import { useEffect, useRef } from 'react';
import { destroy } from 'redux-form';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';

import { getBehandlingFormPrefix } from '@fpsak-frontend/form';

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
}

const ReduxFormStateCleaner = ({ behandlingId, behandlingVersjon }: OwnProps) => {
  const dispatch = useDispatch();
  const ref = useRef<number>();

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
