import React from 'react';
import { Image } from '@fpsak-frontend/shared-components';
import pil from '@fpsak-frontend/assets/images/pil_opp_hoyre.svg';
import styles from './omsorgenForInfo.less';

interface EksternLinkProps {
  to: string;
  text: string;
}

const EksternLink = ({ to, text }: EksternLinkProps) => (
  <a href={to} className={styles.eksternlenke} target="_blank" rel="noopener noreferrer">
    <span>{text}</span>
    <Image src={pil} alt="" />
  </a>
);

export default EksternLink;
