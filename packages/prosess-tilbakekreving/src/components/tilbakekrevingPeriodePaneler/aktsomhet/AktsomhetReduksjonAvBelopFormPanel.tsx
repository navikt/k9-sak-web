import { DecimalField, InputField, RadioGroupField, RadioOption, SelectField } from '@fpsak-frontend/form';
import { ArrowBox, FlexColumn, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { formatCurrencyNoKr, maxValue, minValue, required } from '@fpsak-frontend/utils';
import { BodyShort, Detail } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Aktsomhet from '../../../kodeverk/aktsomhet';

import styles from './aktsomhetReduksjonAvBelopFormPanel.module.css';

const minValue1 = minValue(0.0);
const maxValue100 = maxValue(99.99);

const parseCurrencyInput = (input: any) => {
  const inputNoSpace = input.toString().replace(/\s/g, '');
  const parsedValue = parseInt(inputNoSpace, 10);
  return Number.isNaN(parsedValue) ? '' : parsedValue;
};

export const EGENDEFINERT = 'Egendefinert';
export const ANDELER = ['30', '50', '70', EGENDEFINERT];

interface OwnProps {
  harGrunnerTilReduksjon?: boolean;
  readOnly: boolean;
  handletUaktsomhetGrad: string;
  harMerEnnEnYtelse: boolean;
  feilutbetalingBelop: number;
  andelSomTilbakekreves?: string;
}

const AktsomhetReduksjonAvBelopFormPanel = ({
  harGrunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
  harMerEnnEnYtelse,
  feilutbetalingBelop,
  andelSomTilbakekreves,
}: OwnProps) => (
  <>
    <Row>
      <Column md="12">
        <VerticalSpacer eightPx />
        <Detail>
          <FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.SkalSarligeGrunnerGiReduksjon" />
        </Detail>
        <VerticalSpacer eightPx />
        <RadioGroupField validate={[required]} name="harGrunnerTilReduksjon" readOnly={readOnly}>
          <RadioOption label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Ja" />} value />
          <RadioOption label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Nei" />} value={false} />
        </RadioGroupField>
      </Column>
    </Row>
    {harGrunnerTilReduksjon && (
      <ArrowBox alignOffset={24}>
        <Row>
          <Column md="6">
            {!harMerEnnEnYtelse && andelSomTilbakekreves !== EGENDEFINERT && (
              <>
                <Detail>
                  <FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.AngiAndelSomTilbakekreves" />
                </Detail>
                <FlexRow>
                  <FlexColumn>
                    <SelectField
                      name="andelSomTilbakekreves"
                      label=""
                      validate={[required]}
                      selectValues={ANDELER.map(andel => (
                        <option key={andel} value={andel}>
                          {andel}
                        </option>
                      ))}
                      bredde="s"
                    />
                  </FlexColumn>
                  <FlexColumn className={styles.suffix}>%</FlexColumn>
                </FlexRow>
              </>
            )}
            {!harMerEnnEnYtelse && andelSomTilbakekreves === EGENDEFINERT && (
              <>
                <Detail>
                  <FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.AngiAndelSomTilbakekreves" />
                </Detail>
                <FlexRow>
                  <FlexColumn>
                    <DecimalField
                      name="andelSomTilbakekrevesManuell"
                      readOnly={readOnly}
                      validate={[required, minValue1, maxValue100]}
                      // @ts-ignore tror denne trengs fordi fpsak-frontend/form ikkje er fullstendig konvertert til typescript
                      normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                      htmlSize={14}
                    />
                  </FlexColumn>
                  <FlexColumn
                    className={
                      handletUaktsomhetGrad === Aktsomhet.GROVT_UAKTSOM ? styles.suffixGrovText : styles.suffix
                    }
                  >
                    %
                  </FlexColumn>
                </FlexRow>
              </>
            )}
            {harMerEnnEnYtelse && (
              <InputField
                name="belopSomSkalTilbakekreves"
                label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.AngiBelopSomSkalTilbakekreves" />}
                validate={[required, minValue1]}
                readOnly={readOnly}
                format={formatCurrencyNoKr}
                parse={parseCurrencyInput}
                htmlSize={14}
              />
            )}
          </Column>
          {handletUaktsomhetGrad === Aktsomhet.GROVT_UAKTSOM && (
            <Column md="6">
              <Detail>
                <FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.SkalTilleggesRenter" />
              </Detail>
              <BodyShort size="small" className={styles.labelPadding}>
                <FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Nei" />
              </BodyShort>
            </Column>
          )}
        </Row>
      </ArrowBox>
    )}
    {harGrunnerTilReduksjon === false && (
      <ArrowBox alignOffset={90}>
        <Row>
          <Column md="6">
            <Detail>
              <FormattedMessage
                id={
                  harMerEnnEnYtelse
                    ? 'AktsomhetReduksjonAvBelopFormPanel.BelopSomSkalTilbakekreves'
                    : 'AktsomhetReduksjonAvBelopFormPanel.andelSomTilbakekreves'
                }
              />
            </Detail>
            <BodyShort size="small" className={styles.labelPadding}>
              {harMerEnnEnYtelse ? formatCurrencyNoKr(feilutbetalingBelop) : '100%'}
            </BodyShort>
          </Column>
          {handletUaktsomhetGrad === Aktsomhet.GROVT_UAKTSOM && (
            <Column md="6">
              <RadioGroupField
                label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.SkalTilleggesRenter" />}
                validate={[required]}
                name="skalDetTilleggesRenter"
                readOnly={readOnly}
              >
                <RadioOption label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Ja" />} value />
                <RadioOption label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Nei" />} value={false} />
              </RadioGroupField>
            </Column>
          )}
        </Row>
      </ArrowBox>
    )}
  </>
);

export default AktsomhetReduksjonAvBelopFormPanel;
