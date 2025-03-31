import NødvendigOpplæringFerdigvisning from './NødvendigOpplæringFerdigvisning';
import type { OpplæringVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import { Period } from '@navikt/ft-utils';
import NødvendigOpplæringForm from './NødvendigOpplæringForm';
import DetailView from '../../../shared/detail-view/DetailView';
import { CalendarIcon, PencilIcon } from '@navikt/aksel-icons';
import { useEffect, useState } from 'react';
import { Button } from '@navikt/ds-react';

const NødvendigOpplæringContainer = ({ vurdering }: { vurdering: OpplæringVurderingDto & { perioder: Period[] } }) => {
  const [redigerer, setRedigerer] = useState(false);
  useEffect(() => {
    setRedigerer(false);
  }, [vurdering]);

  if (vurdering.resultat === 'MÅ_VURDERES' || redigerer) {
    return (
      <Wrapper vurdering={vurdering} setRedigerer={setRedigerer} redigerer={redigerer}>
        <NødvendigOpplæringForm vurdering={vurdering} />
      </Wrapper>
    );
  }

  return (
    <Wrapper vurdering={vurdering} setRedigerer={setRedigerer} redigerer={redigerer}>
      <NødvendigOpplæringFerdigvisning vurdering={vurdering} />
    </Wrapper>
  );
};

const Wrapper = ({
  children,
  vurdering,
  setRedigerer,
  redigerer,
}: {
  children: React.ReactNode;
  vurdering: OpplæringVurderingDto & { perioder: Period[] };
  setRedigerer: React.Dispatch<React.SetStateAction<boolean>>;
  redigerer: boolean;
}) => {
  const enkeltdag = vurdering.perioder[0]?.asListOfDays().length === 1;
  return (
    <DetailView
      title="Vurdering av nødvendig opplæring"
      contentAfterTitleRenderer={() => {
        if (vurdering.resultat === 'MÅ_VURDERES') {
          return null;
        }
        return (
          <Button variant="tertiary" size="small" icon={<PencilIcon />} onClick={() => setRedigerer?.(v => !v)}>
            {redigerer ? 'Avbryt redigering uten å lagre' : 'Rediger vurdering'}
          </Button>
        );
      }}
    >
      <div data-testid="Periode" className="flex gap-2">
        <CalendarIcon />{' '}
        {enkeltdag ? vurdering.perioder[0]?.prettifyPeriod().split(' - ')[0] : vurdering.perioder[0]?.prettifyPeriod()}
      </div>
      <div className="border-none bg-border-subtle h-[2px] mt-4" />
      <div className="mt-6">{children}</div>
    </DetailView>
  );
};

export default NødvendigOpplæringContainer;
