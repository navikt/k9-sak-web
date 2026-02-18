import type { ArbeidsgiverArbeidsforholdId } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/ArbeidsgiverArbeidsforholdId.js';
import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button, Dialog } from '@navikt/ds-react';
import { SendForespørselContent } from './SendForespørsel';
import { KanIkkeOppretteNyOppgave } from './KanIkkeOppretteOppgave';
import { ForespørselStatus } from '@k9-sak-web/backend/k9sak/kodeverk/inntektsmelding/ForespørselStatus.js';

interface NyInntektsmeldingDialogProps {
  førsteFraværsdag: string;
  arbeidsgiver: ArbeidsgiverArbeidsforholdId;
  forespørselStatus?: ForespørselStatus;
}

export const NyInntektsmeldingDialog = ({
  førsteFraværsdag,
  arbeidsgiver,
  forespørselStatus,
}: NyInntektsmeldingDialogProps) => {
  const renderContent = () => {
    if (forespørselStatus === ForespørselStatus.UNDER_BEHANDLING || forespørselStatus === ForespørselStatus.FERDIG) {
      return <KanIkkeOppretteNyOppgave førsteFraværsdag={førsteFraværsdag} arbeidsgiver={arbeidsgiver} />;
    }

    return <SendForespørselContent førsteFraværsdag={førsteFraværsdag} arbeidsgiver={arbeidsgiver} />;
  };

  return (
    <Dialog>
      <Dialog.Trigger>
        <Button size="small" variant="secondary" icon={<PaperplaneIcon aria-hidden />}>
          Send ny oppgave
        </Button>
      </Dialog.Trigger>
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>Send ny oppgave om inntektsmelding ved varig lønnsendring</Dialog.Title>
        </Dialog.Header>
        {renderContent()}
      </Dialog.Popup>
    </Dialog>
  );
};
