import React, { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';

import { Row } from 'nav-frontend-grid';
import { Image } from '@fpsak-frontend/shared-components';

// import styles from '../timeLineSoker.less';
import { TidslinjeIkon as TidslinjeIkonProps } from './Tidslinje';

// TODO: styles generell classname
const TidslinjeIkon: FunctionComponent<TidslinjeIkonProps> = ({ src, imageTextKey, titleKey }) => {
  const intl = useIntl();
  return (
    <Row>
      <Image src={src} alt={intl.formatMessage({ id: imageTextKey })} title={intl.formatMessage({ id: titleKey })} />
    </Row>
  );
};

export default TidslinjeIkon;
