import { BodyLong, Box, Button, HStack, VStack } from '@navikt/ds-react';
import { ArrowLeftIcon, ArrowRightIcon, ArrowsCirclepathIcon, ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { ErrorInfoCopy } from './ErrorInfoCopy.js';
import { type ReactNode, useEffect, useState } from 'react';

// Felles props for alle knappane i ErrorHandlingWizard
const btnProps = {
  size: 'small',
  variant: 'secondary',
  'data-color': 'neutral',
} as const;

// Genererer fixAction verdi for standard Prøv på nytt knapp i ErrorHandlingWizard
export const retryAction = (callback: () => void) => {
  return { label: 'Prøv på nytt', icon: <ArrowsCirclepathIcon />, callback };
};

export const reloadAction = {
  label: 'Last på nytt',
  icon: <ArrowCirclepathIcon />,
  callback: () => window.location.reload(),
};

export type ErrorHandlingWizardProps = Readonly<{
  children: ReactNode;
  errors: ReadonlyArray<Error>;
  // Spesifiserer tekst, ikon og handling for "fikseknappen" i wizard. Vanlegvis "prøv på nytt". Standardverdi viss ikkje spesifisert er "Last på nytt" med full reload av sida.
  fixAction?: Readonly<
    {
      label: string;
      icon: ReactNode;
    } & (
      | {
          callback: () => void;
          href?: never;
        }
      | {
          callback?: never;
          href: string;
        }
    )
  >;

  // Fjerner standard info tekst om prøv på nytt og rapporter, i tilfelle dette er inkludert i eigendefinert tekst i children.
  withoutDefaultInfo?: boolean;
}>;

export const ErrorContentBox = ({ children }: { children: ReactNode }) => (
  <Box paddingBlock="space-0 space-8" borderColor="neutral-subtleA" borderWidth="0 0 4">
    {children}
  </Box>
);

export const ErrorHandlingWizard = ({
  children,
  errors,
  fixAction = reloadAction,
  withoutDefaultInfo,
}: ErrorHandlingWizardProps) => {
  const [display, setDisplay] = useState<'error' | 'report' | 'copied'>('error');
  const { label: fixLabel, icon: fixIcon, callback: fixCallback, href: fixHref } = fixAction;

  // Tilbakestill visningstilstand når antal feil endrar seg
  useEffect(() => {
    setDisplay('error');
  }, [errors.length]);

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
            <ErrorInfoCopy {...btnProps} errors={errors} onCopied={() => setDisplay('copied')} />
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
          {withoutDefaultInfo ? null : (
            <div>{fixLabel} for å få feilfri visning. Rapporter feil i porten hvis den vedvarer.</div>
          )}
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
