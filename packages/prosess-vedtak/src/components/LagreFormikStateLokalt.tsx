import { FormikValues, useFormikContext } from 'formik';
import { useEffect, useContext } from 'react';

import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { fieldnames } from '../konstanter';

export default function LagreFormikStateLokalt() {
  const vedtakContext = useContext(VedtakFormContext);

  const { values }: { values: FormikValues } = useFormikContext();
  const verdierSomSkalBeholdesVedNavigasjonVekkFraVedtak = [
    fieldnames.OVERSKRIFT,
    fieldnames.BRØDTEKST,
    fieldnames.OVERSTYRT_MOTTAKER,
    fieldnames.BEGRUNNELSE,
  ];
  useEffect(
    () => () => {
      vedtakContext?.setVedtakFormState(
        Object.keys(values)
          .filter(key => verdierSomSkalBeholdesVedNavigasjonVekkFraVedtak.includes(key))
          .reduce((obj, key) => ({ ...obj, [key]: values[key] }), {}),
      );
    },
    [values],
  );

  return null;
}
