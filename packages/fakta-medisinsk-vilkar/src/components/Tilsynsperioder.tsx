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
import HeadingMedHjelpetekst from './HeadingMedHjelpetekst';
import { getMomentConvertedDate } from './MedisinskVilkarUtils';
import styles from './tilsynsperioder.less';

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
  brukSoknadsdato: (fieldNameFom: string, fieldNameTom: string) => void;
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
    brukSoknadsdato,
  }) => (
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
            label={{ id: 'MedisinskVilkarForm.Vurdering' }}
            validate={[required, minLength(3), maxLength(2000), hasValidText]}
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
            <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJaBehovForKontinuerligTilsyn' }} value />
            <RadioOption
              label={{ id: 'MedisinskVilkarForm.RadioknappNeiBehovForKontinuerligTilsyn' }}
              value={false}
              dataId="behovForKontinuerligTilsynRadioNei"
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
              label={{ id: 'MedisinskVilkarForm.Vurdering' }}
              validate={[required, minLength(3), maxLength(2000), hasValidText]}
              readOnly={readOnly}
            />
            <VerticalSpacer eightPx />
            <RadioGroupField
              name={`${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårConsts.SAMMENHENG_MELLOM_SYKDOM_OG_TILSYN}`}
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
          <VerticalSpacer twentyPx />
          <Element>
            <FormattedMessage id="MedisinskVilkarForm.BehovForKontinuerligTilsynOgPleie.Perioder" />
          </Element>
          <FlexRow wrap>
            <FlexColumn>
              <VerticalSpacer eightPx />
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
                renderUpwards
              />
            </FlexColumn>
            {!readOnly && (
              <FlexColumn>
                <div className={styles.sokandsperiodeButtonContainer}>
                  <button
                    type="button"
                    onClick={() =>
                      brukSoknadsdato(
                        `${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårConsts.FOM}`,
                        `${periodeMedBehovForKontinuerligTilsynId}.${MedisinskVilkårConsts.TOM}`,
                      )
                    }
                    className={styles.soknadsperiodeButton}
                  >
                    <FormattedMessage id="MedisinskVilkarForm.BrukPeriodenTilVurdering" />
                  </button>
                </div>
              </FlexColumn>
            )}
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
                <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={MedisinskVilkårConsts.NEI} />
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
                    label={{ id: 'MedisinskVilkarForm.Vurdering' }}
                    validate={[required, minLength(3), maxLength(2000), hasValidText]}
                    readOnly={readOnly}
                  />
                </>
              ) : null}
            </FlexColumn>
          </FlexRow>
          {harBehovForToOmsorgspersonerDelerAvPerioden && (
            <>
              <VerticalSpacer eightPx />
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
                renderUpwards
              />
            </>
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
  ),
);

export default Tilsynsperioder;
