import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { Edit } from '@navikt/ds-icons';
import { Alert, Button } from '@navikt/ds-react';
import React, { type JSX } from 'react';
import ContainerContext from '../../../context/ContainerContext';
import { Kode, Tilstand } from '../../../types/KompletthetData';
import styles from './periodList.module.css';
import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';

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

export default FortsettUtenInntektsmeldingAvslag;
