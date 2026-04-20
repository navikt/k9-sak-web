import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import { BodyShort, Box, Button, Heading, HStack, Link, Radio, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import type { Control, FieldPath, FieldValues, SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi';
import styles from './beslutter.module.css';
import { InngangsvilkårTab } from './types';
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
  onTabChange: React.Dispatch<React.SetStateAction<InngangsvilkårTab>>;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
}

export const Beslutter = ({
  lokalkontorBeslutterAp,
  innloggetBruker,
  onTabChange,
  api,
  behandling,
  onAksjonspunktBekreftet,
}: Props) => {
  const formHook = useForm<FormValues>({
    defaultValues: {
      behovForBistand: 'godkjent',
      bosattITrondheim: 'godkjent',
      andreLivsoppholdytelser: 'godkjent',
    },
  });

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async () => {
      const aksjonspunkt = lokalkontorBeslutterAp;
      if (!aksjonspunkt?.definisjon) {
        return;
      }
      const aksjonspunktDefinisjon = AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR;
      const payload = {
        '@type': aksjonspunktDefinisjon,
        begrunnelse: 'fordi',
        aksjonspunktGodkjenningDtos: [
          {
            aksjonspunktKode: AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR,
            begrunnelse: 'OK',
            godkjent: true,
          },
        ],
      };
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload]);
    },
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });
  const kanBeslutte = !!innloggetBruker.aktivitetspengerDel1SaksbehandlerTilgang?.kanBeslutte;

  const onSubmit: SubmitHandler<FormValues> = () => bekreftAksjonspunktMutation();

  return (
    <Box width="fit-content">
      <VStack gap="space-16">
        <Heading size="small" level="2">
          Besluttervurdering
        </Heading>

        {lokalkontorBeslutterAp && aksjonspunktErÅpent(lokalkontorBeslutterAp) && (
          <RhfForm formMethods={formHook} onSubmit={onSubmit}>
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
                  <Button variant="primary" type="submit" size="small" loading={isPending}>
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
