import React, { useState } from 'react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading, HelpText, HStack, Loader, Modal, Table } from '@navikt/ds-react';
import AktivitetRad from './AktivitetRad';
import OverstyringUttakForm from './OverstyringUttakForm';
import { erOverstyringInnenforPerioderTilVurdering } from '../utils/overstyringUtils';
import { useMutation, useQuery } from '@tanstack/react-query';
import type BehandlingUttakBackendClient from '../BehandlingUttakBackendClient';
import type {
  k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
  k9_sak_kontrakt_aksjonspunkt_OverstyringAksjonspunktDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import styles from './overstyrUttakForm.module.css';
import type { OverstyringUttakHandling } from '../types/OverstyringUttakTypes';
import type { DTOWithDiscriminatorType } from '@k9-sak-web/backend/shared/typeutils.js';

interface ownProps {
  behandling: Pick<BehandlingDto, 'uuid' | 'versjon'>;
  overstyringAktiv: boolean;
  erOverstyrer: boolean;
  harAksjonspunktForOverstyringAvUttak: boolean;
  perioderTilVurdering: string[] | undefined;
  api: BehandlingUttakBackendClient;
  hentBehandling?: (params?: any, keepData?: boolean) => Promise<Pick<BehandlingDto, 'uuid' | 'versjon'>>;
}

export enum OverstyrUttakHandling {
  SLETT = 'SLETT',
  BEKREFT = 'BEKREFT',
  LAGRE = 'LAGRE',
}

const OverstyrUttak: React.FC<ownProps> = ({
  overstyringAktiv,
  erOverstyrer,
  perioderTilVurdering,
  harAksjonspunktForOverstyringAvUttak,
  behandling,
  api,
  hentBehandling,
}) => {
  const [bekreftSlettId, setBekreftSlettId] = useState<number | false>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [visOverstyringSkjema, setVisOverstyringSkjema] = React.useState<boolean>(false);
  const [redigerOverstyring, setRedigerOverstyring] = React.useState<number | boolean>(false);
  const leseModus = !erOverstyrer;

  const { data: overstyrte, isLoading: lasterOverstyrte } = useQuery({
    queryKey: ['overstyrte', behandling.uuid],
    queryFn: () => api.hentOverstyringUttak(behandling.uuid),
  });

  const { mutate: handleOverstyring } = useMutation({
    mutationFn: async ({ action, values }: OverstyringUttakHandling) => {
      const overstyrteAksjonspunktDto: DTOWithDiscriminatorType<
        k9_sak_kontrakt_aksjonspunkt_OverstyringAksjonspunktDto,
        typeof aksjonspunktCodes.OVERSTYRING_AV_UTTAK
      > = {
        '@type': aksjonspunktCodes.OVERSTYRING_AV_UTTAK,
        gåVidere: false,
        periode: { fom: '', tom: '' }, // MÅ legge til denne inntill videre, hack, for å komme rundt validering i backend
        lagreEllerOppdater: [],
        slett: [],
      };

      if (values && action === OverstyrUttakHandling.LAGRE) {
        overstyrteAksjonspunktDto.lagreEllerOppdater.push({ ...values });
      }

      if (action === OverstyrUttakHandling.SLETT && values?.id) {
        overstyrteAksjonspunktDto.slett.push({ id: values.id });
      }

      if (action === OverstyrUttakHandling.BEKREFT) {
        overstyrteAksjonspunktDto.gåVidere = true;
      }

      return api.overstyringUttak({
        behandlingId: behandling.uuid,
        behandlingVersjon: behandling.versjon,
        bekreftedeAksjonspunktDtoer: [],
        overstyrteAksjonspunktDtoer: [overstyrteAksjonspunktDto],
      });
    },
    onMutate: () => setLoading(true),
    onSuccess: () => {
      void hentBehandling?.({ behandlingId: behandling.uuid }, false);
      window.scroll(0, 0);
    },
    onError: error => {
      setLoading(false);
      throw new Error(`Feil ved overstyring av uttak: ${error.message}`);
    },
  });

  const handleSlett = async (id: number): Promise<void> => {
    setLoading(true);
    handleOverstyring({
      action: OverstyrUttakHandling.SLETT,
      values: { id, begrunnelse: '', periode: { fom: '', tom: '' } },
    });
  };

  const handleAvbrytOverstyringForm = () => {
    setVisOverstyringSkjema(false);
    setRedigerOverstyring(false);
  };

  const handleRediger = (index: number) => {
    setRedigerOverstyring(index);
    setVisOverstyringSkjema(true);
  };

  const bekreftSletting = (id: number) => setBekreftSlettId(id);

  const harNoeÅVise =
    (overstyrte?.overstyringer && overstyrte?.overstyringer?.length > 0 && leseModus) ||
    (overstyringAktiv && erOverstyrer);

  const arbeidsgivere = overstyrte?.arbeidsgiverOversikt?.arbeidsgivere;

  const tableHeaders = (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell />
        <Table.HeaderCell scope="col">Fra og med</Table.HeaderCell>
        <Table.HeaderCell scope="col">Til og med</Table.HeaderCell>
        <Table.HeaderCell scope="col">
          Ny uttaksgrad
          <HelpText title="Uttaksgrad">
            Uttaksgraden viser til hvor mye av den totale pleiepengekvoten som tas ut. Eksempel: Settes uttaksgraden til
            70% er det 30% igjen til en annen part ved behov for én omsorgsperson. I de aller fleste tilfeller vil det
            være riktig å sette uttaksgraden lik gjennomsnittet av utbetalingsgradene for alle aktivitetene samlet.
          </HelpText>
        </Table.HeaderCell>
        {!leseModus && <Table.HeaderCell scope="col">Valg for overstyring</Table.HeaderCell>}
      </Table.Row>
    </Table.Header>
  );

  if (harNoeÅVise) {
    return (
      <div className="mt-4 mb-8">
        {harAksjonspunktForOverstyringAvUttak && (
          <Alert variant="warning">
            <Heading spacing size="xsmall" level="3">
              Vurder overstyring av uttaksgrad og utbetalingsgrad
            </Heading>
            <BodyShort>
              Aksjonspunkt for overstyring av uttaks-/utbetalingsgrad har blitt opprettet i denne, eller en tidligere,
              behandling og må løses av en saksbehandler med overstyrerrolle.
            </BodyShort>
          </Alert>
        )}
        {lasterOverstyrte && <Loader size="large" title="Venter..." />}
        {!lasterOverstyrte && overstyrte?.overstyringer && (
          <>
            {overstyrte?.overstyringer.length === 0 && !visOverstyringSkjema && (
              <>Det er ingen overstyrte aktiviteter i denne saken</>
            )}
            {overstyrte?.overstyringer.length > 0 && (
              <>
                <Heading size="xsmall" className="mt-4">
                  Overstyrte perioder
                </Heading>
                <Table size="small" className={styles.overstyringUttakTabell}>
                  {tableHeaders}
                  <Table.Body>
                    {overstyrte?.overstyringer.map((overstyring, index) => (
                      <AktivitetRad
                        key={overstyring.id}
                        overstyring={overstyring}
                        index={index}
                        handleRediger={handleRediger}
                        visOverstyringSkjema={visOverstyringSkjema}
                        handleSlett={bekreftSletting}
                        loading={loading}
                        erTilVurdering={erOverstyringInnenforPerioderTilVurdering(
                          overstyring,
                          perioderTilVurdering ?? [],
                        )}
                        leseModus={leseModus}
                        arbeidsgivere={arbeidsgivere}
                      />
                    ))}
                  </Table.Body>
                </Table>
              </>
            )}
          </>
        )}

        {erOverstyrer && overstyringAktiv && (
          <>
            {bekreftSlettId && (
              <Modal
                open={!!bekreftSlettId}
                onClose={() => setBekreftSlettId(false)}
                width="small"
                header={{
                  heading: 'Er du sikker på at du vil slette en overstyring?',
                  size: 'small',
                  closeButton: false,
                }}
              >
                {loading && (
                  <HStack padding="space-20" justify="center">
                    <Loader size="large" title="Venter..." />
                  </HStack>
                )}
                {!loading && (
                  <Modal.Footer>
                    <Button size="small" variant="danger" onClick={() => handleSlett(bekreftSlettId)} loading={loading}>
                      Slett
                    </Button>
                    <Button size="small" variant="primary" onClick={() => setBekreftSlettId(false)} loading={loading}>
                      Avbryt
                    </Button>
                  </Modal.Footer>
                )}
              </Modal>
            )}
            {!visOverstyringSkjema && (
              <div className={styles.leggTilOverstyringKnapp}>
                <Button
                  variant="secondary"
                  size="small"
                  disabled={loading}
                  onClick={() => setVisOverstyringSkjema(true)}
                  icon={<PlusCircleIcon fontSize="1.25rem" />}
                  loading={loading}
                >
                  Legg til ny overstyring
                </Button>
              </div>
            )}

            {!visOverstyringSkjema && harAksjonspunktForOverstyringAvUttak && (
              <div className={styles.overstyrUttakFormFooter}>
                <Button
                  variant="primary"
                  size="small"
                  type="submit"
                  onClick={async () => handleOverstyring({ action: 'BEKREFT' })}
                  loading={loading}
                >
                  Bekreft og fortsett
                </Button>
              </div>
            )}
            {visOverstyringSkjema && redigerOverstyring === false && (
              <OverstyringUttakForm
                api={api}
                behandling={behandling}
                handleAvbrytOverstyringForm={handleAvbrytOverstyringForm}
                loading={loading}
                setLoading={setLoading}
                perioderTilVurdering={perioderTilVurdering}
                handleOverstyring={handleOverstyring}
              />
            )}
            {visOverstyringSkjema && typeof redigerOverstyring === 'number' && (
              <OverstyringUttakForm
                api={api}
                behandling={behandling}
                handleAvbrytOverstyringForm={handleAvbrytOverstyringForm}
                overstyring={overstyrte?.overstyringer[redigerOverstyring]}
                loading={loading}
                setLoading={setLoading}
                perioderTilVurdering={perioderTilVurdering}
                handleOverstyring={handleOverstyring}
              />
            )}
          </>
        )}
      </div>
    );
  }

  return null;
};

export default OverstyrUttak;
