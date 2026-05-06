import { BodyLong, Button, HStack, LocalAlert, VStack } from '@navikt/ds-react';
import { type ReactNode, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { ErrorInfoCopy } from './ErrorInfoCopy.js';

export type LocalAlertErrorProps = Readonly<{
  title: string;
  children?: ReactNode;
  error: Error;
  onTryAgain?: () => void;
}>;

// Felles props for alle knappane i LocalAlertError
const btnProps = {
  size: 'small',
  variant: 'secondary',
  'data-color': 'neutral',
} as const;

export const LocalAlertError = ({ title, children, error, onTryAgain }: LocalAlertErrorProps) => {
  const [display, setDisplay] = useState<'error' | 'report' | 'copied'>('error');
  const retryText = onTryAgain != null ? 'Prøv på nytt' : 'Last på nytt';
  const retryAction = onTryAgain ?? (() => window.location.reload());
  return (
    <LocalAlert status="error">
      <LocalAlert.Header>
        <LocalAlert.Title>{title}</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        <VStack gap="space-8">
          {display == 'report' ? (
            <>
              <BodyLong>
                For å rapportere feil, trykk <i>Kopier rapporteringsinfo</i>. Denne knappen kopierer teknisk informasjon
                om feilen til din utklipsstavle.
              </BodyLong>
              <BodyLong>Lim deretter denne info inn i porten sak for å melde feil til oss.</BodyLong>
              <HStack gap="space-4">
                <Button {...btnProps} onClick={() => setDisplay('error')} icon={<ArrowLeftIcon />} iconPosition="left">
                  Tilbake
                </Button>
                <ErrorInfoCopy {...btnProps} errors={[error]} onCopied={() => setDisplay('copied')} />
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
              {children ?? `${error.message}.`}
              <div>{retryText}. Rapporter feil i porten hvis den vedvarer.</div>
              <HStack gap="space-4">
                <Button {...btnProps} onClick={retryAction} icon={<ArrowsCirclepathIcon />} iconPosition="right">
                  {retryText}
                </Button>
                <Button
                  {...btnProps}
                  onClick={() => setDisplay('report')}
                  icon={<ArrowRightIcon />}
                  iconPosition="right"
                >
                  Rapporter feil
                </Button>
              </HStack>
            </>
          )}
        </VStack>
      </LocalAlert.Content>
    </LocalAlert>
  );
};
