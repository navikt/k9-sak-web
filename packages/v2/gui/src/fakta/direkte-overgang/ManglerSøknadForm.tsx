import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import AksjonspunktHelpText from '@k9-sak-web/gui/shared/aksjonspunktHelpText/AksjonspunktHelpText.js';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { Alert, Box, Button, Textarea, VStack } from '@navikt/ds-react';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

type ManglerSøknadKode =
  | typeof AksjonspunktDefinisjon.TRENGER_SØKNAD_FOR_INFOTRYGD_PERIODE
  | typeof AksjonspunktDefinisjon.TRENGER_SØKNAD_FOR_INFOTRYGD_PERIODE_ANNEN_PART;

type FormValues = {
  begrunnelse: string;
};

export type ManglerSøknadSubmitData = {
  kode: ManglerSøknadKode;
  begrunnelse: string;
};

type ManglerSøknadFormProps = {
  aksjonspunkter: AksjonspunktDto[];
  readOnly: boolean;
  submittable: boolean;
  submitCallback: (data: ManglerSøknadSubmitData[]) => void | Promise<void>;
};

const isManglerSøknadAksjonspunkt = (
  aksjonspunkt: AksjonspunktDto,
): aksjonspunkt is AksjonspunktDto & { definisjon: ManglerSøknadKode } =>
  aksjonspunkt.definisjon === AksjonspunktDefinisjon.TRENGER_SØKNAD_FOR_INFOTRYGD_PERIODE ||
  aksjonspunkt.definisjon === AksjonspunktDefinisjon.TRENGER_SØKNAD_FOR_INFOTRYGD_PERIODE_ANNEN_PART;

export const ManglerSøknadForm = ({
  aksjonspunkter,
  readOnly,
  submittable,
  submitCallback,
}: ManglerSøknadFormProps) => {
  const relevanteAksjonspunkter = aksjonspunkter.filter(isManglerSøknadAksjonspunkt);
  const initialBegrunnelse = relevanteAksjonspunkter[0]?.begrunnelse ?? '';
  const relevanteAksjonspunkterIdentitet = relevanteAksjonspunkter
    .map(aksjonspunkt => aksjonspunkt.definisjon)
    .join(',');
  const formMethods = useForm<FormValues>({
    defaultValues: {
      begrunnelse: initialBegrunnelse,
    },
    mode: 'onChange',
  });
  const { reset } = formMethods;
  const begrunnelse = useWatch({ control: formMethods.control, name: 'begrunnelse' });

  useEffect(() => {
    reset({ begrunnelse: initialBegrunnelse });
  }, [reset, initialBegrunnelse, relevanteAksjonspunkterIdentitet]);

  if (relevanteAksjonspunkter.length === 0) {
    return null;
  }

  const hasManglerKomplettSøknad = relevanteAksjonspunkter.some(
    aksjonspunkt => aksjonspunkt.definisjon === AksjonspunktDefinisjon.TRENGER_SØKNAD_FOR_INFOTRYGD_PERIODE,
  );
  const hasManglerKomplettSøknadAnnenPart = relevanteAksjonspunkter.some(
    aksjonspunkt => aksjonspunkt.definisjon === AksjonspunktDefinisjon.TRENGER_SØKNAD_FOR_INFOTRYGD_PERIODE_ANNEN_PART,
  );
  const erAksjonspunktÅpent = relevanteAksjonspunkter.some(aksjonspunkt => isAksjonspunktOpen(aksjonspunkt.status));

  return (
    <form
      onSubmit={formMethods.handleSubmit(async ({ begrunnelse: submittedBegrunnelse }) => {
        if (readOnly || !submittable) {
          return;
        }

        await Promise.resolve(
          submitCallback(
            relevanteAksjonspunkter.map(aksjonspunkt => ({
              kode: aksjonspunkt.definisjon,
              begrunnelse: submittedBegrunnelse,
            })),
          ),
        );
      })}
    >
      <VStack gap="space-16">
        <AksjonspunktHelpText isAksjonspunktOpen={erAksjonspunktÅpent}>
          Kontroller perioder ved direkte overgang fra infotrygd. Dette aksjonspunktet krever spesielle rettigheter.
        </AksjonspunktHelpText>
        {hasManglerKomplettSøknad && (
          <Alert size="small" variant="warning">
            Søker har perioder for 2022 i infotrygd. Disse periodene må tas inn før saken kan behandles videre.
          </Alert>
        )}
        {hasManglerKomplettSøknadAnnenPart && (
          <Alert size="small" variant="warning">
            Søknadsperioden overlapper med periode for berørt sak i infotrygd. Disse periodene må tas inn før saken kan
            behandles videre.
          </Alert>
        )}
        <Box maxWidth="35rem">
          <Textarea
            {...formMethods.register('begrunnelse', {
              validate: value => (value.trim().length > 0 ? undefined : 'Begrunnelse er påkrevd.'),
            })}
            error={formMethods.formState.errors.begrunnelse?.message}
            label="Begrunnelse"
            description="Dersom du likevel ønsker å gå videre må det oppgis en begrunnelse."
            readOnly={readOnly}
            size="small"
          />
        </Box>
        <div>
          <Button
            disabled={readOnly || !submittable || !begrunnelse?.trim() || formMethods.formState.isSubmitting}
            loading={formMethods.formState.isSubmitting}
            size="small"
            type="submit"
          >
            Bekreft og fortsett
          </Button>
        </div>
      </VStack>
    </form>
  );
};
