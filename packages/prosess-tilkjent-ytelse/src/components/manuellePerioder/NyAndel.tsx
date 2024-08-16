import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { FlexColumn, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidDecimal, maxValue, minValue, required } from '@fpsak-frontend/utils';
import { ArbeidsgiverOpplysningerPerId, KodeverkMedNavn } from '@k9-sak-web/types';
import { useState } from 'react';
import NyArbeidsgiverModal from './NyArbeidsgiverModal';

import { Detail, Fieldset, HGrid } from '@navikt/ds-react';
import { InputField, SelectField } from '@navikt/ft-form-hooks';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { NyArbeidsgiverFormState, NyPeriodeFormAndeler, NyPeriodeFormState } from './FormState';
import styles from './periode.module.css';

const minValue0 = minValue(0);
const maxValue100 = maxValue(100);
const maxValue3999 = maxValue(3999);

const mapArbeidsgivere = (arbeidsgivere: ArbeidsgiverOpplysningerPerId) =>
  arbeidsgivere
    ? Object.values(arbeidsgivere).map(({ navn, identifikator }) => (
        <option value={identifikator} key={identifikator}>
          {navn} ({identifikator})
        </option>
      ))
    : [];

const getInntektskategori = (alleKodeverk: { [key: string]: KodeverkMedNavn[] }) => {
  const aktivitetsstatuser = alleKodeverk[kodeverkTyper.INNTEKTSKATEGORI];
  return aktivitetsstatuser.map(ik => (
    <option value={ik.kode} key={ik.kode}>
      {ik.navn}
    </option>
  ));
};

const erSelvstendigNæringsdrivende = inntektskategori =>
  [
    inntektskategorier.DAGMAMMA,
    inntektskategorier.JORDBRUKER,
    inntektskategorier.FISKER,
    inntektskategorier.SELVSTENDIG_NÆRINGSDRIVENDE,
  ].includes(inntektskategori);

const erFrilans = inntektskategori => inntektskategori === inntektskategorier.FRILANSER;

const defaultAndel: NyPeriodeFormAndeler = {
  aktivitetStatus: undefined,
  aktørId: '',
  arbeidsforholdId: '',
  arbeidsforholdType: undefined,
  arbeidsgiverNavn: '',
  arbeidsgiverOrgnr: '',
  eksternArbeidsforholdId: '',
  inntektskategori: undefined,
  refusjon: 0,
  sisteUtbetalingsdato: '',
  stillingsprosent: 0,
  tilSoker: 0,
  utbetalingsgrad: 0,
  uttak: [],
};

interface OwnProps {
  readOnly: boolean;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsgivere: ArbeidsgiverOpplysningerPerId;
  newArbeidsgiverCallback: (values: NyArbeidsgiverFormState) => void;
}

export const NyAndel = ({ newArbeidsgiverCallback, alleKodeverk, readOnly, arbeidsgivere }: OwnProps) => {
  const [isOpen, setOpen] = useState(false);
  const { control } = useFormContext<NyPeriodeFormState>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'andeler',
    keyName: 'fieldId',
  });

  return (
    <>
      <Fieldset
        legend="Ny andel"
        hideLegend
        // error={formState.errors.andeler}
      >
        {fields.map((field, index) => {
          const erSN = erSelvstendigNæringsdrivende(field.inntektskategori);
          const erFL = erFrilans(field.inntektskategori);
          return (
            <FlexRow key={field.fieldId}>
              <FlexColumn>
                <SelectField
                  label={{ id: 'TilkjentYtelse.NyPeriode.Inntektskategori' }}
                  name={`andeler.${index}.inntektskategori`}
                  selectValues={getInntektskategori(alleKodeverk)}
                />
              </FlexColumn>
              {!erSN && !erFL && (
                <FlexColumn className={styles.relative}>
                  <SelectField
                    label={{ id: 'TilkjentYtelse.NyPeriode.Arbeidsgiver' }}
                    name={`andeler.${index}.arbeidsgiverOrgnr`}
                    validate={[required]}
                    selectValues={mapArbeidsgivere(arbeidsgivere)}
                  />
                  <button onClick={() => setOpen(true)} className={styles.addArbeidsforhold}>
                    <Image className={styles.addCircleIcon} src={addCircleIcon} alt="Ny arbeidsgiver" />
                  </button>
                </FlexColumn>
              )}
              <FlexColumn>
                <InputField
                  label={{ id: 'TilkjentYtelse.NyPeriode.TilSoker' }}
                  name={`andeler.${index}.tilSoker`}
                  validate={[required, minValue0, maxValue3999, hasValidDecimal]}
                  format={value => value}
                />
              </FlexColumn>
              {!erSN && !erFL && (
                <FlexColumn>
                  <InputField
                    label={{ id: 'TilkjentYtelse.NyPeriode.Refusjon' }}
                    name={`andeler.${index}.refusjon`}
                    validate={[required, minValue0, maxValue3999, hasValidDecimal]}
                    format={value => value}
                  />
                </FlexColumn>
              )}
              {!erSN && (
                <FlexColumn>
                  <InputField
                    label={{ id: 'TilkjentYtelse.NyPeriode.Ubetalingsgrad' }}
                    name={`andeler.${index}.utbetalingsgrad`}
                    validate={[required, minValue0, maxValue100, hasValidDecimal]}
                    format={value => value}
                  />
                </FlexColumn>
              )}
              <FlexColumn>
                {index > 0 && (
                  <button
                    className={styles.buttonRemove}
                    type="button"
                    onClick={() => {
                      remove(index);
                    }}
                    data-testid="removeButton"
                  />
                )}
              </FlexColumn>
            </FlexRow>
          );
        })}
        <HGrid gap="1" columns={{ xs: '12fr' }}>
          {!readOnly && (
            <button onClick={() => append(defaultAndel)} className={styles.addPeriode}>
              <Image className={styles.addCircleIcon} src={addCircleIcon} alt="Ny andel" />
              <Detail className={styles.imageText}>Ny andel</Detail>
            </button>
          )}
          <VerticalSpacer sixteenPx />
        </HGrid>
      </Fieldset>
      {isOpen && (
        <NyArbeidsgiverModal
          showModal={isOpen}
          closeEvent={(values: NyArbeidsgiverFormState) => {
            newArbeidsgiverCallback(values);
            setOpen(false);
          }}
          cancelEvent={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default NyAndel;
