import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { CalendarIcon, PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button } from '@navikt/ds-react';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { DetailView } from '../../../shared/detailView/DetailView';
import { harAksjonspunkt } from '../../../utils/aksjonspunktUtils.js';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import SykdomUperiodisertFerdigvisning from './SykdomUperiodisertFerdigvisning';
import SykdomUperiodisertForm, { type UperiodisertSykdom } from './SykdomUperiodisertForm';

const SykdomUperiodisertContainer = ({ vurdering }: { vurdering: UperiodisertSykdom }) => {
  const { readOnly, aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const [redigerer, setRedigerer] = useState(false);

  const harAksjonspunkt9301 = harAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_LANGVARIG_SYK);

  useEffect(() => {
    if (!vurdering.vurdertTidspunkt || !vurdering.kanOppdateres) {
      setRedigerer(false);
    }
  }, [vurdering]);

  useEffect(() => {
    if (redigerer) {
      setRedigerer(false);
    }
  }, [vurdering.uuid]);
  // Ferdigvisning hvis det er vurdert og vi skal redigere, eller ikke vurdert
  const visForm =
    !readOnly && ((redigerer && vurdering.vurdertTidspunkt) || (!vurdering.vurdertTidspunkt && harAksjonspunkt9301));
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
      contentAfterTitleRenderer={() => (
        <RedigerKnapp redigerer={redigerer} setRedigerer={setRedigerer} vurdering={vurdering} />
      )}
      belowTitleContent={perioder}
    >
      <div className="mt-6">
        {visForm ? (
          <SykdomUperiodisertForm vurdering={vurdering} setRedigerer={setRedigerer} redigerer={redigerer} />
        ) : (
          <SykdomUperiodisertFerdigvisning vurdering={vurdering} />
        )}
      </div>
    </DetailView>
  );
};

const RedigerKnapp = ({
  redigerer,
  setRedigerer,
  vurdering,
}: {
  redigerer: boolean;
  setRedigerer: (redigerer: boolean) => void;
  vurdering: UperiodisertSykdom;
}) => {
  const { readOnly, aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const harAksjonspunkt9301 = harAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_LANGVARIG_SYK);

  if (redigerer || !vurdering.kanOppdateres || readOnly || !harAksjonspunkt9301) {
    return null;
  }
  // Vi kan kun redigere vurderinger som er opprettet i samme behandling som vi er i
  return (
    <div className="float-right">
      <Button size="small" variant="tertiary" icon={<PencilIcon />} onClick={() => setRedigerer(!redigerer)}>
        Rediger vurdering
      </Button>
    </div>
  );
};

export default SykdomUperiodisertContainer;
