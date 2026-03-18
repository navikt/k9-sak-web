import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';
import AksjonspunktHelpText from '@k9-sak-web/gui/shared/aksjonspunktHelpText/AksjonspunktHelpText.js';
import { Alert, BodyLong, Box, Button, Heading, Label, VStack } from '@navikt/ds-react';
import { RhfForm, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { decodeHtmlEntity } from '@navikt/ft-utils';
import { useForm } from 'react-hook-form';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { assertDefined } from '../../../utils/validation/assertDefined.js';

interface VergeSubmitPayload {
  begrunnelse: string;
  kode: string;
}

interface VergeFaktaIndexProps {
  aksjonspunkter: AksjonspunktDto[];
  submitCallback: (aksjonspunkter: VergeSubmitPayload[]) => void;
  readOnly: boolean;
  harApneAksjonspunkter: boolean;
  submittable: boolean;
}

interface FormValues {
  begrunnelse: string;
}

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const getAksjonspunktKode = (aksjonspunkt: AksjonspunktDto): string => assertDefined(aksjonspunkt.definisjon);

const VergeFaktaIndex = ({
  aksjonspunkter,
  submitCallback,
  readOnly,
  harApneAksjonspunkter,
  submittable,
}: VergeFaktaIndexProps) => {
  const vergeAksjonspunkt = aksjonspunkter.find(
    ap => getAksjonspunktKode(ap) === aksjonspunktkodeDefinisjonType.AVKLAR_VERGE,
  );

  const formMethods = useForm<FormValues>({
    defaultValues: {
      begrunnelse: decodeHtmlEntity(vergeAksjonspunkt?.begrunnelse ?? ''),
    },
    mode: 'onChange',
  });

  if (!vergeAksjonspunkt) {
    return null;
  }

  const onSubmit = (values: FormValues) => {
    submitCallback([
      {
        begrunnelse: values.begrunnelse,
        kode: aksjonspunktkodeDefinisjonType.AVKLAR_VERGE,
      },
    ]);
  };

  return (
    <VStack gap="space-16">
      <Heading level="1" size="small">
        Verge
      </Heading>
      <AksjonspunktHelpText isAksjonspunktOpen={harApneAksjonspunkter}>Søker er under 18 år.</AksjonspunktHelpText>
      <Alert variant="info" size="small">
        <VStack gap="space-12">
          <Label>Mer om verge for mindreårige</Label>
          <BodyLong>
            Når søker er under 18 år, må en verge signere søknaden. For mindreårige vil det vanligvis være den eller de
            foreldrene som har foreldreansvar, du kan se dette i Modia.
          </BodyLong>
          <BodyLong>
            Hvis vi ikke har signatur må du kontakte vergene, og be dem sende signert papirsøknad og førsteside for
            innsending i søkers fødselsnummer innen en frist. Hvis vi ikke får signatur fra verge, må saken henlegges
            fra Behandlingsmenyen.
          </BodyLong>
          <BodyLong>
            Merk at hvis vi får signatur, må brevene i saken manuelt sendes til vergene i tillegg til søker.
          </BodyLong>
        </VStack>
      </Alert>
      <RhfForm<FormValues> formMethods={formMethods} onSubmit={onSubmit}>
        <VStack gap="space-16">
          {(submittable || !!vergeAksjonspunkt.begrunnelse) && (
            <RhfTextarea
              control={formMethods.control}
              name="begrunnelse"
              label={readOnly ? '' : 'Begrunnelse'}
              validate={readOnly ? [] : [required, minLength3, maxLength1500, hasValidText]}
              maxLength={1500}
              readOnly={readOnly}
            />
          )}
          {!readOnly && (
            <Box>
              <Button
                variant="primary"
                size="small"
                type="submit"
                disabled={!submittable || formMethods.formState.isSubmitting}
              >
                Bekreft og fortsett
              </Button>
            </Box>
          )}
        </VStack>
      </RhfForm>
    </VStack>
  );
};

export default VergeFaktaIndex;
