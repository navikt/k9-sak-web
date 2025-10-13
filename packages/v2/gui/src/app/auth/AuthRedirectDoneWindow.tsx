import { Alert, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { type FC, useEffect, useState } from 'react';
import { delay } from '../../utils/delay.js';
import { CheckmarkIcon } from '@navikt/aksel-icons';

type HasPostMessage = Pick<WindowProxy, 'postMessage'>;

const hasPostMessage = (v: unknown): v is HasPostMessage =>
  v != null && typeof v === 'object' && 'postMessage' in v && typeof v.postMessage === 'function';

interface AuthRedirectDoneWindowProps {
  readonly sendAuthDoneMessage?: () => boolean;
  readonly waitForCloseMillis?: number;
}

const defaultProps: Required<AuthRedirectDoneWindowProps> = {
  sendAuthDoneMessage: () => {
    const opener = window.opener;
    if (hasPostMessage(opener)) {
      opener.postMessage('auth done');
      return true;
    } else {
      return false;
    }
  },
  waitForCloseMillis: 400,
};

const intentionalCleanupReason = 'intentional cleanup';

/** Router path for AuthRedirectDoneWindow */
export const authRedirectDoneWindowPath = '/auth/redirect';

export const AuthRedirectDoneWindow: FC<AuthRedirectDoneWindowProps> = ({
  sendAuthDoneMessage = defaultProps.sendAuthDoneMessage,
  waitForCloseMillis = defaultProps.waitForCloseMillis,
}) => {
  const [didNotClose, setDidNotClose] = useState(false);
  const [isManuallyClosing, setIsManuallyClosing] = useState(false);
  useEffect(() => {
    const aborter = new AbortController();
    const sent = sendAuthDoneMessage();
    if (sent) {
      // message to opener sent, we expect this window to be closed very soon.
      // If the window is not closed after waitForCloseMillis, prompt user to do it.
      delay(waitForCloseMillis, aborter.signal)
        .then(() => {
          setDidNotClose(true);
        })
        .catch(reason => {
          if (reason !== intentionalCleanupReason) {
            setDidNotClose(true);
          }
        });
    } else {
      setDidNotClose(true);
    }
    return () => aborter.abort(intentionalCleanupReason);
  }, [sendAuthDoneMessage, waitForCloseMillis]);

  const manualClose = async () => {
    try {
      setIsManuallyClosing(true);
      sendAuthDoneMessage(); // Forsøk å levere melding om at autentisering er fullført ein gang til.
      await delay(waitForCloseMillis); // Vent litt så melding kan bli prossessert før vi tvangslukker vindu.
      window.close();
    } finally {
      setIsManuallyClosing(false);
    }
  };

  const closeInfoVisibility = didNotClose ? 'visible' : 'hidden';
  return (
    <HStack justify="center" padding="space-48">
      <VStack justify="center" gap="space-16">
        <HStack align="center">
          <Heading size="medium">Vellykket innlogging </Heading>{' '}
          <CheckmarkIcon aria-hidden color="var(--ax-text-success-decoration)" fontSize="3rem" />
        </HStack>
        <Alert variant="info" style={{ visibility: closeInfoVisibility }}>
          <p>Innlogging fullført, men systemet klarte ikke signalisere dette til hovedvindu automatisk.</p>
          <p>Prøv å lukke dette vinduet og gjenåpne hovedvinduet for å fortsette å bruke systemet.</p>
        </Alert>
        <Button loading={isManuallyClosing} onClick={manualClose} style={{ visibility: closeInfoVisibility }}>
          Lukk dette vinduet
        </Button>
      </VStack>
    </HStack>
  );
};
