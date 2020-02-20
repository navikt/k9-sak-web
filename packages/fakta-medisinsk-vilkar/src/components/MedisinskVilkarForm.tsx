import { behandlingFormTs } from '@fpsak-frontend/fp-felles';
import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles/src/behandlingFormTS';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { hasValidDate, required } from '@fpsak-frontend/utils';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { Sykdom, TransformValues } from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkår';
import MedisinskVilkårConsts from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkårConstants';
import moment from 'moment';
import { Systemtittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { FieldArray, InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
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
import {
  getPerioderMedKontinuerligTilsynOgPleie,
  getPerioderMedUtvidetKontinuerligTilsynOgPleie,
} from './MedisinskVilkarUtils';

interface MedisinskVilkarFormProps {
  behandlingId: number;
  behandlingVersjon: number;
  readOnly: boolean;
  submitCallback: (props: SubmitCallbackProps[]) => void;
  hasOpenAksjonspunkter: boolean;
  submittable: boolean;
  sykdom?: Sykdom;
  aksjonspunkter: Aksjonspunkt[];
}

interface StateProps {
  harDiagnose: boolean;
  erInnlagt: boolean;
  harBehovForKontinuerligTilsynOgPleie: boolean;
  [MedisinskVilkårConsts.PERIODER_MED_KONTINUERLIG_TILSYN_OG_PLEIE]: any;
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
  sykdom,
}: MedisinskVilkarFormProps & StateProps & InjectedFormProps & WrappedComponentProps) => {
  const { periodeTilVurdering } = sykdom;
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
          disabledDays={{
            before: moment(periodeTilVurdering.fom).toDate(),
            after: moment(periodeTilVurdering.tom).toDate(),
          }}
        />
        <InnlagtBarnRadio readOnly={readOnly} />
        {erInnlagt && (
          <FieldArray
            name={MedisinskVilkårConsts.INNLEGGELSESPERIODER}
            component={InnlagtBarnPeriodeFieldArray}
            props={{ readOnly, periodeTilVurdering }}
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
          periodeTilVurdering={periodeTilVurdering}
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

const transformValues = (values: TransformValues, identifikator?: string) => {
  return {
    kode: aksjonspunktCodes.MEDISINSK_VILKAAR,
    begrunnelse: values.begrunnelse,
    legeerklæring: [
      {
        identifikator: identifikator ?? null,
        diagnosekode: 'values.diagnosekode.value', // TODO (Hallvard): Rett opp i dette når endepunkt for diagnosekoder er ferdig
        kilde: values.legeerklaeringkilde,
        fom: values.legeerklæringFom,
        tom: values.legeerklæringFom,
        innleggelsesperioder: values.erInnlagt ? values.innleggelsesperioder : undefined,
      },
    ],
    pleiebehov: {
      perioderMedKontinuerligTilsynOgPleie: values.perioderMedKontinuerligTilsynOgPleie
        ?.filter(
          periodeMedKontinuerligTilsynOgPleie =>
            !!periodeMedKontinuerligTilsynOgPleie.fom && !!periodeMedKontinuerligTilsynOgPleie.tom,
        )
        .map(periodeMedKontinuerligTilsynOgPleie => ({
          periode: {
            fom: periodeMedKontinuerligTilsynOgPleie.fom,
            tom: periodeMedKontinuerligTilsynOgPleie.tom,
          },
          begrunnelse: values.begrunnelse, // TODO (Hallvard): Denne skal kanskje være noe annet
        })),
      perioderMedUtvidetKontinuerligTilsynOgPleie: getPerioderMedUtvidetKontinuerligTilsynOgPleie(values),
    },
  };
};

const buildInitialValues = createSelector(
  [(props: { sykdom: Sykdom }) => props.sykdom, (props: { aksjonspunkter: Aksjonspunkt[] }) => props.aksjonspunkter],
  (sykdom, aksjonspunkter) => {
    const legeerklæring = sykdom?.legeerklæringer?.[0];
    const aksjonspunkt = aksjonspunkter?.find(ap => ap.definisjon.kode === aksjonspunktCodes.MEDISINSK_VILKAAR);
    const harTidligereBehandling = !!legeerklæring;
    if (!harTidligereBehandling) {
      return {};
    }

    return {
      [MedisinskVilkårConsts.DIAGNOSEKODE]: legeerklæring.diagnosekode,
      legeerklaeringkilde: legeerklæring.kilde,
      legeerklæringFom: legeerklæring.fom,
      legeerklæringTom: legeerklæring.tom,
      innleggelsesperioder: legeerklæring.innleggelsesperioder,
      harDiagnose: !!legeerklæring.diagnosekode,
      erInnlagt: legeerklæring.fom && legeerklæring.innleggelsesperioder.length > 0,
      harBehovForKontinuerligTilsynOgPleie: sykdom.perioderMedKontinuerligTilsynOgPleie?.length > 0,
      begrunnelse: aksjonspunkt.begrunnelse,
      perioderMedKontinuerligTilsynOgPleie: getPerioderMedKontinuerligTilsynOgPleie(sykdom),
    };
  },
);

const mapStateToPropsFactory = (_, props: MedisinskVilkarFormProps) => {
  const { submitCallback, behandlingId, behandlingVersjon, sykdom, aksjonspunkter } = props;
  const onSubmit = values => submitCallback([transformValues(values, props.sykdom?.legeerklæringer[0]?.identifikator)]);

  return state => ({
    onSubmit,
    initialValues: buildInitialValues({ sykdom, aksjonspunkter }),
    [MedisinskVilkårConsts.DIAGNOSEKODE]: !!behandlingFormValueSelector(
      formName,
      behandlingId,
      behandlingVersjon,
    )(state, MedisinskVilkårConsts.DIAGNOSEKODE),
    erInnlagt: !!behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'erInnlagt'),
    harBehovForKontinuerligTilsynOgPleie: !!behandlingFormValueSelector(
      formName,
      behandlingId,
      behandlingVersjon,
    )(state, 'harBehovForKontinuerligTilsynOgPleie'),
    [MedisinskVilkårConsts.PERIODER_MED_KONTINUERLIG_TILSYN_OG_PLEIE]: !!behandlingFormValueSelector(
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
