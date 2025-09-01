import { HistorikkAktørType } from '@k9-sak-web/backend/combined/sak/historikk/HistorikkAktørType.js';
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
  readonly aktørType: HistorikkAktørType;
}

const fontSize = 45;

export const Avatar: FC<AvatarProps> = ({ aktørType }) => {
  switch (aktørType) {
    case HistorikkAktørType.SAKSBEHANDLER:
      return <PersonPencilFillIcon fontSize={fontSize} title="Saksbehandler" />;
    case HistorikkAktørType.SØKER:
      return <PersonFillIcon fontSize={fontSize} title="Søker" />;
    case HistorikkAktørType.BESLUTTER:
      return <PersonGavelFillIcon fontSize={fontSize} title="Beslutter" />;
    case HistorikkAktørType.VEDTAKSLØSNINGEN:
      return <RobotSmileIcon fontSize={fontSize} title="Vedtaksløsningen" />;
    case HistorikkAktørType.ARBEIDSGIVER:
      return <PersonSuitFillIcon fontSize={fontSize} title="Arbeidsgiver" />;
    case HistorikkAktørType.UDEFINERT:
      return <QuestionmarkCircleFillIcon fontSize={fontSize} title="Ukjent aktør type" />;
  }
};
