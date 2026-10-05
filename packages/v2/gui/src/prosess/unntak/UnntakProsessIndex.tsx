import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import {
  behandlingResultatType,
  type BehandlingResultatType,
} from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingResultatType.js';
import type { Periode } from '@k9-sak-web/backend/k9sak/kontrakt/Periode.js';
import type { Overstyringk9VilkåretDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/Overstyringk9VilkåretDto.js';
import AksjonspunktHelpText from '@k9-sak-web/gui/shared/aksjonspunktHelpText/AksjonspunktHelpText.js';
import ContentMaxWidth from '@k9-sak-web/gui/shared/ContentMaxWidth/ContentMaxWidth.js';
import { Alert, Box, Button, Heading, Radio, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, required } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';

const MAKS_LENGDE_BEGRUNNELSE = 4000;
const validerBegrunnelse = [required, maxLength(MAKS_LENGDE_BEGRUNNELSE), hasValidText];

type UnntakResultat = typeof behandlingResultatType.INNVILGET | typeof behandlingResultatType.AVSLÅTT;

export type UnntakSubmitModel = Required<Pick<Overstyringk9VilkåretDto, 'periode' | 'begrunnelse'>> & {
  kode: typeof AksjonspunktDefinisjon.OVERSTYRING_AV_K9_VILKÅRET;
  behandlingResultatType: UnntakResultat;
};

interface FormValues {
  begrunnelse: string | null;
  behandlingResultatType: UnntakResultat | '';
}

const erUnntakResultat = (verdi: string | undefined): verdi is UnntakResultat =>
  verdi === behandlingResultatType.INNVILGET || verdi === behandlingResultatType.AVSLÅTT;

const erGyldigPeriode = (periode: Periode | undefined): periode is Periode =>
  periode !== undefined && periode.fom !== '' && periode.tom !== '' && periode.fom <= periode.tom;

interface UnntakFormProps {
  periode: Periode;
  begrunnelse?: string;
  behandlingResultatType?: BehandlingResultatType;
  isReadOnly: boolean;
  readOnlySubmitButton: boolean;
  submitCallback: (data: UnntakSubmitModel[]) => Promise<void>;
}

const UnntakForm = ({
  periode,
  begrunnelse,
  behandlingResultatType: lagretResultat,
  isReadOnly,
  readOnlySubmitButton,
  submitCallback,
}: UnntakFormProps) => {
  const formMethods = useForm<FormValues>({
    defaultValues: {
      begrunnelse: begrunnelse ?? '',
      behandlingResultatType: erUnntakResultat(lagretResultat) ? lagretResultat : '',
    },
  });
  const { isDirty, isSubmitting } = formMethods.formState;
  const [gjeldendeBegrunnelse, gjeldendeResultat] = formMethods.watch(['begrunnelse', 'behandlingResultatType']);
  const harTommeObligatoriskeFelt = (gjeldendeBegrunnelse ?? '').trim() === '' || gjeldendeResultat === '';

  const handleSubmit = async (values: FormValues) => {
    if (values.begrunnelse === null || !erUnntakResultat(values.behandlingResultatType)) {
      throw new Error('Kan ikke bekrefte unntak uten begrunnelse og gyldig resultat.');
    }
    await submitCallback([
      {
        kode: AksjonspunktDefinisjon.OVERSTYRING_AV_K9_VILKÅRET,
        periode,
        behandlingResultatType: values.behandlingResultatType,
        begrunnelse: values.begrunnelse,
      },
    ]);
  };

  return (
    <RhfForm formMethods={formMethods} onSubmit={handleSubmit}>
      <VStack gap="space-16">
        <Heading size="small" level="2">
          Vurder vilkår
        </Heading>
        <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>Vurder vilkår</AksjonspunktHelpText>
        <ContentMaxWidth>
          <RhfTextarea
            control={formMethods.control}
            name="begrunnelse"
            label="Notat"
            validate={validerBegrunnelse}
            maxLength={MAKS_LENGDE_BEGRUNNELSE}
            readOnly={isReadOnly}
          />
        </ContentMaxWidth>
        <RhfRadioGroup
          control={formMethods.control}
          name="behandlingResultatType"
          legend="Resultat"
          hideLegend
          validate={[required]}
          readOnly={isReadOnly}
        >
          <Radio value={behandlingResultatType.INNVILGET}>Innvilget eller endring</Radio>
          <Radio value={behandlingResultatType.AVSLÅTT}>Avslå eller ingen endring</Radio>
        </RhfRadioGroup>
        {!isReadOnly && (
          <Box>
            <Button
              variant="primary"
              size="small"
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting || (!isDirty && readOnlySubmitButton) || harTommeObligatoriskeFelt}
            >
              Bekreft og fortsett
            </Button>
          </Box>
        )}
      </VStack>
    </RhfForm>
  );
};

interface UnntakProsessIndexProps {
  periode?: Periode;
  begrunnelse?: string;
  behandlingResultatType?: BehandlingResultatType;
  isReadOnly: boolean;
  readOnlySubmitButton: boolean;
  submitCallback: (data: UnntakSubmitModel[]) => Promise<void>;
}

export const UnntakProsessIndex = ({ periode, ...props }: UnntakProsessIndexProps) => {
  if (!erGyldigPeriode(periode)) {
    return (
      <VStack gap="space-16">
        <Heading size="small" level="2">
          Vurder vilkår
        </Heading>
        <Alert variant="warning" size="small">
          Fant ikke én entydig og gyldig periode for vilkåret. Aksjonspunktet kan ikke løses.
        </Alert>
      </VStack>
    );
  }
  // Nøkkel på lagrede verdier gir nytt skjema med nye startverdier når behandlingen er oppdatert.
  const skjemaNøkkel = JSON.stringify([periode.fom, periode.tom, props.begrunnelse, props.behandlingResultatType]);
  return <UnntakForm key={skjemaNøkkel} periode={periode} {...props} />;
};
