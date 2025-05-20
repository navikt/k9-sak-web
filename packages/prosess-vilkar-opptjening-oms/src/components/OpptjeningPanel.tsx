import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg';
import { hasBehandlingFormErrorsOfType, isBehandlingFormDirty, isBehandlingFormSubmitting } from '@fpsak-frontend/form';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import AksjonspunktBox from '@k9-sak-web/gui/shared/aksjonspunktBox/AksjonspunktBox.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import ProsessStegSubmitButton from '@k9-sak-web/prosess-felles/src/ProsessStegSubmitButton';
import { BodyShort, Detail, Heading, Label } from '@navikt/ds-react';
import { ReactNode } from 'react';
import { useIntl } from 'react-intl';
import styles from './opptjeningPanel.module.css';

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
  rendreFakta?: () => ReactNode;
  readOnly: boolean;
  isDirty?: boolean;
  children: ReactNode | ReactNode[];
  isPeriodisertFormComplete?: boolean;
  skjulAksjonspunktVisning?: boolean;
  aksjonspunktErLøst?: boolean;
}

/*
 * OpptjeningPanel
 *
 * Presentasjonskomponent.
 */
const OpptjeningPanel = ({
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
  skjulAksjonspunktVisning,
  aksjonspunktErLøst,
}: OwnProps) => {
  const intl = useIntl();
  return (
    <form onSubmit={handleSubmit}>
      <FlexContainer>
        <FlexRow>
          {aksjonspunktErLøst && (
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
              <Detail className={styles.vilkar}>
                <Lovreferanse>{lovReferanse}</Lovreferanse>
              </Detail>
            </FlexColumn>
          )}
        </FlexRow>

        <FlexRow>
          <FlexColumn>
            {aksjonspunktErLøst && (
              <>
                {originalErVilkarOk && (
                  <>
                    <VerticalSpacer eightPx />
                    <Label size="small" as="p">
                      {intl.formatMessage({ id: 'OpptjeningVilkarView.Oppfylt' })}
                    </Label>
                  </>
                )}
                {originalErVilkarOk === false && (
                  <>
                    <VerticalSpacer eightPx />
                    <Label size="small" as="p">
                      {intl.formatMessage({ id: 'OpptjeningPanel.ErIkkeOppfylt' })}
                    </Label>
                  </>
                )}
              </>
            )}
            {!isAksjonspunktOpen && originalErVilkarOk === undefined && (
              <>
                <VerticalSpacer eightPx />
                <BodyShort size="small">{intl.formatMessage({ id: 'OpptjeningPanel.IkkeBehandlet' })}</BodyShort>
              </>
            )}
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      {isAksjonspunktOpen && <VerticalSpacer eightPx />}
      <AksjonspunktBox
        className={styles.aksjonspunktMargin}
        erAksjonspunktApent={isAksjonspunktOpen && !skjulAksjonspunktVisning}
      >
        {children}
        {!readOnly && <VerticalSpacer sixteenPx />}
        {!skjulAksjonspunktVisning && (
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
        )}
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

export default OpptjeningPanel;
