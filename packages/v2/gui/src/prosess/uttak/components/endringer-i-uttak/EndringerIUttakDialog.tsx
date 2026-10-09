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
              samlet. Dette medfører at vurdering av tapt arbeidstid alltid ser hen til arbeidstiden på
              skjæringstidspunktet.
            </BodyLong>
            <BodyLong>
              Normalarbeidstid for en periode etter 01.01.2027 kan kun endres ved å endre den fra skjæringstidspunktet,
              gjennom søknad eller punsj. Merk at søker fortsatt kan opplyse endret normalarbeidstid i søknaden, slik at
              de rapporterer faktisk antall arbeidstimer riktig. Uttak kan derfor vise en annen normalarbeidstid enn det
              brukeren får i søknaden.
            </BodyLong>
            <BodyLong>
              Alle saker som ikke har fått aksjonspunkt for reglene fra oktober 2024, vil fra denne datoen komme over på
              samme regelsett.
            </BodyLong>
          </VStack>
          <VStack gap="space-4">
            <Detail>November 2025</Detail>
            <BodyLong>
              Det opprettes perioder med inaktiv frilans og inaktiv selvstendig næring om disse bortfaller.
            </BodyLong>
          </VStack>
          <VStack gap="space-4">
            <Detail>Mars 2025</Detail>
            <BodyLong>
              Normalarbeidstid for ikke yrkesaktiv settes lik normalarbeidstid for arbeidsforholdet ved
              skjæringstidspunkt for alle saker som har satt dato i aksjonspunkt innført oktober 2024.
            </BodyLong>
          </VStack>
          <VStack gap="space-4">
            <Detail>Oktober 2024</Detail>
            <BodyLong>
              Nye uttaksregler innføres for saker med ny aktivitet (nytt arbeidsforhold), ikke yrkesaktiv og kun ytelse,
              slik at man kan gradere mot ny inntekt. For saker som får ny aktivitet opprettes aksjonspunkt, og
              saksbehandler setter dato for når nye regler skal gjelde fra. Datoen skulle som hovedregel settes fra
              neste stønadsperiode som ikke var innvilget.
            </BodyLong>
            <BodyLong>
              Nye aktiviteter blir ikke gradert mot arbeidstid, men de kan få utslag i gradering mot inntektstap.
            </BodyLong>
          </VStack>
        </VStack>
      </Dialog.Body>
    </Dialog.Popup>
  </Dialog>
);

export default EndringerIUttakDrawer;
