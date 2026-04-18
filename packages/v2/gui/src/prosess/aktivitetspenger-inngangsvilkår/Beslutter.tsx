import {
  ung_kodeverk_behandling_aksjonspunkt_SkjermlenkeType,
  ung_kodeverk_behandling_aksjonspunkt_VurderÅrsak as VurderÅrsak,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/ungsak/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import {
  BodyShort,
  Box,
  Button,
  Detail,
  ErrorMessage,
  Fieldset,
  Heading,
  HStack,
  Link,
  Radio,
  VStack,
} from '@navikt/ds-react';
import { RhfCheckbox, RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { ArrowBox } from '@navikt/ft-ui-komponenter';
import { useMutation } from '@tanstack/react-query';
import { useFieldArray, useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi';
import styles from './beslutter.module.css';
import { InngangsvilkårTab } from './types';
import { aksjonspunktErÅpent } from './utils/utils';

type AksjonspunktGodkjenningItem = {
  aksjonspunktKode: string;
  skjermlenkeType: string;
  totrinnskontrollGodkjent?: boolean;
  besluttersBegrunnelse?: string;
  feilFakta?: boolean;
  feilRegel?: boolean;
  feilLov?: boolean;
  annet?: boolean;
};

interface FormValues {
  aksjonspunktGodkjenning: AksjonspunktGodkjenningItem[];
}

const skjermlenkeTypeToTab: Record<string, InngangsvilkårTab | undefined> = {
  [ung_kodeverk_behandling_aksjonspunkt_SkjermlenkeType.BOSTEDSVILKÅR]: InngangsvilkårTab.BOSATT_I_TRONDHEIM,
  [ung_kodeverk_behandling_aksjonspunkt_SkjermlenkeType.VURDER_ANDRE_LIVSOPPHOLDSYTELSER]:
    InngangsvilkårTab.ANDRE_LIVSOPPHOLDYTELSER,
  [ung_kodeverk_behandling_aksjonspunkt_SkjermlenkeType.BISTANDSVILKÅR]: InngangsvilkårTab.BEHOV_FOR_BISTAND,
  [ung_kodeverk_behandling_aksjonspunkt_SkjermlenkeType.SOEKNADSFRIST]: InngangsvilkårTab.SØKNADSFRIST,
};

const buildDefaultValues = (
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContextDto[],
): FormValues => ({
  aksjonspunktGodkjenning: totrinnskontrollSkjermlenkeContext.flatMap(ctx =>
    (ctx.totrinnskontrollAksjonspunkter ?? []).map(ap => ({
      aksjonspunktKode: ap.aksjonspunktKode ?? '',
      skjermlenkeType: ctx.skjermlenkeType,
      totrinnskontrollGodkjent: ap.totrinnskontrollGodkjent,
      besluttersBegrunnelse: ap.besluttersBegrunnelse,
      feilFakta: ap.vurderPaNyttArsaker?.includes(VurderÅrsak.FEIL_FAKTA) ?? false,
      feilRegel: ap.vurderPaNyttArsaker?.includes(VurderÅrsak.FEIL_REGEL) ?? false,
      feilLov: ap.vurderPaNyttArsaker?.includes(VurderÅrsak.FEIL_LOV) ?? false,
      annet: ap.vurderPaNyttArsaker?.includes(VurderÅrsak.ANNET) ?? false,
    })),
  ),
});

interface Props {
  lokalkontorBeslutterAp: AksjonspunktDto | undefined;
  innloggetBruker: InnloggetAnsattUngV2Dto;
  vurderBistandsvilkårAp: AksjonspunktDto | undefined;
  onTabChange: React.Dispatch<React.SetStateAction<InngangsvilkårTab>>;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContextDto[];
}

export const Beslutter = ({
  lokalkontorBeslutterAp,
  innloggetBruker,
  onTabChange,
  api,
  behandling,
  onAksjonspunktBekreftet,
  totrinnskontrollSkjermlenkeContext,
}: Props) => {
  const formHook = useForm<FormValues>({
    defaultValues: buildDefaultValues(totrinnskontrollSkjermlenkeContext),
  });

  const { control, getFieldState, trigger } = formHook;
  const { fields } = useFieldArray({ control, name: 'aksjonspunktGodkjenning' });
  const aksjonspunktGodkjenning = useWatch({ control, name: 'aksjonspunktGodkjenning' });

  const kanBeslutte = !!innloggetBruker.aktivitetspengerDel1SaksbehandlerTilgang?.kanBeslutte;

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      const aksjonspunkt = lokalkontorBeslutterAp;
      if (!aksjonspunkt?.definisjon) {
        return;
      }
      const payload = {
        '@type': AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
        // begrunnelse: data.aksjonspunktGodkjenning.map(apGodkjenning => apGodkjenning.besluttersBegrunnelse).join('\n'),
        aksjonspunktGodkjenningDtos: data.aksjonspunktGodkjenning.map(apGodkjenning => {
          const arsaker: VurderÅrsak[] = [];
          if (!apGodkjenning.totrinnskontrollGodkjent) {
            if (apGodkjenning.feilFakta) arsaker.push(VurderÅrsak.FEIL_FAKTA);
            if (apGodkjenning.feilLov) arsaker.push(VurderÅrsak.FEIL_LOV);
            if (apGodkjenning.feilRegel) arsaker.push(VurderÅrsak.FEIL_REGEL);
            if (apGodkjenning.annet) arsaker.push(VurderÅrsak.ANNET);
          }
          return {
            aksjonspunktKode: apGodkjenning.aksjonspunktKode,
            godkjent: apGodkjenning.totrinnskontrollGodkjent ?? false,
            begrunnelse: apGodkjenning.besluttersBegrunnelse,
            arsaker,
          };
        }),
      };
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload]);
    },
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => bekreftAksjonspunktMutation(data);

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
                {fields.map((field, index) => {
                  const item = aksjonspunktGodkjenning?.[index];
                  const visAvslagsårsakKryssbokser = item?.totrinnskontrollGodkjent === false;
                  const visBegrunnelseTekstfelt = item?.totrinnskontrollGodkjent === false;

                  const { error } = getFieldState(`aksjonspunktGodkjenning.${index}`);
                  const checkboxValidationError = error?.message;
                  const reValidate = () => trigger(`aksjonspunktGodkjenning.${index}`);

                  const tab = skjermlenkeTypeToTab[item?.skjermlenkeType ?? ''];
                  const formaterSkjermlenkeType = (skjermlenkeType?: string) => {
                    switch (skjermlenkeType) {
                      case ung_kodeverk_behandling_aksjonspunkt_SkjermlenkeType.BOSTEDSVILKÅR:
                        return 'Bosatt i Trondheim';
                      case ung_kodeverk_behandling_aksjonspunkt_SkjermlenkeType.VURDER_ANDRE_LIVSOPPHOLDSYTELSER:
                        return 'Andre livsoppholdsytelser';
                      case ung_kodeverk_behandling_aksjonspunkt_SkjermlenkeType.BISTANDSVILKÅR:
                        return 'Behov for bistand';
                      case ung_kodeverk_behandling_aksjonspunkt_SkjermlenkeType.SOEKNADSFRIST:
                        return 'Søknadsfrist';
                      default:
                        return skjermlenkeType;
                    }
                  };
                  return (
                    <Box key={field.id}>
                      <button type="button" onClick={() => tab && onTabChange(tab)} className={styles.buttonLink}>
                        <Link as={BodyShort} weight="semibold" size="small">
                          {formaterSkjermlenkeType(item?.skjermlenkeType)}
                        </Link>
                      </button>
                      <Fieldset legend="" hideLegend>
                        <RhfRadioGroup
                          control={control}
                          name={`aksjonspunktGodkjenning.${index}.totrinnskontrollGodkjent`}
                          legend="Vurder om vilkåret er godkjent"
                          hideLegend
                        >
                          <HStack gap="space-16">
                            <Radio value={true}>Godkjent</Radio>
                            <Radio value={false}>Vurder på nytt</Radio>
                          </HStack>
                        </RhfRadioGroup>
                        {visBegrunnelseTekstfelt && (
                          <ArrowBox alignOffset={110}>
                            {visAvslagsårsakKryssbokser && (
                              <VStack gap="space-8">
                                <Detail>Årsak</Detail>
                                <Fieldset legend="" hideLegend>
                                  <HStack gap="space-80">
                                    <div>
                                      <RhfCheckbox
                                        control={control}
                                        name={`aksjonspunktGodkjenning.${index}.feilFakta`}
                                        label="Feil fakta"
                                        onChange={reValidate}
                                      />
                                      <RhfCheckbox
                                        control={control}
                                        name={`aksjonspunktGodkjenning.${index}.feilRegel`}
                                        label="Feil regelforståelse"
                                        onChange={reValidate}
                                      />
                                    </div>
                                    <div>
                                      <RhfCheckbox
                                        control={control}
                                        name={`aksjonspunktGodkjenning.${index}.feilLov`}
                                        label="Feil lovanvendelse"
                                        onChange={reValidate}
                                      />
                                      <RhfCheckbox
                                        control={control}
                                        name={`aksjonspunktGodkjenning.${index}.annet`}
                                        label="Annet"
                                        onChange={reValidate}
                                      />
                                    </div>
                                  </HStack>
                                  {checkboxValidationError && <ErrorMessage>{checkboxValidationError}</ErrorMessage>}
                                </Fieldset>
                              </VStack>
                            )}
                            <div className="mt-4">
                              <RhfTextarea
                                control={control}
                                name={`aksjonspunktGodkjenning.${index}.besluttersBegrunnelse`}
                                label="Begrunnelse"
                              />
                            </div>
                          </ArrowBox>
                        )}
                      </Fieldset>
                    </Box>
                  );
                })}
                <Box>
                  <Button variant="primary" size="small" type="submit" loading={isPending}>
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
