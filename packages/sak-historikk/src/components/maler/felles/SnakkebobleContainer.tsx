import HistorikkAktor from '@fpsak-frontend/kodeverk/src/historikkAktor';
import { Kodeverk } from '@k9-sak-web/types';
import { useSaksbehandlerOppslag } from 'shared-components';
import {
  CogIcon,
  PersonGavelIcon,
  PersonIcon,
  PersonPencilIcon,
  PersonSuitIcon,
  QuestionmarkIcon,
} from '@navikt/aksel-icons';
import { Chat } from '@navikt/ds-react';
import React from 'react';
import styles from './snakkebobleContainer.module.css';

const pilHøyre = (aktoer: Kodeverk): boolean =>
  aktoer.kode !== HistorikkAktor.SOKER && aktoer.kode !== HistorikkAktor.ARBEIDSGIVER;

const formatDate = (date: string): string =>
  `${date.substring(8, 10)}.${date.substring(5, 7)}.${date.substring(0, 4)} - ${date.substring(11, 16)}`;

const getAvatar = (aktoer: Kodeverk): React.JSX.Element => {
  let avatar;
  switch (aktoer.kode) {
    case HistorikkAktor.SAKSBEHANDLER:
      avatar = <PersonPencilIcon title="Saksbehandler" fontSize="1.5rem" />;
      break;
    case HistorikkAktor.BESLUTTER:
      avatar = <PersonGavelIcon title="Beslutter" fontSize="1.5rem" />;
      break;
    case HistorikkAktor.VEDTAKSLOSNINGEN:
      avatar = <CogIcon title="Vedtaksløsningen" fontSize="1.5rem" />;
      break;
    case HistorikkAktor.ARBEIDSGIVER:
      avatar = <PersonSuitIcon title="Arbeidsgiver" fontSize="1.5rem" />;
      break;
    case HistorikkAktor.SOKER:
      avatar = <PersonIcon title="Søker" fontSize="1.5rem" />;
      break;
    default:
      avatar = <QuestionmarkIcon title="Ukjent" fontSize="1.5rem" />;
      break;
  }

  return avatar;
};

const getClassname = (aktoer: Kodeverk): string => {
  let classname;
  switch (aktoer.kode) {
    case HistorikkAktor.SAKSBEHANDLER:
      classname = styles.saksbehandler;
      break;
    case HistorikkAktor.BESLUTTER:
      classname = styles.beslutter;
      break;
    case HistorikkAktor.VEDTAKSLOSNINGEN:
      classname = styles.vedtakslosningen;
      break;
    case HistorikkAktor.ARBEIDSGIVER:
      classname = styles.arbeidsgiver;
      break;
    case HistorikkAktor.SOKER:
      classname = styles.soker;
      break;
    default:
      classname = '';
      break;
  }

  return classname;
};

interface OwnProps {
  dato: string;
  aktoer: Kodeverk;
  kjoenn?: Kodeverk;
  rolleNavn?: string;
  opprettetAv: string;
  children: React.ReactElement;
}

const SnakkebobleContainer = ({ dato, aktoer, rolleNavn = '', opprettetAv, children }: OwnProps) => {
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();

  return (
    <div className={pilHøyre(aktoer) ? styles.chatRight : styles.chatLeft}>
      <Chat
        timestamp={formatDate(dato)}
        position={pilHøyre(aktoer) ? 'right' : 'left'}
        name={`${rolleNavn} ${hentSaksbehandlerNavn(opprettetAv) || ''}`}
        avatar={getAvatar(aktoer)}
        className={getClassname(aktoer)}
      >
        <Chat.Bubble>{children}</Chat.Bubble>
      </Chat>
    </div>
  );
};

export default SnakkebobleContainer;
