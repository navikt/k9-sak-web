import { RadioGroupField } from '@fpsak-frontend/form';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { ProsessStegBegrunnelseTextField } from '@k9-sak-web/prosess-felles';
import { FeatureToggles, Opptjening, Vilkarperiode } from '@k9-sak-web/types';
import { BodyShort } from '@navikt/ds-react';
import { FormattedMessage, useIntl } from 'react-intl';

import avslattImage from '@fpsak-frontend/assets/images/avslaatt.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/check.svg';

import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import dayjs from 'dayjs';
import { useContext } from 'react';
import styles from './VilkarFields.module.css';

export const opptjeningMidlertidigInaktivKoder = {
  TYPE_A: '7847A',
  TYPE_B: '7847B',
};

export type VilkårFieldType = {
  begrunnelse: string;
  vurderesIBehandlingen: boolean;
  vurderesIAksjonspunkt: boolean;
  kode: '7847A' | '7847B' | 'OPPFYLT' | 'IKKE_OPPFYLT';
};

type FormValues = {
  vilkarFields: VilkårFieldType[];
};

interface VilkarFieldsProps {
  erOmsorgspenger?: boolean;
  fieldPrefix: string;
  readOnly: boolean;
  field: VilkårFieldType;
  skalValgMidlertidigInaktivTypeBVises: boolean;
}

export const erVilkarOk = (kode: string) => {
  if (
    kode === 'OPPFYLT' ||
    opptjeningMidlertidigInaktivKoder.TYPE_A === kode ||
    opptjeningMidlertidigInaktivKoder.TYPE_B === kode
  ) {
    return true;
  }
  return false;
};

export const hent847Text = (kode: string) => {
  const kodeTekster: { [key: string]: string } = {
    [opptjeningMidlertidigInaktivKoder.TYPE_A]: 'Vilkåret beregnes jf § 8-47 bokstav A',
    [opptjeningMidlertidigInaktivKoder.TYPE_B]: 'Vilkåret beregnes jf § 8-47 bokstav B',
  };

  return kodeTekster[kode] || '';
};
export const VilkarField = ({
  erOmsorgspenger,
  fieldPrefix,
  field,
  readOnly,
  skalValgMidlertidigInaktivTypeBVises,
}: VilkarFieldsProps & Partial<FormValues>) => {
  const intl = useIntl();
  const featureToggles = useContext(FeatureTogglesContext);
  const erIkkeOppfyltText = (
    <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.ErIkkeOppfylt" values={{ b: chunks => <b>{chunks}</b> }} />
  );
  const erOppfyltText = <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.ErOppfylt" />;

  const vilkarVurderingTekst = () => {
    if (erVilkarOk(field?.kode) && Object.values(opptjeningMidlertidigInaktivKoder).includes(field?.kode)) {
      return hent847Text(field?.kode);
    }
    if (erVilkarOk(field?.kode)) {
      return erOppfyltText;
    }
    return erIkkeOppfyltText;
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
      {readOnly && (
        <FlexContainer>
          <FlexRow>
            <FlexColumn>
              <Image className={styles.image} src={erVilkarOk(field?.kode) ? innvilgetImage : avslattImage} />
            </FlexColumn>
            <FlexColumn>
              <BodyShort>{vilkarVurderingTekst()}</BodyShort>
            </FlexColumn>
          </FlexRow>
          <VerticalSpacer eightPx />
        </FlexContainer>
      )}
      {!readOnly && (
        <RadioGroupField
          name={`${fieldPrefix}.kode`}
          validate={[required]}
          bredde="XXL"
          isVertical
          readOnly={readOnly}
          radios={[
            /*          TSFF-804: Fjerner mulighet for å velge at vilkåret er oppfylt.
            dersom søker har 28 dager med opptjening blir dette aksjonspunktet automatisk løst.
            Så de gangene man får løse aksjonspunktet manuelt har ikke brukeren 28 dager med opptjening.
            Velger man at vilkåret er oppfylt i de tilfellene får man feil i beregning.
            Valget fjernes midlertidig, men skal tilbake igjen når EØS-saker kan behandles i K9.
            */
            {
              value: 'OPPFYLT',
              label: erOppfyltText,
            },
            {
              value: 'IKKE_OPPFYLT',
              label: erIkkeOppfyltText,
            },
            ...(!erOmsorgspenger
              ? [
                  {
                    value: opptjeningMidlertidigInaktivKoder.TYPE_A,
                    label: intl.formatMessage({ id: 'OpptjeningVilkarAksjonspunktPanel.MidlertidigInaktivA' }),
                  },
                ]
              : []),
            ...(skalValgMidlertidigInaktivTypeBVises
              ? [
                  {
                    value: opptjeningMidlertidigInaktivKoder.TYPE_B,
                    label: intl.formatMessage({ id: 'OpptjeningVilkarAksjonspunktPanel.MidlertidigInaktivB' }),
                  },
                ]
              : []),
          ].filter(v => {
            if (featureToggles?.OPPTJENING_READ_ONLY_PERIODER) {
              return v.value !== 'OPPFYLT';
            }
            return true;
          })}
        />
      )}
      <VerticalSpacer sixteenPx />
    </>
  );
};

VilkarField.buildInitialValues = (
  vilkårPerioder: Vilkarperiode[],
  opptjening: Opptjening[],
  featureToggles: FeatureToggles,
): FormValues => {
  const utledKode = (periode: Vilkarperiode) => {
    if (
      periode.merknad.kode === opptjeningMidlertidigInaktivKoder.TYPE_A ||
      periode.merknad.kode === opptjeningMidlertidigInaktivKoder.TYPE_B
    ) {
      return periode.merknad.kode as '7847A' | '7847B';
    }
    return periode.vilkarStatus.kode as 'OPPFYLT' | 'IKKE_OPPFYLT';
  };

  return {
    vilkarFields: Array.isArray(vilkårPerioder)
      ? vilkårPerioder.map(periode => {
          const skjæringstidspunkt = periode.periode.fom;
          const opptjeningForPeriode = opptjening?.find(
            o => dayjs(o?.fastsattOpptjening?.opptjeningTom).add(1, 'day').format('YYYY-MM-DD') === skjæringstidspunkt,
          );

          return {
            begrunnelse: periode.begrunnelse,
            vurderesIBehandlingen: periode.vurderesIBehandlingen,
            vurderesIAksjonspunkt: featureToggles?.OPPTJENING_READ_ONLY_PERIODER
              ? opptjeningForPeriode?.fastsattOpptjening.vurderesIAksjonspunkt
              : true,
            kode: utledKode(periode),
          };
        })
      : [],
  };
};

export default VilkarField;
