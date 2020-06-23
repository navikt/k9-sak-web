import React, { FunctionComponent, ReactNode } from 'react';
import { Image } from '@fpsak-frontend/shared-components/index';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';
import styles from './seksjon.less';

const classNames = classnames.bind(styles);

interface SeksjonProps {
  imgSrc: ReactNode;
  title: {
    id: string;
    values?: object;
  };
  bakgrunn: 'grå' | 'hvit';
}

const Seksjon: FunctionComponent<SeksjonProps> = ({ imgSrc, title, bakgrunn, children }) => (
  <section className={classNames('seksjon', { grå: bakgrunn === 'grå' })}>
    <Undertittel tag="h3" className={styles.tittel}>
      <Image src={imgSrc} />
      <FormattedMessage id={title.id} values={title.values} />
    </Undertittel>
    {children}
  </section>
);

export default Seksjon;
