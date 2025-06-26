import { Link } from '@navikt/ds-react';
import { Fragment } from 'react';
type LovreferanseProps = {
  /**
   * Lovreferanseteksten.
   *
   * Denne teksten antas å være på formatet "§ 9-1", "§§ 9-2 og 9-3", "§ 8", "§ 9-3 jamfør 8-9" osv. */
  children: string;
  /**
   * Om lovreferansen er for Ungdomsprogrammet.
   * Dette brukes for å bestemme hvilken lovdatalenke som skal brukes.
   * Hvis ikke satt, vil den bruke lovdatalenken for vanlig lovreferanse. */
  isUng?: boolean;
};

/**
 * Tar inn en tekst, og lenker eventuelle lovreferanser til deres definisjon på lovdata sine sider
 *
 * ```tsx
 * <Lovreferanse>§ 9-1</Lovreferanse>
 * <Lovreferanse>§§ 9-1 og 9-2 jf. 22-21</Lovreferanse>
 * ```
 * */
export const Lovreferanse = ({ children, isUng }: LovreferanseProps) => {
  return <span>{berikMedLovdataLenker(children, isUng)}</span>;
};

const berikMedLovdataLenker = (lovreferanse: string, isUng?: boolean) => {
  const grunnUrlen = isUng
    ? 'https://lovdata.no/LTI/forskrift/2025-06-20-1182/'
    : 'https://lovdata.no/lov/1997-02-28-19/';

  const seksjonsRegex = /(\d+(-\d+)?)/;

  // Hvis lovreferansen ikke inneholder "§" eller "Kapittel" (case insensitive)
  // så returnerer vi bare teksten
  if (!/(§|Kapittel)/i.test(lovreferanse)) {
    return lovreferanse;
  }

  return lovreferanse
    .replace(/,\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((del, index) => {
      const kapittelOgKanskjeParagraf = del.match(seksjonsRegex)?.[0];

      if (!kapittelOgKanskjeParagraf) {
        return <span key={index}>{del} </span>;
      }

      const link =
        kapittelOgKanskjeParagraf.includes('-') || isUng
          ? `${grunnUrlen}§${kapittelOgKanskjeParagraf}`
          : `${grunnUrlen}§${kapittelOgKanskjeParagraf}-1`;

      const prefix = del.includes('§§') ? '§§ ' : del.includes('§') ? '§ ' : '';
      const suffix = del.endsWith(',') ? ', ' : ' ';

      return (
        <Fragment key={index}>
          {prefix}
          <Link href={link} title="Les mer på Lovdata.no" target="_blank">
            {kapittelOgKanskjeParagraf}
          </Link>
          {suffix}
        </Fragment>
      );
    });
};
