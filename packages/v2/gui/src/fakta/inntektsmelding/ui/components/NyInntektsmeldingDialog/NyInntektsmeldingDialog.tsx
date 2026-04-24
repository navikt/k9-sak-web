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
    switch (forespørselStatus) {
      case ForespørselStatus.UNDER_BEHANDLING:
      case ForespørselStatus.FERDIG:
      case ForespørselStatus.STP_MER_ENN_4_UKER:
      case ForespørselStatus.BEHANDLING_FERDIG:
        return (
          <KanIkkeOppretteNyOppgave
            førsteFraværsdag={førsteFraværsdag}
            arbeidsgiver={arbeidsgiver}
            forespørselStatus={forespørselStatus}
          />
        );
      case ForespørselStatus.UTGÅTT:
      case undefined:
        return <SendForespørselContent førsteFraværsdag={førsteFraværsdag} arbeidsgiver={arbeidsgiver} />;
      default: {
        const _exhaustiveCheck: never = forespørselStatus;
        throw new Error(`Unhandled ForespørselStatus: ${_exhaustiveCheck}`);
      }
    }
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
