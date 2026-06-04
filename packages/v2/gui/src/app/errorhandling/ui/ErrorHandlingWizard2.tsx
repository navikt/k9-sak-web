import { BodyLong, Box, Button, HStack, VStack } from '@navikt/ds-react';
import {
  ArrowCirclepathIcon,
  ArrowCirclepathReverseIcon,
  ArrowsCirclepathIcon,
  ExternalLinkIcon,
} from '@navikt/aksel-icons';
import { type ReactNode } from 'react';
import { ErrorReportPopover } from './ErrorReportPopover.js';
import { makeErrorReportLinkForJira } from "./makeErrorReportText.js";
import type { ErrorViewProps } from "./resolveErrorViewProps.js";

// Felles props for alle knappane i ErrorHandlingWizard
const btnProps = {
  size: 'small',
  variant: 'secondary',
  'data-color': 'neutral',
} as const;

// Genererer fixAction verdi for standard Prøv på nytt knapp i ErrorHandlingWizard
export const retryAction = (callback: () => void): ErrorHandlingWizardFixAction => {
  return {
    label: 'Prøv på nytt',
    icon: <ArrowsCirclepathIcon />,
    info: <BodyLong>Prøv på nytt for å få feilfri visning. Meld feil i porten hvis du ikke får løst den selv.</BodyLong>,
    callback,
  };
};

export const reloadAction: ErrorHandlingWizardFixAction = {
  label: 'Last på nytt',
  icon: <ArrowCirclepathIcon />,
  info: <>
    <BodyLong>Prøv å laste inn på nytt.</BodyLong>
    <BodyLong> Meld feil i porten hvis den ikke løser seg etter hvert.</BodyLong>
  </>,
  callback: () => window.location.reload(),
};

export const reloadActionWithFormResetWarning: ErrorHandlingWizardFixAction = {
  label: 'Last på nytt',
  icon: <ArrowCirclepathIcon />,
  info: <>
    <BodyLong>Prøv å laste inn på nytt.</BodyLong>
    <BodyLong>
      Obs! Hvis du trykker på "Last på nytt", forsvinner teksten du har skrevet inn i feltene. Du kan kopiere teksten
      før du laster inn på nytt.
    </BodyLong>
    <BodyLong>Meld feilen i Porten hvis du ikke får løst den selv.</BodyLong>
  </>,
  callback: () => window.location.reload(),
};

export const restartAction: ErrorHandlingWizardFixAction = {
  label: 'Tilbake til forsiden',
  icon: <ArrowCirclepathReverseIcon />,
  info: 'Prøv å starte på nytt fra forsiden. Meld feil i Porten hvis du ikke får løst den selv.',
  href: '/',
};

export type ErrorHandlingWizardFixAction = Readonly<
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

export type ErrorHandlingWizardProps = Readonly<{
  errorProps: ReadonlyArray<ErrorViewProps>;
}>;

export const ErrorHandlingWizard = ({ errorProps }: ErrorHandlingWizardProps) => {
  const [firstErrorProp, ...otherErrorProps] = errorProps
  if(firstErrorProp == null) {
    return null
  }
  const { label: fixLabel, icon: fixIcon, info: fixInfo, callback: fixCallback, href: fixHref } = firstErrorProp.fixAction

  const fixButton =
    fixCallback != null ? (
      <Button {...btnProps} onClick={fixCallback} icon={fixIcon} iconPosition="right">
        {fixLabel}
      </Button>
    ) : (
      <Button {...btnProps} as="a" href={fixHref} icon={fixIcon} iconPosition="right">
        {fixLabel}
      </Button>
    );

  const errors = errorProps.map(ep => ep.error)
  const reportLink = makeErrorReportLinkForJira(errors)

  return <VStack gap="space-0">
    <Box paddingBlock="space-0 space-8" borderColor="neutral-subtleA" borderWidth="0 0 4">
      {firstErrorProp.errorInfo}
    </Box>
    {fixInfo}
    <HStack gap="space-4" paddingBlock="space-0 space-8" >
      {fixButton}
      <Button {...btnProps} as="a" href={reportLink} target="_blank" icon={<ExternalLinkIcon />} iconPosition="right">
        Meld feil
      </Button>
      <ErrorReportPopover errors={errors} {...btnProps}>
        Vis teknisk info
      </ErrorReportPopover>
    </HStack>
    {otherErrorProps.map(ep => {
      return <Box paddingBlock="space-8" borderColor="neutral-subtleA" borderWidth="4 0 0">
        {ep.errorInfo}
      </Box>
    })}
  </VStack>
};

// <Box paddingBlock="space-0 space-8" borderColor="danger" borderWidth="2 0 0"></Box>
