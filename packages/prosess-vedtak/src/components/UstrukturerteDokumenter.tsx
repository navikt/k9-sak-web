import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/utils';
import { BodyShort, Heading, Link } from '@navikt/ds-react';
import moment from 'moment';
import React from 'react';
import styles from './ustrukturerteDokumenter.module.css';

export interface Link {
  href: string;
  rel: string;
  requestPayload: Record<string, unknown>;
  type: string;
}

export interface UstrukturerteDokumenterType {
  datert: string;
  id: string;
  links: Link[];
  type: string;
}

const linkIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 24H3V0H14L21 7V24ZM12 2H5V22H19V8H12V2ZM14 2.83V6L17.17 5.999L14 2.83Z"
      fill="#0067C5"
    />
  </svg>
);

const getLinks = (dokumenter: UstrukturerteDokumenterType[]) =>
  dokumenter?.map(dokument => {
    const navn = `${dokument.type} - ${moment(dokument.datert).format(DDMMYYYY_DATE_FORMAT)}`;
    const getLink = dokument.links.find(link => link.type === 'GET');
    return (
      <li key={navn} className={styles.ustrukturerteDokumenter__listItem}>
        {linkIcon}
        <Link href={getLink.href} target="_blank">
          {navn}
        </Link>
      </li>
    );
  });

interface UstrukturerteDokumenterProps {
  fritekstdokumenter: UstrukturerteDokumenterType[];
}

const UstrukturerteDokumenter = ({ fritekstdokumenter }: UstrukturerteDokumenterProps) => (
  <div className={styles.ustrukturerteDokumenter}>
    <Heading size="small" level="2">
      Uregistrerte opplysninger
    </Heading>
    <BodyShort size="small" className={styles.ustrukturerteDokumenter__text}>
      Noen av dokumentene i saken inneholder opplysninger som ikke kan punsjes. <br />
      Se gjennom følgende dokumenter for å se om det finnes opplysninger som vil påvirke saken:
    </BodyShort>
    <ul className={styles.ustrukturerteDokumenter__linkList}>{getLinks(fritekstdokumenter)}</ul>
  </div>
);

export default UstrukturerteDokumenter;
