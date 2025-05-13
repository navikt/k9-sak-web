import NødvendigOpplæringFerdigvisning from './NødvendigOpplæringFerdigvisning';
import type { OpplæringVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import { Period } from '@navikt/ft-utils';
import NødvendigOpplæringForm from './NødvendigOpplæringForm';
import DetailView from '../../../shared/detailView/DetailView';
import { CalendarIcon, PencilIcon } from '@navikt/aksel-icons';
import { useEffect, useState, useContext } from 'react';
import { BodyShort, Button } from '@navikt/ds-react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';

const NødvendigOpplæringContainer = ({ vurdering }: { vurdering: OpplæringVurderingDto & { perioder: Period[] } }) => {
  const { readOnly, aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const harAksjonspunkt9302 = !!aksjonspunkter.find(akspunkt => akspunkt.definisjon.kode === '9302');
  const [redigering, setRedigering] = useState(false);
  useEffect(() => {
    setRedigering(false);
  }, [vurdering]);

  if (!readOnly && harAksjonspunkt9302 && (vurdering.resultat === 'MÅ_VURDERES' || redigering)) {
    return (
      <Wrapper vurdering={vurdering} setRedigering={setRedigering} redigering={redigering}>
        <NødvendigOpplæringForm vurdering={vurdering} setRedigering={setRedigering} redigering={redigering} />
      </Wrapper>
    );
  }

  return (
    <Wrapper vurdering={vurdering} setRedigering={setRedigering} redigering={redigering}>
      <NødvendigOpplæringFerdigvisning vurdering={vurdering} />
    </Wrapper>
  );
};

const Wrapper = ({
  children,
  vurdering,
  setRedigering,
  redigering,
}: {
  children: React.ReactNode;
  vurdering: OpplæringVurderingDto & { perioder: Period[] };
  setRedigering: React.Dispatch<React.SetStateAction<boolean>>;
  redigering: boolean;
}) => {
  const { readOnly } = useContext(SykdomOgOpplæringContext);
  const enkeltdag = vurdering.perioder[0]?.asListOfDays().length === 1;
  return (
    <DetailView
      title="Vurdering av nødvendig opplæring"
      contentAfterTitleRenderer={() => {
        if (vurdering.resultat === 'MÅ_VURDERES' || redigering || readOnly) {
          return null;
        }
        return (
          <Button variant="tertiary" size="small" icon={<PencilIcon />} onClick={() => setRedigering(v => !v)}>
            Rediger vurdering
          </Button>
        );
      }}
    >
      <div data-testid="Periode" className="flex gap-2">
        <CalendarIcon fontSize="20" />
        <BodyShort size="small">
          {enkeltdag
            ? vurdering.perioder[0]?.prettifyPeriod().split(' - ')[0]
            : vurdering.perioder[0]?.prettifyPeriod()}
        </BodyShort>
      </div>
      <div className="border-none bg-border-subtle h-[2px] mt-4" />
      <div className="mt-6">{children}</div>
    </DetailView>
  );
};

export default NødvendigOpplæringContainer;
