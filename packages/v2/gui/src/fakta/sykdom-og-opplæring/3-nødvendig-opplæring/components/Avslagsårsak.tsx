import {
  k9_kodeverk_vilkår_Avslagsårsak as OpplæringVurderingDtoAvslagsårsak,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringResultat as OpplæringVurderingDtoResultat,
} from '@k9-sak-web/backend/k9sak/generated';
import { Radio, RadioGroup } from '@navikt/ds-react';
import { useContext } from 'react';
import { Controller, useFormContext, type ControllerProps } from 'react-hook-form';
import { K9KodeverkoppslagContext } from '../../../../kodeverk/oppslag/K9KodeverkoppslagContext.jsx';
import { SykdomOgOpplæringContext } from '../../FaktaSykdomOgOpplæringIndex';

type NødvendigOpplæringFormFields = {
  begrunnelse: string;
  resultat: OpplæringVurderingDtoResultat | '';
  harLegeerklæring: 'JA' | 'NEI' | '';
  harNødvendigOpplæring: 'JA' | 'DELVIS' | 'NEI' | '';
  avslagsårsak?: OpplæringVurderingDtoAvslagsårsak;
  perioder: {
    resultat: OpplæringVurderingDtoResultat | '';
    avslagsårsak: OpplæringVurderingDtoAvslagsårsak | '';
    fom: string;
    tom: string;
  }[];
  perioderUtenNødvendigOpplæring: {
    fom: string;
    tom: string;
    resultat: OpplæringVurderingDtoResultat | '';
    avslagsårsak: OpplæringVurderingDtoAvslagsårsak | '';
  }[];
};

export const Avslagsårsak = ({
  name,
  update,
  index,
  fieldValue,
}: {
  name: ControllerProps<NødvendigOpplæringFormFields>['name'];
  update?: (index: number, value: any) => void;
  index?: number;
  fieldValue?: NødvendigOpplæringFormFields['perioderUtenNødvendigOpplæring'][number];
}) => {
  const formMethods = useFormContext<NødvendigOpplæringFormFields>();
  const context = useContext(SykdomOgOpplæringContext);
  const readOnly = context.readOnly;
  const k9Kodeverkoppslag = useContext(K9KodeverkoppslagContext);

  const opplæringIkkeDokumentertMedLegeerklæring = formMethods.watch('harLegeerklæring') === 'NEI';

  return (
    <Controller
      control={formMethods.control}
      name={name}
      rules={
        opplæringIkkeDokumentertMedLegeerklæring
          ? undefined
          : {
              validate: value => {
                return value === OpplæringVurderingDtoAvslagsårsak.IKKE_NØDVENDIG_OPPLÆRING ||
                  value === OpplæringVurderingDtoAvslagsårsak.IKKE_OPPLÆRING_I_PERIODEN
                  ? undefined
                  : 'Avslagsårsak er påkrevd';
              },
            }
      }
      render={({ field, fieldState }) => {
        return (
          <RadioGroup
            {...field}
            legend="Avslagsårsak"
            readOnly={readOnly}
            size="small"
            error={fieldState.error?.message as string | undefined}
            onChange={value => {
              field.onChange(value);
              if (index !== undefined && update) {
                update(index, { ...fieldValue, avslagsårsak: value });
              }
            }}
          >
            <Radio value={OpplæringVurderingDtoAvslagsårsak.IKKE_NØDVENDIG_OPPLÆRING}>
              {k9Kodeverkoppslag.k9sak.avslagsårsaker(OpplæringVurderingDtoAvslagsårsak.IKKE_NØDVENDIG_OPPLÆRING).navn}
            </Radio>
            <Radio value={OpplæringVurderingDtoAvslagsårsak.IKKE_OPPLÆRING_I_PERIODEN}>
              {k9Kodeverkoppslag.k9sak.avslagsårsaker(OpplæringVurderingDtoAvslagsårsak.IKKE_OPPLÆRING_I_PERIODEN).navn}
            </Radio>
          </RadioGroup>
        );
      }}
    />
  );
};
