import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Flatknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Image from '@fpsak-frontend/shared-components/src/Image';
import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import styles from './leggTilKnapp.less';

interface LeggTilKnappProps {
  onClick: VoidFunction;
  tekstId: string;
}

const LeggTilKnapp: FunctionComponent<LeggTilKnappProps> = ({ onClick, tekstId }) => (
  <Flatknapp mini kompakt onClick={onClick} htmlType="button">
    <Image className={styles.marginRight} src={addCircleIcon} />
    <Normaltekst>
      <FormattedMessage id={tekstId} />
    </Normaltekst>
  </Flatknapp>
);

export default LeggTilKnapp;
