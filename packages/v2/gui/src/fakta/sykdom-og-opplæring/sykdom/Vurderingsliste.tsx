import { Heading } from '@navikt/ds-react';
import { InteractiveList } from '@navikt/ft-plattform-komponenter';

const Vurderingsliste = () => {
  const elements = [
    {
      id: '1',
      label: 'Vurdering 1',
      description: 'Vurdering 1',
    },
  ];
  return (
    <div>
      <Heading size="xsmall">Alle perioder</Heading>

      <div>
        <div>Status</div>
        <div>Periode</div>
      </div>

      {elements.length === 0 && <p>Ingen vurderinger å vise</p>}

      {elements.length > 0 && (
        <div>
          <InteractiveList elements={[]} />
        </div>
      )}
    </div>
  );
};

export default Vurderingsliste;
