import { FormikValues, useFormikContext } from 'formik';
import { useEffect, useContext } from 'react';

import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { fieldnames } from '../konstanter';

const verdierSomSkalNullstilles = [
  fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV,
  fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV,
  fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING,
];
export const filtrerVerdierSomSkalNullstilles = vedtakForm =>
  Object.keys(vedtakForm)
    .filter(key => !verdierSomSkalNullstilles.includes(key))
    .reduce((obj, key) => ({ ...obj, [key]: vedtakForm[key] }), {});

export const settMalerVedtakContext = (vedtakContext, maler) => {
  const nyVedtakState = { ...vedtakContext, maler };

  if (JSON.stringify(maler) !== JSON.stringify(vedtakContext.vedtakFormState?.maler)) {
    vedtakContext?.setVedtakFormState(nyVedtakState);
  }
};

const LagreVedtakFormIContext = () => {
  const vedtakContext = useContext(VedtakFormContext);

  const { values }: { values: FormikValues } = useFormikContext();
  const nyVedtakState = { ...values, maler: vedtakContext.vedtakFormState?.maler };
  useEffect(
    () => () => {
      if (JSON.stringify(nyVedtakState) !== JSON.stringify(vedtakContext.vedtakFormState)) {
        vedtakContext?.setVedtakFormState(nyVedtakState);
      }
    },
    [nyVedtakState, vedtakContext.vedtakFormState],
  );

  return null;
};

export default LagreVedtakFormIContext;
