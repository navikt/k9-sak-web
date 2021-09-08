import React, { useState } from 'react';
import { WrappedComponentProps } from 'react-intl';
import { FieldArrayFieldsProps, FieldArrayMetaProps } from 'redux-form';
import { FlexColumn, FlexRow, PeriodFieldArray, Image } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn, ArbeidsforholdV2, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { InputField, SelectField } from '@fpsak-frontend/form';
import { hasValidDecimal, maxValue, minValue, required, getKodeverknavnFn } from '@fpsak-frontend/utils';
import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import NyttArbeidsforholdModal from './NyttArbeidsforholdModal';
import { createVisningsnavnForAndel } from '../TilkjentYteleseUtils';

import styles from './periode.less';

const minValue0 = minValue(0);
const maxValue100 = maxValue(100);
const maxValue3999 = maxValue(3999);

const mapArbeidsforhold = (
  arbeidsForhold: ArbeidsforholdV2[],
  getKodeverknavn,
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
) =>
  arbeidsForhold.map((andel: ArbeidsforholdV2, index) => {
    const label = createVisningsnavnForAndel(andel, getKodeverknavn, arbeidsgiverOpplysningerPerId);
    const key = `${andel.id}${index}`;
    return (
      <option value={JSON.stringify(andel)} key={key}>
        {label}
      </option>
    );
  });

const getInntektskategori = alleKodeverk => {
  const aktivitetsstatuser = alleKodeverk[kodeverkTyper.INNTEKTSKATEGORI];
  return aktivitetsstatuser.map(ik => (
    <option value={ik.kode} key={ik.kode}>
      {ik.navn}
    </option>
  ));
};

const defaultAndel = {
  fom: '',
  tom: '',
};

interface OwnProps {
  meta: FieldArrayMetaProps;
  readOnly: boolean;
  fields: FieldArrayFieldsProps<any>;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsforhold: ArbeidsforholdV2[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  newArbeidsforholdCallback: (values: any) => void;
  behandlingId: number;
  behandlingVersjon: number;
}

export const NyAndel = ({
  fields,
  meta,
  newArbeidsforholdCallback,
  alleKodeverk,
  readOnly,
  arbeidsforhold,
  arbeidsgiverOpplysningerPerId,
  behandlingId,
  behandlingVersjon,
}: OwnProps & WrappedComponentProps) => {
  const [isOpen, setOpen] = useState(false);
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

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
        {(periodeElementFieldId, index, getRemoveButton) => (
          <FlexRow key={periodeElementFieldId}>
            <FlexColumn>
              <InputField
                label="Til søker"
                name={`${periodeElementFieldId}.tilSoker`}
                validate={[required, minValue0, maxValue3999, hasValidDecimal]}
                format={value => value}
              />
            </FlexColumn>
            <FlexColumn>
              <InputField
                label="Refusjon"
                name={`${periodeElementFieldId}.refusjon`}
                validate={[required, minValue0, maxValue3999, hasValidDecimal]}
                format={value => value}
              />
            </FlexColumn>
            <FlexColumn className={styles.relative}>
              <SelectField
                label="Arbeidsforhold"
                bredde="xl"
                name={`${periodeElementFieldId}.arbeidsgiver`}
                validate={[required]}
                selectValues={mapArbeidsforhold(arbeidsforhold, getKodeverknavn, arbeidsgiverOpplysningerPerId)}
              />
              <div
                onClick={() => setOpen(true)}
                onKeyDown={() => setOpen(true)}
                className={styles.addArbeidsforhold}
                role="button"
                tabIndex={0}
              >
                <Image className={styles.addCircleIcon} src={addCircleIcon} alt="Nytt arbeidsforhold" />
              </div>
            </FlexColumn>
            <FlexColumn>
              <SelectField
                label={{ id: 'TilkjentYtelse.NyPeriode.Inntektskategori' }}
                name={`${periodeElementFieldId}.inntektskategori`}
                bredde="l"
                selectValues={getInntektskategori(alleKodeverk)}
              />
            </FlexColumn>
            <FlexColumn>
              <InputField
                label={{ id: 'TilkjentYtelse.NyPeriode.Ubetalingsgrad' }}
                name={`${periodeElementFieldId}.utbetalingsgrad`}
                validate={[required, minValue0, maxValue100, hasValidDecimal]}
                format={value => value}
              />
            </FlexColumn>
            <FlexColumn>{getRemoveButton()}</FlexColumn>
          </FlexRow>
        )}
      </PeriodFieldArray>

      {isOpen && (
        <NyttArbeidsforholdModal
          showModal={isOpen}
          newArbeidsforholdCallback={newArbeidsforholdCallback}
          closeEvent={values => {
            newArbeidsforholdCallback(values);
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
