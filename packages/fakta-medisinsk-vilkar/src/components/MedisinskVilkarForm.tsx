import { behandlingFormTs } from '@fpsak-frontend/fp-felles';
import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles/src/behandlingFormTS';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { hasValidDate, required } from '@fpsak-frontend/utils';
import { TransformValues } from '@k9-frontend/types/src/medisinsk-vilkår/MedisinskVilkår';
import MedisinskVilkårConsts from '@k9-frontend/types/src/medisinsk-vilkår/MedisinskVilkårConstants';
import { Systemtittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { FieldArray, InjectedFormProps } from 'redux-form';
import DatepickerField from '../../../form/src/DatepickerField';
import { SubmitCallbackProps } from '../MedisinskVilkarIndex';
import DiagnosekodeSelector from './DiagnosekodeSelector';
import DiagnoseRadio from './DiagnoseRadio';
import InnlagtBarnPeriodeFieldArray from './InnlagtBarnPeriodeFieldArray';
import InnlagtBarnRadio from './InnlagtBarnRadio';
import KontinuerligTilsynOgPleie from './KontinuerligTilsynOgPleie';
import Legeerklaering from './Legeerklaering';
import styles from './medisinskVilkar.less';
import MedisinskVilkarFormButtons from './MedisinskVilkarFormButtons';

interface MedisinskVilkarFormProps {
  behandlingId: number;
  behandlingVersjon: number;
  readOnly: boolean;
  submitCallback: (props: SubmitCallbackProps[]) => void;
  hasOpenAksjonspunkter: boolean;
  submittable: boolean;
}

interface StateProps {
  harDiagnose: boolean;
  erInnlagt: boolean;
  harBehovForToOmsorgspersoner: boolean;
  harBehovForKontinuerligTilsynOgPleie: boolean;
  [MedisinskVilkårConsts.PERIODER_MED_TILSYN_OG_PLEIE]: any;
}

const formName = 'MedisinskVilkarForm';

export const MedisinskVilkarForm = ({
  behandlingId,
  behandlingVersjon,
  handleSubmit,
  form,
  readOnly,
  hasOpenAksjonspunkter,
  submittable,
  harDiagnose,
  erInnlagt,
  harBehovForKontinuerligTilsynOgPleie,
}: MedisinskVilkarFormProps & StateProps & InjectedFormProps & WrappedComponentProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.headingContainer}>
        <Systemtittel>
          <FormattedMessage id="MedisinskVilkarForm.Fakta" />
        </Systemtittel>
      </div>
      <div className={styles.fieldContainer}>
        <DatepickerField
          name={MedisinskVilkårConsts.LEGEERKLÆRING_FOM}
          validate={[required, hasValidDate]}
          defaultValue={null}
          readOnly={readOnly}
          label={{ id: 'MedisinskVilkarForm.Legeerklæring.Perioder' }}
        />
        <InnlagtBarnRadio readOnly={readOnly} />
        {erInnlagt && (
          <FieldArray
            name={MedisinskVilkårConsts.INNLEGGELSESPERIODER}
            component={InnlagtBarnPeriodeFieldArray}
            props={{ readOnly }}
          />
        )}
        <div className={styles.fieldContainer}>
          <DiagnoseRadio readOnly={readOnly} />
          {harDiagnose && <DiagnosekodeSelector readOnly={readOnly} />}
        </div>
        <div className={styles.fieldContainer}>
          <Legeerklaering readOnly={readOnly} />
        </div>
      </div>
      <div className={styles.headingContainer}>
        <Systemtittel>
          <FormattedMessage id="MedisinskVilkarForm.Vilkår" />
        </Systemtittel>
      </div>
      <div className={styles.fieldContainer}>
        <KontinuerligTilsynOgPleie
          readOnly={readOnly}
          harBehovForKontinuerligTilsynOgPleie={harBehovForKontinuerligTilsynOgPleie}
        />
      </div>
      <MedisinskVilkarFormButtons
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        form={form}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        readOnly={readOnly}
        submittable={submittable}
      />
    </form>
  );
};

const transformValues = (values: TransformValues) => {
  return {
    kode: aksjonspunktCodes.MEDISINSK_VILKAAR,
    begrunnelse: values.begrunnelse,
    legeerklæring: [
      {
        identifikator: null,
        diagnosekode: values.diagnosekode,
        kilde: values.legeerklaeringkilde,
        fom: values.legeerklæringFom,
        tom: values.legeerklæringFom,
        innleggelsesperioder: values.innleggelsesperioder,
      },
    ],
    pleiebehov: {
      perioderMedTilsynOgPleie: values.perioderMedTilsynOgPleie
        ?.filter(periodeMedTilsyonOgPleie => !!periodeMedTilsyonOgPleie.fom && !!periodeMedTilsyonOgPleie.tom)
        .map(periodeMedTilsyonOgPleie => ({
          periode: {
            fom: periodeMedTilsyonOgPleie.fom,
            tom: periodeMedTilsyonOgPleie.tom,
          },
          begrunnelse: values.begrunnelse, // TODO (Hallvard): Denne skal kanskje være noe annet
        })),
      perioderMedUtvidetTilsynOgPleie: values.perioderMedUtvidetTilsynOgPleie
        ?.filter(
          periodeMedUtvidetTilsyonOgPleie =>
            !!periodeMedUtvidetTilsyonOgPleie.fom && !!periodeMedUtvidetTilsyonOgPleie.tom,
        )
        .map((periodeMedUtvidetTilsyonOgPleie, idx: number) => ({
          periode: {
            fom: periodeMedUtvidetTilsyonOgPleie.fom,
            tom: periodeMedUtvidetTilsyonOgPleie.tom,
          },
          begrunnelse: values.perioderMedTilsynOgPleie[idx].begrunnelse,
        })),
    },
  };
};

// const buildInitialValues = createSelector(
//   [(props: { legeerklaeringDto: LegeerklaeringDto }) => props.legeerklaeringDto],
//   legeerklaeringDto => {
//     const legeerklaeringSignatar = getValidLegeerklaeringSignatar(legeerklaeringDto.legeerklaeringSignatar);

//     return {
//       ...legeerklaeringDto,
//       legeerklaeringSignatar,
//     };
//   },
// );

const mapStateToPropsFactory = (_, props: MedisinskVilkarFormProps) => {
  const { submitCallback, behandlingId, behandlingVersjon } = props;
  const onSubmit = values => submitCallback([transformValues(values)]);

  return state => ({
    onSubmit,
    // initialValues: buildInitialValues({ legeerklaeringDto }),
    [MedisinskVilkårConsts.DIAGNOSEKODE]: !!behandlingFormValueSelector(
      formName,
      behandlingId,
      behandlingVersjon,
    )(state, MedisinskVilkårConsts.DIAGNOSEKODE),
    erInnlagt: !!behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'erInnlagt'),
    behovForToOmsorgspersoner: !!behandlingFormValueSelector(
      formName,
      behandlingId,
      behandlingVersjon,
    )(state, 'behovForToOmsorgspersoner'),
    harBehovForKontinuerligTilsynOgPleie: !!behandlingFormValueSelector(
      formName,
      behandlingId,
      behandlingVersjon,
    )(state, 'harBehovForKontinuerligTilsynOgPleie'),
    [MedisinskVilkårConsts.PERIODER_MED_TILSYN_OG_PLEIE]: !!behandlingFormValueSelector(
      formName,
      behandlingId,
      behandlingVersjon,
    ),
    harDiagnose: !!behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'harDiagnose'),
  });
};

const connectedComponent = connect(mapStateToPropsFactory)(
  behandlingFormTs({
    form: formName,
    enableReinitialize: true,
  })(MedisinskVilkarForm),
);

export default injectIntl(connectedComponent);
