import { FormikValues, useFormikContext } from 'formik';
import { useEffect, useContext } from 'react';

import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { fieldnames } from '../konstanter';

const LagreFormikStateLokalt = () => {
  const vedtakContext = useContext(VedtakFormContext);

  const { values }: { values: FormikValues } = useFormikContext();

  // Per nå er det ønskelig å beholde alle verdiene ved navigasjon
  const verdierSomIkkeSkalBeholdesVedNavigasjonVekkFraVedtak = [];

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
};

export default LagreFormikStateLokalt;
