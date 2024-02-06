import React, { useRef, useState } from 'react';

import { Alert, BodyShort, Button, Heading, Modal, Table } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/ft-plattform-komponenter';
import NavFrontendSpinner from 'nav-frontend-spinner';

import { erOverstyringInnenforPerioderTilVurdering } from '../../../util/dateUtils';
import ContainerContext from '../../context/ContainerContext';
import OverstyringUttakForm from './OverstyringUttakForm';
import AktivitetRad from './AktivitetRad';
import { useOverstyrUttak } from '../../context/OverstyrUttakContext';
import { formaterOverstyringTilFormData } from '../../../util/overstyringUtils';

import styles from './overstyrUttakForm.module.css';

interface ownProps {
  overstyringAktiv: boolean;
}

const OverstyrUttakForm: React.FC<ownProps> = ({ overstyringAktiv }) => {
  const [bekreftSlettId, setBekreftSlettId] = useState<string | false>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { handleOverstyringAksjonspunkt, erOverstyrer, perioderTilVurdering } = React.useContext(ContainerContext);
  const [visOverstyringSkjema, setVisOverstyringSkjema] = React.useState<boolean>(false);
  const { lasterOverstyringer, overstyrte, harAksjonspunktForOverstyringAvUttak } = useOverstyrUttak();
  const [redigerOverstyring, setRedigerOverstyring] = React.useState<number | boolean>(false);
  const leseModus = !erOverstyrer;
  const handleSubmit = () => {
    setLoading(true);
    handleOverstyringAksjonspunkt({
      gåVidere: true,
      erVilkarOk: true,
      periode: { fom: '', tom: '' },
      lagreEllerOppdater: [],
      slett: [],
    });
  };

  const tableHeaders = (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell />
        <Table.HeaderCell scope="col">Fra og med</Table.HeaderCell>
        <Table.HeaderCell scope="col">Til og med</Table.HeaderCell>
        <Table.HeaderCell scope="col">Ny uttaksgrad</Table.HeaderCell>
        {!leseModus && <Table.HeaderCell scope="col">Valg for overstyring</Table.HeaderCell>}
      </Table.Row>
    </Table.Header>
  );

  const ref = useRef<HTMLDialogElement>(null);

  const handleSlett = (id: string): void => {
    ref.current?.close();
    setBekreftSlettId(false);
    setLoading(true);
    handleOverstyringAksjonspunkt({
      erVilkarOk: false,
      gåVidere: false,
      periode: { fom: '', tom: '' },
      lagreEllerOppdater: [],
      slett: [{ id }],
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

  const bekreftSletting = (id: string) => {
    setBekreftSlettId(id);
    ref.current?.showModal();
  };

  const harNoeÅVise = (overstyrte?.length > 0 && leseModus) || (overstyringAktiv && erOverstyrer);

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
        {lasterOverstyringer && <NavFrontendSpinner />}
        {!lasterOverstyringer && (
          <>
            {overstyrte?.length === 0 && !visOverstyringSkjema && (
              <>Det er ingen overstyrte aktiviteter i denne saken</>
            )}
            {overstyrte?.length > 0 && (
              <>
                <Heading size="xsmall" className="mt-4">
                  Overstyrte perioder
                </Heading>
                <Table size="small" className={styles.overstyringUttakTabell}>
                  {tableHeaders}
                  <Table.Body>
                    {overstyrte.map((overstyring, index) => (
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
                  <Button variant="danger" onClick={() => handleSlett(bekreftSlettId)}>
                    Slett
                  </Button>
                  <Button variant="primary" onClick={() => ref.current?.close()}>
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
                  icon={<PlusIcon />}
                  loading={loading}
                >
                  Legg til ny overstyring
                </Button>
              </div>
            )}

            {!visOverstyringSkjema && harAksjonspunktForOverstyringAvUttak && (
              <div className={styles.overstyrUttakFormFooter}>
                <Button variant="primary" size="small" type="submit" onClick={handleSubmit} loading={loading}>
                  Bekreft og fortsett
                </Button>
              </div>
            )}
            {visOverstyringSkjema && redigerOverstyring === false && (
              <OverstyringUttakForm
                handleAvbrytOverstyringForm={handleAvbrytOverstyringForm}
                loading={loading}
                setLoading={setLoading}
              />
            )}
            {visOverstyringSkjema && typeof redigerOverstyring === 'number' && (
              <OverstyringUttakForm
                handleAvbrytOverstyringForm={handleAvbrytOverstyringForm}
                overstyring={formaterOverstyringTilFormData(overstyrte[redigerOverstyring])}
                loading={loading}
                setLoading={setLoading}
              />
            )}
          </>
        )}
      </div>
    );
  }

  return null;
};

export default OverstyrUttakForm;
