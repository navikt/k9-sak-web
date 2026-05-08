import { BodyLong, Box, Button, HStack, VStack } from '@navikt/ds-react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsCirclepathIcon,
  ArrowCirclepathIcon,
  ArrowCirclepathReverseIcon,
} from '@navikt/aksel-icons';
import { ErrorInfoCopy } from './ErrorInfoCopy.js';
import { type ReactNode, useEffect, useState } from 'react';

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
    info: <BodyLong>Prøv på nytt for å få feilfri visning. Rapporter feil i porten hvis den vedvarer.</BodyLong>,
    callback,
  };
};

export const reloadAction: ErrorHandlingWizardFixAction = {
  label: 'Last på nytt',
  icon: <ArrowCirclepathIcon />,
  info: <BodyLong>Last på nytt for å få feilfri visning. Rapporter feil i porten hvis den vedvarer.</BodyLong>,
  callback: () => window.location.reload(),
};

export const restartAction: ErrorHandlingWizardFixAction = {
  label: 'Start på nytt',
  icon: <ArrowCirclepathReverseIcon />,
  info: 'Prøv å starte på nytt fra startsiden. Rapporter feil hvis det ikke hjelper.',
  href: '/',
};

export type ErrorHandlingWizardFixAction = Readonly<
  {
    // Tekst på "fikseknapp" i wizard
    label: string;
    // Ikon på "fikseknapp" i wizard
    icon: ReactNode;
    // Tekst til bruker, om kva som kan gjerast for å fikse problem, evt rapportere det. Ikkje putt avansert markup her.
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
  children: ReactNode;
  // Feil som blir med i kopiert rapporteringsinfo
  reportErrors: ReadonlyArray<Error>;
  // Spesifiserer tekst, ikon og handling for "fikseknappen" i wizard og tilhøyrande veiledning. Vanlegvis "prøv på nytt". Standardverdi viss ikkje spesifisert er "Last på nytt" med full reload av sida.
  fixAction?: ErrorHandlingWizardFixAction;
}>;

const ErrorContentBox = ({ children }: { children: ReactNode }) => (
  <Box paddingBlock="space-0 space-8" borderColor="neutral-subtleA" borderWidth="0 0 4">
    {children}
  </Box>
);

export const ErrorHandlingWizard = ({ children, reportErrors, fixAction = reloadAction }: ErrorHandlingWizardProps) => {
  const [display, setDisplay] = useState<'error' | 'report' | 'copied'>('error');
  const { label: fixLabel, icon: fixIcon, info: fixInfo, callback: fixCallback, href: fixHref } = fixAction;

  // Tilbakestill visningstilstand når antal feil endrar seg
  useEffect(() => {
    setDisplay('error');
  }, [reportErrors.length]);

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

  return (
    <VStack gap="space-8">
      {display == 'report' ? (
        <>
          <BodyLong>
            For å rapportere feil, trykk <i>Kopier feilinformasjon</i>. Du kopierer da teknisk informasjon om feilen til
            din utklipsstavle.
          </BodyLong>
          <BodyLong>Lim deretter denne info inn i porten sak for å melde feil til oss.</BodyLong>
          <HStack gap="space-4">
            <Button {...btnProps} onClick={() => setDisplay('error')} icon={<ArrowLeftIcon />} iconPosition="left">
              Tilbake
            </Button>
            <ErrorInfoCopy {...btnProps} errors={reportErrors} onCopied={() => setDisplay('copied')} />
          </HStack>
        </>
      ) : display == 'copied' ? (
        <>
          <BodyLong>Rapporteringsinfo er kopiert. Lim den inn i porten sak for å melde feil til oss.</BodyLong>
          <HStack gap="space-4">
            <Button {...btnProps} onClick={() => setDisplay('report')} icon={<ArrowLeftIcon />} iconPosition="left">
              Tilbake
            </Button>
            {fixButton}
          </HStack>
        </>
      ) : (
        <>
          {children}
          {fixInfo}
          <HStack gap="space-4">
            {fixButton}
            <Button {...btnProps} onClick={() => setDisplay('report')} icon={<ArrowRightIcon />} iconPosition="right">
              Rapporter feil
            </Button>
          </HStack>
        </>
      )}
    </VStack>
  );
};

ErrorHandlingWizard.ErrorBox = ErrorContentBox;
