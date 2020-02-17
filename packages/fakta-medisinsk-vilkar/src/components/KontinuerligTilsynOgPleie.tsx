import { PeriodpickerField, RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import { FlexColumn, FlexRow, PeriodFieldArray, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  dateRangesNotOverlapping,
  hasValidDate,
  hasValidText,
  maxLength,
  minLength,
  required,
} from '@fpsak-frontend/utils';
import { Periode } from '@k9-frontend/types/src/medisinsk-vilkår/MedisinskVilkår';
import MedisinskVilkårConsts from '@k9-frontend/types/src/medisinsk-vilkår/MedisinskVilkårConstants';
import ExpandablePanel from '@navikt/nap-expandable-panel';
import moment from 'moment';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';
import MedisinskVilkårValues from '../types/MedisinskVilkårValues';
import styles from './medisinskVilkar.less';

interface KontinuerligTilsynOgPleieProps {
  readOnly: boolean;
  harBehovForKontinuerligTilsynOgPleie: boolean;
  periodeTilVurdering: Periode;
}

const KontinuerligTilsynOgPleie: React.FunctionComponent<KontinuerligTilsynOgPleieProps> = ({
  readOnly,
  harBehovForKontinuerligTilsynOgPleie,
  periodeTilVurdering,
}) => (
  <>
    <FlexRow>
      <FlexColumn>
        <Element>
          <FormattedMessage id="MedisinskVilkarForm.BehovForKontinuerligTilsynOgPleie" />
        </Element>
        <VerticalSpacer eightPx />
        <TextAreaField
          name="begrunnelse"
          label={{ id: 'MedisinskVilkarForm.Begrunnelse' }}
          validate={[required, minLength(3), maxLength(400), hasValidText]}
          readOnly={readOnly}
        />
        <RadioGroupField
          name={MedisinskVilkårValues.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE}
          bredde="M"
          validate={[required]}
          readOnly={readOnly}
        >
          <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
          <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
        </RadioGroupField>
      </FlexColumn>
    </FlexRow>

    {harBehovForKontinuerligTilsynOgPleie && (
      <FieldArray
        name={MedisinskVilkårConsts.PERIODER_MED_KONTINUERLIG_TILSYN_OG_PLEIE}
        rerenderOnEveryChange
        component={({ fields }) => {
          if (fields.length === 0) {
            fields.push({ fom: '', tom: '', behovForToOmsorgspersoner: undefined });
          }
          return (
            <div className={styles.pickerContainer}>
              <PeriodFieldArray
                fields={fields}
                emptyPeriodTemplate={{
                  fom: '',
                  tom: '',
                }}
                shouldShowAddButton
                readOnly={readOnly}
              >
                {(fieldId, index) => {
                  const isPeriodeDefined = !!fields.get(index).fom && !!fields.get(index).tom;
                  return (
                    <div key={fieldId} className={styles.expandablePanelContainer}>
                      <ExpandablePanel isOpen renderHeader={() => null} onClick={() => null}>
                        <div className={styles.periodeContainer}>
                          <FlexRow wrap>
                            <FlexColumn>
                              <PeriodpickerField
                                names={[
                                  `${fieldId}.${MedisinskVilkårConsts.FOM}`,
                                  `${fieldId}.${MedisinskVilkårConsts.TOM}`,
                                ]}
                                validate={[required, hasValidDate, dateRangesNotOverlapping]}
                                defaultValue={null}
                                readOnly={readOnly}
                                label={{ id: 'MedisinskVilkarForm.BehovForKontinuerligTilsynOgPleie.Perioder' }}
                                disabledDays={{
                                  before: moment(periodeTilVurdering.fom).toDate(),
                                  after: moment(periodeTilVurdering.tom).toDate(),
                                }}
                              />
                            </FlexColumn>
                          </FlexRow>
                          <FlexRow>
                            <FlexColumn>
                              <Element>
                                <FormattedMessage id="MedisinskVilkarForm.BehovForEnEllerToOmsorgspersoner" />
                              </Element>
                              <VerticalSpacer eightPx />
                              <TextAreaField
                                name={`${fieldId}.${MedisinskVilkårConsts.BEGRUNNELSE}`}
                                label={{ id: 'MedisinskVilkarForm.Begrunnelse' }}
                                validate={[required, minLength(3), maxLength(400), hasValidText]}
                                readOnly={readOnly}
                              />
                              <RadioGroupField
                                name={`${fieldId}.behovForToOmsorgspersoner`}
                                bredde="M"
                                validate={[required]}
                                readOnly={readOnly || !isPeriodeDefined}
                              >
                                <RadioOption
                                  label={{ id: 'MedisinskVilkarForm.RadioknappJaHele' }}
                                  value={MedisinskVilkårConsts.JA_HELE}
                                />
                                <RadioOption
                                  label={{ id: 'MedisinskVilkarForm.RadioknappJaDeler' }}
                                  value={MedisinskVilkårConsts.JA_DELER}
                                />
                                <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value="nei" />
                              </RadioGroupField>
                            </FlexColumn>
                          </FlexRow>
                          {fields.get(index).behovForToOmsorgspersoner === MedisinskVilkårConsts.JA_DELER && (
                            <FlexRow>
                              <FieldArray
                                name={MedisinskVilkårConsts.PERIODER_MED_UTVIDET_KONTINUERLIG_TILSYN_OG_PLEIE}
                                component={utvidetTilsynFieldProps => {
                                  return (
                                    <PeriodFieldArray
                                      fields={utvidetTilsynFieldProps.fields}
                                      emptyPeriodTemplate={{
                                        fom: '',
                                        tom: '',
                                      }}
                                      shouldShowAddButton
                                      readOnly={readOnly}
                                    >
                                      {(utvidetTilsynFieldId, idx, getRemoveButton) => (
                                        <FlexRow key={utvidetTilsynFieldId} wrap>
                                          <FlexColumn>
                                            <PeriodpickerField
                                              names={[`${utvidetTilsynFieldId}.fom`, `${utvidetTilsynFieldId}.tom`]}
                                              validate={[required, hasValidDate, dateRangesNotOverlapping]}
                                              defaultValue={null}
                                              readOnly={readOnly}
                                              label={idx === 0 ? { id: 'MedisinskVilkarForm.BehovForTo.Periode' } : ''}
                                              disabledDays={{
                                                before: moment(fields.get(index).fom).toDate(),
                                                after: moment(fields.get(index).tom).toDate(),
                                              }}
                                            />
                                          </FlexColumn>
                                          <FlexColumn>{getRemoveButton()}</FlexColumn>
                                        </FlexRow>
                                      )}
                                    </PeriodFieldArray>
                                  );
                                }}
                              />
                            </FlexRow>
                          )}
                          <FlexRow>
                            <FlexColumn>
                              <Hovedknapp
                                mini
                                // disabled={isDisabled(
                                // )}
                                // onClick={onClick}
                                htmlType="button"
                              >
                                <FormattedMessage id="MedisinskVilkarForm.BehovForTo.Lagre" />
                              </Hovedknapp>
                            </FlexColumn>
                            {index > 0 && (
                              <FlexColumn>
                                <Knapp mini htmlType="button" onClick={() => fields.remove(index)} disabled={false}>
                                  <FormattedMessage id="MedisinskVilkarForm.BehovForTo.Avbryt" />
                                </Knapp>
                              </FlexColumn>
                            )}
                          </FlexRow>
                        </div>
                      </ExpandablePanel>
                    </div>
                  );
                }}
              </PeriodFieldArray>
            </div>
          );
        }}
        props={{ readOnly }}
      />
    )}
  </>
);

export default KontinuerligTilsynOgPleie;
