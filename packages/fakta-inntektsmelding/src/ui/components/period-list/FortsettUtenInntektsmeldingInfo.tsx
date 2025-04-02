import { Edit } from '@navikt/ds-icons';
import { Alert, Button } from '@navikt/ds-react';
import { LabelledContent } from '@navikt/ft-plattform-komponenter';
import React, { type JSX } from 'react';
import ContainerContext from '../../../context/ContainerContext';
import { Kode, Tilstand } from '../../../types/KompletthetData';
import styles from './periodList.module.css';
import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';

const FortsettUtenInntektsmeldingInfo = ({
  tilstand,
  redigeringsmodus,
  setRedigeringsmodus,
}: {
  tilstand: Tilstand;
  redigeringsmodus: boolean;
  setRedigeringsmodus: (state: boolean) => void;
}): JSX.Element | null => {
  const { readOnly } = React.useContext(ContainerContext);

  if (tilstand?.vurdering?.kode === Kode.FORTSETT && !redigeringsmodus && tilstand.tilVurdering) {
    return (
      <>
        <Alert variant="info" size="medium" className={styles.periodList__alertstripe}>
          <span>Fortsett uten inntektsmelding.</span>
          {!readOnly && (
            <Button variant="secondary" size="small" onClick={() => setRedigeringsmodus(true)} icon={<Edit />}>
              <span>Rediger vurdering</span>
            </Button>
          )}
        </Alert>
        <LabelledContent
          label="Begrunnelse"
          content={<span className="whitespace-pre-wrap">{tilstand.begrunnelse}</span>}
          indentContent
        />
        <VurdertAv ident={tilstand.vurdertAv} date={tilstand.vurdertTidspunkt} />
      </>
    );
  }

  return null;
};

export default FortsettUtenInntektsmeldingInfo;
