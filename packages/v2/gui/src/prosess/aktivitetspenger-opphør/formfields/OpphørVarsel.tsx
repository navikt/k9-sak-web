import { InfoCard, List, Radio } from '@navikt/ds-react';
import { RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import type { Control, FieldValues, Path } from 'react-hook-form';
import type { OpphørVarselFormData } from './OpphørVarselFormData.js';

interface Props<TForm extends FieldValues> {
  control: Control<TForm & OpphørVarselFormData>;
  selectedId: string;
  isFormLocked: boolean;
  skalSendeForhåndsvarsel: string;
  skalViseForhåndsvarselTekst: boolean;
  forhåndsvarselBeskrivelse: string;
}

export const OpphørVarsel = <TForm extends FieldValues>({
  control,
  selectedId,
  isFormLocked,
  skalSendeForhåndsvarsel,
  skalViseForhåndsvarselTekst,
  forhåndsvarselBeskrivelse,
}: Props<TForm>) => {
  const varselPath = `perioder.${selectedId}.skalSendeVarselOmOpphør` as Path<TForm & OpphørVarselFormData>;
  const forhåndsvarselPath = `perioder.${selectedId}.forhåndsvarselTekst` as Path<TForm & OpphørVarselFormData>;
  const begrunnelsePath = `perioder.${selectedId}.begrunnelseForIkkeVarsle` as Path<TForm & OpphørVarselFormData>;

  return (
    <>
      <RhfRadioGroup
        key={`${selectedId}-varsle`}
        control={control}
        name={varselPath}
        legend="Skal du sende varsel om opphør?"
        description="Hvis det er en god grunn til det, kan du la være å sende varsel. For eksempel at bruker har kommet med opplysningene selv."
        validate={[required]}
        readOnly={isFormLocked}
      >
        <Radio value="ja">Ja</Radio>
        <Radio value="nei">Nei</Radio>
      </RhfRadioGroup>
      {skalViseForhåndsvarselTekst && skalSendeForhåndsvarsel === 'ja' && (
        <RhfTextarea
          control={control}
          name={forhåndsvarselPath}
          label="Tekst i forhåndsvarsel (vises til bruker)"
          description={forhåndsvarselBeskrivelse}
          readOnly={isFormLocked}
          validate={[required, minLength(3), maxLength(1000)]}
          resize
          maxLength={1000}
        />
      )}
      {skalSendeForhåndsvarsel === 'nei' && (
        <RhfTextarea
          control={control}
          name={begrunnelsePath}
          label="Begrunnelse for hvorfor det ikke er behov for varsel"
          readOnly={isFormLocked}
          validate={[required, minLength(3), maxLength(4000)]}
          resize
          maxLength={4000}
        />
      )}
      {!isFormLocked && skalSendeForhåndsvarsel === 'ja' && (
        <InfoCard data-color="info" size="small">
          <InfoCard.Header>
            <InfoCard.Title>Bruker vil få ett varsel om opphør på min side</InfoCard.Title>
          </InfoCard.Header>
          <InfoCard.Content>
            <List size="small">
              <List.Item>
                Når du går videre sendes det ett forhåndsvarsel til bruker med dato og årsak for opphør.
              </List.Item>
              <List.Item>
                Saken settes på vent til bruker svarer på forhåndsvarsel eller det har gått 14 dager.
              </List.Item>
            </List>
          </InfoCard.Content>
        </InfoCard>
      )}
    </>
  );
};
