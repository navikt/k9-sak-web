import React, { FunctionComponent } from 'react';
import pilHøyre from '@fpsak-frontend/assets/images/pil_hoyre_filled.svg';
import Image from '@fpsak-frontend/shared-components/src/Image';
import classnames from 'classnames/bind';
import { Overføringsretning, OverføringsretningEnum } from '../types/Overføring';
import styles from './pil.less';

const classNames = classnames.bind(styles);

interface PilProps {
  retning: Overføringsretning;
  className?: string;
}

const Pil: FunctionComponent<PilProps> = ({ retning, className = '' }) => (
  <Image
    className={classNames('pil', className, { pilVenstre: retning === OverføringsretningEnum.INN })}
    src={pilHøyre}
  />
);

export default Pil;
