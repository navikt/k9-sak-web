import type { ReactNode } from 'react';
import { ArrowCirclepathIcon, ArrowCirclepathReverseIcon, ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { BodyLong } from '@navikt/ds-react';

export type ErrorFixButton = Readonly<
  {
    // Tekst på "fikseknapp" i wizard
    label: string;
    // Ikon på "fikseknapp" i wizard
    icon: ReactNode;
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

export type ErrorFixAction = Readonly<{
  // Tekst til bruker, om kva som kan gjerast for å fikse problem, evt melde det. Ikkje putt avansert markup her.
  info: ReactNode;
  // Valgfri knapp. Viss ikkje sett, visast ingen "fikseknapp" i feilvisninga.
  button?: ErrorFixButton;
}>;

// Genererer fixAction verdi for standard Prøv på nytt knapp i Error
export const retryAction = (callback: () => void): ErrorFixAction => {
  return {
    info: (
      <BodyLong>Prøv på nytt for å få feilfri visning. Meld feil i porten hvis du ikke får løst den selv.</BodyLong>
    ),
    button: {
      label: 'Prøv på nytt',
      icon: <ArrowsCirclepathIcon />,
      callback,
    },
  };
};

export const reloadAction: ErrorFixAction = {
  info: (
    <>
      <BodyLong>Prøv å laste siden på nytt.</BodyLong>
      <BodyLong> Meld feil i porten hvis den ikke løser seg etter hvert.</BodyLong>
    </>
  ),
  button: {
    label: 'Last siden på nytt',
    icon: <ArrowCirclepathIcon />,
    callback: () => window.location.reload(),
  },
};

export const reloadActionWithFormResetWarning: ErrorFixAction = {
  info: (
    <>
      <BodyLong>Prøv å laste siden på nytt.</BodyLong>
      <BodyLong>
        Obs! Hvis du trykker på "Last siden på nytt", forsvinner teksten du har skrevet inn i feltene. Du kan kopiere
        teksten før du laster inn på nytt.
      </BodyLong>
      <BodyLong>Meld feilen i Porten hvis du ikke får løst den selv.</BodyLong>
    </>
  ),
  button: {
    label: 'Last siden på nytt',
    icon: <ArrowCirclepathIcon />,
    callback: () => window.location.reload(),
  },
};

export const restartAction: ErrorFixAction = {
  info: 'Prøv å starte på nytt fra forsiden. Meld feil i Porten hvis du ikke får løst den selv.',
  button: {
    label: 'Tilbake til forsiden',
    icon: <ArrowCirclepathReverseIcon />,
    href: '/',
  },
};
