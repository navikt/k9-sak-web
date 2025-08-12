import {
  FigureInwardFillIcon,
  FigureOutwardFillIcon,
  PersonCheckmarkFillIcon,
  PersonPencilFillIcon,
  PersonSuitFillIcon,
  QuestionmarkCircleFillIcon,
  RobotSmileIcon,
} from '@navikt/aksel-icons';
import { historikkAktor, type HistorikkAktor } from '../tilbake/historikkinnslagTsTypeV2.js';
import { kjønn as kjønnKode } from '@k9-sak-web/backend/k9sak/kodeverk/Kjønn.js';
import {
  type kodeverk_historikk_HistorikkAktør as HistorikkAktørDtoType,
  kodeverk_historikk_HistorikkAktør as historikkAktør,
} from '@k9-sak-web/backend/k9sak/generated';
import { type klage_kodeverk_historikk_HistorikkAktør as KlageHistorikkAktørDtoType } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { isLegacyTilbakeHistorikkAktor } from './snakkebobleUtils.jsx';

interface Props {
  aktørType: HistorikkAktor | HistorikkAktørDtoType | KlageHistorikkAktørDtoType;
  kjønn?: string;
}

export const Avatar = ({ aktørType, kjønn }: Props) => {
  const kode = isLegacyTilbakeHistorikkAktor(aktørType) ? aktørType.kode : aktørType;
  switch (kode) {
    case historikkAktor.SAKSBEHANDLER:
    case historikkAktør.SAKSBEHANDLER:
      return <PersonPencilFillIcon fontSize={45} title="Saksbehandler" />;
    case historikkAktor.SOKER:
    case historikkAktør.SØKER:
      if (kjønn === kjønnKode.KVINNE) return <FigureOutwardFillIcon fontSize={45} title="Søker" />;
      else if (kjønn === kjønnKode.MANN) return <FigureInwardFillIcon fontSize={45} title="Søker" />;
      return <FigureOutwardFillIcon fontSize={45} title="Søker" />;
    case historikkAktor.BESLUTTER:
    case historikkAktør.BESLUTTER:
      return <PersonCheckmarkFillIcon fontSize={45} title="Beslutter" />;
    case historikkAktor.VEDTAKSLOSNINGEN:
    case historikkAktør.VEDTAKSLØSNINGEN:
      return <RobotSmileIcon fontSize={45} title="Vedtaksløsningen" />;
    case historikkAktor.ARBEIDSGIVER:
    case historikkAktør.ARBEIDSGIVER:
      return <PersonSuitFillIcon fontSize={45} title="Arbeidsgiver" />;
    case historikkAktør.UDEFINERT:
      return <QuestionmarkCircleFillIcon fontSize={45} title="Ukjent aktør type" />;
  }
};
