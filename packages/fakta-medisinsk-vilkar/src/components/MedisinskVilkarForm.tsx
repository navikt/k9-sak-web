import { PeriodpickerField, DatepickerField, behandlingForm } from '@fpsak-frontend/form';
import { Label } from '@fpsak-frontend/form/src/Label';
import { behandlingFormValueSelector } from '@fpsak-frontend/form/src/behandlingForm';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpTextTemp } from '@fpsak-frontend/shared-components';
import { dateRangesNotOverlapping, hasValidDate, required } from '@fpsak-frontend/utils';
import { Aksjonspunkt, SubmitCallback, Sykdom } from '@k9-sak-web/types';
import { Periode, TransformValues } from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkår';
import MedisinskVilkårConsts from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkårConstants';
import moment from 'moment';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Element, Systemtittel } from 'nav-frontend-typografi';
import React, { useState, useCallback } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import DiagnosekodeSelector from './DiagnosekodeSelector';
import KontinuerligTilsynOgPleie from './KontinuerligTilsynOgPleie';
import Legeerklaering from './Legeerklaering';
import styles from './medisinskVilkar.less';
import MedisinskVilkarFormButtons from './MedisinskVilkarFormButtons';
import {
  getPerioderMedKontinuerligTilsynOgPleie,
  getPerioderMedUtvidetKontinuerligTilsynOgPleie,
  isHeleSokandsperiodenInnlegelse,
} from './MedisinskVilkarUtils';

interface MedisinskVilkarFormProps {
  behandlingId: number;
  behandlingVersjon: number;
  readOnly: boolean;
  submitCallback: (props: SubmitCallback[]) => void;
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

export const MedisinskVilkarFormImpl = ({
  behandlingId,
  behandlingVersjon,
  handleSubmit,
  form,
  readOnly,
  harApneAksjonspunkter,
  submittable,
  sykdom,
  aksjonspunkter,
  intl,
}: Partial<MedisinskVilkarFormProps> & Partial<StateProps> & InjectedFormProps & WrappedComponentProps) => {
  const [showVilkaarsvurdering, setShowVilkaarsvurdering] = useState(false);
  const { periodeTilVurdering, legeerklæringer } = sykdom;
  const diagnosekode = legeerklæringer && legeerklæringer[0] ? legeerklæringer[0].diagnosekode : '';
  const isApOpen = harApneAksjonspunkter || !submittable;
  const getAksjonspunktHelpText = useCallback(
    () => (
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={isApOpen}>{getHelpTexts(aksjonspunkter)}</AksjonspunktHelpTextTemp>
    ),
    [aksjonspunkter, isApOpen],
  );

  const handleFortsettTilVilkaarButtonClick = useCallback(() => {
    setShowVilkaarsvurdering(true);
  }, []);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.headingContainer}>
        <Systemtittel>
          <FormattedMessage id="MedisinskVilkarForm.Fakta" />
        </Systemtittel>
      </div>
      <div className={styles.fieldContainerLarge}>
        <Legeerklaering readOnly={readOnly} />
      </div>
      <div className={styles.fieldContainerSmall}>
        <DatepickerField
          name={MedisinskVilkårConsts.LEGEERKLÆRING_FOM}
          validate={[required, hasValidDate]}
          readOnly={readOnly}
          label={
            <Label
              input={{ id: 'MedisinskVilkarForm.Legeerklæring.Perioder', args: {} }}
              typographyElement={Element}
              intl={intl}
            />
          }
          disabledDays={{
            before: moment(periodeTilVurdering.fom).toDate(),
            after: moment(periodeTilVurdering.tom).toDate(),
          }}
          dataId="legeerklaeringsdato"
        />
      </div>
      <div className={styles.fieldContainerLarge}>
        <DiagnosekodeSelector initialDiagnosekodeValue={diagnosekode} readOnly={readOnly} />
      </div>

      <div className={styles.fieldContainerLarge}>
        <Element>
          <FormattedMessage id="MedisinskVilkarForm.Innlagt" />
        </Element>
        <PeriodpickerField
          names={[
            `${MedisinskVilkårConsts.INNLEGGELSESPERIODE}.fom`,
            `${MedisinskVilkårConsts.INNLEGGELSESPERIODE}.tom`,
          ]}
          validate={[required, hasValidDate, dateRangesNotOverlapping]}
          readOnly={readOnly}
          label={{ id: 'MedisinskVilkarForm.Periode' }}
          disabledDays={{
            before: moment(periodeTilVurdering.fom).toDate(),
            after: moment(periodeTilVurdering.tom).toDate(),
          }}
          dataId="sykehusInnlagtDato"
          ariaLabel={intl.formatMessage({ id: 'MedisinskVilkarForm.Innlagt' })}
        />
      </div>
      {!showVilkaarsvurdering && !readOnly && (
        <Hovedknapp
          className={styles.fortsettTilVilkaarButton}
          mini
          onClick={handleFortsettTilVilkaarButtonClick}
          data-id="fortsettTilVilkaarsvurdering"
        >
          <FormattedMessage id="MedisinskVilkarForm.FortsettTilVilkaarsvurdering" />
        </Hovedknapp>
      )}

      <div className={!showVilkaarsvurdering && !readOnly ? styles.hideVilkaarsVurdering : ''}>
        <div className={styles.vilkarsContainer}>
          <div className={styles.headingContainer}>
            <Systemtittel>
              <FormattedMessage id="MedisinskVilkarForm.Vilkår" />
            </Systemtittel>
          </div>
          <div className={styles.fieldContainerLarge}>
            <KontinuerligTilsynOgPleie
              readOnly={readOnly}
              periodeTilVurdering={periodeTilVurdering}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              formName={formName}
              getAksjonspunktHelpText={getAksjonspunktHelpText}
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
      </div>
    </form>
  );
};

const transformValues = (values: TransformValues, periodeTilVurdering: Periode, identifikator?: string) => ({
  kode: aksjonspunktCodes.MEDISINSK_VILKAAR,
  begrunnelse: 'placeholder', // TODO (Hallvard): Finn ut hva vi skal gjøre her
  legeerklæring: [
    {
      identifikator: identifikator ?? null,
      diagnosekode: values.diagnosekode.key ?? values.diagnosekode,
      kilde: values.legeerklaeringkilde,
      fom: values.legeerklæringFom,
      tom: values.legeerklæringFom,
      innleggelsesperioder: values.innleggelsesperiode ? [values.innleggelsesperiode] : undefined,
    },
  ],
  pleiebehov: isHeleSokandsperiodenInnlegelse(values.innleggelsesperiode, periodeTilVurdering)
    ? {}
    : {
      perioderMedKontinuerligTilsynOgPleie: values.perioderMedKontinuerligTilsynOgPleie
        ?.filter(
          periodeMedKontinuerligTilsynOgPleie =>
            periodeMedKontinuerligTilsynOgPleie.harBehovForKontinuerligTilsynOgPleie &&
            !!periodeMedKontinuerligTilsynOgPleie.fom &&
            !!periodeMedKontinuerligTilsynOgPleie.tom,
        )
        .map(periodeMedKontinuerligTilsynOgPleie => ({
          periode: {
            fom: periodeMedKontinuerligTilsynOgPleie.fom,
            tom: periodeMedKontinuerligTilsynOgPleie.tom,
          },
          begrunnelse: periodeMedKontinuerligTilsynOgPleie.begrunnelse,
          årsaksammenheng: periodeMedKontinuerligTilsynOgPleie.sammenhengMellomSykdomOgTilsyn,
          årsaksammenhengBegrunnelse: periodeMedKontinuerligTilsynOgPleie.sammenhengMellomSykdomOgTilsynBegrunnelse,
        })),
      perioderMedUtvidetKontinuerligTilsynOgPleie:
        values.perioderMedKontinuerligTilsynOgPleie?.length > 0
          ? getPerioderMedUtvidetKontinuerligTilsynOgPleie(values)
          : undefined,
    },
});

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
  const onSubmit = values =>
    submitCallback([
      transformValues(values, props.sykdom.periodeTilVurdering, props.sykdom?.legeerklæringer[0]?.identifikator),
    ]);

  return state => ({
    onSubmit,
    initialValues: buildInitialValues({ sykdom, aksjonspunkter }),
    diagnosekode: !!behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'diagnosekode'),
  });
};

const MedisinskVilkarForm = connect(mapStateToProps)(
  behandlingForm({
    form: formName,
    enableReinitialize: true,
  })(injectIntl(MedisinskVilkarFormImpl)),
);

export default MedisinskVilkarForm;
