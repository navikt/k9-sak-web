import dayjs from 'dayjs';
import SykdomUperiodisertForm, { type UperiodisertSykdom } from './SykdomUperiodisertForm';
import { CalendarIcon } from '@navikt/aksel-icons';
import { DetailView, EditIcon } from '@navikt/ft-plattform-komponenter';
import { useState } from 'react';
import { Button } from '@navikt/ds-react';
import SykdomUperiodisertFerdigvisning from './SykdomUperiodisertFerdigvisning';

export const SykdomUperiodisertFormContainer = ({ vurdering }: { vurdering: UperiodisertSykdom }) => {
  const [redigering, setRedigering] = useState(false);
  // Ferdigvisning hvis det er vurdert og vi skal redigere, eller ikke vurdert
  const visForm = (redigering && vurdering.vurderingsdato) || !vurdering.vurderingsdato;
  return (
    <DetailView
      title="Vurdering av sykdom"
      contentAfterTitleRenderer={() => (
        <div className="min-w-[475px] flex justify-end">
          <Button
            size="small"
            className=""
            variant="tertiary"
            icon={<EditIcon />}
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
        {visForm ? <SykdomUperiodisertForm vurdering={vurdering} /> : <SykdomUperiodisertFerdigvisning />}
      </div>
    </DetailView>
  );
};
