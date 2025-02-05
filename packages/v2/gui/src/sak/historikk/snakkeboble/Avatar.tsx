import {
  FigureInwardFillIcon,
  FigureOutwardFillIcon,
  PersonCheckmarkFillIcon,
  PersonPencilFillIcon,
  PersonSuitFillIcon,
  RobotSmileIcon,
} from '@navikt/aksel-icons';
import { historikkAktor, type HistorikkAktor } from '../historikkinnslagTsTypeV2.js';
import { kjønn as kjønnKode } from '@k9-sak-web/backend/k9sak/kodeverk/Kjønn.js';

interface Props {
  aktørType: HistorikkAktor;
  kjønn?: string;
}

export const Avatar = ({ aktørType, kjønn }: Props) => {
  switch (aktørType.kode) {
    case historikkAktor.SAKSBEHANDLER:
      return <PersonPencilFillIcon fontSize={45} title="Saksbehandler" />;
    case historikkAktor.SOKER:
      if (kjønn === kjønnKode.KVINNE) return <FigureOutwardFillIcon fontSize={45} title="Søker" />;
      else if (kjønn === kjønnKode.MANN) return <FigureInwardFillIcon fontSize={45} title="Søker" />;
      return <FigureOutwardFillIcon fontSize={45} title="Søker" />;
    case historikkAktor.BESLUTTER:
      return <PersonCheckmarkFillIcon fontSize={45} title="Beslutter" />;
    case historikkAktor.VEDTAKSLOSNINGEN:
      return <RobotSmileIcon fontSize={45} title="Vedtaksløsningen" />;
    case historikkAktor.ARBEIDSGIVER:
      return <PersonSuitFillIcon fontSize={45} title="Arbeidsgiver" />;
  }
};
