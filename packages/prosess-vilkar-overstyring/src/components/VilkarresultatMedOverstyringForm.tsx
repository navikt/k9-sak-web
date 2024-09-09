import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel_ny.svg';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import {
  AksjonspunktBox,
  EditedIcon,
  FlexColumn,
  FlexContainer,
  FlexRow,
  Image,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { VilkarResultPickerRHF } from '@k9-sak-web/prosess-felles';
import { Aksjonspunkt, Kodeverk, KodeverkMedNavn, SubmitCallback } from '@k9-sak-web/types';
import Vilkarperiode from '@k9-sak-web/types/src/vilkarperiode';
import { BodyShort, Button, Label } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';
import moment from 'moment';
import React, { SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { VilkarresultatMedOverstyringFormState } from './FormState';
import OverstyrBekreftKnappPanel from './OverstyrBekreftKnappPanel';
import VilkarresultatMedBegrunnelse from './VilkarresultatMedBegrunnelse';
import styles from './vilkarresultatMedOverstyringForm.module.css';

export interface CustomVilkarText {
  id: string;
  values?: any;
}

interface VilkarresultatMedOverstyringFormProps {
  aksjonspunkter: Aksjonspunkt[];
  behandlingsresultat: {
    type: string;
  };
  behandlingId: number;
  behandlingVersjon: number;
  behandlingType: string;
  erMedlemskapsPanel: boolean;
  erOverstyrt?: boolean;
  lovReferanse?: string;
  medlemskapFom: string;
  overrideReadOnly: boolean;
  overstyringApKode: string;
  status: string;
  submitCallback: (props: SubmitCallback[]) => void;
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  avslagKode?: string;
  periode?: Vilkarperiode;
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
}: Partial<VilkarresultatMedOverstyringFormProps>) => {
  const buildInitialValues = (): VilkarresultatMedOverstyringFormState => {
    const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon === overstyringApKode);
    return {
      isOverstyrt: aksjonspunkt !== undefined,
      ...VilkarresultatMedBegrunnelse.buildInitialValues(avslagKode, aksjonspunkter, status, periode),
    };
  };
  const formMethods = useForm<VilkarresultatMedOverstyringFormState>({
    defaultValues: buildInitialValues(),
  });
  const toggleAv = () => {
    formMethods.reset(buildInitialValues());
    toggleOverstyring(oldArray => oldArray.filter(code => code !== overstyringApKode));
  };

  const periodeFom = periode?.periode?.fom;
  const periodeTom = periode?.periode?.tom;

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
        <AksjonspunktBox className={styles.aksjonspunktMargin} erAksjonspunktApent={erOverstyrt}>
          <Label data-testid="overstyringform" size="small" as="p">
            <FormattedMessage id="VilkarresultatMedOverstyringForm.AutomatiskVurdering" />
          </Label>
          <VerticalSpacer eightPx />
          <VilkarresultatMedBegrunnelse
            skalViseBegrunnelse={erOverstyrt || !!overstyringAksjonspunkt}
            readOnly={isReadOnly || !erOverstyrt}
            erVilkarOk={erVilkarOk}
            customVilkarIkkeOppfyltText={customVilkarIkkeOppfyltText}
            customVilkarOppfyltText={customVilkarOppfyltText}
            erMedlemskapsPanel={erMedlemskapsPanel}
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

const getCustomVilkarText = (medlemskapFom: string, behandlingType: string, erOppfylt: boolean) => {
  const customVilkarText = { id: '', values: null };
  const isBehandlingRevurderingFortsattMedlemskap = behandlingType === BehandlingType.REVURDERING && !!medlemskapFom;
  if (isBehandlingRevurderingFortsattMedlemskap) {
    customVilkarText.id = erOppfylt
      ? 'VilkarResultPicker.VilkarOppfyltRevurderingFom'
      : 'VilkarResultPicker.VilkarIkkeOppfyltRevurderingFom';
    customVilkarText.values = { fom: moment(medlemskapFom).format(DDMMYYYY_DATE_FORMAT) };
  }
  return customVilkarText.id ? customVilkarText : undefined;
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
  ...VilkarResultPickerRHF.transformValues(values),
  ...VilkarresultatMedBegrunnelse.transformValues(values),
  periode: periodeFom && periodeTom ? { fom: periodeFom, tom: periodeTom } : undefined,
});

export default VilkarresultatMedOverstyringForm;
