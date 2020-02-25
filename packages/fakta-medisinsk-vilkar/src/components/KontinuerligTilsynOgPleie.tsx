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
  renderAksjonspunktHelpText: JSX.Element;
}

interface StateProps {
  innleggelsesperiode: Periode;
}

const KontinuerligTilsynOgPleie: React.FunctionComponent<KontinuerligTilsynOgPleieProps & StateProps> = ({
  readOnly,
  periodeTilVurdering,
  innleggelsesperiode,
  renderAksjonspunktHelpText,
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
                      harBehovForToOmsorgspersonerDelerAvPerioden={harBehovForToOmsorgspersonerDelerAvPerioden}
                      harBehovForToOmsorgspersonerHelePerioden={harBehovForToOmsorgspersonerHelePerioden}
                      readOnly={readOnly}
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
                      renderAksjonspunktHelpText={renderAksjonspunktHelpText}
                    />
                  );
                }}
              </PeriodFieldArray>
            </div>
          );
        }}
        props={{ readOnly }}
      />
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
