import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import Image from '@fpsak-frontend/shared-components/src/Image';
import { Button } from '@navikt/ds-react';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './leggTilKnapp.module.css';

interface LeggTilKnappProps {
  onClick: VoidFunction;
  tekstId: string;
  disabled?: boolean;
}

const LeggTilKnapp = ({ onClick, tekstId, disabled = false }: LeggTilKnappProps) => (
  <Button variant="tertiary" size="small" onClick={onClick} type="button" disabled={disabled}>
    <Image className={styles.image} src={addCircleIcon} />
    <Normaltekst>
      <FormattedMessage id={tekstId} />
    </Normaltekst>
  </Button>
);

export default LeggTilKnapp;
