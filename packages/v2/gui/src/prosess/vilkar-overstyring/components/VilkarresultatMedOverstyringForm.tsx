import type { AksjonspunktDto, VilkårPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { behandlingType as BehandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import OverstyrBekreftKnappPanel from '@k9-sak-web/gui/shared/overstyrBekreftKnappPanel/OverstyrBekreftKnappPanel.js';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { Alert, BodyShort, Box, Button, HStack, Label, VStack } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';
import { type SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { EditedIcon } from '../../../shared/EditedIcon';
import { type VilkarresultatMedOverstyringFormState } from './FormState';
import VilkarresultatMedBegrunnelse from './VilkarresultatMedBegrunnelse';
import styles from './vilkarresultatMedOverstyringForm.module.css';
import VilkarResultPickerRHF from './VilkarResultPickerRHF';

export type SubmitData = Readonly<{
  begrunnelse: string;
  avslagskode?: string;
  avslagDato?: string;
  kode: string;
  erVilkarOk: boolean;
  periode: { tom: string; fom: string } | undefined;
}>;

interface VilkarresultatMedOverstyringFormProps {
  aksjonspunkter: AksjonspunktDto[];
  behandlingType: string;
  erMedlemskapsPanel: boolean;
  erOverstyrt?: boolean;
  medlemskapFom: string;
  overrideReadOnly: boolean;
  overstyringApKode: string;
  status: string;
  submitCallback: (props: SubmitData[]) => void;
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  avslagKode?: string;
  periode: VilkårPeriodeDto;
  vilkarType: string;
}

/**
 * VilkarresultatForm
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const VilkarresultatMedOverstyringForm = ({
  aksjonspunkter,
  avslagKode,
  behandlingType,
  erMedlemskapsPanel,
  erOverstyrt,
  medlemskapFom,
  overrideReadOnly,
  overstyringApKode,
  periode,
  submitCallback,
  status,
  toggleOverstyring,
  vilkarType,
}: VilkarresultatMedOverstyringFormProps) => {
  const buildInitialValues = (): VilkarresultatMedOverstyringFormState => {
    const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon === overstyringApKode);
    return {
      isOverstyrt: aksjonspunkt !== undefined,
      ...VilkarresultatMedBegrunnelse.buildInitialValues(aksjonspunkter, status, periode, avslagKode),
    };
  };
  const formMethods = useForm<VilkarresultatMedOverstyringFormState>({
    defaultValues: buildInitialValues(),
  });
  const toggleAv = () => {
    formMethods.reset(buildInitialValues());
    toggleOverstyring(oldArray => oldArray.filter(code => code !== overstyringApKode));
  };

  const periodeFom = periode?.periode?.fom ?? '';
  const periodeTom = periode?.periode?.tom ?? '';

  const onSubmit = (values: VilkarresultatMedOverstyringFormState) =>
    submitCallback([transformValues(values, overstyringApKode, periodeFom, periodeTom)]);

  useEffect(
    () => () => {
      formMethods.reset(buildInitialValues());
    },
    [periodeFom, periodeTom],
  );

  const erVilkarOk = formMethods.watch('erVilkarOk');

  const customVilkarOppfyltText = getCustomVilkarTextForOppfylt(medlemskapFom, behandlingType);
  const customVilkarIkkeOppfyltText = getCustomVilkarTextForIkkeOppfylt(medlemskapFom, behandlingType);
  const overstyringAksjonspunkt = aksjonspunkter.find(ap => ap.definisjon === overstyringApKode);
  const isReadOnly = overrideReadOnly || !periode?.vurderesIBehandlingen;
  const opprettetAv = overstyringAksjonspunkt ? overstyringAksjonspunkt.opprettetAv : '';
  const isSolvable =
    erOverstyrt ||
    (overstyringAksjonspunkt !== undefined
      ? !(overstyringAksjonspunkt.status === aksjonspunktStatus.OPPRETTET && !overstyringAksjonspunkt.kanLoses)
      : false);

  return (
    <Form formMethods={formMethods} onSubmit={onSubmit}>
      {(erOverstyrt || !!overstyringAksjonspunkt) && (
        <div className={`${styles.aksjonspunktBox} ${erOverstyrt ? styles.aksjonspunktBoxOpen : ''}`}>
          <Label data-testid="overstyringform" size="small" as="p">
            Manuell overstyring av automatisk vurdering
          </Label>
          <Box marginBlock={'2 0'}>
            <VilkarresultatMedBegrunnelse
              skalViseBegrunnelse={erOverstyrt || !!overstyringAksjonspunkt}
              readOnly={isReadOnly || !erOverstyrt}
              erVilkarOk={erVilkarOk}
              customVilkarIkkeOppfyltText={customVilkarIkkeOppfyltText}
              customVilkarOppfyltText={customVilkarOppfyltText}
              erMedlemskapsPanel={erMedlemskapsPanel}
              opprettetAv={opprettetAv ?? ''}
              vilkarType={vilkarType}
            />
          </Box>
          <Box marginBlock={'4 0'}>
            {!erOverstyrt && erVilkarOk !== undefined && (
              <Box marginBlock={'1 0'}>
                <HStack gap="4" align="center">
                  <EditedIcon />
                  <BodyShort size="small">Endret av saksbehandler</BodyShort>
                </HStack>
              </Box>
            )}
            {erOverstyrt && (
              <VStack gap="4">
                <Alert size="small" inline variant="warning">
                  Overstyring skal kun gjøres i unntakstilfeller
                </Alert>
                <HStack gap="4">
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
          </Box>
        </div>
      )}
    </Form>
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
): SubmitData => ({
  kode: overstyringApKode,
  ...VilkarResultPickerRHF.transformValues(values),
  ...VilkarresultatMedBegrunnelse.transformValues(values),
  periode: periodeFom && periodeTom ? { fom: periodeFom, tom: periodeTom } : undefined,
});

export default VilkarresultatMedOverstyringForm;
