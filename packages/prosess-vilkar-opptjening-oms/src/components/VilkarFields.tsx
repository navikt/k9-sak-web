import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Normaltekst } from 'nav-frontend-typografi';
import { VerticalSpacer, FlexContainer, FlexRow, FlexColumn, Image } from '@fpsak-frontend/shared-components';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { ProsessStegBegrunnelseTextField } from '@k9-sak-web/prosess-felles';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { required } from '@fpsak-frontend/utils';
import { Aksjonspunkt, Vilkarperiode } from '@k9-sak-web/types';

import avslattImage from '@fpsak-frontend/assets/images/avslaatt.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/check.svg';

import styles from './VilkarFields.less';

export const midlertidigInaktiv = {
  TYPE_A: '7847A',
  TYPE_B: '7847B',
};

type FormValues = {
  erVilkarOk: string | boolean;
  vilkarFields: { erVilkarOk: string | boolean }[];
};

interface VilkarFieldsProps {
  erOmsorgspenger?: boolean;
  fieldPrefix: string;
  readOnly: boolean;
}

export const VilkarFields = ({
  erOmsorgspenger,
  fieldPrefix,
  erVilkarOk,
  readOnly,
}: VilkarFieldsProps & Partial<FormValues>) => {
  const intl = useIntl();
  const erIkkeOppfyltText = (
    <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.ErIkkeOppfylt" values={{ b: chunks => <b>{chunks}</b> }} />
  );
  const erOppfyltText = <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.ErOppfylt" />;
  const er847Text = <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.Er847" />;

  return (
    <>
      <ProsessStegBegrunnelseTextField
        text={
          erOmsorgspenger
            ? intl.formatMessage({ id: 'OpptjeningVilkarAksjonspunktPanel.OmsorgspengerVurderLabel' })
            : undefined
        }
        readOnly={readOnly}
        fieldNamePrefix={fieldPrefix}
        placeholderText={intl.formatMessage({ id: 'OpptjeningVilkarAksjonspunktPanel.VurderingPlaceholder' })}
      />
      <VerticalSpacer sixteenPx />
      {readOnly && erVilkarOk !== undefined && (
        <FlexContainer>
          <FlexRow>
            <FlexColumn>
              <Image className={styles.image} src={erVilkarOk ? innvilgetImage : avslattImage} />
            </FlexColumn>
            <FlexColumn>
              {typeof erVilkarOk === 'string' && Object.values(midlertidigInaktiv).includes(erVilkarOk) === true && (
                <Normaltekst>{er847Text}</Normaltekst>
              )}
              {erVilkarOk === true && <Normaltekst>{erOppfyltText}</Normaltekst>}
              {!erVilkarOk && <Normaltekst>{erIkkeOppfyltText}</Normaltekst>}
            </FlexColumn>
          </FlexRow>
          <VerticalSpacer eightPx />
        </FlexContainer>
      )}
      {(!readOnly || erVilkarOk === undefined) && (
        <RadioGroupField
          name={`${fieldPrefix}.erVilkarOk`}
          validate={[required]}
          bredde="XXL"
          direction="vertical"
          readOnly={readOnly}
        >
          {({ optionProps }) => (
            <FlexContainer>
              <FlexColumn>
                <FlexRow spaceBetween={false}>
                  <RadioOption label={erOppfyltText} value {...optionProps} />
                </FlexRow>
                <FlexRow spaceBetween={false}>
                  <RadioOption label={erIkkeOppfyltText} value={false} {...optionProps} />
                </FlexRow>
                {!erOmsorgspenger ? (
                  <FlexRow spaceBetween={false}>
                    <RadioOption
                      label={{ id: 'OpptjeningVilkarAksjonspunktPanel.MidlertidigInaktivA' }}
                      value={midlertidigInaktiv.TYPE_A}
                      {...optionProps}
                    />
                  </FlexRow>
                ) : null}
                <FlexRow spaceBetween={false}>
                  <RadioOption
                    label={{ id: 'OpptjeningVilkarAksjonspunktPanel.MidlertidigInaktivB' }}
                    value={midlertidigInaktiv.TYPE_B}
                    {...optionProps}
                  />
                </FlexRow>
              </FlexColumn>
            </FlexContainer>
          )}
        </RadioGroupField>
      )}
      <VerticalSpacer sixteenPx />
    </>
  );
};

VilkarFields.buildInitialValues = (
  aksjonspunkter: Aksjonspunkt[],
  vilkårPerioder: Vilkarperiode[],
  status: string,
): FormValues => {
  const isOpenAksjonspunkt = aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode));
  const erVilkarOk = isOpenAksjonspunkt ? undefined : vilkarUtfallType.OPPFYLT === status;
  return {
    erVilkarOk,
    vilkarFields: Array.isArray(vilkårPerioder)
      ? vilkårPerioder.map(periode => ({
          begrunnelse: periode.begrunnelse,
          erVilkarOk: Object.values(midlertidigInaktiv).includes(periode.merknad?.kode)
            ? periode.merknad.kode
            : periode.vilkarStatus.kode === vilkarUtfallType.OPPFYLT,
        }))
      : [],
  };
};

export default VilkarFields;
