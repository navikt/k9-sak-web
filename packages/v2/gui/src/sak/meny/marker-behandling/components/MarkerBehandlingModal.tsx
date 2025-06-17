// import { MerknadEndretDtoMerknadKode } from '@k9-sak-web/backend/k9sak/generated';
import { EndreMerknadRequestMerknadKode, type MerknadResponse } from '@k9-sak-web/backend/k9sak/generated';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { goToLos, goToSearch } from '@k9-sak-web/lib/paths/paths.js';
import { TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, HStack, List, Loader, Modal, VStack } from '@navikt/ds-react';
import { Form, SelectField, TextAreaField } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
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

const getMerknader = (merknader: MerknadResponse): string[] => {
  const ubrukteMerknader: EndreMerknadRequestMerknadKode[] = [];

  if (!merknader.hastesak.aktiv) {
    ubrukteMerknader.push(EndreMerknadRequestMerknadKode.HASTESAK);
  }
  if (!merknader.utenlandstilsnitt.aktiv) {
    ubrukteMerknader.push(EndreMerknadRequestMerknadKode.UTENLANDSTILSNITT);
  }
  return ubrukteMerknader;
};

const getGjeldendeMerknader = (merknader: MerknadResponse) => {
  interface Merknad {
    tittel: string;
    begrunnelse: string;
    merknadKode: EndreMerknadRequestMerknadKode;
  }

  const gjeldendeMerknader: Merknad[] = [];
  if (merknader.hastesak.aktiv) {
    gjeldendeMerknader.push({
      tittel: 'Hastesak',
      begrunnelse: merknader.hastesak.fritekst ?? '',
      merknadKode: EndreMerknadRequestMerknadKode.HASTESAK,
    });
  }
  if (merknader.utenlandstilsnitt.aktiv) {
    gjeldendeMerknader.push({
      tittel: 'Utenlandstilsnitt',
      begrunnelse: merknader.utenlandstilsnitt.fritekst ?? '',
      merknadKode: EndreMerknadRequestMerknadKode.UTENLANDSTILSNITT,
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
  const featureToggles = useContext(FeatureTogglesContext);
  const formState = useFormState({ control: formMethods.control });
  const valgtMerknad = useWatch({ control: formMethods.control, name: 'merknad' });

  const handleSubmit = async (values: FormValues) => {
    if (values.merknad) {
      await api.markerBehandling({
        behandlingUuid,
        fritekst: values.begrunnelse ?? '',
        merknadKode: values.merknad as EndreMerknadRequestMerknadKode,
      });
      if (erVeileder) {
        goToSearch();
      } else {
        goToLos();
      }
    }
  };

  const slettMerknad = async (merknadKode: EndreMerknadRequestMerknadKode) => {
    await api.fjernMerknad({
      behandlingUuid,
      merknadKode,
    });
    await hentMerknader();
  };

  const gjeldendeMerknader = merknaderFraLos ? getGjeldendeMerknader(merknaderFraLos) : [];

  return (
    <Modal open onClose={lukkModal} aria-label="Modal for markering av behandling" portal width="38.375rem">
      <Modal.Header>
        <Heading as="h3" size="small">
          Marker behandling og send til egen kø
        </Heading>
      </Modal.Header>
      <Modal.Body>
        {isFetching ? (
          <Loader size="medium" title="Henter merknader..." />
        ) : (
          <VStack gap="4">
            {gjeldendeMerknader.length > 0 && (
              <div>
                <Heading size="xsmall" level="4" spacing>
                  Gjeldende merknader
                </Heading>
                <List as="ul" size="small">
                  {gjeldendeMerknader.map(merknad => (
                    <List.Item title={merknad.tittel} key={merknad.tittel}>
                      <HStack gap="12" align="center" justify="space-between">
                        <BodyShort size="small">{merknad.begrunnelse}</BodyShort>
                        <Button
                          type="button"
                          onClick={() => slettMerknad(merknad.merknadKode)}
                          variant="tertiary"
                          size="small"
                          icon={<TrashIcon fontSize="1.5rem" title="Slett merknad" />}
                        />
                      </HStack>
                    </List.Item>
                  ))}
                </List>
              </div>
            )}
            <Form<FormValues> formMethods={formMethods} onSubmit={handleSubmit}>
              <VStack gap="6">
                <VStack gap="4">
                  <SelectField
                    name="merknad"
                    label="Velg ny merknad"
                    selectValues={tilgjengeligeMerknader.map(merknad => (
                      <option key={merknad} value={merknad}>
                        {merknad.charAt(0) + merknad.slice(1).toLowerCase()}
                      </option>
                    ))}
                  />
                  {valgtMerknad && (
                    <TextAreaField
                      name="begrunnelse"
                      label="Kommentar"
                      validate={[required, minLength3, maxLength100000, hasValidText]}
                      maxLength={100000}
                      readOnly={!featureToggles.LOS_MARKER_BEHANDLING_SUBMIT}
                    />
                  )}
                </VStack>
                <div className={styles.buttonContainer}>
                  <Button
                    variant="primary"
                    size="small"
                    disabled={!featureToggles.LOS_MARKER_BEHANDLING_SUBMIT || formState.isSubmitting}
                  >
                    {erVeileder ? 'Lagre, gå til forsiden' : 'Lagre, gå til LOS'}
                  </Button>
                  <Button variant="secondary" size="small" onClick={lukkModal}>
                    Lukk
                  </Button>
                </div>
              </VStack>
            </Form>
          </VStack>
        )}
      </Modal.Body>
    </Modal>
  );
};
export default MarkerBehandlingModal;
