import { k9_kodeverk_vilkår_VilkårUtfallMerknad as VilkårPeriodeDtoMerknad } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Radio } from '@navikt/ds-react';
import { RhfRadioGroupNew, RhfTextarea } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import FeatureTogglesContext from '../../../featuretoggles/FeatureTogglesContext';
import type { VilkårFieldFormValues } from '../types/VilkårFieldFormValues';
import type { VilkårFieldType } from '../types/VilkårFieldType';

const validateMinLength3 = minLength(3);
const validateMaxLength1500 = maxLength(1500);

export const opptjeningMidlertidigInaktivKoder = {
  TYPE_A: VilkårPeriodeDtoMerknad.VM_7847_A,
  TYPE_B: VilkårPeriodeDtoMerknad.VM_7847_B,
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
}: VilkarFieldsProps & Partial<VilkårFieldFormValues>) => {
  const { control } = useFormContext();
  const featureToggles = useContext(FeatureTogglesContext);
  const erIkkeOppfyltText = (
    <>
      Søker har ikke oppfylt krav om 28 dagers opptjening, vilkåret er <b>ikke</b> oppfylt.
    </>
  );
  const erOppfyltText = 'Søker har oppfylt krav om 28 dagers opptjening, vilkåret er oppfylt.';

  const vilkarVurderingTekst = () => {
    if (
      erVilkarOk(field?.kode) &&
      Object.values(opptjeningMidlertidigInaktivKoder).some(kode => kode === field?.kode)
    ) {
      return hent847Text(field?.kode);
    }
    if (erVilkarOk(field?.kode)) {
      return erOppfyltText;
    }
    return erIkkeOppfyltText;
  };

  const radios = [
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
            label: 'Søker oppfyller vilkåret til opptjening jf § 8-47 bokstav A',
          },
        ]
      : []),
    ...(skalValgMidlertidigInaktivTypeBVises
      ? [
          {
            value: opptjeningMidlertidigInaktivKoder.TYPE_B,
            label: 'Søker oppfyller vilkåret til opptjening jf § 8-47 bokstav B',
          },
        ]
      : []),
  ].filter(v => {
    if (featureToggles?.['OPPTJENING_READ_ONLY_PERIODER']) {
      return v.value !== 'OPPFYLT';
    }
    return true;
  });

  return (
    <div className="mt-4">
      <RhfTextarea
        control={control}
        name={`${fieldPrefix}.begrunnelse`}
        size="small"
        label={erOmsorgspenger ? 'Vurder om bruker oppfyller opptjening jf § 9-2 eller § 8-47 bokstav B' : 'Vurdering'}
        validate={[required, validateMinLength3, validateMaxLength1500]}
        readOnly={readOnly}
        maxLength={1500}
      />

      <Box.New marginBlock="4">
        {readOnly && (
          <div className="flex gap-4">
            {erVilkarOk(field?.kode) ? (
              <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
            ) : (
              <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--ax-bg-danger-strong)' }} />
            )}
            <BodyShort size="small">{vilkarVurderingTekst()}</BodyShort>
          </div>
        )}
        {!readOnly && (
          <RhfRadioGroupNew control={control} name={`${fieldPrefix}.kode`} validate={[required]} isReadOnly={readOnly}>
            {radios.map(radio => (
              <Radio key={radio.value} value={radio.value}>
                {radio.label}
              </Radio>
            ))}
          </RhfRadioGroupNew>
        )}
      </Box.New>
    </div>
  );
};

export default VilkarField;
