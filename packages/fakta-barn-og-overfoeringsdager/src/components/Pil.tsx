import pilHøyre from '@k9-sak-web/assets/images/pil_hoyre_filled.svg';
import Image from '@k9-sak-web/shared-components/src/Image';
import classnames from 'classnames/bind';
import React from 'react';
import { Overføringsretning, OverføringsretningEnum } from '../types/Overføring';
import styles from './pil.module.css';

const classNames = classnames.bind(styles);

interface PilProps {
  retning: Overføringsretning;
  className?: string;
}

const Pil = ({ retning, className = '' }: PilProps) => (
  <Image
    className={classNames('pil', className, { pilVenstre: retning === OverføringsretningEnum.INN })}
    src={pilHøyre}
  />
);

export default Pil;
