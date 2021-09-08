import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Flatknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Image from '@fpsak-frontend/shared-components/src/Image';
import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import styles from './leggTilKnapp.less';

interface LeggTilKnappProps {
  onClick: VoidFunction;
  tekstId: string;
  disabled?: boolean;
}

const LeggTilKnapp = ({ onClick, tekstId, disabled = false }: LeggTilKnappProps) => (
  <Flatknapp mini kompakt onClick={onClick} htmlType="button" disabled={disabled}>
    <Image className={styles.image} src={addCircleIcon} />
    <Normaltekst>
      <FormattedMessage id={tekstId} />
    </Normaltekst>
  </Flatknapp>
);

export default LeggTilKnapp;
