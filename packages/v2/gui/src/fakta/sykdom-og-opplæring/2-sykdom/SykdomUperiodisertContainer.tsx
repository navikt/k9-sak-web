import dayjs from 'dayjs';
import SykdomUperiodisertForm, { type UperiodisertSykdom } from './SykdomUperiodisertForm';
import { CalendarIcon, PencilIcon } from '@navikt/aksel-icons';
import { useContext, useEffect, useState } from 'react';
import { Button, BodyShort } from '@navikt/ds-react';
import SykdomUperiodisertFerdigvisning from './SykdomUperiodisertFerdigvisning';
import { DetailView } from '../../../shared/detailView/DetailView';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';

const SykdomUperiodisertContainer = ({ vurdering }: { vurdering: UperiodisertSykdom }) => {
  const { readOnly, behandlingUuid, aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const [redigering, setRedigering] = useState(false);

  const harAksjonspunkt9301 = !!aksjonspunkter.find(akspunkt => akspunkt.definisjon.kode === '9301');

  useEffect(() => {
    if (!vurdering.vurdertTidspunkt || vurdering.behandlingUuid !== behandlingUuid) {
      setRedigering(false);
    }
  }, [vurdering, behandlingUuid]);
  // Ferdigvisning hvis det er vurdert og vi skal redigere, eller ikke vurdert
  const visForm =
    !readOnly && ((redigering && vurdering.vurdertTidspunkt) || (!vurdering.vurdertTidspunkt && harAksjonspunkt9301));
  const perioder = (
    <div data-testid="Periode" className="flex gap-2">
      <CalendarIcon fontSize="20" />
      <BodyShort size="small">{dayjs(vurdering.vurdertTidspunkt).format('DD.MM.YYYY')}</BodyShort>
    </div>
  );
  return (
    <DetailView
      title="Vurdering av sykdom"
      border
      contentAfterTitleRenderer={() =>
        !readOnly &&
        harAksjonspunkt9301 && (
          <RedigerKnapp redigering={redigering} setRedigering={setRedigering} vurdering={vurdering} />
        )
      }
      belowTitleContent={perioder}
    >
      <div className="mt-6">
        {visForm ? (
          <SykdomUperiodisertForm vurdering={vurdering} setRedigering={setRedigering} redigering={redigering} />
        ) : (
          <SykdomUperiodisertFerdigvisning vurdering={vurdering} />
        )}
      </div>
    </DetailView>
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

export default SykdomUperiodisertContainer;
