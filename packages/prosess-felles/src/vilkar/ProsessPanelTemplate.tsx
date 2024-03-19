import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg';
import { hasBehandlingFormErrorsOfType, isBehandlingFormDirty, isBehandlingFormSubmitting } from '@fpsak-frontend/form';
import {
  AksjonspunktBox,
  FlexColumn,
  FlexContainer,
  FlexRow,
  Image,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { BodyShort, Detail, Heading, Label } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
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
            <Heading size="small" level="2">
              {title}
            </Heading>
          </FlexColumn>
          {lovReferanse && (
            <FlexColumn>
              <Detail className={styles.vilkar}>{lovReferanse}</Detail>
            </FlexColumn>
          )}
        </FlexRow>

        <FlexRow>
          <FlexColumn>
            {originalErVilkarOk && (
              <>
                <VerticalSpacer eightPx />
                <Label size="small" as="p">
                  {intl.formatMessage({ id: 'ProsessPanelTemplate.ErOppfylt' })}
                </Label>
              </>
            )}
            {originalErVilkarOk === false && (
              <>
                <VerticalSpacer eightPx />
                <Label size="small" as="p">
                  {intl.formatMessage({ id: 'ProsessPanelTemplate.ErIkkeOppfylt' })}
                </Label>
              </>
            )}
            {!isAksjonspunktOpen && originalErVilkarOk === undefined && (
              <>
                <VerticalSpacer eightPx />
                <BodyShort size="small">{intl.formatMessage({ id: 'ProsessPanelTemplate.IkkeBehandlet' })}</BodyShort>
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
