import type { ArbeidsgiverArbeidsforholdId } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/ArbeidsgiverArbeidsforholdId.js';
import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button, Dialog } from '@navikt/ds-react';
import { useState } from 'react';
import { SendForespørselContent } from './SendForespørsel';
import { KanIkkeOppretteNyOppgaveContent } from './KanIkkeOppretteOppgave';

interface NyInntektsmeldingDialogProps {
  førsteFraværsdag: string;
  arbeidsgiver: ArbeidsgiverArbeidsforholdId;
  harEksisterendeOppgave?: boolean;
  tidligereOppgaveSendtDato?: string;
}

export const NyInntektsmeldingDialog = ({
  førsteFraværsdag,
  arbeidsgiver,
  harEksisterendeOppgave,
  tidligereOppgaveSendtDato,
}: NyInntektsmeldingDialogProps) => {
  const [begrunnelse, setBegrunnelse] = useState('');

  const renderContent = () => {
    if (harEksisterendeOppgave && tidligereOppgaveSendtDato) {
      return (
        <KanIkkeOppretteNyOppgaveContent
          førsteFraværsdag={førsteFraværsdag}
          arbeidsgiver={arbeidsgiver}
          tidligereOppgaveSendtDato={tidligereOppgaveSendtDato}
        />
      );
    }

    return (
      <SendForespørselContent
        førsteFraværsdag={førsteFraværsdag}
        arbeidsgiver={arbeidsgiver}
        begrunnelse={begrunnelse}
        onBegrunnelseChange={setBegrunnelse}
      />
    );
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
          <Dialog.Title>Send ny oppgave om inntektsmelding</Dialog.Title>
        </Dialog.Header>
        {renderContent()}
      </Dialog.Popup>
    </Dialog>
  );
};
