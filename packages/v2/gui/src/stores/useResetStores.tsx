// clean all zustand stores
import { useAvregningFormState } from './AvregningFormStore';
import { useEffect, useRef } from 'react';

export const useResetStores = (behandlingId: number | undefined) => {
  const { reset: resetAvregningForm } = useAvregningFormState();
  const ref = useRef<number | undefined>(behandlingId);
  useEffect(() => {
    if (ref.current && ref.current !== behandlingId) {
      resetAvregningForm();
    }
    ref.current = behandlingId;
    return () => {
      resetAvregningForm();
    };
  }, [behandlingId, resetAvregningForm]);
};
