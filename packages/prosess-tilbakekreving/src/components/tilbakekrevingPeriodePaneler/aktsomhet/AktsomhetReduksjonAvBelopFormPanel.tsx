import { DecimalField, InputField, RadioGroupField, SelectField } from '@fpsak-frontend/form';
import { ArrowBox, FlexColumn, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { formatCurrencyNoKr, maxValue, minValue, required } from '@fpsak-frontend/utils';
import { BodyShort, Detail, HGrid } from '@navikt/ds-react';
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
    <HGrid gap="space-4" columns={{ xs: '12fr' }}>
      <div>
        <VerticalSpacer eightPx />
        <Detail>
          Skal særlige grunner gi reduksjon av beløpet?
        </Detail>
        <VerticalSpacer eightPx />
        <RadioGroupField
          validate={[required]}
          name="harGrunnerTilReduksjon"
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
      </div>
    </HGrid>
    {harGrunnerTilReduksjon && (
      <ArrowBox alignOffset={24}>
        <HGrid gap="space-4" columns={{ xs: '6fr 6fr' }}>
          <div>
            {!harMerEnnEnYtelse && andelSomTilbakekreves !== EGENDEFINERT && (
              <>
                <Detail>
                  Angi andel som skal tilbakekreves
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
                  Angi andel som skal tilbakekreves
                </Detail>
                <FlexRow>
                  <FlexColumn>
                    <DecimalField
                      name="andelSomTilbakekrevesManuell"
                      readOnly={readOnly}
                      validate={[required, minValue1, maxValue100]}
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
                label={Angi beløp som skal tilbakekreves}
                validate={[required, minValue1]}
                readOnly={readOnly}
                format={formatCurrencyNoKr}
                parse={parseCurrencyInput}
                htmlSize={14}
              />
            )}
          </div>
          {handletUaktsomhetGrad === Aktsomhet.GROVT_UAKTSOM && (
            <div>
              <Detail>
                Skal det tillegges renter?
              </Detail>
              <BodyShort size="small" className={styles.labelPadding}>
                Nei
              </BodyShort>
            </div>
          )}
        </HGrid>
      </ArrowBox>
    )}
    {harGrunnerTilReduksjon === false && (
      <ArrowBox alignOffset={90}>
        <HGrid gap="space-4" columns={{ xs: '6fr 6fr' }}>
          <div>
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
          </div>
          {handletUaktsomhetGrad === Aktsomhet.GROVT_UAKTSOM && (
            <div>
              <RadioGroupField
                label={Skal det tillegges renter?}
                validate={[required]}
                name="skalDetTilleggesRenter"
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
            </div>
          )}
        </HGrid>
      </ArrowBox>
    )}
  </>
);

export default AktsomhetReduksjonAvBelopFormPanel;
