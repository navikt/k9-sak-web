import { RadioGroupField } from '@fpsak-frontend/form';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { ProsessStegBegrunnelseTextField } from '@k9-sak-web/prosess-felles';
import { Aksjonspunkt, Vilkarperiode } from '@k9-sak-web/types';
import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import avslattImage from '@fpsak-frontend/assets/images/avslaatt.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/check.svg';

import styles from './VilkarFields.module.css';

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
  skalValgMidlertidigInaktivTypeBVises: boolean;
}

export const VilkarFields = ({
  erOmsorgspenger,
  fieldPrefix,
  erVilkarOk,
  readOnly,
  skalValgMidlertidigInaktivTypeBVises,
}: VilkarFieldsProps & Partial<FormValues>) => {
  const intl = useIntl();
  const erIkkeOppfyltText = (
    <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.ErIkkeOppfylt" values={{ b: chunks => <b>{chunks}</b> }} />
  );
  const erOppfyltText = <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.ErOppfylt" />;

  const hent847Text = () => {
    switch (erVilkarOk) {
      case midlertidigInaktiv.TYPE_A:
        return <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.Er847A" />;
      case midlertidigInaktiv.TYPE_B:
        return <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.Er847B" />;
      default:
        return <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.Er847" />;
    }
  };

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
        placeholderText={intl.formatMessage({ id: 'OpptjeningVilkarAksjonspunktPanel.VurderingPlaceholderText' })}
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
                <BodyShort size="small">{hent847Text()}</BodyShort>
              )}
              {erVilkarOk === true && <BodyShort size="small">{erOppfyltText}</BodyShort>}
              {!erVilkarOk && <BodyShort size="small">{erIkkeOppfyltText}</BodyShort>}
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
          isVertical
          readOnly={readOnly}
          isTrueOrFalseSelection={erOmsorgspenger && !skalValgMidlertidigInaktivTypeBVises}
          radios={[
            {
              value: 'true',
              label: erOppfyltText,
            },
            {
              value: 'false',
              label: erIkkeOppfyltText,
            },
            ...(!erOmsorgspenger
              ? [
                  {
                    value: midlertidigInaktiv.TYPE_A,
                    label: intl.formatMessage({ id: 'OpptjeningVilkarAksjonspunktPanel.MidlertidigInaktivA' }),
                  },
                ]
              : []),
            ...(skalValgMidlertidigInaktivTypeBVises
              ? [
                  {
                    value: midlertidigInaktiv.TYPE_B,
                    label: intl.formatMessage({ id: 'OpptjeningVilkarAksjonspunktPanel.MidlertidigInaktivB' }),
                  },
                ]
              : []),
          ]}
        />
      )}
      <VerticalSpacer sixteenPx />
    </>
  );
};

VilkarFields.buildInitialValues = (
  aksjonspunkter: Aksjonspunkt[],
  vilkårPerioder: Vilkarperiode[],
  erVilkarOk: boolean,
): FormValues => ({
  erVilkarOk,
  vilkarFields: Array.isArray(vilkårPerioder)
    ? vilkårPerioder.map(periode => ({
        begrunnelse: periode.begrunnelse,
        vurderesIBehandlingen: periode.vurderesIBehandlingen,
        erVilkarOk: Object.values(midlertidigInaktiv).includes(periode.merknad?.kode)
          ? periode.merknad.kode
          : periode.vilkarStatus.kode === vilkarUtfallType.OPPFYLT,
      }))
    : [],
});

export default VilkarFields;
