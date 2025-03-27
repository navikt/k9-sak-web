import { DetailView } from '@navikt/ft-plattform-komponenter';
import type { ReisetidPeriodeVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import { Form } from '@navikt/ft-form-hooks';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from '@navikt/aksel-icons';
import type { Period } from '@navikt/ft-utils';
import { Button } from '@navikt/ds-react';
import { useContext } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';

interface ReisetidFormProps {
  vurdering: ReisetidPeriodeVurderingDto & { perioder: Period[] };
}

const ReisetidForm = ({ vurdering }: ReisetidFormProps) => {
  const { løsAksjonspunkt9302 } = useContext(SykdomOgOpplæringContext);
  const formMethods = useForm<{
    begrunnelse: string;
  }>({
    defaultValues: {
      begrunnelse: vurdering.begrunnelse,
    },
  });

  return (
    <>
      <DetailView title="Reisetid">
        <div data-testid="Periode" className="flex items-center gap-2">
          {vurdering.perioder.length > 0 && (
            <>
              <CalendarIcon height={24} width={24} />{' '}
              <span>{vurdering.perioder.map(p => p.prettifyPeriod()).join(', ')}</span>
            </>
          )}
        </div>
        <div className="border-none bg-border-default h-px mt-4" />
        <div className="mt-6">
          <Form
            formMethods={formMethods}
            onSubmit={data => {
              // Add form submission logic here
            }}
          >
            <div className="flex flex-col gap-6">
              <div>
                <Button variant="primary" type="submit">
                  Bekreft og fortsett
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </DetailView>
    </>
  );
};

export default ReisetidForm;
