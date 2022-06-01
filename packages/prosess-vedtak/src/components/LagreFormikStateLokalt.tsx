import { FormikValues, useFormikContext } from 'formik';
import { useEffect, useContext } from 'react';

import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { fieldnames } from '../konstanter';

export default function LagreFormikStateLokalt() {
  const vedtakContext = useContext(VedtakFormContext);

  const { values }: { values: FormikValues } = useFormikContext();
  const verdierSomIkkeSkalBeholdesVedNavigasjonVekkFraVedtak = [
    fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV,
    fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING,
    fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV,
  ];
  useEffect(
    () => () => {
      vedtakContext?.setVedtakFormState(
        Object.keys(values)
          .filter(key => !verdierSomIkkeSkalBeholdesVedNavigasjonVekkFraVedtak.includes(key))
          .reduce((obj, key) => ({ ...obj, [key]: values[key] }), {}),
      );
    },
    [values],
  );

  return null;
}
