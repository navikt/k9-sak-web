import { RadioGroupField } from '@fpsak-frontend/form';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { ProsessStegBegrunnelseTextField } from '@k9-sak-web/prosess-felles';
import { Opptjening, Vilkarperiode } from '@k9-sak-web/types';
import { BodyShort } from '@navikt/ds-react';
import { FormattedMessage, useIntl } from 'react-intl';

import avslattImage from '@fpsak-frontend/assets/images/avslaatt.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/check.svg';

import styles from './VilkarFields.module.css';
import dayjs from 'dayjs';

export const opptjeningMidlertidigInaktivKoder = {
  TYPE_A: '7847A',
  TYPE_B: '7847B',
};

export type VilkårFieldType = {
  begrunnelse: string;
  vurderesIBehandlingen: boolean;
  periodeHar28DagerOgTrengerIkkeVurderesManuelt: boolean;
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
            {
              value: 'OPPFYLT',
              label: erOppfyltText,
            },
            */
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
          ]}
        />
      )}
      <VerticalSpacer sixteenPx />
    </>
  );
};

VilkarField.buildInitialValues = (vilkårPerioder: Vilkarperiode[], opptjening: Opptjening[]): FormValues => {
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
          const periodeHar28DagerOgTrengerIkkeVurderesManuelt =
            opptjeningForPeriode?.fastsattOpptjening?.opptjeningperiode?.dager >= 28 ||
            opptjeningForPeriode?.fastsattOpptjening?.opptjeningperiode?.måneder > 0;

          return {
            begrunnelse: periode.begrunnelse,
            vurderesIBehandlingen: periode.vurderesIBehandlingen,
            periodeHar28DagerOgTrengerIkkeVurderesManuelt,
            kode: utledKode(periode),
          };
        })
      : [],
  };
};

export default VilkarField;
