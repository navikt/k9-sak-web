import type {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  k9_sak_kontrakt_vilkår_InnvilgetMerknad as InnvilgetMerknad,
  k9_sak_kontrakt_vilkår_VilkårPeriodeDto as VilkårPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { behandlingType as BehandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import OverstyrBekreftKnappPanel from '@k9-sak-web/gui/shared/overstyrBekreftKnappPanel/OverstyrBekreftKnappPanel.js';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { Alert, BodyShort, Box, Button, HStack, Label, VStack } from '@navikt/ds-react';
import { RhfForm } from '@navikt/ft-form-hooks';
import { type FunctionComponent, type SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { EditedIcon } from '../../../shared/EditedIcon';
import { type VilkarresultatMedOverstyringFormState } from './FormState';
import { VilkarresultatMedBegrunnelse } from './VilkarresultatMedBegrunnelse';
import styles from './vilkarresultatMedOverstyringFormPeriodisert.module.css';
import VilkarResultPickerPeriodisertRHF from './VilkarResultPickerPeriodisertRHF';

interface VilkarresultatMedOverstyringFormProps {
  aksjonspunkter: AksjonspunktDto[];
  behandlingType: string;
  erMedlemskapsPanel: boolean;
  visPeriodisering: boolean;
  erOverstyrt?: boolean;
  medlemskapFom: string;
  overrideReadOnly: boolean;
  overstyringApKode: string;
  status: string;
  submitCallback: (props: any[]) => void;
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  avslagKode?: string;
  periode: VilkårPeriodeDto;
  vilkarType: string;
  innvilgelseMerknadKode?: string;
  relevanteInnvilgetMerknader: InnvilgetMerknad[];
}

/**
 * VilkarresultatForm
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const VilkarresultatMedOverstyringFormPeriodisert: FunctionComponent<VilkarresultatMedOverstyringFormProps> = ({
  aksjonspunkter,
  avslagKode,
  behandlingType,
  erMedlemskapsPanel,
  erOverstyrt,
  medlemskapFom,
  overrideReadOnly,
  overstyringApKode,
  periode,
  status,
  submitCallback,
  toggleOverstyring,
  visPeriodisering,
  vilkarType,
  innvilgelseMerknadKode,
  relevanteInnvilgetMerknader,
}) => {
  const periodeFom = periode?.periode?.fom ?? '';
  const periodeTom = periode?.periode?.tom ?? '';

  const buildInitialValues = (): VilkarresultatMedOverstyringFormState => {
    const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon === overstyringApKode);
    return {
      isOverstyrt: aksjonspunkt !== undefined,
      ...VilkarresultatMedBegrunnelse.buildInitialValues(
        aksjonspunkter,
        status,
        periode,
        avslagKode,
        innvilgelseMerknadKode,
      ),
    };
  };
  const onSubmit = (values: VilkarresultatMedOverstyringFormState) =>
    submitCallback([transformValues(values, overstyringApKode, periodeFom, periodeTom)]);
  const formMethods = useForm<VilkarresultatMedOverstyringFormState>({
    defaultValues: buildInitialValues(),
  });

  const toggleAv = () => {
    formMethods.reset(buildInitialValues());
    toggleOverstyring(oldArray => oldArray.filter(code => code !== overstyringApKode));
  };

  useEffect(
    () => () => {
      formMethods.reset(buildInitialValues());
    },
    [periodeFom, periodeTom],
  );

  const valgtPeriodeFom = formMethods.watch('valgtPeriodeFom');
  const valgtPeriodeTom = formMethods.watch('valgtPeriodeTom');
  const erVilkarOk = formMethods.watch('erVilkarOk');
  const periodeVilkarStatus = formMethods.watch('periodeVilkarStatus');

  const customVilkarOppfyltText = getCustomVilkarTextForOppfylt(medlemskapFom, behandlingType);
  const customVilkarIkkeOppfyltText = getCustomVilkarTextForIkkeOppfylt(medlemskapFom, behandlingType);
  const overstyringAksjonspunkt = aksjonspunkter.find(ap => ap.definisjon === overstyringApKode);
  const isSolvable =
    erOverstyrt ||
    (overstyringAksjonspunkt !== undefined
      ? !(overstyringAksjonspunkt.status === aksjonspunktStatus.OPPRETTET && !overstyringAksjonspunkt.kanLoses)
      : false);

  const isReadOnly = overrideReadOnly || !periode?.vurderesIBehandlingen;
  const hasAksjonspunkt = overstyringAksjonspunkt !== undefined;
  const opprettetAv = overstyringAksjonspunkt?.opprettetAv ? overstyringAksjonspunkt.opprettetAv : '';

  return (
    <RhfForm formMethods={formMethods} onSubmit={onSubmit}>
      {(erOverstyrt || hasAksjonspunkt) && (
        <div className={`${styles.aksjonspunktBox} ${erOverstyrt ? styles.aksjonspunktBoxOpen : ''}`}>
          <Label data-testid="overstyringform" size="small" as="p">
            Manuell overstyring av automatisk vurdering
          </Label>
          <Box.New marginBlock={'2 0'}>
            <VilkarresultatMedBegrunnelse
              skalViseBegrunnelse={erOverstyrt || hasAksjonspunkt}
              readOnly={isReadOnly || !erOverstyrt}
              erVilkarOk={erVilkarOk}
              customVilkarIkkeOppfyltText={customVilkarIkkeOppfyltText}
              customVilkarOppfyltText={customVilkarOppfyltText}
              erMedlemskapsPanel={erMedlemskapsPanel}
              visPeriodisering={visPeriodisering}
              periodeFom={periodeFom}
              periodeTom={periodeTom}
              valgtPeriodeFom={valgtPeriodeFom}
              valgtPeriodeTom={valgtPeriodeTom}
              periodeVilkarStatus={periodeVilkarStatus}
              opprettetAv={opprettetAv}
              vilkarType={vilkarType}
              relevanteInnvilgetMerknader={relevanteInnvilgetMerknader}
            />
          </Box.New>
          <Box.New marginBlock={'4 0'}>
            {!erOverstyrt && erVilkarOk !== undefined && (
              <Box.New marginBlock={'1 0'}>
                <HStack gap="space-16" align="center">
                  <EditedIcon />
                  <BodyShort size="small">Endret av saksbehandler</BodyShort>
                </HStack>
              </Box.New>
            )}
            {erOverstyrt && (
              <VStack gap="space-16">
                <Alert size="small" inline variant="warning">
                  Overstyring skal kun gjøres i unntakstilfeller
                </Alert>
                <HStack gap="space-16">
                  <OverstyrBekreftKnappPanel
                    submitting={formMethods.formState.isSubmitting}
                    pristine={!isSolvable || !formMethods.formState.isDirty}
                    overrideReadOnly={overrideReadOnly}
                  />
                  <Button
                    size="small"
                    variant="secondary"
                    type="button"
                    loading={formMethods.formState.isSubmitting}
                    disabled={formMethods.formState.isSubmitting}
                    onClick={toggleAv}
                  >
                    Avbryt
                  </Button>
                </HStack>
              </VStack>
            )}
          </Box.New>
        </div>
      )}
    </RhfForm>
  );
};

const getCustomVilkarText = (medlemskapFom: string, behandlingType: string, erOppfylt: boolean) => {
  const isBehandlingRevurderingFortsattMedlemskap = behandlingType === BehandlingType.REVURDERING && !!medlemskapFom;
  if (isBehandlingRevurderingFortsattMedlemskap) {
    return erOppfylt ? (
      `Vilkåret er oppfylt f.o.m. ${initializeDate(medlemskapFom).format(DDMMYYYY_DATE_FORMAT)}`
    ) : (
      <>
        Vilkåret er <b>ikke</b> oppfylt f.o.m. {`${initializeDate(medlemskapFom).format(DDMMYYYY_DATE_FORMAT)}`}
      </>
    );
  }
  return undefined;
};

const getCustomVilkarTextForOppfylt = (medlemskapFom: string, behandlingType: string) =>
  getCustomVilkarText(medlemskapFom, behandlingType, true);

const getCustomVilkarTextForIkkeOppfylt = (medlemskapFom: string, behandlingType: string) =>
  getCustomVilkarText(medlemskapFom, behandlingType, false);

const transformValues = (
  values: VilkarresultatMedOverstyringFormState,
  overstyringApKode: string,
  periodeFom: string,
  periodeTom: string,
) => ({
  kode: overstyringApKode,
  ...VilkarResultPickerPeriodisertRHF.transformValues(values, periodeFom, periodeTom),
  ...VilkarresultatMedBegrunnelse.transformValues(values),
});

export default VilkarresultatMedOverstyringFormPeriodisert;
