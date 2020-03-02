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
import HeadingMedHjelpetekst from './HeadingMedHjelpetekst';

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
  sammenhengMellomSykdomOgTilsyn: boolean;
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
    sammenhengMellomSykdomOgTilsyn,
  }) => (
    <div className={styles.tilsynContainer}>
      <PeriodePolse theme="warn" hideIcon>
        <div className={styles.periodeContainer}>
          <FlexRow wrap>
            <FlexColumn>
              <HeadingMedHjelpetekst
                headingId="MedisinskVilkarForm.BehovForKontinuerligTilsynOgPleie"
                helpTextId={[
                  'MedisinskVilkarForm.BehovForKontinuerligTilsynOgPleieHjelpetekstOne',
                  'MedisinskVilkarForm.BehovForKontinuerligTilsynOgPleieHjelpetekstTwo',
                ]}
              />
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
                direction="vertical"
              >
                <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJaBehovForKontinuerligTilsyn' }} value />
                <RadioOption
                  label={{ id: 'MedisinskVilkarForm.RadioknappNeiBehovForKontinuerligTilsyn' }}
                  value={false}
                />
              </RadioGroupField>
            </FlexColumn>
          </FlexRow>
          {harBehovForKontinuerligTilsynOgPleie && (
            <FlexRow wrap>
              <FlexColumn>
                <VerticalSpacer twentyPx />
                <HeadingMedHjelpetekst
                  headingId="MedisinskVilkarForm.SammenhengMellomSykdomOgTilsyn"
                  helpTextId="MedisinskVilkarForm.SammenhengSykdomOgPleieHjelpetekst"
                />
                <VerticalSpacer eightPx />
                <TextAreaField
                  name={`${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårConsts.SAMMENG_MELLOM_SYKDOM_OG_TILSYN_BEGRUNNELSE}`}
                  label={{ id: 'MedisinskVilkarForm.Begrunnelse' }}
                  validate={[required, minLength(3), maxLength(400), hasValidText]}
                  readOnly={readOnly}
                />
                <VerticalSpacer eightPx />
                <RadioGroupField
                  name={`${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårValues.SAMMENHENG_MELLOM_SYKDOM_OG_TILSYN}`}
                  bredde="M"
                  validate={[required]}
                  readOnly={readOnly}
                  direction="vertical"
                >
                  <RadioOption
                    label={{ id: 'MedisinskVilkarForm.RadioknappJaSammenhengSykdomOgKontinuerligTilsyn' }}
                    value
                  />
                  <RadioOption
                    label={{ id: 'MedisinskVilkarForm.RadioknappNeiSammenhengSykdomOgKontinuerligTilsyn' }}
                    value={false}
                  />
                </RadioGroupField>
              </FlexColumn>
            </FlexRow>
          )}
          {harBehovForKontinuerligTilsynOgPleie && sammenhengMellomSykdomOgTilsyn && (
            <>
              <FlexRow wrap>
                <FlexColumn>
                  <VerticalSpacer twentyPx />
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
                  <VerticalSpacer twentyPx />
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
