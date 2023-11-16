import { Element, Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import React, { ReactNode } from 'react';

import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg?react';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg?react';
import { hasBehandlingFormErrorsOfType, isBehandlingFormDirty, isBehandlingFormSubmitting } from '@fpsak-frontend/form';
import {
  AksjonspunktBox,
  FlexColumn,
  FlexContainer,
  FlexRow,
  Image,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';

import getPackageIntl from '../../i18n/getPackageIntl';
import ProsessStegSubmitButton from '../ProsessStegSubmitButton';

import styles from './prosessPanelTemplate.module.css';

interface OwnProps {
  title: string;
  behandlingId: number;
  behandlingVersjon: number;
  lovReferanse?: string;
  isAksjonspunktOpen: boolean;
  handleSubmit: (data: any) => any;
  formName: string;
  readOnlySubmitButton: boolean;
  originalErVilkarOk?: boolean;
  rendreFakta?: () => void;
  readOnly: boolean;
  isDirty?: boolean;
  children: ReactNode | ReactNode[];
  isPeriodisertFormComplete?: boolean;
}

/*
 * ProsessPanelTemplate
 *
 * Presentasjonskomponent.
 */
const ProsessPanelTemplate = ({
  behandlingId,
  behandlingVersjon,
  lovReferanse,
  title,
  originalErVilkarOk,
  isAksjonspunktOpen,
  handleSubmit,
  formName,
  readOnlySubmitButton,
  readOnly,
  rendreFakta,
  isDirty,
  children,
  isPeriodisertFormComplete,
}: OwnProps) => {
  const intl = getPackageIntl();
  return (
    <form onSubmit={handleSubmit}>
      <FlexContainer>
        <FlexRow>
          {originalErVilkarOk !== undefined && (
            <FlexColumn>
              <Image className={styles.status} src={originalErVilkarOk ? innvilgetImage : avslattImage} />
            </FlexColumn>
          )}
          <FlexColumn>
            <Undertittel>{title}</Undertittel>
          </FlexColumn>
          {lovReferanse && (
            <FlexColumn>
              <Undertekst className={styles.vilkar}>{lovReferanse}</Undertekst>
            </FlexColumn>
          )}
        </FlexRow>

        <FlexRow>
          <FlexColumn>
            {originalErVilkarOk && (
              <>
                <VerticalSpacer eightPx />
                <Element>{intl.formatMessage({ id: 'ProsessPanelTemplate.ErOppfylt' })}</Element>
              </>
            )}
            {originalErVilkarOk === false && (
              <>
                <VerticalSpacer eightPx />
                <Element>{intl.formatMessage({ id: 'ProsessPanelTemplate.ErIkkeOppfylt' })}</Element>
              </>
            )}
            {!isAksjonspunktOpen && originalErVilkarOk === undefined && (
              <>
                <VerticalSpacer eightPx />
                <Normaltekst>{intl.formatMessage({ id: 'ProsessPanelTemplate.IkkeBehandlet' })}</Normaltekst>
              </>
            )}
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      {isAksjonspunktOpen && <VerticalSpacer eightPx />}
      <AksjonspunktBox className={styles.aksjonspunktMargin} erAksjonspunktApent={isAksjonspunktOpen}>
        {children}
        {!readOnly && <VerticalSpacer sixteenPx />}
        <ProsessStegSubmitButton
          formName={formName}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          isReadOnly={readOnly}
          isSubmittable={!readOnlySubmitButton}
          isDirty={isDirty}
          isBehandlingFormSubmitting={isBehandlingFormSubmitting}
          isBehandlingFormDirty={isBehandlingFormDirty}
          hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
          isPeriodisertFormComplete={isPeriodisertFormComplete}
        />
      </AksjonspunktBox>
      {rendreFakta && (
        <>
          <VerticalSpacer sixteenPx />
          {rendreFakta()}
        </>
      )}
    </form>
  );
};

export default ProsessPanelTemplate;
