import { useState, type FC } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, HStack, ReadMore, Textarea, VStack } from '@navikt/ds-react';
import '@k9-sak-web/gui/utils/validation/yupSchemas';
import type { AksjonspunktDto, BehandlingDto, BekreftData } from '@k9-sak-web/backend/k9sak/generated';
import { kanAksjonspunktRedigeres, skalAksjonspunktUtredes } from '@k9-sak-web/gui/utils/aksjonspunkt.js';
import { invalidTextRegex } from '@k9-sak-web/gui/utils/validation/regexes.js';
import type BehandlingAvregningBackendClient from '../AvregningBackendClient';
import AksjonspunktBox from '../../../shared/aksjonspunktBox/AksjonspunktBox';

interface Props {
  aksjonspunkt: AksjonspunktDto;
  behandling: BehandlingDto;
  readOnly?: boolean;
  api: BehandlingAvregningBackendClient;
  oppdaterBehandling: () => void;
}

interface KontrollerEtterbetalingFormData {
  begrunnelse: string;
}

export type BekreftKontrollerEtterbetalingAksjonspunktRequest = BekreftData['requestBody'] & {
  bekreftedeAksjonspunktDtoer: Array<{
    '@type': string;
    kode: string | null | undefined;
    begrunnelse: string;
  }>;
};

const KontrollerEtterbetaling: FC<Props> = ({ behandling, aksjonspunkt, readOnly, api, oppdaterBehandling }) => {
  const [loading, setLoading] = useState(false);
  const [rediger, setRediger] = useState(skalAksjonspunktUtredes(aksjonspunkt, behandling.status));
  const kanRedigeres = !readOnly && kanAksjonspunktRedigeres(aksjonspunkt, behandling.status);

  const initialValues = {
    begrunnelse: aksjonspunkt.begrunnelse || '',
  };

  const kontrollerEtterbetalingFormSchema: yup.ObjectSchema<KontrollerEtterbetalingFormData> = yup.object({
    begrunnelse: yup
      .string()
      .validChars(invalidTextRegex)
      .min(3, 'Du må skrive minst tre tegn')
      .max(1500, 'Maks 1500 tegn tillatt.')
      .required('Begrunnelse må fylles ut')
      .isChangedComparedTo(initialValues.begrunnelse),
  });

  const formMethods = useForm<KontrollerEtterbetalingFormData>({
    resolver: yupResolver(kontrollerEtterbetalingFormSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (data: KontrollerEtterbetalingFormData) => {
    try {
      setLoading(true);
      const requestBody: BekreftKontrollerEtterbetalingAksjonspunktRequest = {
        behandlingId: `${behandling.id}`,
        behandlingVersjon: behandling.versjon,
        bekreftedeAksjonspunktDtoer: [
          {
            '@type': aksjonspunkt.definisjon || '',
            kode: aksjonspunkt.definisjon,
            begrunnelse: data.begrunnelse,
          },
        ],
      };

      await api.bekreftAksjonspunkt(requestBody);
      oppdaterBehandling();
    } finally {
      setLoading(false);
    }
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = formMethods;

  const toggleRediger = () => {
    if (rediger) reset();
    setRediger(!rediger);
  };
  return (
    <AksjonspunktBox erAksjonspunktApent={rediger}>
      <ReadMore header="Dette bør undersøker rundt etterbetalingen">
        Saken stopper i simulering fordi arbeidsgiver har endret sitt refusjonskrav, eller har endret fra refusjon til
        direkte utbetaling i en periode som allerede har blitt utbetalt til bruker. I tillegg er etterbetalingen høy. Du
        må kontrollerer om dette er riktig. Dette kan gjøres ved å kontakte arbeidsgiver. Er det feil, må de sende inn
        ny inntektsmelding. Får du ikke tak i arbeidsgiver, kan du kontakte søker og høre om de kan spørre
        arbeidsgiveren sin.
      </ReadMore>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap="4">
          <Textarea
            label="Begrunn hvorfor du går videre med denne behandlingen."
            maxLength={1500}
            minLength={3}
            readOnly={!rediger}
            {...register('begrunnelse')}
            error={errors.begrunnelse?.message}
          />
          <HStack gap={'2'}>
            {rediger && (
              <Button loading={loading} size="small">
                Bekreft og fortsett
              </Button>
            )}
            {kanRedigeres && (
              <Button type="button" variant="secondary" size="small" loading={loading} onClick={() => toggleRediger()}>
                {rediger ? 'Avbryt' : 'Rediger'}
              </Button>
            )}
          </HStack>
        </VStack>
      </form>
    </AksjonspunktBox>
  );
};

export default KontrollerEtterbetaling;
