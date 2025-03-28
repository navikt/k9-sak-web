import dayjs from 'dayjs';
import SykdomUperiodisertForm, { type UperiodisertSykdom } from './SykdomUperiodisertForm';
import { CalendarIcon, PencilIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { Button } from '@navikt/ds-react';
import SykdomUperiodisertFerdigvisning from './SykdomUperiodisertFerdigvisning';
import { DetailViewV2 } from '../../../shared/DetailView/DetailView';

export const SykdomUperiodisertFormContainer = ({ vurdering }: { vurdering: UperiodisertSykdom }) => {
  const [redigering, setRedigering] = useState(false);
  // Ferdigvisning hvis det er vurdert og vi skal redigere, eller ikke vurdert
  const visForm = (redigering && vurdering.vurderingsdato) || !vurdering.vurderingsdato;
  return (
    <DetailViewV2
      title="Vurdering av sykdom"
      contentAfterTitleRenderer={() => (
        <div className="float-right">
          <Button
            size="small"
            className=""
            variant="tertiary"
            icon={<PencilIcon />}
            onClick={() => setRedigering(!redigering)}
          >
            Rediger
          </Button>
        </div>
      )}
    >
      <div data-testid="Periode" className="flex items-center gap-2">
        {vurdering.vurderingsdato && (
          <>
            <div className="flex my-auto gap-2">
              <CalendarIcon height={24} width={24} />{' '}
              <span>{dayjs(vurdering.vurderingsdato).format('DD.MM.YYYY')}</span>
            </div>
          </>
        )}
      </div>
      <div className="border-none bg-border-default h-px mt-4" />
      <div className="mt-6">
        {visForm ? (
          <SykdomUperiodisertForm vurdering={vurdering} />
        ) : (
          <SykdomUperiodisertFerdigvisning vurdering={vurdering} />
        )}
      </div>
    </DetailViewV2>
  );
};
