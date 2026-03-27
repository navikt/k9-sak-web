import type { ung_sak_kontrakt_vilkår_VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { MedlemskapsPeriodeDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/MedlemskapsPeriodeDto.js';
import { Box, Button, Heading, Radio, ReadMore, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';

interface Props {
  submitCallback: (
    data: Array<{ kode: AksjonspunktDto['definisjon']; begrunnelse: string; erVilkarOk: boolean }>,
    aksjonspunkt: Array<Pick<AksjonspunktDto, 'definisjon'>>,
  ) => Promise<unknown>;
  aksjonspunkt: Pick<AksjonspunktDto, 'definisjon'> | undefined;
  readOnly: boolean;
  forutgåendeMedlemskap: MedlemskapsPeriodeDto[];
  vilkår: ung_sak_kontrakt_vilkår_VilkårMedPerioderDto[];
}

interface FormData {
  erGodkjent: string;
}

const buildInitialValues = (vilkår: ung_sak_kontrakt_vilkår_VilkårMedPerioderDto[]): FormData => {
  if (vilkår.some(v => v.perioder?.some(p => p.vilkarStatus === Utfall.OPPFYLT))) {
    return { erGodkjent: 'true' };
  }
  if (vilkår.some(v => v.perioder?.some(p => p.vilkarStatus === Utfall.IKKE_OPPFYLT))) {
    return { erGodkjent: 'false' };
  }
  return {
    erGodkjent: '',
  };
};

export const ForutgåendeMedlemskap = ({ submitCallback, aksjonspunkt, readOnly, vilkår }: Props) => {
  const formMethods = useForm<FormData>({
    defaultValues: buildInitialValues(vilkår),
  });

  const onSubmit = async (data: FormData) => {
    if (!aksjonspunkt) {
      return;
    }
    const erVilkarOk = data.erGodkjent === 'true';
    const payload = {
      kode: aksjonspunkt.definisjon,
      begrunnelse: erVilkarOk ? 'Forutgående medlemskap er godkjent.' : 'Forutgående medlemskap er ikke godkjent.',
      erVilkarOk,
      avslagsårsak: erVilkarOk ? undefined : 'SØKER_IKKE_MEDLEM',
    };
    await submitCallback([payload], [aksjonspunkt]);
  };

  return (
    <Box width="fit-content">
      <Heading size="medium" level="1" spacing>
        Medlemskap
      </Heading>

      <RhfForm formMethods={formMethods} onSubmit={onSubmit}>
        <VStack gap="space-16">
          <ReadMore header="Hvordan går jeg frem?">Veiledning her</ReadMore>
          <RhfRadioGroup
            control={formMethods.control}
            name="erGodkjent"
            legend="Er forutgående medlemskap godkjent?"
            validate={[required]}
            disabled={readOnly}
          >
            <Radio value="true">Ja</Radio>
            <Radio value="false">Nei</Radio>
          </RhfRadioGroup>
          <Button type="submit" size="small" disabled={readOnly} loading={formMethods.formState.isSubmitting}>
            Bekreft og fortsett
          </Button>
        </VStack>
      </RhfForm>
    </Box>
  );
};
