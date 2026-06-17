import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { VurderÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/VurderÅrsak.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/ungsak/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import {
  Alert,
  BodyShort,
  Box,
  Button,
  Detail,
  ErrorMessage,
  Fieldset,
  HStack,
  Link,
  Radio,
  VStack,
} from '@navikt/ds-react';
import { RhfCheckbox, RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { ArrowBox } from '@navikt/ft-ui-komponenter';
import { useMutation } from '@tanstack/react-query';
import { useFieldArray, useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';
import styles from './beslutterOpphør.module.css';
import { OpphørTab } from './types.js';

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

const skjermlenkeTypeToTab: Record<string, OpphørTab | undefined> = {
  KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST: OpphørTab.ÅRSAK_OG_VARSEL,
  OPPHØR_VILKÅR: OpphørTab.VILKÅRSVURDERING,
};

const tabSortOrder: OpphørTab[] = [OpphørTab.ÅRSAK_OG_VARSEL, OpphørTab.VILKÅRSVURDERING];

const getTabOrderIndex = (skjermlenkeType: string): number => {
  const tab = skjermlenkeTypeToTab[skjermlenkeType];
  const index = tab ? tabSortOrder.indexOf(tab) : -1;
  return index === -1 ? Number.POSITIVE_INFINITY : index;
};

const formaterSkjermlenkeType = (skjermlenkeType?: string): string => {
  switch (skjermlenkeType) {
    case 'KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST':
      return 'Årsak og varsel';
    case 'OPPHØR_VILKÅR':
      return 'Vilkårsvurdering';
    default:
      return skjermlenkeType ?? '';
  }
};

const buildDefaultValues = (
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContextDto[],
): FormValues => {
  const aksjonspunktGodkjenning = totrinnskontrollSkjermlenkeContext
    .flatMap(ctx =>
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
    )
    .toSorted((a, b) => getTabOrderIndex(a.skjermlenkeType) - getTabOrderIndex(b.skjermlenkeType));

  return { aksjonspunktGodkjenning };
};

interface Props {
  lokalkontorBeslutterAp: AksjonspunktDto | undefined;
  onTabChange: React.Dispatch<React.SetStateAction<OpphørTab>>;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContextDto[];
  kanBeslutte: boolean;
}

export const BeslutterOpphør = ({
  lokalkontorBeslutterAp,
  onTabChange,
  api,
  behandling,
  onAksjonspunktBekreftet,
  totrinnskontrollSkjermlenkeContext,
  kanBeslutte,
}: Props) => {
  const formHook = useForm<FormValues>({
    defaultValues: buildDefaultValues(totrinnskontrollSkjermlenkeContext),
  });

  const { control, getFieldState, trigger } = formHook;
  const { fields } = useFieldArray({ control, name: 'aksjonspunktGodkjenning' });
  const aksjonspunktGodkjenning = useWatch({ control, name: 'aksjonspunktGodkjenning' });
  const isAksjonspunktSolved = lokalkontorBeslutterAp?.status === AksjonspunktStatus.UTFØRT;

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      if (!lokalkontorBeslutterAp?.definisjon) {
        return;
      }
      const payload = {
        '@type': AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
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
    <>
      {!kanBeslutte && (
        <Box width="fit-content">
          <Alert size="small" variant="info">
            Saken er sendt til beslutter.
          </Alert>
        </Box>
      )}
      {kanBeslutte && (
        <VStack gap="space-20">
          {!isAksjonspunktSolved && (
            <Alert variant="warning" size="small">
              Kontroller faglige vurderinger for opphør.
            </Alert>
          )}
          <VStack gap="space-16" marginInline="space-16">
            <RhfForm formMethods={formHook} onSubmit={onSubmit}>
              <VStack gap="space-28">
                {fields.map((field, index) => {
                  const item = aksjonspunktGodkjenning?.[index];
                  const visAvslagsårsakKryssbokser = item?.totrinnskontrollGodkjent === false;
                  const visBegrunnelseTekstfelt = item?.totrinnskontrollGodkjent === false;

                  const { error } = getFieldState(`aksjonspunktGodkjenning.${index}`);
                  const checkboxValidationError = error?.message;
                  const reValidate = () => trigger(`aksjonspunktGodkjenning.${index}`);

                  const tab = skjermlenkeTypeToTab[item?.skjermlenkeType ?? ''];

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
                            <Box marginBlock="space-16 space-0" maxWidth="70ch" width="100%">
                              <RhfTextarea
                                control={control}
                                name={`aksjonspunktGodkjenning.${index}.besluttersBegrunnelse`}
                                label="Begrunnelse"
                              />
                            </Box>
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
            </RhfForm>
          </VStack>
        </VStack>
      )}
    </>
  );
};
