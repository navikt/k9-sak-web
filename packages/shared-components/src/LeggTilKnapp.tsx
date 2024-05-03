import addCircleIcon from '@k9-sak-web/assets/images/add-circle.svg';
import Image from '@k9-sak-web/shared-components/src/Image';
import { BodyShort, Button } from '@navikt/ds-react';
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
    <BodyShort size="small">
      <FormattedMessage id={tekstId} />
    </BodyShort>
  </Button>
);

export default LeggTilKnapp;
