import { PeriodpickerField } from '@fpsak-frontend/form';
import { behandlingFormTs } from '@fpsak-frontend/fp-felles';
import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles/src/behandlingFormTS';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { dateRangesNotOverlapping, hasValidDate, required } from '@fpsak-frontend/utils';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { Periode, Sykdom, TransformValues } from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkår';
import MedisinskVilkårConsts from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkårConstants';
import moment from 'moment';
import { Element, Systemtittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import { AksjonspunktHelpTextTemp } from '@fpsak-frontend/shared-components';
import DatepickerField from '../../../form/src/DatepickerField';
import { SubmitCallbackProps } from '../MedisinskVilkarIndex';
import DiagnosekodeSelector from './DiagnosekodeSelector';
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
  harApneAksjonspunkter: boolean;
  submittable: boolean;
  sykdom?: Sykdom;
  aksjonspunkter: Aksjonspunkt[];
}

interface StateProps {
  harDiagnose: boolean;
  harBehovForKontinuerligTilsynOgPleie: boolean;
  [MedisinskVilkårConsts.PERIODER_MED_KONTINUERLIG_TILSYN_OG_PLEIE]: any;
  innleggelsesperiode: Periode;
}

const { MEDISINSK_VILKAAR } = aksjonspunktCodes;

const getHelpTexts = aksjonspunkter => {
  const helpTexts = [];
  if (hasAksjonspunkt(MEDISINSK_VILKAAR, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="VurderBehov" id="MedisinskVilkarPanel.VurderBehov" />);
  }
  return helpTexts;
};

const formName = 'MedisinskVilkarForm';

export const MedisinskVilkarForm = ({
  behandlingId,
  behandlingVersjon,
  handleSubmit,
  form,
  readOnly,
  harApneAksjonspunkter,
  submittable,
  sykdom,
  aksjonspunkter,
}: MedisinskVilkarFormProps & StateProps & InjectedFormProps & WrappedComponentProps) => {
  const { periodeTilVurdering, legeerklæringer } = sykdom;
  const diagnosekode = legeerklæringer && legeerklæringer[0] ? legeerklæringer[0].diagnosekode : '';
  const isApOpen = harApneAksjonspunkter || !submittable;
  const getAksjonspunktHelpText = (
    <AksjonspunktHelpTextTemp isAksjonspunktOpen={isApOpen}>{getHelpTexts(aksjonspunkter)}</AksjonspunktHelpTextTemp>
  );
  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.headingContainer}>
          <Systemtittel>
            <FormattedMessage id="MedisinskVilkarForm.Fakta" />
          </Systemtittel>
        </div>
        <div className={styles.fieldContainer}>
          <Legeerklaering readOnly={readOnly} />
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
        </div>
        <div className={styles.fieldContainer}>
          <DiagnosekodeSelector initialDiagnosekodeValue={diagnosekode} readOnly={readOnly} />
        </div>

        <div className={styles.fieldContainer}>
          <Element>
            <FormattedMessage id="MedisinskVilkarForm.Innlagt" />
          </Element>
          <PeriodpickerField
            names={[
              `${MedisinskVilkårConsts.INNLEGGELSESPERIODE}.fom`,
              `${MedisinskVilkårConsts.INNLEGGELSESPERIODE}.tom`,
            ]}
            validate={[required, hasValidDate, dateRangesNotOverlapping]}
            defaultValue={null}
            readOnly={readOnly}
            label={{ id: 'MedisinskVilkarForm.Periode' }}
            disabledDays={{
              before: moment(periodeTilVurdering.fom).toDate(),
              after: moment(periodeTilVurdering.tom).toDate(),
            }}
          />
        </div>
        <div className={styles.vilkarsContainer}>
          <div className={styles.helpTextContainer}>{getAksjonspunktHelpText}</div>

          <div className={styles.headingContainer}>
            <Systemtittel>
              <FormattedMessage id="MedisinskVilkarForm.Vilkår" />
            </Systemtittel>
          </div>
          <div className={styles.fieldContainer}>
            <KontinuerligTilsynOgPleie
              readOnly={readOnly}
              periodeTilVurdering={periodeTilVurdering}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              formName={formName}
            />
          </div>
        </div>

        <MedisinskVilkarFormButtons
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          form={form}
          harApneAksjonspunkter={harApneAksjonspunkter}
          readOnly={readOnly}
          submittable={submittable}
        />
      </form>
    </>
  );
};

const transformValues = (values: TransformValues, identifikator?: string) => {
  return {
    kode: aksjonspunktCodes.MEDISINSK_VILKAAR,
    begrunnelse: 'placeholder', // TODO (Hallvard): Finn ut hva vi skal gjøre her
    legeerklæring: [
      {
        identifikator: identifikator ?? null,
        diagnosekode: values.diagnosekode.key,
        kilde: values.legeerklaeringkilde,
        fom: values.legeerklæringFom,
        tom: values.legeerklæringFom,
        innleggelsesperioder: values.innleggelsesperiode ? [values.innleggelsesperiode] : undefined,
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
          begrunnelse: periodeMedKontinuerligTilsynOgPleie.begrunnelse,
        })),
      perioderMedUtvidetKontinuerligTilsynOgPleie:
        values.perioderMedKontinuerligTilsynOgPleie?.length > 0
          ? getPerioderMedUtvidetKontinuerligTilsynOgPleie(values)
          : undefined,
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
      diagnosekode: legeerklæring.diagnosekode,
      legeerklaeringkilde: legeerklæring.kilde,
      legeerklæringFom: legeerklæring.fom,
      legeerklæringTom: legeerklæring.tom,
      innleggelsesperiode: legeerklæring.innleggelsesperioder[0],
      harDiagnose: !!legeerklæring.diagnosekode,
      begrunnelse: aksjonspunkt.begrunnelse,
      perioderMedKontinuerligTilsynOgPleie: getPerioderMedKontinuerligTilsynOgPleie(sykdom),
    };
  },
);

const mapStateToProps = (_, props: MedisinskVilkarFormProps) => {
  const { submitCallback, behandlingId, behandlingVersjon, sykdom, aksjonspunkter } = props;
  const onSubmit = values => submitCallback([transformValues(values, props.sykdom?.legeerklæringer[0]?.identifikator)]);

  return state => ({
    onSubmit,
    initialValues: buildInitialValues({ sykdom, aksjonspunkter }),
    diagnosekode: !!behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'diagnosekode'),
  });
};

const connectedComponent = connect(mapStateToProps)(
  behandlingFormTs({
    form: formName,
    enableReinitialize: true,
  })(MedisinskVilkarForm),
);

export default injectIntl(connectedComponent);
