import { InputField, RadioGroupField } from '@fpsak-frontend/form';
import { ArrowBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { formatCurrencyNoKr, minValue, removeSpacesFromNumber, required } from '@fpsak-frontend/utils';
import { BodyShort, Detail } from '@navikt/ds-react';
import React from 'react';
import styles from './belopetMottattIGodTroFormPanel.module.css';

const minValue1 = minValue(1);

const parseCurrencyInput = (input: any) => {
  const inputNoSpace = input.toString().replace(/\s/g, '');
  const parsedValue = parseInt(inputNoSpace, 10);
  return Number.isNaN(parsedValue) ? '' : parsedValue;
};

export interface InitialValuesGodTroForm {
  erBelopetIBehold: boolean;
  tilbakekrevdBelop?: number;
}

interface OwnProps {
  readOnly: boolean;
  erBelopetIBehold?: boolean;
}

const BelopetMottattIGodTroFormPanel = ({ readOnly, erBelopetIBehold }: OwnProps) => (
  <>
    <Detail>
      Er beløpet i behold?
    </Detail>
    <VerticalSpacer eightPx />
    <RadioGroupField
      validate={[required]}
      name="erBelopetIBehold"
      readOnly={readOnly}
      radios={[
        {
          value: true,
          label: Ja,
        },
        {
          value: false,
          label: Nei,
        },
      ]}
    />
    <div className={styles.arrowbox}>
      {erBelopetIBehold === true && (
        <ArrowBox alignOffset={25}>
          <InputField
            name="tilbakekrevdBelop"
            label={{ id: 'BelopetMottattIGodTroFormPanel.AngiBelop' }}
            validate={[required, minValue1]}
            readOnly={readOnly}
            format={formatCurrencyNoKr}
            parse={parseCurrencyInput}
            htmlSize={14}
          />
        </ArrowBox>
      )}
      {erBelopetIBehold === false && (
        <ArrowBox alignOffset={90}>
          <BodyShort size="small">
            Ingen tilbakekreving
          </BodyShort>
        </ArrowBox>
      )}
    </div>
  </>
);

BelopetMottattIGodTroFormPanel.transformValues = (
  info: { erBelopetIBehold: boolean; tilbakekrevdBelop: number },
  vurderingBegrunnelse: string,
) => ({
  '@type': 'godTro',
  begrunnelse: vurderingBegrunnelse,
  erBelopetIBehold: info.erBelopetIBehold,
  tilbakekrevesBelop: info.erBelopetIBehold ? removeSpacesFromNumber(info.tilbakekrevdBelop) : undefined,
});

BelopetMottattIGodTroFormPanel.buildIntialValues = (info: {
  erBelopetIBehold: boolean;
  tilbakekrevesBelop: number;
}) => ({
  erBelopetIBehold: info.erBelopetIBehold,
  tilbakekrevdBelop: info.tilbakekrevesBelop,
});

export default BelopetMottattIGodTroFormPanel;
