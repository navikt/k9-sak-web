import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { FlexColumn, FlexRow, Image, useFeatureToggles, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidDecimal, maxValue, minValue, required } from '@fpsak-frontend/utils';
import { ArbeidsgiverOpplysningerPerId, KodeverkMedNavn } from '@k9-sak-web/types';
import { useEffect, useState } from 'react';
import NyArbeidsgiverModal from './NyArbeidsgiverModal';

import { Button, Detail, Fieldset, HGrid } from '@navikt/ds-react';
import { InputField, SelectField } from '@navikt/ft-form-hooks';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { NyArbeidsgiverFormState, NyPeriodeFormAndeler, TilkjentYtelseFormState } from './FormState';
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

const mapArbeidsgivereOrg = (arbeidsgivere: ArbeidsgiverOpplysningerPerId) =>
  arbeidsgivere
    ? Object.values(arbeidsgivere)
        .filter(arbeidsgiver => arbeidsgiver.personIdentifikator == null) // erPrivatPerson returneres ikke fra backend
        .map(({ navn, identifikator }) => (
          <option value={identifikator} key={identifikator}>
            {navn} ({identifikator})
          </option>
        ))
    : [];

const mapArbeidsgiverePrivatperson = (arbeidsgivere: ArbeidsgiverOpplysningerPerId) =>
  arbeidsgivere
    ? Object.values(arbeidsgivere)
        .filter(arbeidsgiver => arbeidsgiver.personIdentifikator != null) // erPrivatPerson returneres ikke fra backend
        .map(({ navn, personIdentifikator }) => (
          <option value={personIdentifikator} key={personIdentifikator}>
            {navn} ({personIdentifikator})
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
  const { control } = useFormContext<TilkjentYtelseFormState>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'nyPeriodeForm.andeler',
    keyName: 'fieldId',
  });
  const [featureToggles] = useFeatureToggles();
  const skillUtPrivatperson = featureToggles?.SKILL_UT_PRIVATPERSON;

  useEffect(() => {
    if (fields.length === 0) {
      append(defaultAndel);
    }
  }, []);

  return (
    <>
      <Fieldset legend="Ny andel" hideLegend>
        {fields.map((field, index) => {
          const erSN = erSelvstendigNæringsdrivende(field.inntektskategori);
          const erFL = erFrilans(field.inntektskategori);
          return (
            <FlexRow key={field.fieldId}>
              <FlexColumn>
                <SelectField
                  label="Inntektskategori"
                  name={`nyPeriodeForm.andeler.${index}.inntektskategori`}
                  selectValues={getInntektskategori(alleKodeverk)}
                />
              </FlexColumn>
              {!erSN && !erFL && (
                <>
                  <div className="flex items-end">
                    <SelectField
                      label="Arbeidsgiver"
                      name={`nyPeriodeForm.andeler.${index}.arbeidsgiverOrgnr`}
                      validate={[required]}
                      selectValues={
                        skillUtPrivatperson ? mapArbeidsgivereOrg(arbeidsgivere) : mapArbeidsgivere(arbeidsgivere)
                      }
                    />
                    <Button
                      variant="secondary"
                      size="small"
                      icon={<Image src={addCircleIcon} />}
                      onClick={() => setOpen(true)}
                      aria-label="Ny arbeidsgiver"
                      type="button"
                    />
                  </div>
                  {skillUtPrivatperson && (
                    <div className="flex items-end">
                      <SelectField
                        label="Arbeidsgiver (privatperson)"
                        name={`nyPeriodeForm.andeler.${index}.arbeidsgiverPersonIdent`}
                        validate={[required]}
                        selectValues={mapArbeidsgiverePrivatperson(arbeidsgivere)}
                      />
                      <Button
                        variant="secondary"
                        size="small"
                        icon={<Image src={addCircleIcon} />}
                        onClick={() => setOpen(true)}
                        aria-label="Ny arbeidsgiver (privatperson)"
                        type="button"
                      />
                    </div>
                  )}
                </>
              )}
              <FlexColumn>
                <InputField
                  label="Til søker"
                  name={`nyPeriodeForm.andeler.${index}.tilSoker`}
                  validate={[required, minValue0, maxValue3999, hasValidDecimal]}
                  format={value => value}
                />
              </FlexColumn>
              {!erSN && !erFL && (
                <FlexColumn>
                  <InputField
                    label="Refusjon"
                    name={`nyPeriodeForm.andeler.${index}.refusjon`}
                    validate={[required, minValue0, maxValue3999, hasValidDecimal]}
                    format={value => value}
                  />
                </FlexColumn>
              )}
              {!erSN && (
                <FlexColumn>
                  <InputField
                    label="Uttaksgrad"
                    name={`nyPeriodeForm.andeler.${index}.utbetalingsgrad`}
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
        <HGrid gap="1" columns={{ xs: '1fr 11fr' }}>
          {!readOnly && (
            <button type="button" onClick={() => append(defaultAndel)} className={styles.addPeriode}>
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
