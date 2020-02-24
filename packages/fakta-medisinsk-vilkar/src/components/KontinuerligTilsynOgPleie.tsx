import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles/src/behandlingFormTS';
import { FlexColumn, FlexRow, PeriodFieldArray, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { Periode } from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkår';
import MedisinskVilkårConsts from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkårConstants';
import moment from 'moment';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { FieldArray } from 'redux-form';
import styles from './medisinskVilkar.less';
import PeriodePolse from './PeriodePolse';
import Tilsynsperioder from './Tilsynsperioder';

interface KontinuerligTilsynOgPleieProps {
  readOnly: boolean;
  periodeTilVurdering: Periode;
  behandlingId: number;
  behandlingVersjon: number;
  formName: string;
}

interface StateProps {
  innleggelsesperiode: Periode;
}

const KontinuerligTilsynOgPleie: React.FunctionComponent<KontinuerligTilsynOgPleieProps & StateProps> = ({
  readOnly,
  periodeTilVurdering,
  innleggelsesperiode,
}) => {
  const getPolseForInnleggelsesperiode = () =>
    innleggelsesperiode ? (
      <PeriodePolse
        dates={`${moment(innleggelsesperiode.fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(
          innleggelsesperiode.tom,
        ).format(DDMMYYYY_DATE_FORMAT)}`}
        lengthInText={`${Math.abs(moment(innleggelsesperiode.tom).diff(moment(innleggelsesperiode.fom), 'days')) +
          1} dager`}
        status="Innlagt"
        theme="success"
      />
    ) : null;

  const getPolseForPeriodeSomMaaVurderes = () => {
    const periodStart = innleggelsesperiode
      ? moment(innleggelsesperiode.tom).add(1, 'days')
      : moment(periodeTilVurdering.fom);
    return (
      <PeriodePolse
        dates={`${periodStart.format(DDMMYYYY_DATE_FORMAT)} - ${moment(periodeTilVurdering.tom).format(
          DDMMYYYY_DATE_FORMAT,
        )}`}
        lengthInText={`${Math.abs(periodStart.diff(moment(periodeTilVurdering.tom), 'days')) + 1} dager`}
        status="Perioden som må vurderes"
        theme="warn"
      />
    );
  };

  return (
    <>
      <FlexRow>
        <FlexColumn>
          <PeriodePolse
            dates={`${moment(periodeTilVurdering.fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(
              periodeTilVurdering.tom,
            ).format(DDMMYYYY_DATE_FORMAT)}`}
            lengthInText={`${Math.abs(moment(periodeTilVurdering.tom).diff(moment(periodeTilVurdering.fom), 'days')) +
              1} dager`}
            status="Søknadsperiode"
            theme="blue"
          />
          {getPolseForInnleggelsesperiode()}
          {getPolseForPeriodeSomMaaVurderes()}
          <VerticalSpacer twentyPx />
        </FlexColumn>
      </FlexRow>

      {/* {harBehovForKontinuerligTilsynOgPleie && ( */}
      <FieldArray
        name={MedisinskVilkårConsts.PERIODER_MED_KONTINUERLIG_TILSYN_OG_PLEIE}
        rerenderOnEveryChange
        component={({ fields }) => {
          if (fields.length === 0) {
            fields.push({ fom: '', tom: '', behovForToOmsorgspersoner: undefined });
          }
          const removeIndex = useCallback(index => fields.remove(index), []);
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
                {(periodeMedBehovForKontinuerligTilsynId, index) => {
                  // const isPeriodeDefined = !!fields.get(index).fom && !!fields.get(index).tom;
                  const harBehovForToOmsorgspersonerHelePerioden =
                    fields.get(index).behovForToOmsorgspersoner === MedisinskVilkårConsts.JA_HELE;
                  const harBehovForToOmsorgspersonerDelerAvPerioden =
                    fields.get(index).behovForToOmsorgspersoner === MedisinskVilkårConsts.JA_DELER;
                  const { harBehovForKontinuerligTilsynOgPleie } = fields.get(index);
                  const valgtPeriodeMedBehovForKontinuerligTilsynOgPleieFom = fields.get(index).fom;
                  const valgtPeriodeMedBehovForKontinuerligTilsynOgPleieTom = fields.get(index).tom;
                  const datoBegrensningFom = innleggelsesperiode
                    ? moment(innleggelsesperiode.tom)
                        .add(1, 'days')
                        .toString()
                    : periodeTilVurdering.fom;

                  return (
                    <Tilsynsperioder
                      key={periodeMedBehovForKontinuerligTilsynId}
                      periodeMedBehovForKontinuerligTilsynId={periodeMedBehovForKontinuerligTilsynId}
                      harBehovForKontinuerligTilsynOgPleie={harBehovForKontinuerligTilsynOgPleie}
                      datoBegrensningFom={datoBegrensningFom}
                      datoBegrensningTom={periodeTilVurdering.tom}
                      // isPeriodeDefined={isPeriodeDefined}
                      harBehovForToOmsorgspersonerDelerAvPerioden={harBehovForToOmsorgspersonerDelerAvPerioden}
                      harBehovForToOmsorgspersonerHelePerioden={harBehovForToOmsorgspersonerHelePerioden}
                      readOnly={false}
                      showCancelButton={index > 0}
                      removeIndex={removeIndex}
                      index={index}
                      valgtPeriodeMedBehovForKontinuerligTilsynOgPleieFom={
                        valgtPeriodeMedBehovForKontinuerligTilsynOgPleieFom !==
                        valgtPeriodeMedBehovForKontinuerligTilsynOgPleieTom
                          ? valgtPeriodeMedBehovForKontinuerligTilsynOgPleieFom
                          : ''
                      }
                      valgtPeriodeMedBehovForKontinuerligTilsynOgPleieTom={
                        valgtPeriodeMedBehovForKontinuerligTilsynOgPleieFom !==
                        valgtPeriodeMedBehovForKontinuerligTilsynOgPleieTom
                          ? valgtPeriodeMedBehovForKontinuerligTilsynOgPleieTom
                          : ''
                      }
                    />
                    // <div key={periodeMedBehovForKontinuerligTilsyn} className={styles.expandablePanelContainer}>
                    //   <PeriodePolse theme="warn">
                    //     <div className={styles.periodeContainer}>
                    //       <FlexRow wrap>
                    //         <FlexColumn>
                    //           <Element>
                    //             <FormattedMessage id="MedisinskVilkarForm.BehovForKontinuerligTilsynOgPleie" />
                    //           </Element>
                    //           <VerticalSpacer eightPx />
                    //           <TextAreaField
                    //             name={`${periodeMedBehovForKontinuerligTilsyn}.${MedisinskVilkårConsts.BEGRUNNELSE}`}
                    //             label={{ id: 'MedisinskVilkarForm.Begrunnelse' }}
                    //             validate={[required, minLength(3), maxLength(400), hasValidText]}
                    //             readOnly={readOnly}
                    //           />
                    //           <VerticalSpacer eightPx />
                    //           <RadioGroupField
                    //             name={`${periodeMedBehovForKontinuerligTilsyn}.${MedisinskVilkårValues.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE}`}
                    //             bredde="M"
                    //             validate={[required]}
                    //             readOnly={readOnly}
                    //           >
                    //             <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappJa' }} value />
                    //             <RadioOption label={{ id: 'MedisinskVilkarForm.RadioknappNei' }} value={false} />
                    //           </RadioGroupField>
                    //         </FlexColumn>
                    //       </FlexRow>
                    //       {harBehovForKontinuerligTilsynOgPleie && (
                    //         <>
                    //           <FlexRow wrap>
                    //             <FlexColumn>
                    //               <PeriodpickerField
                    //                 names={[
                    //                   `${periodeMedBehovForKontinuerligTilsyn}.${MedisinskVilkårConsts.FOM}`,
                    //                   `${periodeMedBehovForKontinuerligTilsyn}.${MedisinskVilkårConsts.TOM}`,
                    //                 ]}
                    //                 validate={[required, hasValidDate, dateRangesNotOverlapping]}
                    //                 defaultValue={null}
                    //                 readOnly={readOnly}
                    //                 label={{ id: 'MedisinskVilkarForm.BehovForKontinuerligTilsynOgPleie.Perioder' }}
                    //                 disabledDays={{
                    //                   before: moment(periodeTilVurdering.fom).toDate(),
                    //                   after: moment(periodeTilVurdering.tom).toDate(),
                    //                 }}
                    //               />
                    //             </FlexColumn>
                    //           </FlexRow>
                    //           <FlexRow>
                    //             <FlexColumn>
                    //               <Element>
                    //                 <FormattedMessage id="MedisinskVilkarForm.BehovForEnEllerToOmsorgspersoner" />
                    //               </Element>
                    //               <VerticalSpacer eightPx />
                    //               <RadioGroupField
                    //                 name={`${periodeMedBehovForKontinuerligTilsyn}.behovForToOmsorgspersoner`}
                    //                 bredde="M"
                    //                 validate={[required]}
                    //                 readOnly={readOnly || !isPeriodeDefined}
                    //                 direction="vertical"
                    //               >
                    //                 <RadioOption
                    //                   label={{ id: 'MedisinskVilkarForm.RadioknappNei' }}
                    //                   value={MedisinskVilkårConsts.NEI}
                    //                 />
                    //                 <RadioOption
                    //                   label={{ id: 'MedisinskVilkarForm.RadioknappJaHele' }}
                    //                   value={MedisinskVilkårConsts.JA_HELE}
                    //                 />
                    //                 <RadioOption
                    //                   label={{ id: 'MedisinskVilkarForm.RadioknappJaDeler' }}
                    //                   value={MedisinskVilkårConsts.JA_DELER}
                    //                 />
                    //               </RadioGroupField>
                    //               {harBehovForToOmsorgspersonerDelerAvPerioden ||
                    //               harBehovForToOmsorgspersonerHelePerioden ? (
                    //                 <TextAreaField
                    //                   name={`${periodeMedBehovForKontinuerligTilsyn}.${MedisinskVilkårConsts.BEGRUNNELSE_UTVIDET}`}
                    //                   label={{ id: 'MedisinskVilkarForm.Begrunnelse' }}
                    //                   validate={[required, minLength(3), maxLength(400), hasValidText]}
                    //                   readOnly={readOnly}
                    //                 />
                    //               ) : null}
                    //             </FlexColumn>
                    //           </FlexRow>
                    //           {harBehovForToOmsorgspersonerDelerAvPerioden && (
                    //             <FieldArray
                    //               name={`${periodeMedBehovForKontinuerligTilsyn}.${MedisinskVilkårConsts.PERIODER_MED_UTVIDET_KONTINUERLIG_TILSYN_OG_PLEIE}`}
                    //               component={utvidetTilsynFieldProps => {
                    //                 return (
                    //                   <PeriodFieldArray
                    //                     fields={utvidetTilsynFieldProps.fields}
                    //                     emptyPeriodTemplate={{
                    //                       fom: '',
                    //                       tom: '',
                    //                     }}
                    //                     shouldShowAddButton
                    //                     readOnly={readOnly}
                    //                   >
                    //                     {(periodeMedBehovForUtvidetKontinuerligTilsyn, idx, getRemoveButton) => (
                    //                       <FlexRow key={periodeMedBehovForUtvidetKontinuerligTilsyn} wrap>
                    //                         <FlexColumn>
                    //                           <PeriodpickerField
                    //                             names={[
                    //                               `${periodeMedBehovForUtvidetKontinuerligTilsyn}.fom`,
                    //                               `${periodeMedBehovForUtvidetKontinuerligTilsyn}.tom`,
                    //                             ]}
                    //                             validate={[required, hasValidDate, dateRangesNotOverlapping]}
                    //                             defaultValue={null}
                    //                             readOnly={readOnly}
                    //                             label={
                    //                               idx === 0 ? { id: 'MedisinskVilkarForm.BehovForTo.Periode' } : ''
                    //                             }
                    //                             disabledDays={{
                    //                               before: moment(fields.get(index).fom).toDate(),
                    //                               after: moment(fields.get(index).tom).toDate(),
                    //                             }}
                    //                           />
                    //                         </FlexColumn>
                    //                         <FlexColumn>{getRemoveButton()}</FlexColumn>
                    //                       </FlexRow>
                    //                     )}
                    //                   </PeriodFieldArray>
                    //                 );
                    //               }}
                    //             />
                    //           )}
                    //         </>
                    //       )}
                    //       {index > 0 && (
                    //         <FlexRow>
                    //           <FlexColumn>
                    //             <Knapp mini htmlType="button" onClick={() => fields.remove(index)} disabled={false}>
                    //               <FormattedMessage id="MedisinskVilkarForm.BehovForTo.Avbryt" />
                    //             </Knapp>
                    //           </FlexColumn>
                    //         </FlexRow>
                    //       )}
                    //     </div>
                    //   </PeriodePolse>
                    // </div>
                  );
                }}
              </PeriodFieldArray>
            </div>
          );
        }}
        props={{ readOnly }}
      />
      {/* )} */}
    </>
  );
};

const mapStateToProps = (_, props: KontinuerligTilsynOgPleieProps) => {
  const { behandlingVersjon, behandlingId, formName } = props;
  return state => ({
    innleggelsesperiode: behandlingFormValueSelector(
      formName,
      behandlingId,
      behandlingVersjon,
    )(state, 'innleggelsesperiode'),
  });
};

export default connect(mapStateToProps)(KontinuerligTilsynOgPleie);
