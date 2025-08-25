import NødvendigOpplæringFerdigvisning from './NødvendigOpplæringFerdigvisning';
import type { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringVurderingDto as OpplæringVurderingDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { Period } from '@navikt/ft-utils';
import NødvendigOpplæringForm from './NødvendigOpplæringForm';
import DetailView from '../../../shared/detailView/DetailView';
import { PencilIcon } from '@navikt/aksel-icons';
import { useEffect, useState, useContext } from 'react';
import { Button } from '@navikt/ds-react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { harAksjonspunkt } from '../../../utils/aksjonspunktUtils.js';

const NødvendigOpplæringContainer = ({ vurdering }: { vurdering: OpplæringVurderingDto & { perioder: Period[] } }) => {
  const { readOnly, aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const harAksjonspunkt9302 = harAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_OPPLÆRING);
  const [redigerer, setRedigerer] = useState(false);
  useEffect(() => {
    setRedigerer(false);
  }, [vurdering.perioder]);

  if (!readOnly && harAksjonspunkt9302 && (vurdering.resultat === 'MÅ_VURDERES' || redigerer)) {
    return (
      <Wrapper vurdering={vurdering} setRedigerer={setRedigerer} redigerer={redigerer}>
        <NødvendigOpplæringForm vurdering={vurdering} setRedigerer={setRedigerer} redigerer={redigerer} />
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
  const { readOnly, aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const harAksjonspunkt9302 = harAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_OPPLÆRING);
  return (
    <DetailView
      title="Dokumentasjon"
      border
      contentAfterTitleRenderer={() => {
        if (vurdering.resultat === 'MÅ_VURDERES' || redigerer || readOnly || !harAksjonspunkt9302) {
          return null;
        }
        return (
          <Button variant="tertiary" size="small" icon={<PencilIcon />} onClick={() => setRedigerer(v => !v)}>
            Rediger vurdering
          </Button>
        );
      }}
      perioder={vurdering.perioder}
    >
      <div className="mt-6">{children}</div>
    </DetailView>
  );
};

export default NødvendigOpplæringContainer;
