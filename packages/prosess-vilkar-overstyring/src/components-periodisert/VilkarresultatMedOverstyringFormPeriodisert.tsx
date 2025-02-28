import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel_ny.svg';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import {
  AksjonspunktBox,
  FlexColumn,
  FlexContainer,
  FlexRow,
  Image,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { EditedIcon } from '@k9-sak-web/gui/shared/EditedIcon.js';
import OverstyrBekreftKnappPanel from '@k9-sak-web/gui/shared/overstyrBekreftKnappPanel/OverstyrBekreftKnappPanel.js';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { VilkarResultPickerPeriodisertRHF } from '@k9-sak-web/prosess-felles';
import { Aksjonspunkt, Kodeverk, KodeverkMedNavn, SubmitCallback, Vilkarperiode } from '@k9-sak-web/types';
import { BodyShort, Button, Label } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';
import moment from 'moment';
import { FunctionComponent, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { VilkarresultatMedOverstyringFormState } from './FormState';
import { VilkarresultatMedBegrunnelse } from './VilkarresultatMedBegrunnelse';
import styles from './vilkarresultatMedOverstyringFormPeriodisert.module.css';
import { InnvilgetUtfallType } from '@k9-sak-web/types/src/vilkarTsType';

export interface CustomVilkarText {
  id: string;
  values?: any;
}

interface VilkarresultatMedOverstyringFormProps {
  aksjonspunkter: Aksjonspunkt[];
  avslagsarsaker: KodeverkMedNavn[];
  behandlingsresultat: {
    type: Kodeverk;
  };
  behandlingId: number;
  behandlingVersjon: number;
  behandlingType: Kodeverk;
  customVilkarIkkeOppfyltText?: CustomVilkarText;
  customVilkarOppfyltText?: CustomVilkarText;
  erMedlemskapsPanel: boolean;
  visPeriodisering: boolean;
  erOverstyrt?: boolean;
  hasAksjonspunkt: boolean;
  isReadOnly: boolean;
  lovReferanse?: string;
  medlemskapFom: string;
  overrideReadOnly: boolean;
  overstyringApKode: string;
  status: string;
  submitCallback: (props: SubmitCallback[]) => void;
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  avslagKode?: string;
  innvilgelseMerknadKode?: string;
  periode?: Vilkarperiode;
  opprettetAv?: string;
  relevanteInnvilgetUtfall?: InnvilgetUtfallType[];
}

/**
 * VilkarresultatForm
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const VilkarresultatMedOverstyringFormPeriodisert: FunctionComponent<
  Partial<VilkarresultatMedOverstyringFormProps>
> = ({
  aksjonspunkter,
  avslagKode,
  innvilgelseMerknadKode,
  avslagsarsaker,
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
  relevanteInnvilgetUtfall,
}) => {
  const buildInitialValues = (): VilkarresultatMedOverstyringFormState => {
    const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === overstyringApKode);
    return {
      isOverstyrt: aksjonspunkt !== undefined,
      ...VilkarresultatMedBegrunnelse.buildInitialValues(
        avslagKode,
        aksjonspunkter,
        status,
        periode,
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

  const periodeFom = periode?.periode?.fom;
  const periodeTom = periode?.periode?.tom;

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
  const overstyringAksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === overstyringApKode);
  const isSolvable =
    erOverstyrt ||
    (overstyringAksjonspunkt !== undefined
      ? !(overstyringAksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && !overstyringAksjonspunkt.kanLoses)
      : false);

  const isReadOnly = overrideReadOnly || !periode?.vurderesIBehandlingen;
  const hasAksjonspunkt = overstyringAksjonspunkt !== undefined;
  const opprettetAv = overstyringAksjonspunkt ? overstyringAksjonspunkt.opprettetAv : '';

  return (
    <Form formMethods={formMethods} onSubmit={onSubmit}>
      {(erOverstyrt || hasAksjonspunkt) && (
        <AksjonspunktBox className={styles.aksjonspunktMargin} erAksjonspunktApent={erOverstyrt}>
          <Label data-testid="overstyringform" size="small" as="p">
            <FormattedMessage id="VilkarresultatMedOverstyringForm.AutomatiskVurdering" />
          </Label>
          <VerticalSpacer eightPx />
          <VilkarresultatMedBegrunnelse
            skalViseBegrunnelse={erOverstyrt || hasAksjonspunkt}
            readOnly={isReadOnly || !erOverstyrt}
            erVilkarOk={erVilkarOk}
            customVilkarIkkeOppfyltText={customVilkarIkkeOppfyltText}
            customVilkarOppfyltText={customVilkarOppfyltText}
            erMedlemskapsPanel={erMedlemskapsPanel}
            visPeriodisering={visPeriodisering}
            avslagsarsaker={avslagsarsaker}
            relevanteInnvilgetUtfall={relevanteInnvilgetUtfall}
            periodeFom={periodeFom}
            periodeTom={periodeTom}
            valgtPeriodeFom={valgtPeriodeFom}
            valgtPeriodeTom={valgtPeriodeTom}
            periodeVilkarStatus={periodeVilkarStatus}
            opprettetAv={opprettetAv}
          />
          <VerticalSpacer sixteenPx />
          {!erOverstyrt && erVilkarOk !== undefined && (
            <>
              <VerticalSpacer fourPx />
              <FlexRow>
                <FlexColumn>
                  <EditedIcon />
                </FlexColumn>
                <FlexColumn>
                  <BodyShort size="small">
                    <FormattedMessage id="VilkarresultatMedOverstyringForm.Endret" />
                  </BodyShort>
                </FlexColumn>
              </FlexRow>
            </>
          )}
          {erOverstyrt && (
            <FlexContainer>
              <FlexRow>
                <FlexColumn>
                  <Image src={advarselIkonUrl} />
                </FlexColumn>
                <FlexColumn>
                  <Label size="small" as="p">
                    <FormattedMessage id="VilkarresultatMedOverstyringForm.Unntakstilfeller" />
                  </Label>
                </FlexColumn>
              </FlexRow>
              <VerticalSpacer sixteenPx />
              <FlexRow>
                <FlexColumn>
                  <OverstyrBekreftKnappPanel
                    submitting={formMethods.formState.isSubmitting}
                    pristine={!isSolvable || !formMethods.formState.isDirty}
                    overrideReadOnly={overrideReadOnly}
                  />
                </FlexColumn>
                <FlexColumn>
                  <Button
                    size="small"
                    variant="secondary"
                    type="button"
                    loading={formMethods.formState.isSubmitting}
                    disabled={formMethods.formState.isSubmitting}
                    onClick={toggleAv}
                  >
                    <FormattedMessage id="VilkarresultatMedOverstyringForm.Avbryt" />
                  </Button>
                </FlexColumn>
              </FlexRow>
            </FlexContainer>
          )}
        </AksjonspunktBox>
      )}
    </Form>
  );
};

const getCustomVilkarText = (medlemskapFom: string, behandlingType: Kodeverk, erOppfylt: boolean) => {
  const customVilkarText = { id: '', values: null };
  const isBehandlingRevurderingFortsattMedlemskap =
    behandlingType.kode === BehandlingType.REVURDERING && !!medlemskapFom;
  if (isBehandlingRevurderingFortsattMedlemskap) {
    customVilkarText.id = erOppfylt
      ? 'VilkarResultPicker.VilkarOppfyltRevurderingFom'
      : 'VilkarResultPicker.VilkarIkkeOppfyltRevurderingFom';
    customVilkarText.values = { fom: moment(medlemskapFom).format(DDMMYYYY_DATE_FORMAT) };
  }
  return customVilkarText.id ? customVilkarText : undefined;
};

const getCustomVilkarTextForOppfylt = (medlemskapFom: string, behandlingType: Kodeverk) =>
  getCustomVilkarText(medlemskapFom, behandlingType, true);

const getCustomVilkarTextForIkkeOppfylt = (medlemskapFom: string, behandlingType: Kodeverk) =>
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
