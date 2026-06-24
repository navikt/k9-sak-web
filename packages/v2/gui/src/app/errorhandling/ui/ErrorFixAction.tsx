import type { ReactNode } from "react";
import { ArrowCirclepathIcon, ArrowCirclepathReverseIcon, ArrowsCirclepathIcon } from "@navikt/aksel-icons";
import { BodyLong } from "@navikt/ds-react";

export type ErrorFixAction = Readonly<
  {
    // Tekst på "fikseknapp" i wizard
    label: string;
    // Ikon på "fikseknapp" i wizard
    icon: ReactNode;
    // Tekst til bruker, om kva som kan gjerast for å fikse problem, evt melde det. Ikkje putt avansert markup her.
    info: ReactNode;
  } & (
  | {
  callback: () => void; // Onclick på "fikseknapp" kaller denne
  href?: never;
}
  | {
  callback?: never;
  href: string; // Klikk på "fikseknapp" (link) navigerer til denne.
}
  )
>;

// Genererer fixAction verdi for standard Prøv på nytt knapp i Error
export const retryAction = (callback: () => void): ErrorFixAction => {
  return {
    label: 'Prøv på nytt',
    icon: <ArrowsCirclepathIcon />,
    info: <BodyLong>Prøv på nytt for å få feilfri visning. Meld feil i porten hvis du ikke får løst den selv.</BodyLong>,
    callback,
  };
};

export const reloadAction: ErrorFixAction = {
  label: 'Last siden på nytt',
  icon: <ArrowCirclepathIcon />,
  info: <>
    <BodyLong>Prøv å laste siden på nytt.</BodyLong>
    <BodyLong> Meld feil i porten hvis den ikke løser seg etter hvert.</BodyLong>
    </>,
  callback: () => window.location.reload(),
};

export const reloadActionWithFormResetWarning: ErrorFixAction = {
  label: 'Last siden på nytt',
  icon: <ArrowCirclepathIcon />,
  info: <>
    <BodyLong>Prøv å laste siden på nytt.</BodyLong>
    <BodyLong>
    Obs! Hvis du trykker på "Last siden på nytt", forsvinner teksten du har skrevet inn i feltene. Du kan kopiere teksten
  før du laster inn på nytt.
    </BodyLong>
    <BodyLong>Meld feilen i Porten hvis du ikke får løst den selv.</BodyLong>
    </>,
  callback: () => window.location.reload(),
};

export const restartAction: ErrorFixAction = {
  label: 'Tilbake til forsiden',
  icon: <ArrowCirclepathReverseIcon />,
  info: 'Prøv å starte på nytt fra forsiden. Meld feil i Porten hvis du ikke får løst den selv.',
  href: '/',
};
