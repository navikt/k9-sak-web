import { Image } from '@fpsak-frontend/shared-components/index';
import { Heading } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './seksjon.module.css';

const classNames = classnames.bind(styles);

interface SeksjonProps {
  imgSrc: string;
  title: {
    id: string;
    values?: any;
  };
  bakgrunn: 'grå' | 'hvit';
  medMarg?: boolean;
  children: React.ReactNode;
}

const Seksjon = ({ imgSrc, title, bakgrunn, children, medMarg }: SeksjonProps) => (
  <section className={classNames('seksjon', { grå: bakgrunn === 'grå', medMarg })}>
    <Heading size="small" level="3" className={styles.tittel}>
      <Image src={imgSrc} />
      <FormattedMessage id={title.id} values={title.values} />
    </Heading>
    {children}
  </section>
);

export default Seksjon;
