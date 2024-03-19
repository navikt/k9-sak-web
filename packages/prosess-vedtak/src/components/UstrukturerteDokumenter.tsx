import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { Heading } from '@navikt/ds-react';
import moment from 'moment';
import Lenke from 'nav-frontend-lenker';
import { Normaltekst } from 'nav-frontend-typografi';
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
        <Lenke href={getLink.href} target="_blank">
          {navn}
        </Lenke>
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
    <Normaltekst className={styles.ustrukturerteDokumenter__text}>
      Noen av dokumentene i saken inneholder opplysninger som ikke kan punsjes. <br />
      Se gjennom følgende dokumenter for å se om det finnes opplysninger som vil påvirke saken:
    </Normaltekst>
    <ul className={styles.ustrukturerteDokumenter__linkList}>{getLinks(fritekstdokumenter)}</ul>
  </div>
);

export default UstrukturerteDokumenter;
