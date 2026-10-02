import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { OverstyringAksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/OverstyringAksjonspunktDto.js';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import type { DTOWithDiscriminatorType } from '@k9-sak-web/backend/shared/typeutils.js';
import { useRefetchBehandling } from '@k9-sak-web/gui/context/BehandlingContext.js';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading, HelpText, HStack, Loader, Modal, Table } from '@navikt/ds-react';
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useUttakApi } from '../api/UttakApiContext.js';
import { finnAksjonspunkt } from '../../../utils/aksjonspunktUtils.js';
import { useState, type FC } from 'react';
import { useUttakContext } from '../context/UttakContext.js';
import { OverstyrUttakHandling, type OverstyringUttakHandling } from '../types/OverstyringUttakTypes.js';
import { erOverstyringInnenforPerioderTilVurdering } from '../utils/overstyringUtils.js';
import AktivitetRad from './AktivitetRad.js';
import OverstyringUttakForm from './OverstyringUttakForm.js';
import styles from './overstyrUttak.module.css';
import { uttakOverstyringerQueryOptions, uttakQueryOptions } from '../api/uttakQueryOptions.js';

interface OverstyrUttakProps {
  overstyringAktiv: boolean;
}

const OverstyrUttak: FC<OverstyrUttakProps> = ({ overstyringAktiv }) => {
  const { behandling, aksjonspunkter, erOverstyrer } = useUttakContext();
  const uttakApi = useUttakApi();
  const { data: uttak, refetch: hentUttak } = useSuspenseQuery(
    uttakQueryOptions(uttakApi, behandling.uuid, behandling.versjon),
  );
  const perioderTilVurdering = uttak?.perioderTilVurdering ?? [];
  const harOverstyringAksjonspunkt =
    finnAksjonspunkt(aksjonspunkter, AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK) !== undefined;
  const hentBehandling = useRefetchBehandling();
  const [bekreftSlettId, setBekreftSlettId] = useState<number>();
  // 'ny' viser skjema for ny overstyring, et tall viser skjema for å endre overstyring med den indeksen
  const [overstyringSkjema, setOverstyringSkjema] = useState<'ny' | number>();
  const leseModus = !erOverstyrer || !overstyringAktiv;

  const { data: overstyrte, isLoading: lasterOverstyrte } = useQuery(
    uttakOverstyringerQueryOptions(uttakApi, behandling.uuid),
  );

  const { mutate: handleOverstyring, isPending: loading } = useMutation({
    mutationFn: async ({ action, values }: OverstyringUttakHandling) => {
      const overstyrteAksjonspunktDto: DTOWithDiscriminatorType<
        OverstyringAksjonspunktDto,
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

      return uttakApi.overstyringUttak({
        behandlingId: behandling.uuid,
        behandlingVersjon: behandling.versjon,
        bekreftedeAksjonspunktDtoer: [],
        overstyrteAksjonspunktDtoer: [overstyrteAksjonspunktDto],
      });
    },
    onSuccess: async () => {
      await Promise.all([hentUttak(), hentBehandling()]);
      setBekreftSlettId(undefined);
      setOverstyringSkjema(undefined);
      window.scroll(0, 0);
    },
    onError: error => {
      throw new Error(`Feil ved overstyring av uttak: ${error.message}`);
    },
  });

  const handleSlett = (id: number) =>
    handleOverstyring({
      action: OverstyrUttakHandling.SLETT,
      values: { id, begrunnelse: '', periode: { fom: '', tom: '' } },
    });

  const harNoeÅVise =
    (overstyrte?.overstyringer && overstyrte?.overstyringer?.length > 0) || (erOverstyrer && overstyringAktiv);

  const arbeidsgivere = overstyrte?.arbeidsgiverOversikt?.arbeidsgivere;

  const tableHeaders = (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell />
        <Table.HeaderCell scope="col">Fra og med</Table.HeaderCell>
        <Table.HeaderCell scope="col">Til og med</Table.HeaderCell>
        <Table.HeaderCell scope="col">
          <HStack gap="space-8">
            Ny uttaksgrad
            <HelpText title="Uttaksgrad">
              Uttaksgraden viser til hvor mye av den totale pleiepengekvoten som tas ut. Eksempel: Settes uttaksgraden
              til 70% er det 30% igjen til en annen part ved behov for én omsorgsperson. I de aller fleste tilfeller vil
              det være riktig å sette uttaksgraden lik gjennomsnittet av utbetalingsgradene for alle aktivitetene
              samlet.
            </HelpText>
          </HStack>
        </Table.HeaderCell>
        {!leseModus && <Table.HeaderCell scope="col">Valg for overstyring</Table.HeaderCell>}
      </Table.Row>
    </Table.Header>
  );

  if (harNoeÅVise) {
    return (
      <div>
        {harOverstyringAksjonspunkt && (
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
            {overstyringAktiv && overstyrte?.overstyringer.length === 0 && overstyringSkjema === undefined && (
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
                        handleRediger={setOverstyringSkjema}
                        visOverstyringSkjema={overstyringSkjema !== undefined}
                        handleSlett={setBekreftSlettId}
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
            <Modal
              open={bekreftSlettId !== undefined}
              onClose={() => setBekreftSlettId(undefined)}
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
                  <Button
                    data-color="danger"
                    size="small"
                    variant="primary"
                    onClick={() => bekreftSlettId !== undefined && handleSlett(bekreftSlettId)}
                    loading={loading}
                  >
                    Slett
                  </Button>
                  <Button size="small" variant="primary" onClick={() => setBekreftSlettId(undefined)} loading={loading}>
                    Avbryt
                  </Button>
                </Modal.Footer>
              )}
            </Modal>
            {overstyringSkjema === undefined && (
              <div className={styles.leggTilOverstyringKnapp}>
                <Button
                  variant="secondary"
                  size="small"
                  disabled={loading}
                  onClick={() => setOverstyringSkjema('ny')}
                  icon={<PlusCircleIcon fontSize="1.25rem" />}
                  loading={loading}
                >
                  Legg til ny overstyring
                </Button>
              </div>
            )}

            {overstyringSkjema === undefined && harOverstyringAksjonspunkt && (
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
            {overstyringSkjema !== undefined && (
              <OverstyringUttakForm
                key={overstyringSkjema}
                overstyring={
                  typeof overstyringSkjema === 'number' ? overstyrte?.overstyringer[overstyringSkjema] : undefined
                }
                lagre={values => handleOverstyring({ action: OverstyrUttakHandling.LAGRE, values })}
                avbryt={() => setOverstyringSkjema(undefined)}
                loading={loading}
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
