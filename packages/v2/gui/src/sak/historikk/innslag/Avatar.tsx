import { HistorikkAktør } from '@k9-sak-web/backend/combined/kodeverk/historikk/HistorikkAktør.js';
import type { FC } from 'react';
import {
  PersonFillIcon,
  PersonGavelFillIcon,
  PersonPencilFillIcon,
  PersonSuitFillIcon,
  QuestionmarkCircleFillIcon,
  RobotSmileIcon,
} from '@navikt/aksel-icons';

export interface AvatarProps {
  readonly aktørType: HistorikkAktør;
}

const fontSize = 45;

export const Avatar: FC<AvatarProps> = ({ aktørType }) => {
  switch (aktørType) {
    case HistorikkAktør.SAKSBEHANDLER:
      return <PersonPencilFillIcon fontSize={fontSize} title="Saksbehandler" />;
    case HistorikkAktør.LOKALKONTOR_SAKSBEHANDLER:
      return <PersonPencilFillIcon fontSize={fontSize} title="Saksbehandler Nav-lokalt" />;
    case HistorikkAktør.SØKER:
      return <PersonFillIcon fontSize={fontSize} title="Søker" />;
    case HistorikkAktør.BESLUTTER:
      return <PersonGavelFillIcon fontSize={fontSize} title="Beslutter" />;
    case HistorikkAktør.LOKALKONTOR_BESLUTTER:
      return <PersonGavelFillIcon fontSize={fontSize} title="Beslutter Nav-lokalt" />;
    case HistorikkAktør.VEDTAKSLØSNINGEN:
      return <RobotSmileIcon fontSize={fontSize} title="Vedtaksløsningen" />;
    case HistorikkAktør.ARBEIDSGIVER:
      return <PersonSuitFillIcon fontSize={fontSize} title="Arbeidsgiver" />;
    case HistorikkAktør.UDEFINERT:
      return <QuestionmarkCircleFillIcon fontSize={fontSize} title="Ukjent aktør type" />;
  }
};
