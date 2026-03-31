import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import { BodyShort, Box, Button, Heading, HStack, Link, Radio, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useState } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import styles from './beslutter.module.css';
import { InngangsvilkårTab, type SubmitCallback } from './types';
import { aksjonspunktErÅpent } from './utils/utils';

interface VilkårRadioItemProps<TFieldValues extends FieldValues> {
  label: string;
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  onLabelClick: () => void;
}

const VilkårRadioItem = <TFieldValues extends FieldValues>({
  label,
  name,
  control,
  onLabelClick,
}: VilkårRadioItemProps<TFieldValues>) => (
  <Box>
    <button type="button" onClick={onLabelClick} className={styles.buttonLink}>
      <Link as={BodyShort} weight="semibold" size="small">
        {label}
      </Link>
    </button>
    <RhfRadioGroup
      name={name}
      legend="Vurder om vilkåret er godkjent"
      hideLegend
      control={control}
      validate={[required]}
    >
      <HStack gap="space-16">
        <Radio value="godkjent">Godkjent</Radio>
        <Radio value="ikkeGodkjent">Ikke godkjent</Radio>
      </HStack>
    </RhfRadioGroup>
  </Box>
);

interface FormValues {
  behovForBistand?: 'godkjent' | 'ikkeGodkjent';
  bosattITrondheim?: 'godkjent' | 'ikkeGodkjent';
  andreLivsoppholdytelser?: 'godkjent' | 'ikkeGodkjent';
}

interface Props {
  lokalkontorBeslutterAp: AksjonspunktDto | undefined;
  innloggetBruker: InnloggetAnsattUngV2Dto;
  vurderBistandsvilkårAp: AksjonspunktDto | undefined;
  submitCallback: SubmitCallback;
  onTabChange: React.Dispatch<React.SetStateAction<InngangsvilkårTab>>;
}

export const Beslutter = ({
  lokalkontorBeslutterAp,
  vurderBistandsvilkårAp,
  innloggetBruker,
  submitCallback,
  onTabChange,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const formHook = useForm<FormValues>({
    defaultValues: {
      behovForBistand: 'godkjent',
      bosattITrondheim: 'godkjent',
      andreLivsoppholdytelser: 'godkjent',
    },
  });

  const onSubmit = async () => {
    setIsLoading(true);
    const aksjonspunkt = lokalkontorBeslutterAp;
    if (!aksjonspunkt) {
      return;
    }
    const payload = {
      kode: aksjonspunkt.definisjon,
      begrunnelse: 'fordi',
      aksjonspunktGodkjenningDtos: [
        {
          aksjonspunktKode: vurderBistandsvilkårAp?.definisjon,
          begrunnelse: 'OK',
          godkjent: true,
        },
      ],
    };
    try {
      await submitCallback([payload], [aksjonspunkt]);
    } finally {
      setIsLoading(false);
    }
  };
  const kanBeslutte = !!innloggetBruker.aktivitetspengerDel1SaksbehandlerTilgang?.kanBeslutte;

  const handleSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <Box width="fit-content">
      <VStack gap="space-16">
        <Heading size="small" level="2">
          Besluttervurdering
        </Heading>

        {lokalkontorBeslutterAp && aksjonspunktErÅpent(lokalkontorBeslutterAp) && (
          <RhfForm formMethods={formHook} onSubmit={handleSubmit}>
            {!kanBeslutte && <BodyShort>Du må ha rolle LOKALKONTOR_BESLUTTER</BodyShort>}
            {kanBeslutte && (
              <VStack gap="space-28">
                <VilkårRadioItem
                  label="Bosatt i Trondheim"
                  name="bosattITrondheim"
                  control={formHook.control}
                  onLabelClick={() => onTabChange(InngangsvilkårTab.BOSATT_I_TRONDHEIM)}
                />
                <VilkårRadioItem
                  label="Andre livsoppholdytelser"
                  name="andreLivsoppholdytelser"
                  control={formHook.control}
                  onLabelClick={() => onTabChange(InngangsvilkårTab.ANDRE_LIVSOPPHOLDYTELSER)}
                />
                <VilkårRadioItem
                  label="Behov for bistand"
                  name="behovForBistand"
                  control={formHook.control}
                  onLabelClick={() => onTabChange(InngangsvilkårTab.BEHOV_FOR_BISTAND)}
                />
                <Box>
                  <Button variant="primary" size="small" onClick={onSubmit} loading={isLoading}>
                    Bekreft
                  </Button>
                </Box>
              </VStack>
            )}
          </RhfForm>
        )}
      </VStack>
    </Box>
  );
};
