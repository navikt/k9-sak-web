import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { Alert, Box, Button, VStack } from '@navikt/ds-react';
import { RhfForm, RhfTextarea } from '@navikt/ft-form-hooks';
import { useForm } from 'react-hook-form';
import { isAksjonspunktOpen } from '../../utils/aksjonspunktUtils.js';
import { assertDefined } from '../../utils/validation/assertDefined.js';

interface SubmitData {
  kode: string;
  begrunnelse: string;
}

interface Props {
  submitCallback: (data: SubmitData[]) => void;
  readOnly: boolean;
  submittable: boolean;
  aksjonspunkter: AksjonspunktDto[];
}

interface FormValues {
  begrunnelse: string;
}

const DirekteOvergangFaktaIndex = ({ submitCallback, readOnly, submittable, aksjonspunkter }: Props) => {
  const relevanteAksjonspunkter = aksjonspunkter.filter(
    ap =>
      ap.definisjon === AksjonspunktDefinisjon.TRENGER_SØKNAD_FOR_INFOTRYGD_PERIODE ||
      ap.definisjon === AksjonspunktDefinisjon.TRENGER_SØKNAD_FOR_INFOTRYGD_PERIODE_ANNEN_PART,
  );

  const erÅpent = relevanteAksjonspunkter.some(ap => isAksjonspunktOpen(ap.status));
  const manglerSøknadForPeriode = relevanteAksjonspunkter.some(
    ap => ap.definisjon === AksjonspunktDefinisjon.TRENGER_SØKNAD_FOR_INFOTRYGD_PERIODE,
  );
  const manglerSøknadAnnenPart = relevanteAksjonspunkter.some(
    ap => ap.definisjon === AksjonspunktDefinisjon.TRENGER_SØKNAD_FOR_INFOTRYGD_PERIODE_ANNEN_PART,
  );

  const formMethods = useForm<FormValues>({
    defaultValues: { begrunnelse: relevanteAksjonspunkter[0]?.begrunnelse ?? '' },
  });

  const onSubmit = (values: FormValues) => {
    submitCallback(
      relevanteAksjonspunkter.map(ap => ({
        kode: assertDefined(ap.definisjon),
        begrunnelse: values.begrunnelse,
      })),
    );
  };

  return (
    <VStack gap="space-8">
      {erÅpent && (
        <Alert size="small" variant="info">
          Kontroller perioder ved direkte overgang fra infotrygd. Dette aksjonspunktet krever spesielle rettigheter.
        </Alert>
      )}
      {manglerSøknadForPeriode && (
        <Alert size="small" variant="warning">
          Søker har perioder for 2022 i infotrygd. Disse periodene må tas inn før saken kan behandles videre.
        </Alert>
      )}
      {manglerSøknadAnnenPart && (
        <Alert size="small" variant="warning">
          Søknadsperioden overlapper med periode for berørt sak i infotrygd. Disse periodene må tas inn før saken kan
          behandles videre.
        </Alert>
      )}
      <Box>Dersom du likevel ønsker å gå videre må det oppgis en begrunnelse.</Box>
      <RhfForm formMethods={formMethods} onSubmit={onSubmit}>
        <VStack gap="space-8">
          <Box maxWidth="70ch">
            <RhfTextarea
              control={formMethods.control}
              name="begrunnelse"
              label="Begrunnelse"
              validate={[v => (!v ? 'Begrunnelse er påkrevd.' : null)]}
              readOnly={readOnly}
            />
          </Box>
          {!readOnly && (
            <div>
              <Button size="small" disabled={!submittable} variant="primary" type="submit">
                Bekreft og fortsett
              </Button>
            </div>
          )}
        </VStack>
      </RhfForm>
    </VStack>
  );
};

export default DirekteOvergangFaktaIndex;
