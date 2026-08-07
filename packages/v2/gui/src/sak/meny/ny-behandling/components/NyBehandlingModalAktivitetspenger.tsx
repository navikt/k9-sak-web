import { BehandlingType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingType.js';
import type { KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import { Box, Button, HStack, Modal, VStack } from '@navikt/ds-react';
import { RhfForm, RhfSelect } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';
import { getBehandlingTyper, getEnabledBehandlingstyper, type BehandlingOppretting } from './NyBehandlingModal';

export type FormValues = {
  behandlingType: string;
  vilkårRevurdering: string;
};

interface Props {
  behandlingstyper: KodeverkObject[];
  behandlingOppretting: BehandlingOppretting[];
  cancelEvent: () => void;
  kanTilbakekrevingOpprettes: {
    kanBehandlingOpprettes: boolean;
    kanRevurderingOpprettes: boolean;
  };
  submitCallback: (data: { behandlingArsakType: string; behandlingType: string }) => Promise<void>;
}

const createOptions = (bt: KodeverkObject, enabledBehandlingstyper: KodeverkObject[]) => {
  const navn = bt.kode === BehandlingType.REVURDERING ? 'Manuell revurdering med opphør/avslag' : bt.navn;

  const isEnabled = enabledBehandlingstyper.some(b => b.kode === bt.kode);
  return <option key={bt.kode} value={bt.kode} disabled={!isEnabled}>{` ${navn} `}</option>;
};

const getÅrsakLabel = (årsak: string) => {
  if (årsak === 'ENDRET-BOSTED') {
    return '§2 - Ikke bosatt i Trondheim';
  }
  return årsak;
};

export const NyBehandlingModalAktivitetspenger = ({
  cancelEvent,
  behandlingstyper,
  submitCallback,
  behandlingOppretting,
  kanTilbakekrevingOpprettes,
}: Props) => {
  const handleSubmit = async (formValues: FormValues) => {
    await submitCallback({
      behandlingArsakType: formValues.vilkårRevurdering,
      behandlingType: formValues.behandlingType,
    });
  };
  const formMethods = useForm<FormValues>({
    defaultValues: {
      behandlingType: '',
      vilkårRevurdering: '',
    },
  });

  const behandlingTyper = getBehandlingTyper(behandlingstyper);
  const enabledBehandlingstyper = getEnabledBehandlingstyper(
    behandlingstyper,
    behandlingOppretting,
    kanTilbakekrevingOpprettes,
  );
  const isRevurdering = formMethods.watch('behandlingType') === BehandlingType.REVURDERING;
  const årsakerTilRevurdering = behandlingOppretting
    .find(bo => bo.behandlingType === BehandlingType.REVURDERING)
    ?.gyldigePerioderPerÅrsak?.map(g => g.årsak);
  return (
    <Modal
      open
      aria-label="Ny behandling"
      onClose={cancelEvent}
      header={{
        heading: 'Opprett ny behandling',
        size: 'small',
      }}
    >
      <RhfForm<FormValues> formMethods={formMethods} onSubmit={handleSubmit}>
        <Modal.Body>
          <Box width="55ch">
            <VStack gap="space-20">
              <RhfSelect
                control={formMethods.control}
                name="behandlingType"
                label="Hva slags behandling ønsker du å opprette?"
                validate={[required]}
                selectValues={behandlingTyper.map(bt => createOptions(bt, enabledBehandlingstyper))}
              />
              {isRevurdering && (
                <RhfSelect
                  control={formMethods.control}
                  name="vilkårRevurdering"
                  label="Vilkår som skal føre til opphør eller avslag"
                  validate={[required]}
                  selectValues={(årsakerTilRevurdering || []).map(årsak => (
                    <option key={årsak} value={årsak}>
                      {getÅrsakLabel(årsak)}
                    </option>
                  ))}
                />
              )}
            </VStack>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <HStack gap="space-8" justify="end">
            <Button variant="secondary" type="button" size="small" onClick={cancelEvent}>
              Avbryt
            </Button>
            <Button
              variant="primary"
              size="small"
              loading={formMethods.formState.isSubmitting}
              disabled={formMethods.formState.isSubmitting}
            >
              Opprett behandling
            </Button>
          </HStack>
        </Modal.Footer>
      </RhfForm>
    </Modal>
  );
};
