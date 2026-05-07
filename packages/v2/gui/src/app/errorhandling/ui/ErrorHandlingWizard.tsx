import { BodyLong, Button, HStack, VStack } from '@navikt/ds-react';
import { ArrowLeftIcon, ArrowRightIcon, ArrowsCirclepathIcon, ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { ErrorInfoCopy } from './ErrorInfoCopy.js';
import { type ReactNode, useState } from 'react';

// Felles props for alle knappane i ErrorHandlingWizard
const btnProps = {
  size: 'small',
  variant: 'secondary',
  'data-color': 'neutral',
} as const;

export type ErrorHandlingWizardProps = Readonly<{
  children?: ReactNode;
  errors: ReadonlyArray<Error>;
  onTryAgain?: () => void;
}>;

export const ErrorHandlingWizard = ({ children, errors, onTryAgain }: ErrorHandlingWizardProps) => {
  const [display, setDisplay] = useState<'error' | 'report' | 'copied'>('error');
  const retryText = onTryAgain != null ? 'Prøv på nytt' : 'Last på nytt';
  const retryAction = onTryAgain ?? (() => window.location.reload());
  const retryIcon = onTryAgain != null ? <ArrowsCirclepathIcon /> : <ArrowCirclepathIcon />;

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
          </HStack>
        </>
      ) : (
        <>
          {children}
          <div>{retryText}. Rapporter feil i porten hvis den vedvarer.</div>
          <HStack gap="space-4">
            <Button {...btnProps} onClick={retryAction} icon={retryIcon} iconPosition="right">
              {retryText}
            </Button>
            <Button {...btnProps} onClick={() => setDisplay('report')} icon={<ArrowRightIcon />} iconPosition="right">
              Rapporter feil
            </Button>
          </HStack>
        </>
      )}
    </VStack>
  );
};
