import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg?react';
import { InputField, SelectField } from '@fpsak-frontend/form';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { FlexColumn, FlexRow, Image, PeriodFieldArray } from '@fpsak-frontend/shared-components';
import { hasValidDecimal, maxValue, minValue, required } from '@fpsak-frontend/utils';
import { ArbeidsgiverOpplysningerPerId, KodeverkMedNavn } from '@k9-sak-web/types';
import React, { useState } from 'react';
import { WrappedComponentProps } from 'react-intl';
import { FieldArrayFieldsProps, FieldArrayMetaProps } from 'redux-form';
import NyArbeidsgiverModal from './NyArbeidsgiverModal';

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

const getInntektskategori = alleKodeverk => {
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

const defaultAndel = {
  fom: '',
  tom: '',
};

interface OwnProps {
  meta: FieldArrayMetaProps;
  readOnly: boolean;
  fields: FieldArrayFieldsProps<any>;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsgivere: ArbeidsgiverOpplysningerPerId;
  newArbeidsgiverCallback: (values: any) => void;
  behandlingId: number;
  behandlingVersjon: number;
}

export const NyAndel = ({
  fields,
  meta,
  newArbeidsgiverCallback,
  alleKodeverk,
  readOnly,
  arbeidsgivere,
  behandlingId,
  behandlingVersjon,
}: OwnProps & WrappedComponentProps) => {
  const [isOpen, setOpen] = useState(false);

  const allFields = fields.getAll();

  return (
    <>
      <PeriodFieldArray
        shouldShowAddButton
        fields={fields}
        meta={meta}
        textCode="TilkjentYtelse.NyAndel"
        emptyPeriodTemplate={defaultAndel}
        readOnly={readOnly}
      >
        {(periodeElementFieldId, index, getRemoveButton) => {
          const values = allFields[index];

          const erSN = erSelvstendigNæringsdrivende(values.inntektskategori);
          const erFL = erFrilans(values.inntektskategori);

          return (
            <FlexRow key={periodeElementFieldId}>
              <FlexColumn>
                <SelectField
                  label={{ id: 'TilkjentYtelse.NyPeriode.Inntektskategori' }}
                  name={`${periodeElementFieldId}.inntektskategori`}
                  bredde="l"
                  selectValues={getInntektskategori(alleKodeverk)}
                />
              </FlexColumn>
              {!erSN && !erFL && (
                <FlexColumn className={styles.relative}>
                  <SelectField
                    label={{ id: 'TilkjentYtelse.NyPeriode.Arbeidsgiver' }}
                    bredde="xl"
                    name={`${periodeElementFieldId}.arbeidsgiverOrgnr`}
                    validate={[required]}
                    selectValues={mapArbeidsgivere(arbeidsgivere)}
                  />
                  <div
                    onClick={() => setOpen(true)}
                    onKeyDown={() => setOpen(true)}
                    className={styles.addArbeidsforhold}
                    role="button"
                    tabIndex={0}
                  >
                    <Image className={styles.addCircleIcon} src={addCircleIcon} alt="Ny arbeidsgiver" />
                  </div>
                </FlexColumn>
              )}
              <FlexColumn>
                <InputField
                  label={{ id: 'TilkjentYtelse.NyPeriode.TilSoker' }}
                  name={`${periodeElementFieldId}.tilSoker`}
                  validate={[required, minValue0, maxValue3999, hasValidDecimal]}
                  format={value => value}
                />
              </FlexColumn>
              {!erSN && !erFL && (
                <FlexColumn>
                  <InputField
                    label={{ id: 'TilkjentYtelse.NyPeriode.Refusjon' }}
                    name={`${periodeElementFieldId}.refusjon`}
                    validate={[required, minValue0, maxValue3999, hasValidDecimal]}
                    format={value => value}
                  />
                </FlexColumn>
              )}
              {!erSN && (
                <FlexColumn>
                  <InputField
                    label={{ id: 'TilkjentYtelse.NyPeriode.Ubetalingsgrad' }}
                    name={`${periodeElementFieldId}.utbetalingsgrad`}
                    validate={[required, minValue0, maxValue100, hasValidDecimal]}
                    format={value => value}
                  />
                </FlexColumn>
              )}
              <FlexColumn>{getRemoveButton()}</FlexColumn>
            </FlexRow>
          );
        }}
      </PeriodFieldArray>

      {isOpen && (
        <NyArbeidsgiverModal
          showModal={isOpen}
          newArbeidsgiverCallback={newArbeidsgiverCallback}
          closeEvent={values => {
            newArbeidsgiverCallback(values);
            setOpen(false);
          }}
          cancelEvent={() => setOpen(false)}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
      )}
    </>
  );
};

export default NyAndel;
