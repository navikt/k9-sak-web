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
import MedisinskVilkårConsts from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkårConstants';
import moment from 'moment';
import { Knapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';
import MedisinskVilkårValues from '../types/MedisinskVilkårValues';
import styles from './medisinskVilkar.less';
import PeriodePolse from './PeriodePolse';

interface TilsynsperioderProps {
  periodeMedBehovForKontinuerligTilsynId: string;
  readOnly: boolean;
  harBehovForKontinuerligTilsynOgPleie: boolean;
  // isPeriodeDefined,
  harBehovForToOmsorgspersonerDelerAvPerioden: boolean;
  harBehovForToOmsorgspersonerHelePerioden: boolean;
  datoBegrensningFom: string | Date;
  datoBegrensningTom: string | Date;
  showCancelButton: boolean;
  removeIndex: (index: number) => void;
  index: number;
  valgtPeriodeMedBehovForKontinuerligTilsynOgPleieFom: string;
  valgtPeriodeMedBehovForKontinuerligTilsynOgPleieTom: string;
}

const Tilsynsperioder: React.FunctionComponent<TilsynsperioderProps> = React.memo(
  ({
    periodeMedBehovForKontinuerligTilsynId,
    readOnly,
    harBehovForKontinuerligTilsynOgPleie,
    // isPeriodeDefined,
    harBehovForToOmsorgspersonerDelerAvPerioden,
    harBehovForToOmsorgspersonerHelePerioden,
    datoBegrensningFom,
    datoBegrensningTom,
    showCancelButton,
    removeIndex,
    index,
    valgtPeriodeMedBehovForKontinuerligTilsynOgPleieFom,
    valgtPeriodeMedBehovForKontinuerligTilsynOgPleieTom,
  }) => (
    <div className={styles.expandablePanelContainer}>
      <PeriodePolse theme="warn">
        <div className={styles.periodeContainer}>
          <FlexRow wrap>
            <FlexColumn>
              <Element>
                <FormattedMessage id="MedisinskVilkarForm.BehovForKontinuerligTilsynOgPleie" />
              </Element>
              <VerticalSpacer eightPx />
              <TextAreaField
                name={`${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårConsts.BEGRUNNELSE}`}
                label={{ id: 'MedisinskVilkarForm.Begrunnelse' }}
                validate={[required, minLength(3), maxLength(400), hasValidText]}
                readOnly={readOnly}
              />
              <VerticalSpacer eightPx />
              <RadioGroupField
                name={`${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårValues.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE}`}
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
            <>
              <FlexRow wrap>
                <FlexColumn>
                  <PeriodpickerField
                    names={[
                      `${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårConsts.FOM}`,
                      `${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårConsts.TOM}`,
                    ]}
                    validate={[required, hasValidDate, dateRangesNotOverlapping]}
                    defaultValue={null}
                    readOnly={readOnly}
                    label={{ id: 'MedisinskVilkarForm.BehovForKontinuerligTilsynOgPleie.Perioder' }}
                    disabledDays={{
                      before: moment(datoBegrensningFom).toDate(),
                      after: moment(datoBegrensningTom).toDate(),
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
                  <RadioGroupField
                    name={`${periodeMedBehovForKontinuerligTilsynId}.behovForToOmsorgspersoner`}
                    bredde="M"
                    validate={[required]}
                    readOnly={readOnly}
                    direction="vertical"
                  >
                    <RadioOption
                      label={{ id: 'MedisinskVilkarForm.RadioknappNei' }}
                      value={MedisinskVilkårConsts.NEI}
                    />
                    <RadioOption
                      label={{ id: 'MedisinskVilkarForm.RadioknappJaHele' }}
                      value={MedisinskVilkårConsts.JA_HELE}
                    />
                    <RadioOption
                      label={{ id: 'MedisinskVilkarForm.RadioknappJaDeler' }}
                      value={MedisinskVilkårConsts.JA_DELER}
                    />
                  </RadioGroupField>
                  {harBehovForToOmsorgspersonerDelerAvPerioden || harBehovForToOmsorgspersonerHelePerioden ? (
                    <TextAreaField
                      name={`${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårConsts.BEGRUNNELSE_UTVIDET}`}
                      label={{ id: 'MedisinskVilkarForm.Begrunnelse' }}
                      validate={[required, minLength(3), maxLength(400), hasValidText]}
                      readOnly={readOnly}
                    />
                  ) : null}
                </FlexColumn>
              </FlexRow>
              {harBehovForToOmsorgspersonerDelerAvPerioden && (
                <FieldArray
                  name={`${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårConsts.PERIODER_MED_UTVIDET_KONTINUERLIG_TILSYN_OG_PLEIE}`}
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
                        {(periodeMedBehovForUtvidetKontinuerligTilsyn, idx, getRemoveButton) => (
                          <FlexRow key={periodeMedBehovForUtvidetKontinuerligTilsyn} wrap>
                            <FlexColumn>
                              <PeriodpickerField
                                names={[
                                  `${periodeMedBehovForUtvidetKontinuerligTilsyn}.fom`,
                                  `${periodeMedBehovForUtvidetKontinuerligTilsyn}.tom`,
                                ]}
                                validate={[required, hasValidDate, dateRangesNotOverlapping]}
                                defaultValue={null}
                                readOnly={readOnly}
                                label={idx === 0 ? { id: 'MedisinskVilkarForm.BehovForTo.Periode' } : ''}
                                disabledDays={{
                                  before: moment(valgtPeriodeMedBehovForKontinuerligTilsynOgPleieFom).toDate(),
                                  after: moment(valgtPeriodeMedBehovForKontinuerligTilsynOgPleieTom).toDate(),
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
              )}
            </>
          )}
          {showCancelButton && (
            <FlexRow>
              <FlexColumn>
                <Knapp mini htmlType="button" onClick={() => removeIndex(index)} disabled={false}>
                  <FormattedMessage id="MedisinskVilkarForm.BehovForTo.Avbryt" />
                </Knapp>
              </FlexColumn>
            </FlexRow>
          )}
        </div>
      </PeriodePolse>
    </div>
  ),
);

export default Tilsynsperioder;
