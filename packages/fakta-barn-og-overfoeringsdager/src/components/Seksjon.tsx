import { Image } from '@fpsak-frontend/shared-components/index';
import { Heading } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import React from 'react';
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

// Helper to get section title
const getSectionTitle = (titleObj: any): string => {
  if (typeof titleObj === 'string') return titleObj;
  if (titleObj && titleObj.id) {
    const titles: Record<string, string> = {
      'FaktaBarn.Tittel': 'Barn',
      'FaktaRammevedtak.ErMidlertidigAlene.Tittel': 'Midlertidig aleneomsorg',
      'FaktaRammevedtak.Overføringer.Tittel': 'Overføringer og fordelinger',
    };
    return titles[titleObj.id] || titleObj.id;
  }
  return '';
};

const Seksjon = ({ imgSrc, title, bakgrunn, children, medMarg }: SeksjonProps) => (
  <section className={classNames('seksjon', { grå: bakgrunn === 'grå', medMarg })}>
    <Heading size="small" level="3" className={styles.tittel}>
      <Image src={imgSrc} />
      {getSectionTitle(title)}
    </Heading>
    {children}
  </section>
);

export default Seksjon;
