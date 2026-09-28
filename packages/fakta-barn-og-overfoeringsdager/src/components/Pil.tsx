import pilHøyre from '@fpsak-frontend/assets/images/pil_hoyre_filled.svg';
import Image from '@fpsak-frontend/shared-components/src/Image';
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

// Kompileringsfeil her betyr at BRUK_V2_DELING_AV_DAGER er fjernet fra FeatureToggles.
// Slett denne fila (med tilhørende spec/css) og fjern v1-grenen i UttakFaktaPanelDef når migreringen er ferdig.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_DELING_AV_DAGER'];
