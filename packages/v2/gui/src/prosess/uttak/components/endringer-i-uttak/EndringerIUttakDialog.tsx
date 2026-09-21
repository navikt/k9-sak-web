import { BodyLong, Detail, Dialog, Heading, HStack, VStack } from '@navikt/ds-react';
import { InformationSquareIcon } from '@navikt/aksel-icons';

interface EndringerIUttakDrawerProps {
  open: boolean;
  onClose: () => void;
}

const EndringerIUttakDrawer = ({ open, onClose }: EndringerIUttakDrawerProps) => (
  <Dialog open={open} onOpenChange={nextOpen => !nextOpen && onClose()}>
    <Dialog.Popup position="right" width="530px">
      <Dialog.Header>
        <HStack align="center" gap="space-8">
          <InformationSquareIcon aria-hidden fontSize="1.5rem" />
          <Dialog.Title>Endringer i uttak</Dialog.Title>
        </HStack>
      </Dialog.Header>
      <Dialog.Body>
        <VStack gap="space-24">
          <VStack gap="space-4">
            <Detail>Januar 2027</Detail>
            <Heading size="xsmall" level="2">
              Normalarbeidstid låses på skjæringstidspunktet
            </Heading>
            <BodyLong>
              Fra og med 01.01.2027 låses normalarbeidstid på skjæringstidspunktet. For arbeidstakere låses
              normalarbeidstiden per arbeidsforhold, for frilans og selvstendig næring låses den for hele aktiviteten
              samlet. Faktisk arbeidstid kan fortsatt endres gjennom hele søknadsperioden.
            </BodyLong>
            <BodyLong>
              Normalarbeidstid for en periode etter 01.01.2027 kan kun endres ved å endre den ved skjæringstidspunktet.
              Om man punsjer eller endrer normalarbeidstid for senere perioder vil den ikke endre seg i uttak.
            </BodyLong>
          </VStack>
          <VStack gap="space-4">
            <Detail>2024-2025</Detail>
            <Heading size="xsmall" level="2">
              Flere endringer legges til i uttak
            </Heading>
            <BodyLong>
              November 2025: Det opprettes perioder med inaktiv frilans og inaktiv selvstendig næring om disse
              bortfaller.
            </BodyLong>
            <BodyLong>
              Mars 2025: Normalarbeidstid for ikke yrkesaktiv settes lik normalarbeidstid for arbeidsforholdet ved
              skjæringstidspunkt for alle saker som har satt dato i aksjonspunkt.
            </BodyLong>
          </VStack>
          <VStack gap="space-4">
            <Detail>Mai 2023</Detail>
            <Heading size="xsmall" level="2">
              Nye uttaksregler innføres for saker med «ny aktivitet», «ikke yrkesaktiv» og «kun ytelse»
            </Heading>
            <BodyLong>
              Nye uttaksregler innføres for saker med ny aktivitet (nytt arbeidsforhold), ikke yrkesaktiv og kun ytelse,
              slik at man kan gradere mot ny inntekt. For saker som får ny aktivitet opprettes aksjonspunkt, og
              saksbehandler setter dato for når nye regler skal gjelde fra.
            </BodyLong>
            <BodyLong>
              Nye aktiviteter blir ikke tatt med i utregning av søkers uttaksgrad. «Ikke-yrkesaktiv» og «Kun ytelse» får
              alltid 100% som utbetalingsgrad, hvis det ikke er reduksjon grunnet tilsyn.
            </BodyLong>
          </VStack>
        </VStack>
      </Dialog.Body>
    </Dialog.Popup>
  </Dialog>
);

export default EndringerIUttakDrawer;
