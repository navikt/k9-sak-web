import { useCallback, useEffect, useRef } from 'react';
import throttle from 'lodash.throttle';

// Brukes for midlertidig mellomlagring av input fra saksbehandlare som ett global objekt i k9-sak-web.
export const BrukFormSesjonslagring = (
  formStateKey: string,
  formState,
  watch,
  setValue,
  lesemodus: boolean,
  åpenForRedigering: boolean,
  getValues,
) => {
  watch();
  const stateSlettet = useRef(false);
  const settState = () => {
    if (!stateSlettet.current) formState.setState(formStateKey, getValues());
  };
  const sendDataTilFormState = useCallback(throttle(settState, 2000), []);

  useEffect(() => {
    const data = formState.getState(formStateKey);
    if (data) {
      if (!data) return;
      setValue('åpenForRedigering', data.åpenForRedigering);
      if ((lesemodus && getValues().åpenForRedigering) || !lesemodus) {
        Object.keys(data).forEach(key => {
          setValue(key, data[key]);
        });
      }
    }
  }, []);

  useEffect(() => {
    if ((lesemodus && getValues().åpenForRedigering) || !lesemodus) {
      sendDataTilFormState();
    }
  });

  return {
    fjerneState: () => {
      stateSlettet.current = true;
      return formState.deleteState(formStateKey);
    },
    fjerneDataTilknyttetBehandling: behandlingsID => {
      formState.deleteState(formStateKey);
      formState.deleteState(`${behandlingsID}-utvidetrett-ks`);
      formState.deleteState(`${behandlingsID}-utvidetrett-ma`);
    },
  };
};

export default BrukFormSesjonslagring;
