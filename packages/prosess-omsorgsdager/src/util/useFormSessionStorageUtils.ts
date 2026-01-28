import { debounce } from '@k9-sak-web/gui/utils/debounce.js';
import { useCallback, useEffect, useRef } from 'react';
import { Path, UseFormGetValues, UseFormSetValue, UseFormWatch } from 'react-hook-form';

// Brukes for midlertidig mellomlagring av input fra saksbehandlare som ett global objekt i k9-sak-web.
export const BrukFormSesjonslagring = <TFormData extends Record<string, unknown>>(
  formStateKey: string,
  formState,
  watch: UseFormWatch<TFormData>,
  setValue: UseFormSetValue<TFormData>,
  lesemodus: boolean,
  åpenForRedigering: boolean,
  getValues: UseFormGetValues<TFormData>,
) => {
  watch();
  const stateSlettet = useRef(false);
  const settState = () => {
    if (!stateSlettet.current) formState.setState(formStateKey, getValues());
  };
  const sendDataTilFormState = useCallback(debounce(settState, 2000), []);

  useEffect(() => {
    const data = formState.getState(formStateKey);
    if (data) {
      if (!data) return;
      setValue('åpenForRedigering' as Path<TFormData>, data.åpenForRedigering);
      if ((lesemodus && getValues().åpenForRedigering) || !lesemodus) {
        Object.keys(data).forEach(key => {
          setValue(key as Path<TFormData>, data[key]);
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
