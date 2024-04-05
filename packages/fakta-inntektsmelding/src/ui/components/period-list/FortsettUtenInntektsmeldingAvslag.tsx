import { Edit } from '@navikt/ds-icons';
import { Alert, Button } from '@navikt/ds-react';
import { LabelledContent } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import ContainerContext from '../../../context/ContainerContext';
import { Kode, Tilstand } from '../../../types/KompletthetData';
import styles from './periodList.module.css';

const FortsettUtenInntektsmeldingAvslag = ({
  tilstand,
  redigeringsmodus,
  setRedigeringsmodus,
}: {
  tilstand: Tilstand;
  redigeringsmodus: boolean;
  setRedigeringsmodus: (state: boolean) => void;
}): JSX.Element | null => {
  const { readOnly } = React.useContext(ContainerContext);

  if (tilstand?.vurdering?.kode === Kode.MANGLENDE_GRUNNLAG && !redigeringsmodus && tilstand.tilVurdering) {
    return (
      <>
        <Alert variant="error" size="medium" className={styles.periodList__alertstripe}>
          <span>Kan ikke gå videre uten inntektsmelding, søknad avslås.</span>
          {!readOnly && (
            <Button variant="secondary" size="small" onClick={() => setRedigeringsmodus(true)} icon={<Edit />}>
              <span>Rediger vurdering</span>
            </Button>
          )}
        </Alert>
        <LabelledContent label="Begrunnelse" content={<span>{tilstand.begrunnelse}</span>} />
      </>
    );
  }
  return null;
};

export default FortsettUtenInntektsmeldingAvslag;
