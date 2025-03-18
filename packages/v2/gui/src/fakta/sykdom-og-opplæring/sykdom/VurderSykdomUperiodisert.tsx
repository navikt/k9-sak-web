import Vurderingsliste from './Vurderingsliste';
import { Heading } from '@navikt/ds-react';

const VurderSykdomUperiodisert = () => {
  return (
    <div>
      <Vurderingsliste />
      <div>
        <Heading size="small">Valgt vurdering</Heading>
      </div>
    </div>
  );
};

export default VurderSykdomUperiodisert;
