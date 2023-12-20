import React, { useState } from 'react';

import { Button, Heading, Table } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/ft-plattform-komponenter';

import NavFrontendSpinner from 'nav-frontend-spinner';
import ContainerContext from '../../context/ContainerContext';
import OverstyringUttakForm from './OverstyringUttakForm';
import AktivitetRad from './AktivitetRad';
import { useOverstyrUttak } from '../../context/OverstyrUttakContext';
import { UttakOverstyring } from '../../../types/UttakOverstyring';
import { formaterOverstyringTilFormData } from '../../../util/overstyringUtils';

import styles from './overstyrUttakForm.css';

const tableHeaders = (
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell />
      <Table.HeaderCell scope="col">Fra og med</Table.HeaderCell>
      <Table.HeaderCell scope="col">Til og med</Table.HeaderCell>
      <Table.HeaderCell scope="col">Ny uttaksgrad</Table.HeaderCell>
      <Table.HeaderCell scope="col">Valg for overstyring</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
);

const OverstyrUttakForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { handleOverstyringAksjonspunkt } = React.useContext(ContainerContext);
  const [visOverstyringSkjema, setVisOverstyringSkjema] = React.useState<boolean>(false);
  const { lasterOverstyringer, overstyrte } = useOverstyrUttak();
  const [redigerOverstyring, setRedigerOverstyring] = React.useState<number | boolean>(false);
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

  const handleSlett = (id: string): void => {
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

  return (
    <div className={styles.overstyrUttakForm}>
      {lasterOverstyringer && <NavFrontendSpinner />}
      {!lasterOverstyringer && (
        <>
          {overstyrte?.length === 0 && !visOverstyringSkjema && <>Det er ingen overstyrte aktiviteter i denne saken</>}
          {overstyrte?.length > 0 && (
            <>
              <Heading size="xsmall">Overstyrte perioder</Heading>
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
                      handleSlett={handleSlett}
                      loading={loading}
                      setLoading={setLoading}
                    />
                  ))}
                </Table.Body>
              </Table>
            </>
          )}
        </>
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

      {!visOverstyringSkjema && overstyrte?.length > 0 && (
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
    </div>
  );
};

export default OverstyrUttakForm;
