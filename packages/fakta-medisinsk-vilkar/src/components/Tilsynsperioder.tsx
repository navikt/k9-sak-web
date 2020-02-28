import { PeriodpickerField, RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import { FlexColumn, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  dateRangesNotOverlapping,
  hasValidDate,
  hasValidText,
  maxLength,
  minLength,
  required,
} from '@fpsak-frontend/utils';
import MedisinskVilkårConsts from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkårConstants';
import moment, { Moment } from 'moment';
import { Knapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import MedisinskVilkårValues from '../types/MedisinskVilkårValues';
import styles from './medisinskVilkar.less';
import PeriodePolse from './PeriodePolse';
import { getMomentConvertedDate } from './MedisinskVilkarUtils';

interface TilsynsperioderProps {
  periodeMedBehovForKontinuerligTilsynId: string;
  readOnly: boolean;
  harBehovForKontinuerligTilsynOgPleie: boolean;
  harBehovForToOmsorgspersonerDelerAvPerioden: boolean;
  harBehovForToOmsorgspersonerHelePerioden: boolean;
  datoBegrensningFom: string | Date | Moment;
  datoBegrensningTom: string | Date | Moment;
  showCancelButton: boolean;
  removeIndex: (index: number) => void;
  index: number;
  valgtPeriodeMedBehovForKontinuerligTilsynOgPleieFom: string;
  valgtPeriodeMedBehovForKontinuerligTilsynOgPleieTom: string;
  renderAksjonspunktHelpText: JSX.Element;
}

const Tilsynsperioder: React.FunctionComponent<TilsynsperioderProps> = React.memo(
  ({
    periodeMedBehovForKontinuerligTilsynId,
    readOnly,
    harBehovForKontinuerligTilsynOgPleie,
    harBehovForToOmsorgspersonerDelerAvPerioden,
    harBehovForToOmsorgspersonerHelePerioden,
    datoBegrensningFom,
    datoBegrensningTom,
    showCancelButton,
    removeIndex,
    index,
    valgtPeriodeMedBehovForKontinuerligTilsynOgPleieFom,
    valgtPeriodeMedBehovForKontinuerligTilsynOgPleieTom,
    renderAksjonspunktHelpText,
  }) => (
    <div className={styles.tilsynContainer}>
      <PeriodePolse theme="warn">
        <div className={styles.periodeContainer}>
          <div className={styles.helpTextContainer}>{renderAksjonspunktHelpText}</div>
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
                dataId={`begrunnelseForKontinuerligTilsyn[${index}]`}
              />
              <VerticalSpacer eightPx />
              <RadioGroupField
                name={`${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårValues.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE}`}
                bredde="M"
                validate={[required]}
                readOnly={readOnly}
                direction="vertical"
              >
                <RadioOption
                  label={{ id: 'MedisinskVilkarForm.RadioknappNei' }}
                  value={false}
                  dataId="behovForKontinuerligTilsynRadioNei"
                />
                <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
              </RadioGroupField>
            </FlexColumn>
          </FlexRow>
          {harBehovForKontinuerligTilsynOgPleie && (
            <>
              <FlexRow wrap>
                <FlexColumn>
                  <Element>
                    <FormattedMessage id="MedisinskVilkarForm.BehovForKontinuerligTilsynOgPleie.Perioder" />
                  </Element>
                  <PeriodpickerField
                    names={[
                      `${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårConsts.FOM}`,
                      `${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårConsts.TOM}`,
                    ]}
                    validate={[required, hasValidDate, dateRangesNotOverlapping]}
                    defaultValue={null}
                    readOnly={readOnly}
                    label={{ id: 'MedisinskVilkarForm.Periode' }}
                    disabledDays={{
                      before: getMomentConvertedDate(datoBegrensningFom),
                      after: getMomentConvertedDate(datoBegrensningTom),
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
                    <>
                      <VerticalSpacer fourPx />
                      <TextAreaField
                        name={`${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårConsts.BEGRUNNELSE_UTVIDET}`}
                        label={{ id: 'MedisinskVilkarForm.Begrunnelse' }}
                        validate={[required, minLength(3), maxLength(400), hasValidText]}
                        readOnly={readOnly}
                      />
                    </>
                  ) : null}
                </FlexColumn>
              </FlexRow>
              {harBehovForToOmsorgspersonerDelerAvPerioden && (
                <PeriodpickerField
                  names={[
                    `${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårConsts.PERIODER_MED_UTVIDET_KONTINUERLIG_TILSYN_OG_PLEIE}.fom`,
                    `${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårConsts.PERIODER_MED_UTVIDET_KONTINUERLIG_TILSYN_OG_PLEIE}.tom`,
                  ]}
                  validate={[required, hasValidDate, dateRangesNotOverlapping]}
                  defaultValue={null}
                  readOnly={readOnly}
                  label={{ id: 'MedisinskVilkarForm.Periode' }}
                  disabledDays={{
                    before: moment(valgtPeriodeMedBehovForKontinuerligTilsynOgPleieFom).toDate(),
                    after: moment(valgtPeriodeMedBehovForKontinuerligTilsynOgPleieTom).toDate(),
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
