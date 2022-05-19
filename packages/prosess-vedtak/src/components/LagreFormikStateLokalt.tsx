import { useFormikContext } from 'formik';
import { useEffect, useContext } from 'react';
import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';

export default function LagreFormikStateLokalt() {
  const vedtakContext = useContext(VedtakFormContext);
  const { values } = useFormikContext();
  useEffect(
    () => () => {
      vedtakContext?.setVedtakFormState(values);
    },
    [values],
  );
  return null;
}
