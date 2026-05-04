import { MerknadType } from '@k9-sak-web/backend/k9sak/kodeverk/produksjonsstyring/MerknadType.js';
import type { MerknadResponse } from '@k9-sak-web/backend/k9sak/kontrakt/los/MerknadResponse.js';
import { goToLos, goToSearch } from '@k9-sak-web/lib/paths/paths.js';
import { TrashIcon } from '@navikt/aksel-icons';
import { Bleed, BodyShort, Box, Button, Heading, HStack, List, Loader, Modal, VStack } from '@navikt/ds-react';
import { RhfForm, RhfSelect, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import type { MarkerBehandlingBackendApi } from '../MarkerBehandlingBackendApi';
import styles from './markerBehandlingModal.module.css';

const minLength3 = minLength(3);
const maxLength100000 = maxLength(100000);

interface PureOwnProps {
  lukkModal: () => void;
  behandlingUuid: string;
  erVeileder?: boolean;
  api: MarkerBehandlingBackendApi;
}

interface FormValues {
  merknad: string;
  begrunnelse: string;
}

/**
 * Hastesak og utenlandssak kan markeres manuelt.
 * Direkte utbetaling markeres kun maskinelt.
 */
const getMerknader = (merknader: MerknadResponse): MerknadType[] => {
  const ubrukteMerknader: MerknadType[] = [];

  if (!merknader.hastesak.aktiv) {
    ubrukteMerknader.push(MerknadType.HASTESAK);
  }
  if (!merknader.utenlandssak.aktiv) {
    ubrukteMerknader.push(MerknadType.UTENLANDSSAK);
  }
  return ubrukteMerknader;
};

const getGjeldendeMerknader = (merknader: MerknadResponse) => {
  interface Merknad {
    tittel: string;
    begrunnelse: string;
    merknadKode: MerknadType;
  }

  const gjeldendeMerknader: Merknad[] = [];
  if (merknader.hastesak.aktiv) {
    gjeldendeMerknader.push({
      tittel: 'Hastesak',
      begrunnelse: merknader.hastesak.fritekst ?? '',
      merknadKode: MerknadType.HASTESAK,
    });
  }
  if (merknader.utenlandssak.aktiv) {
    gjeldendeMerknader.push({
      tittel: 'Utenlandssak',
      begrunnelse: merknader.utenlandssak.fritekst ?? '',
      merknadKode: MerknadType.UTENLANDSSAK,
    });
  }
  return gjeldendeMerknader;
};

const MarkerBehandlingModal: React.FC<PureOwnProps> = ({ lukkModal, behandlingUuid, erVeileder, api }) => {
  const {
    data: merknaderFraLos,
    refetch: hentMerknader,
    isFetching,
  } = useQuery({
    queryKey: ['merknader', behandlingUuid],
    queryFn: async () => {
      const data = await api.getMerknader(behandlingUuid);
      return data ?? null;
    },
  });

  const tilgjengeligeMerknader = merknaderFraLos ? getMerknader(merknaderFraLos) : [];
  const buildInitialValues = (): FormValues => {
    return {
      merknad: '',
      begrunnelse: '',
    };
  };

  const formMethods = useForm<FormValues>({ defaultValues: buildInitialValues() });
  const formState = useFormState({ control: formMethods.control });
  const valgtMerknad = useWatch({ control: formMethods.control, name: 'merknad' });

  const handleSubmit = async (values: FormValues) => {
    if (values.merknad) {
      await api.markerBehandling({
        behandlingUuid,
        fritekst: values.begrunnelse ?? '',
        merknadKode: values.merknad as MerknadType,
      });
      if (erVeileder) {
        goToSearch();
      } else {
        goToLos();
      }
    }
  };

  const slettMerknad = async (merknadKode: MerknadType) => {
    await api.fjernMerknad({
      behandlingUuid,
      merknadKode,
    });
    await hentMerknader();
  };

  const gjeldendeMerknader = merknaderFraLos ? getGjeldendeMerknader(merknaderFraLos) : [];

  return (
    <Modal open onClose={lukkModal} aria-label="Modal for markering av behandling" width="38.375rem">
      <Modal.Header>
        <Heading as="h3" size="small">
          Marker behandling og send til egen kø
        </Heading>
      </Modal.Header>
      <Modal.Body>
        {isFetching ? (
          <Loader size="medium" title="Henter merknader..." />
        ) : (
          <VStack gap="space-16">
            {gjeldendeMerknader.length > 0 && (
              <div>
                <Heading size="xsmall" level="4" spacing>
                  Gjeldende merknader
                </Heading>
                <Box marginBlock="space-12" asChild>
                  <List data-aksel-migrated-v8 as="ul" size="small">
                    {gjeldendeMerknader.map(merknad => (
                      <List.Item title={merknad.tittel} key={merknad.tittel}>
                        <HStack gap="space-48" align="center" justify="space-between">
                          <BodyShort size="small">{merknad.begrunnelse}</BodyShort>
                          <Bleed marginBlock="space-4 space-0">
                            <Button
                              type="button"
                              onClick={() => slettMerknad(merknad.merknadKode)}
                              variant="tertiary"
                              size="small"
                              icon={<TrashIcon fontSize="1.5rem" title="Slett merknad" />}
                            />
                          </Bleed>
                        </HStack>
                      </List.Item>
                    ))}
                  </List>
                </Box>
              </div>
            )}
            <RhfForm<FormValues> formMethods={formMethods} onSubmit={handleSubmit}>
              <VStack gap="space-24">
                <VStack gap="space-16">
                  <RhfSelect
                    control={formMethods.control}
                    name="merknad"
                    label="Velg ny merknad"
                    selectValues={tilgjengeligeMerknader.map(merknad => {
                      let label = merknad.charAt(0) + merknad.slice(1).toLowerCase();
                      if (merknad === MerknadType.UTENLANDSSAK) {
                        label = 'Utenlandssak';
                      }
                      return (
                        <option key={merknad} value={merknad}>
                          {label}
                        </option>
                      );
                    })}
                  />
                  {valgtMerknad && (
                    <RhfTextarea
                      control={formMethods.control}
                      name="begrunnelse"
                      label="Kommentar"
                      validate={[required, minLength3, maxLength100000, hasValidText]}
                      maxLength={100000}
                    />
                  )}
                </VStack>
                <div className={styles.buttonContainer}>
                  <Button
                    variant="primary"
                    size="small"
                    disabled={formState.isSubmitting}
                    loading={formState.isSubmitting}
                  >
                    {erVeileder ? 'Lagre, gå til forsiden' : 'Lagre, gå til LOS'}
                  </Button>
                  <Button variant="secondary" size="small" onClick={lukkModal}>
                    Lukk
                  </Button>
                </div>
              </VStack>
            </RhfForm>
          </VStack>
        )}
      </Modal.Body>
    </Modal>
  );
};
export default MarkerBehandlingModal;
