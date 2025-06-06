import {
  HistorikkinnslagDel,
  HistorikkinnslagEndretFelt,
  HistorikkInnslagOpplysning,
  Kodeverk,
} from '@k9-sak-web/types';
import React from 'react';

import { IntlShape } from 'react-intl';
import historikkEndretFeltTypeCodes from '../../../kodeverk/historikkEndretFeltTypeCodes';
import historikkEndretFeltVerdiTypeCodes from '../../../kodeverk/historikkEndretFeltVerdiTypeCodes';
import historikkOpplysningTypeCodes from '../../../kodeverk/historikkOpplysningTypeCodes';
import historikkResultatTypeCodes from '../../../kodeverk/historikkResultatTypeCodes';

export const findIdForOpplysningCode = (opplysning: HistorikkInnslagOpplysning): string | undefined => {
  if (!opplysning) {
    return undefined;
  }
  const typeKode = opplysning.opplysningType?.kode;
  const opplysningCode = typeKode != null ? historikkOpplysningTypeCodes[typeKode] : undefined;
  if (!opplysningCode) {
    return `OpplysningTypeCode ${typeKode} finnes ikke-LEGG DET INN`;
  }
  return opplysningCode.feltId;
};

export const findResultatText = (
  resultat: string,
  intl: IntlShape,
  getKodeverknavn: (kodeverk: Kodeverk) => string,
): string | React.ReactNode[] | null => {
  if (!resultat) {
    return null;
  }

  const historikkResultatNavn = getKodeverknavn({ kode: resultat, kodeverk: 'HISTORIKK_RESULTAT_TYPE' });
  if (historikkResultatNavn) {
    return historikkResultatNavn;
  }

  const vedtakResultatNavn = getKodeverknavn({ kode: resultat, kodeverk: 'VEDTAK_RESULTAT_TYPE' });
  if (vedtakResultatNavn) {
    return vedtakResultatNavn;
  }

  const resultatCode = historikkResultatTypeCodes[resultat];
  if (!resultatCode) {
    return `ResultatTypeCode ${resultat} finnes ikke-LEGG DET INN`;
  }
  const fieldId = resultatCode.feltId;
  const msg = intl.formatMessage({ id: fieldId }, { b: chunks => <b>{chunks}</b>, br: <br /> });
  return msg;
};

export const findHendelseText = (
  hendelse: HistorikkinnslagDel['hendelse'],
  getKodeverknavn: (kodeverk: Kodeverk) => string,
): string | undefined => {
  if (!hendelse || hendelse.navn == null) {
    return undefined;
  }
  if (hendelse.verdi == null) {
    return getKodeverknavn(hendelse.navn);
  }
  return `${getKodeverknavn(hendelse.navn)} ${hendelse.verdi}`;
};

const convertToBoolean = (verdi: boolean): string => (verdi === true ? 'Ja' : 'Nei');

export const findEndretFeltVerdi = (
  endretFelt: HistorikkinnslagEndretFelt,
  verdi: string | number | boolean | undefined,
  intl: IntlShape,
  getKodeverknavn: (kodeverk: Kodeverk) => string,
): string | number | null => {
  if (verdi == null) {
    return null;
  }
  if (typeof verdi === 'boolean') {
    return convertToBoolean(verdi);
  }
  if (endretFelt.klTilVerdi != undefined) {
    const historikkFeltVerdiNavn = getKodeverknavn({
      kode: verdi as string,
      kodeverk: 'HISTORIKK_ENDRET_FELT_VERDI_TYPE',
    });
    if (historikkFeltVerdiNavn) {
      return historikkFeltVerdiNavn;
    }

    const historikkFeltNavn = getKodeverknavn({ kode: verdi as string, kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE' });
    if (historikkFeltNavn) {
      return historikkFeltNavn;
    }

    const verdiCode = historikkEndretFeltVerdiTypeCodes[verdi];
    if (!verdiCode) {
      return `EndretFeltVerdiTypeCode ${verdi} finnes ikke-LEGG DET INN`;
    }
    return intl.formatMessage({ id: verdiCode.verdiId });
  }
  return verdi;
};

export const findEndretFeltNavn = (endretFelt: HistorikkinnslagEndretFelt, intl: IntlShape): string => {
  const navnCode = endretFelt.endretFeltNavn.kode;
  const endretFeltNavnType = historikkEndretFeltTypeCodes[navnCode];
  if (!endretFeltNavnType) {
    return `EndretFeltTypeCode ${navnCode} finnes ikke-LEGG DET INN`;
  }
  const fieldId = endretFeltNavnType.feltId;
  return endretFelt.navnVerdi !== null
    ? intl.formatMessage(
        { id: fieldId },
        {
          value: endretFelt.navnVerdi,
        },
      )
    : intl.formatMessage({ id: fieldId });
};

export const scrollUp = () => {
  if (window.innerWidth < 1305) {
    window.scroll(0, 0);
  }
  return false;
};
