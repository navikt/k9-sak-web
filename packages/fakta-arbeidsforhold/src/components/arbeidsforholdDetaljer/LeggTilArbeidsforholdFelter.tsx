import moment from 'moment';
import React from 'react';

import { DatepickerField, InputField } from '@fpsak-frontend/form';
import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  DDMMYYYY_DATE_FORMAT,
  hasValidDate,
  hasValidInteger,
  maxValue,
  minValue,
  required,
} from '@fpsak-frontend/utils';
import BehandlingFormFieldCleaner from '../../util/BehandlingFormFieldCleaner';

import CustomArbeidsforhold from '../../typer/CustomArbeidsforholdTsType';
import styles from './leggTilArbeidsforholdFelter.css';

// ----------------------------------------------------------------------------------
// Methods
// ----------------------------------------------------------------------------------
const sluttdatoErrorMsg = dato => [{ id: 'PersonArbeidsforholdDetailForm.DateNotAfterOrEqual' }, { dato }];
const startdatoErrorMsg = dato => [{ id: 'PersonArbeidsforholdDetailForm.DateNotBeforeOrEqual' }, { dato }];
const formatDate = dato => moment(dato).format(DDMMYYYY_DATE_FORMAT);

interface OwnProps {
  readOnly: boolean;
  formName: string;
  behandlingId: number;
  behandlingVersjon: number;
}

// ----------------------------------------------------------------------------------
// Component : LeggTilArbeidsforholdFelter
// ----------------------------------------------------------------------------------

const LeggTilArbeidsforholdFelter = ({ readOnly, formName, behandlingId, behandlingVersjon }: OwnProps) => (
  <BehandlingFormFieldCleaner
    formName={formName}
    fieldNames={['arbeidsgiverNavn', 'startdato', 'sluttdato', 'stillingsprosent', 'yrkestittel']}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
  >
    <FlexContainer>
      <FlexRow wrap>
        <FlexColumn className={styles.navnColumn}>
          <InputField
            name="navn"
            label={{ id: 'PersonArbeidsforholdDetailForm.ArbeidsgiverNavn' }}
            validate={[required]}
            bredde="XL"
            readOnly={readOnly}
          />
        </FlexColumn>
        <FlexColumn className={styles.columnItem}>
          <DatepickerField
            name="fomDato"
            label={{ id: 'PersonArbeidsforholdDetailForm.ArbeidsforholdStartdato' }}
            validate={[required, hasValidDate]}
            readOnly={readOnly}
          />
        </FlexColumn>
        <FlexColumn className={styles.columnItem}>
          <DatepickerField
            name="tomDato"
            label={{ id: 'PersonArbeidsforholdDetailForm.ArbeidsforholdSluttdato' }}
            validate={[hasValidDate]}
            readOnly={readOnly}
          />
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn className={styles.columnItem}>
          <InputField
            name="stillingsprosent"
            label={{ id: 'PersonArbeidsforholdDetailForm.Stillingsprosent' }}
            validate={[required, minValue(0), maxValue(100), hasValidInteger]}
            readOnly={readOnly}
            bredde="S"
            parse={value => {
              const parsedValue = parseInt(value, 10);
              return Number.isNaN(parsedValue) ? value : parsedValue;
            }}
          />
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <VerticalSpacer sixteenPx />
        <FlexColumn className={styles.navnColumn}>
          <InputField
            name="yrkestittel"
            label={{ id: 'PersonArbeidsforholdDetailForm.Yrkestittel' }}
            validate={[required]}
            bredde="L"
            readOnly={readOnly}
          />
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </BehandlingFormFieldCleaner>
);

LeggTilArbeidsforholdFelter.validate = (
  values: CustomArbeidsforhold,
): {
  tomDato: string;
  fomDato: string;
} | null => {
  if (values === undefined || values === null) {
    return null;
  }
  const { fomDato, tomDato } = values;
  if (fomDato && tomDato && moment(fomDato).isAfter(moment(tomDato))) {
    return {
      // @ts-ignore
      tomDato: sluttdatoErrorMsg(formatDate(fomDato)),
      // @ts-ignore
      fomDato: startdatoErrorMsg(formatDate(tomDato)),
    };
  }
  return null;
};

export default LeggTilArbeidsforholdFelter;
