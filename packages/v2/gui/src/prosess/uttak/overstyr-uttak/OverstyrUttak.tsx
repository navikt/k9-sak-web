import React, { useRef, useState } from 'react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading, HelpText, Loader, Modal, Table } from '@navikt/ds-react';
import AktivitetRad from './AktivitetRad';
import OverstyringUttakForm from './OverstyringUttakForm';
import { erOverstyringInnenforPerioderTilVurdering } from '../utils/overstyringUtils';
import { useMutation, useQuery, type UseMutateFunction } from '@tanstack/react-query';
import type BehandlingUttakBackendClient from '../BehandlingUttakBackendClient';
import type { BehandlingDto, OverstyrUttakPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';
import { aksjonspunktCodes, type AksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import styles from './overstyrUttakForm.module.css';

export enum OverstyrUttakHandling {
  SLETT = 'SLETT',
  BEKREFT = 'BEKREFT',
  LAGRE = 'LAGRE',
}

type OverstyringUttakHandling = {
  action: keyof typeof OverstyrUttakHandling;
  values?: OverstyrUttakPeriodeDto;
};

export type HandleOverstyringType = UseMutateFunction<unknown, Error, OverstyringUttakHandling, void>;

interface ownProps {
  behandling: Pick<BehandlingDto, 'uuid' | 'versjon'>;
  overstyringAktiv: boolean;
  erOverstyrer: boolean;
  harAksjonspunktForOverstyringAvUttak: boolean;
  perioderTilVurdering: any[];
  api: BehandlingUttakBackendClient;
}

interface OverstyrUttakRequest {
  '@type': AksjonspunktCodes;
  gåVidere: boolean;
  erVilkarOk: boolean;
  periode: { fom: string; tom: string };
  lagreEllerOppdater: OverstyrUttakPeriodeDto[];
  slett: { id: number | string }[];
}

const OverstyrUttak: React.FC<ownProps> = ({
  overstyringAktiv,
  erOverstyrer,
  perioderTilVurdering,
  harAksjonspunktForOverstyringAvUttak,
  behandling,
  api,
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
      const overstyrteAksjonspunktDto: OverstyrUttakRequest = {
        '@type': aksjonspunktCodes.OVERSTYRING_AV_UTTAK,
        gåVidere: false,
        erVilkarOk: false,
        periode: { fom: '', tom: '' }, // MÅ legge til denne inntill videre, hack, for å komme rundt validering i backend
        lagreEllerOppdater: [], // { ...values, søkersUttaksgrad: values.søkersUttaksgrad ? values.søkersUttaksgrad : undefined },
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
        overstyrteAksjonspunktDto.erVilkarOk = true;
      }

      return api.overstyringUttak({
        behandlingId: behandling.uuid,
        behandlingVersjon: behandling.versjon,
        bekreftedeAksjonspunktDtoer: [],
        overstyrteAksjonspunktDtoer: [overstyrteAksjonspunktDto],
      });
    },
    onMutate: () => setLoading(true),
    onSettled: () => setLoading(false),
  });

  const handleSlett = async (id: number): Promise<void> => {
    ref.current?.close();
    setBekreftSlettId(false);
    setLoading(true);
    handleOverstyring({
      action: OverstyrUttakHandling.SLETT,
      values: { id, begrunnelse: '', periode: { fom: '', tom: '' } },
    });
  };

  const ref = useRef<HTMLDialogElement>(null);

  const handleAvbrytOverstyringForm = () => {
    setVisOverstyringSkjema(false);
    setRedigerOverstyring(false);
  };

  const handleRediger = (index: number) => {
    setRedigerOverstyring(index);
    setVisOverstyringSkjema(true);
  };

  const bekreftSletting = (id: number) => {
    setBekreftSlettId(id);
    ref.current?.showModal();
  };

  const harNoeÅVise =
    (overstyrte?.overstyringer && overstyrte?.overstyringer?.length > 0 && leseModus) ||
    (overstyringAktiv && erOverstyrer);

  const arbeidsgivere = overstyrte?.arbeidsgiverOversikt.arbeidsgivere;

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
                        erTilVurdering={erOverstyringInnenforPerioderTilVurdering(overstyring, perioderTilVurdering)}
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
                ref={ref}
                width="small"
                header={{
                  heading: 'Er du sikker på at du vil slette en overstyring?',
                  size: 'small',
                  closeButton: false,
                }}
              >
                <Modal.Footer>
                  <Button size="small" variant="danger" onClick={() => handleSlett(bekreftSlettId)}>
                    Slett
                  </Button>
                  <Button size="small" variant="primary" onClick={() => ref.current?.close()}>
                    Avbryt
                  </Button>
                </Modal.Footer>
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
