import dayjs from 'dayjs';
import SykdomUperiodisertForm, { type UperiodisertSykdom } from './SykdomUperiodisertForm';
import { CalendarIcon, PencilIcon } from '@navikt/aksel-icons';
import { useContext, useEffect, useState } from 'react';
import { Button } from '@navikt/ds-react';
import SykdomUperiodisertFerdigvisning from './SykdomUperiodisertFerdigvisning';
import { DetailViewV2 } from '../../../shared/detail-view/DetailView';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';

const SykdomUperiodisertFormContainer = ({ vurdering }: { vurdering: UperiodisertSykdom }) => {
  const { readOnly } = useContext(SykdomOgOpplæringContext);
  const [redigering, setRedigering] = useState(false);

  useEffect(() => {
    if (vurdering) {
      setRedigering(false);
    }
  }, [vurdering]);
  // Ferdigvisning hvis det er vurdert og vi skal redigere, eller ikke vurdert
  const visForm = (redigering && vurdering.vurdertTidspunkt) || !vurdering.vurdertTidspunkt;
  return (
    <DetailViewV2
      title="Vurdering av sykdom"
      contentAfterTitleRenderer={() =>
        !readOnly && <RedigerKnapp redigering={redigering} setRedigering={setRedigering} vurdering={vurdering} />
      }
    >
      <div data-testid="Periode" className="flex items-center gap-2">
        {vurdering.vurdertTidspunkt && (
          <>
            <div className="flex my-auto gap-2">
              <CalendarIcon height={24} width={24} />{' '}
              <span>{dayjs(vurdering.vurdertTidspunkt).format('DD.MM.YYYY')}</span>
            </div>
          </>
        )}
      </div>
      <div className="border-none bg-border-subtle h-[2px] mt-4" />
      <div className="mt-6">
        {visForm ? (
          <SykdomUperiodisertForm vurdering={vurdering} setRedigering={setRedigering} redigering={redigering} />
        ) : (
          <SykdomUperiodisertFerdigvisning vurdering={vurdering} />
        )}
      </div>
    </DetailViewV2>
  );
};

const RedigerKnapp = ({
  redigering,
  setRedigering,
  vurdering,
}: {
  redigering: boolean;
  setRedigering: (redigering: boolean) => void;
  vurdering: UperiodisertSykdom;
}) => {
  const { behandlingUuid } = useContext(SykdomOgOpplæringContext);

  // Vi kan kun redigere vurderinger som er opprettet i samme behandling som vi er i
  if (behandlingUuid !== vurdering.behandlingUuid) {
    return null;
  }
  return (
    <div className="float-right">
      {!redigering && (
        <Button size="small" variant="tertiary" icon={<PencilIcon />} onClick={() => setRedigering(!redigering)}>
          Rediger vurdering
        </Button>
      )}
    </div>
  );
};

export default SykdomUperiodisertFormContainer;
