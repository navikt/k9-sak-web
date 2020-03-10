import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel2.svg';
import checkIkonUrl from '@fpsak-frontend/assets/images/check.svg';
import { behandlingFormValueSelector, getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles/src/behandlingFormTS';
import { Image, PeriodFieldArray, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { Periode } from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkår';
import MedisinskVilkårConsts from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkårConstants';
import moment from 'moment';
import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change as reduxFormChange, FieldArray } from 'redux-form';
import styles from './kontinuerligTilsynOgPleie.less';
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
  behandlingFormPrefix: string;
  reduxFormChange: (formName: string, fieldName: string, value: any) => void;
}

const KontinuerligTilsynOgPleie: React.FunctionComponent<KontinuerligTilsynOgPleieProps & StateProps> = ({
  readOnly,
  periodeTilVurdering,
  innleggelsesperiode,
  formName,
  behandlingFormPrefix,
  reduxFormChange: formChange,
}) => {
  const intl = useIntl();
  const getPolseForInnleggelsesperiode = () =>
    innleggelsesperiode ? (
      <div className={styles.polseContainer}>
        <PeriodePolse
          dates={`${moment(innleggelsesperiode.fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(
            innleggelsesperiode.tom,
          ).format(DDMMYYYY_DATE_FORMAT)}`}
          lengthInText={`${Math.abs(moment(innleggelsesperiode.tom).diff(moment(innleggelsesperiode.fom), 'days')) +
            1} dager`}
          status="Innlagt"
          theme="success"
          icon={
            <Image
              className={styles.polseIcon}
              alt={intl.formatMessage({ id: 'HelpText.Aksjonspunkt' })}
              src={checkIkonUrl}
            />
          }
        />
      </div>
    ) : null;

  const getPolseForPeriodeSomMaaVurderes = () => {
    let periodStart;
    if (innleggelsesperiode) {
      if (moment(innleggelsesperiode.tom).isSame(moment(periodeTilVurdering.tom))) {
        return null;
      }
      periodStart = moment(innleggelsesperiode.tom).add(1, 'days');
    } else {
      periodStart = moment(periodeTilVurdering.fom);
    }
    return (
      <PeriodePolse
        dates={`${periodStart.format(DDMMYYYY_DATE_FORMAT)} - ${moment(periodeTilVurdering.tom).format(
          DDMMYYYY_DATE_FORMAT,
        )}`}
        lengthInText={`${Math.abs(periodStart.diff(moment(periodeTilVurdering.tom), 'days')) + 1} dager`}
        status="Perioden som må vurderes"
        theme="warn"
        icon={
          <Image
            className={styles.polseIcon}
            alt={intl.formatMessage({ id: 'HelpText.Aksjonspunkt' })}
            src={advarselIkonUrl}
          />
        }
      />
    );
  };

  const renderTilsynsperiodeFieldArray = ({ fields }) => {
    if (fields.length === 0) {
      fields.push({ fom: '', tom: '', behovForToOmsorgspersoner: undefined });
    }
    const removeIndex = useCallback(index => fields.remove(index), []);
    const brukSoknadsdato = useCallback((fieldNameFom, fieldNameTom) => {
      const formSelector = `${behandlingFormPrefix}.${formName}`;
      formChange(
        formSelector,
        fieldNameFom,
        innleggelsesperiode ? moment(innleggelsesperiode.tom).add(1, 'days') : periodeTilVurdering.fom,
      );
      formChange(formSelector, fieldNameTom, periodeTilVurdering.tom);
    }, []);
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
            const { harBehovForKontinuerligTilsynOgPleie, sammenhengMellomSykdomOgTilsyn } = fields.get(index);
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
                sammenhengMellomSykdomOgTilsyn={sammenhengMellomSykdomOgTilsyn}
                brukSoknadsdato={brukSoknadsdato}
              />
            );
          }}
        </PeriodFieldArray>
      </div>
    );
  };

  return (
    <>
      <PeriodePolse
        dates={`${moment(periodeTilVurdering.fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(
          periodeTilVurdering.tom,
        ).format(DDMMYYYY_DATE_FORMAT)}`}
        lengthInText={`${Math.abs(moment(periodeTilVurdering.tom).diff(moment(periodeTilVurdering.fom), 'days')) +
          1} dager`}
        status="Søknadsperiode"
        theme="gray"
      />
      {getPolseForInnleggelsesperiode()}
      {getPolseForPeriodeSomMaaVurderes()}
      <VerticalSpacer twentyPx />

      <FieldArray
        name={MedisinskVilkårConsts.PERIODER_MED_KONTINUERLIG_TILSYN_OG_PLEIE}
        rerenderOnEveryChange
        component={renderTilsynsperiodeFieldArray}
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
    behandlingFormPrefix: getBehandlingFormPrefix(behandlingId, behandlingVersjon),
  });
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      reduxFormChange,
    },
    dispatch,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(KontinuerligTilsynOgPleie);
