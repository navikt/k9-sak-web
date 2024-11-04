import type { AksjonspunktDto, VilkårPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { behandlingType as BehandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { Alert, BodyShort, Box, Button, HStack, Label, VStack } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';
import { type FunctionComponent, type SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { EditedIcon } from '../../../shared/EditedIcon';
import { type VilkarresultatMedOverstyringFormState } from './FormState';
import OverstyrBekreftKnappPanel from './OverstyrBekreftKnappPanel';
import { VilkarresultatMedBegrunnelse } from './VilkarresultatMedBegrunnelse';
import styles from './vilkarresultatMedOverstyringFormPeriodisert.module.css';
import VilkarResultPickerPeriodisertRHF from './VilkarResultPickerPeriodisertRHF';

export const vilkarUtfallPeriodisert = {
  OPPFYLT: 'OPPFYLT',
  IKKE_OPPFYLT: 'IKKE_OPPFYLT',
  DELVIS_OPPFYLT: 'DELVIS_OPPFYLT',
  DELVIS_IKKE_OPPFYLT: 'DELVIS_IKKE_OPPFYLT',
};

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
}) => {
  const periodeFom = periode?.periode?.fom ?? '';
  const periodeTom = periode?.periode?.tom ?? '';

  const buildInitialValues = (): VilkarresultatMedOverstyringFormState => {
    const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon === overstyringApKode);
    return {
      isOverstyrt: aksjonspunkt !== undefined,
      ...VilkarresultatMedBegrunnelse.buildInitialValues(aksjonspunkter, status, periode, avslagKode),
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
    <Form formMethods={formMethods} onSubmit={onSubmit}>
      {(erOverstyrt || hasAksjonspunkt) && (
        <div className={`${styles.aksjonspunktBox} ${erOverstyrt ? styles.aksjonspunktBoxOpen : ''}`}>
          <Label data-testid="overstyringform" size="small" as="p">
            Manuell overstyring av automatisk vurdering
          </Label>
          <Box marginBlock={'2 0'}>
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
) => ({
  kode: overstyringApKode,
  ...VilkarResultPickerPeriodisertRHF.transformValues(values, periodeFom, periodeTom),
  ...VilkarresultatMedBegrunnelse.transformValues(values),
});

export default VilkarresultatMedOverstyringFormPeriodisert;
