import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { SkjermlenkeType } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/SkjermlenkeType.js';
import { VurderÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/VurderÅrsak.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/ungsak/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
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
import { useState } from 'react';
import { useFieldArray, useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi';
import styles from './beslutter.module.css';
import { InngangsvilkårTab } from './types';
import { aksjonspunktErÅpent } from './utils/utils';
import { VilkårSplittPanel, type VilkårSplittPanelItem } from './VilkårSplittPanel';

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
  [SkjermlenkeType.BOSTEDSVILKÅR]: InngangsvilkårTab.BOSATT_I_TRONDHEIM,
  [SkjermlenkeType.VURDER_ANDRE_LIVSOPPHOLDSYTELSER]: InngangsvilkårTab.ANDRE_LIVSOPPHOLDYTELSER,
  [SkjermlenkeType.BISTANDSVILKÅR]: InngangsvilkårTab.BEHOV_FOR_BISTAND,
  [SkjermlenkeType.SOEKNADSFRIST]: InngangsvilkårTab.SØKNADSFRIST,
};

const tabSortOrder: InngangsvilkårTab[] = [
  InngangsvilkårTab.SØKNADSFRIST,
  InngangsvilkårTab.ALDER,
  InngangsvilkårTab.BOSATT_I_TRONDHEIM,
  InngangsvilkårTab.ANDRE_LIVSOPPHOLDYTELSER,
  InngangsvilkårTab.BEHOV_FOR_BISTAND,
];

const getTabOrderIndex = (skjermlenkeType: string): number => {
  const tab = skjermlenkeTypeToTab[skjermlenkeType];
  const index = tab ? tabSortOrder.indexOf(tab) : -1;
  return index === -1 ? Number.POSITIVE_INFINITY : index;
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
    .sort((a, b) => getTabOrderIndex(a.skjermlenkeType) - getTabOrderIndex(b.skjermlenkeType));

  return {
    aksjonspunktGodkjenning,
  };
};

interface Props {
  lokalkontorBeslutterAp: AksjonspunktDto | undefined;
  innloggetBruker: InnloggetAnsattUngV2Dto;
  onTabChange: React.Dispatch<React.SetStateAction<InngangsvilkårTab>>;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContextDto[];
  søknadsfristVilkår: VilkårMedPerioderDto;
}

export const Beslutter = ({
  lokalkontorBeslutterAp,
  innloggetBruker,
  onTabChange,
  api,
  behandling,
  onAksjonspunktBekreftet,
  totrinnskontrollSkjermlenkeContext,
  søknadsfristVilkår,
}: Props) => {
  const formHook = useForm<FormValues>({
    defaultValues: buildDefaultValues(totrinnskontrollSkjermlenkeContext),
  });

  const { control, getFieldState, trigger } = formHook;
  const { fields } = useFieldArray({ control, name: 'aksjonspunktGodkjenning' });
  const aksjonspunktGodkjenning = useWatch({ control, name: 'aksjonspunktGodkjenning' });
  const isAksjonspunktSolved = lokalkontorBeslutterAp?.status === AksjonspunktStatus.UTFØRT;
  const kanBeslutte = !!innloggetBruker.aktivitetspengerDel1SaksbehandlerTilgang?.kanBeslutte;
  const items: VilkårSplittPanelItem[] = (søknadsfristVilkår?.perioder ?? []).map(p => ({
    id: p.periode.fom,
    status: isAksjonspunktSolved ? 'success' : 'warning',
    label: `${formatDate(p.periode.fom)}`,
    periode: p.periode,
  }));
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '');
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
          {!isAksjonspunktSolved && kanBeslutte && (
            <Alert variant="warning" size="small">
              Kontroller faglige vurderinger for inngangsvilkår.
            </Alert>
          )}
          <VilkårSplittPanel
            items={items}
            selectedItemId={selectedId}
            onItemSelect={setSelectedId}
            detailHeading="Besluttervurdering"
            defaultIsLocked={isAksjonspunktSolved}
          >
            {lokalkontorBeslutterAp && aksjonspunktErÅpent(lokalkontorBeslutterAp) && (
              <RhfForm formMethods={formHook} onSubmit={onSubmit}>
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
                          case SkjermlenkeType.BOSTEDSVILKÅR:
                            return 'Bosatt i Trondheim';
                          case SkjermlenkeType.VURDER_ANDRE_LIVSOPPHOLDSYTELSER:
                            return 'Andre livsoppholdsytelser';
                          case SkjermlenkeType.BISTANDSVILKÅR:
                            return 'Behov for bistand';
                          case SkjermlenkeType.SOEKNADSFRIST:
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
                                      {checkboxValidationError && (
                                        <ErrorMessage>{checkboxValidationError}</ErrorMessage>
                                      )}
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
          </VilkårSplittPanel>
        </VStack>
      )}
    </>
  );
};
