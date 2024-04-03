import {
  RadioGroupField,
  RadioOption,
  SelectField,
  TextAreaField,
  behandlingForm,
  behandlingFormValueSelector,
} from '@fpsak-frontend/form';
import tilbakekrevingKodeverkTyper from '@fpsak-frontend/kodeverk/src/tilbakekrevingKodeverkTyper';
import { AdvarselModal, FlexColumn, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  DDMMYYYY_DATE_FORMAT,
  decodeHtmlEntity,
  formatCurrencyNoKr,
  hasValidText,
  maxLength,
  minLength,
  required,
} from '@fpsak-frontend/utils';
import { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { BodyShort, Button, Detail, Label } from '@navikt/ds-react';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import React, { Component } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormSection, InjectedFormProps, change, clearFields } from 'redux-form';
import Aktsomhet, { AKTSOMHET_REKKEFØLGE } from '../kodeverk/aktsomhet';
import SarligGrunn from '../kodeverk/sarligGrunn';
import VilkarResultat from '../kodeverk/vilkarResultat';
import DataForPeriode from '../types/dataForPeriodeTsType';
import { DetaljertFeilutbetalingPeriode } from '../types/detaljerteFeilutbetalingsperioderTsType';
import ForeldelsePerioderWrapper from '../types/foreldelsePerioderTsType';
import TilbakekrevingTimelineData from './splittePerioder/TilbakekrevingTimelineData';
import styles from './tilbakekrevingPeriodeForm.module.css';
import ForeldetFormPanel from './tilbakekrevingPeriodePaneler/ForeldetFormPanel';
import TilbakekrevingAktivitetTabell from './tilbakekrevingPeriodePaneler/TilbakekrevingAktivitetTabell';
import AktsomhetFormPanel, {
  InitialValuesAktsomhetForm,
} from './tilbakekrevingPeriodePaneler/aktsomhet/AktsomhetFormPanel';
import BelopetMottattIGodTroFormPanel, {
  InitialValuesGodTroForm,
} from './tilbakekrevingPeriodePaneler/godTro/BelopetMottattIGodTroFormPanel';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

export const TILBAKEKREVING_PERIODE_FORM_NAME = 'TilbakekrevingPeriodeForm';

export type CustomPeriode = {
  fom: string;
  tom: string;
  erTotalBelopUnder4Rettsgebyr: boolean;
  foreldelseVurderingType?: Kodeverk;
  begrunnelse?: string;
  harMerEnnEnYtelse: boolean;
} & DetaljertFeilutbetalingPeriode;

export type CustomPerioder = {
  perioder: CustomPeriode[];
};

export interface InitialValuesDetailForm {
  valgtVilkarResultatType: string;
  begrunnelse: string;
  erForeldet?: boolean;
  periodenErForeldet?: boolean;
  foreldetBegrunnelse?: string;
  vurderingBegrunnelse?: string;
  harMerEnnEnYtelse: boolean;
  [VilkarResultat.FEIL_OPPLYSNINGER]?: InitialValuesAktsomhetForm;
  [VilkarResultat.FORSTO_BURDE_FORSTAATT]?: InitialValuesAktsomhetForm;
  [VilkarResultat.MANGELFULL_OPPLYSNING]?: InitialValuesAktsomhetForm;
  [VilkarResultat.GOD_TRO]?: InitialValuesGodTroForm;
}

export type CustomVilkarsVurdertePeriode = {
  fom: string;
  tom: string;
  erSplittet?: boolean;
  feilutbetaling?: number;
} & InitialValuesDetailForm;

interface OwnProps {
  data: DataForPeriode;
  periode?: CustomVilkarsVurdertePeriode;
  behandlingFormPrefix: string;
  skjulPeriode: (...args: any[]) => any;
  setNestePeriode: (...args: any[]) => any;
  setForrigePeriode: (...args: any[]) => any;
  readOnly: boolean;
  erBelopetIBehold?: boolean;
  tilbakekrevSelvOmBeloepErUnder4Rettsgebyr?: boolean;
  oppdaterPeriode: (...args: any[]) => any;
  oppdaterSplittedePerioder: (...args: any[]) => any;
  antallPerioderMedAksjonspunkt: number;
  andelSomTilbakekreves?: string;
  vilkarResultatTyper?: KodeverkMedNavn[];
  aktsomhetTyper?: KodeverkMedNavn[];
  sarligGrunnTyper?: KodeverkMedNavn[];
  reduserteBelop?: {
    erTrekk: boolean;
    belop: number;
  }[];
  behandlingId: number;
  behandlingVersjon: number;
  beregnBelop: (...args: any[]) => any;
  vilkarsVurdertePerioder: CustomVilkarsVurdertePeriode[];
  valgtVilkarResultatType?: string;
  handletUaktsomhetGrad: Aktsomhet;
  harGrunnerTilReduksjon?: boolean;
  erSerligGrunnAnnetValgt?: boolean;
}

interface DispatchProps {
  clearFields: (form: string, keepTouched: boolean, persistentSubmitErrors: boolean, ...fields: string[]) => void;
  change: (form: string, field: string, value: any, touch?: boolean, persistentSubmitErrors?: boolean) => void;
}

interface OwnState {
  showModal: boolean;
}

export class TilbakekrevingPeriodeFormImpl extends Component<
  OwnProps & DispatchProps & WrappedComponentProps & InjectedFormProps,
  OwnState
> {
  state = { showModal: false };

  static defaultProps = {
    erBelopetIBehold: undefined,
    tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: undefined,
    andelSomTilbakekreves: undefined,
  };

  resetFields = (valgtVerdi: string) => {
    const {
      behandlingFormPrefix,
      clearFields: clearFormFields,
      change: changeValue,
      valgtVilkarResultatType,
    } = this.props;
    const fields = [valgtVilkarResultatType];

    clearFormFields(`${behandlingFormPrefix}.${TILBAKEKREVING_PERIODE_FORM_NAME}`, false, false, ...fields);

    if (valgtVilkarResultatType === VilkarResultat.FORSTO_BURDE_FORSTAATT) {
      if (valgtVerdi === Aktsomhet.FORSETT) {
        changeValue(`${VilkarResultat.FORSTO_BURDE_FORSTAATT}.${Aktsomhet.FORSETT}.skalDetTilleggesRenter`, false);
      }
      if (valgtVerdi === Aktsomhet.GROVT_UAKTSOM) {
        changeValue(
          `${VilkarResultat.FORSTO_BURDE_FORSTAATT}.${Aktsomhet.GROVT_UAKTSOM}.skalDetTilleggesRenter`,
          false,
        );
      }
    }
  };

  saveOrToggleModal = () => {
    const { showModal } = this.state;
    const { data, tilbakekrevSelvOmBeloepErUnder4Rettsgebyr, antallPerioderMedAksjonspunkt, ...formProps } = this.props;

    if (
      antallPerioderMedAksjonspunkt > 1 &&
      data.erTotalBelopUnder4Rettsgebyr &&
      tilbakekrevSelvOmBeloepErUnder4Rettsgebyr === false
    ) {
      this.setState((state: any) => ({ ...state, showModal: !showModal }));
    } else {
      // @ts-ignore Kva med parametere?
      formProps.handleSubmit();
    }
  };

  saveForm = () => {
    const { showModal } = this.state;
    const { ...formProps } = this.props;

    this.setState((state: any) => ({ ...state, showModal: !showModal }));
    // @ts-ignore Kva med parametere?
    formProps.handleSubmit();
  };

  onEndrePeriodeForKopi = (event: any, vurdertePerioder: CustomVilkarsVurdertePeriode[]) => {
    const { change: changeValue, periode } = this.props;

    const fomTom = event.target.value.split('_');
    const kopierDenne = vurdertePerioder.find(
      (per: CustomVilkarsVurdertePeriode) => per.fom === fomTom[0] && per.tom === fomTom[1],
    );
    const vilkårResultatType = kopierDenne.valgtVilkarResultatType;
    const resultatType = kopierDenne[vilkårResultatType];

    const resultatTypeKopi = JSON.parse(JSON.stringify(resultatType));
    if (vilkårResultatType !== VilkarResultat.GOD_TRO) {
      const { handletUaktsomhetGrad } = resultatTypeKopi;
      if (handletUaktsomhetGrad !== Aktsomhet.FORSETT && periode.harMerEnnEnYtelse !== kopierDenne.harMerEnnEnYtelse) {
        resultatTypeKopi[handletUaktsomhetGrad].andelSomTilbakekreves = null;
        resultatTypeKopi[handletUaktsomhetGrad].andelSomTilbakekrevesManuell = null;
        resultatTypeKopi[handletUaktsomhetGrad].belopSomSkalTilbakekreves = null;
      }
    }

    changeValue('valgtVilkarResultatType', vilkårResultatType, true, false);
    changeValue('begrunnelse', kopierDenne.begrunnelse, true, false);
    changeValue('vurderingBegrunnelse', kopierDenne.vurderingBegrunnelse, true, false);
    changeValue(vilkårResultatType, resultatTypeKopi);

    event.preventDefault();
  };

  render() {
    const {
      valgtVilkarResultatType,
      handletUaktsomhetGrad,
      harGrunnerTilReduksjon,
      skjulPeriode,
      readOnly,
      erBelopetIBehold,
      erSerligGrunnAnnetValgt,
      vilkarResultatTyper,
      aktsomhetTyper,
      sarligGrunnTyper,
      reduserteBelop,
      setNestePeriode,
      setForrigePeriode,
      oppdaterSplittedePerioder,
      data,
      andelSomTilbakekreves,
      behandlingId,
      behandlingVersjon,
      beregnBelop,
      intl,
      vilkarsVurdertePerioder,
      ...formProps
    } = this.props;
    const { showModal } = this.state;
    const vurdertePerioder = vilkarsVurdertePerioder.filter(
      per => !per.erForeldet && per.valgtVilkarResultatType != null,
    );
    return (
      <div className={styles.container}>
        <TilbakekrevingTimelineData
          periode={data}
          callbackForward={setNestePeriode}
          callbackBackward={setForrigePeriode}
          oppdaterSplittedePerioder={oppdaterSplittedePerioder}
          readOnly={readOnly}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          beregnBelop={beregnBelop}
        />
        <VerticalSpacer twentyPx />
        {reduserteBelop.map(belop => (
          <React.Fragment key={belop.belop}>
            <BodyShort size="small">
              <FormattedMessage
                id={
                  belop.erTrekk
                    ? 'TilbakekrevingPeriodeForm.FeilutbetaltBelopTrekk'
                    : 'TilbakekrevingPeriodeForm.FeilutbetaltBelopEtterbetaling'
                }
                values={{ belop: formatCurrencyNoKr(belop.belop), b: (chunks: any) => <b>{chunks}</b> }}
              />
            </BodyShort>
            <VerticalSpacer eightPx />
          </React.Fragment>
        ))}
        <TilbakekrevingAktivitetTabell ytelser={data.ytelser} />
        <VerticalSpacer twentyPx />
        {!readOnly && !data.erForeldet && vurdertePerioder.length > 0 && (
          <>
            <Row>
              <Column md="10">
                <Label size="small" as="p">
                  <FormattedMessage id="TilbakekrevingPeriodeForm.KopierVilkårsvurdering" />
                </Label>
                <SelectField
                  name="perioderForKopi"
                  selectValues={vurdertePerioder.map(per => {
                    const perId = `${per.fom}_${per.tom}`;
                    const perValue = `${moment(per.fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(per.tom).format(
                      DDMMYYYY_DATE_FORMAT,
                    )}`;
                    return (
                      <option key={perId} value={perId}>
                        {perValue}
                      </option>
                    );
                  })}
                  onChange={event => this.onEndrePeriodeForKopi(event, vurdertePerioder)}
                  bredde="m"
                  label=""
                />
              </Column>
            </Row>
            <VerticalSpacer twentyPx />
          </>
        )}
        <Row>
          <Column md={data.erForeldet ? '12' : '6'}>
            <Row>
              {data.erForeldet && (
                <Column md="12">
                  <ForeldetFormPanel />
                </Column>
              )}
              {!data.erForeldet && (
                <Column md="10">
                  <Label size="small" as="p">
                    <FormattedMessage id="TilbakekrevingPeriodeForm.VilkarForTilbakekreving" />
                  </Label>
                  <VerticalSpacer eightPx />
                  <TextAreaField
                    name="begrunnelse"
                    label={{ id: 'TilbakekrevingPeriodeForm.Vurdering' }}
                    validate={[required, minLength3, maxLength1500, hasValidText]}
                    maxLength={1500}
                    readOnly={readOnly}
                    textareaClass={styles.explanationTextarea}
                    placeholder={intl.formatMessage({ id: 'TilbakekrevingPeriodeForm.Vurdering.Hjelpetekst' })}
                  />
                  <VerticalSpacer twentyPx />
                  <Detail>
                    <FormattedMessage id="TilbakekrevingPeriodeForm.oppfylt" />
                  </Detail>
                  <VerticalSpacer eightPx />
                  <RadioGroupField
                    validate={[required]}
                    name="valgtVilkarResultatType"
                    direction="vertical"
                    readOnly={readOnly}
                    // @ts-ignore tror denne trengs fordi fpsak-frontend/form ikkje er fullstendig konvertert til typescript
                    onChange={this.resetFields}
                  >
                    {vilkarResultatTyper.map(vrt => (
                      <RadioOption key={vrt.kode} label={vrt.navn} value={vrt.kode} />
                    ))}
                  </RadioGroupField>
                </Column>
              )}
            </Row>
          </Column>
          <Column md="6">
            <Row>
              <Column md="10">
                {valgtVilkarResultatType && (
                  <>
                    <Label size="small" as="p">
                      <FormattedMessage
                        id={
                          valgtVilkarResultatType === VilkarResultat.GOD_TRO
                            ? 'TilbakekrevingPeriodeForm.BelopetMottattIGodTro'
                            : 'TilbakekrevingPeriodeForm.Aktsomhet'
                        }
                      />
                    </Label>
                    <VerticalSpacer eightPx />
                    <TextAreaField
                      name="vurderingBegrunnelse"
                      label={{
                        id:
                          valgtVilkarResultatType === VilkarResultat.GOD_TRO
                            ? 'TilbakekrevingPeriodeForm.VurderingMottattIGodTro'
                            : 'TilbakekrevingPeriodeForm.VurderingAktsomhet',
                      }}
                      validate={[required, minLength3, maxLength1500, hasValidText]}
                      maxLength={1500}
                      readOnly={readOnly}
                    />
                    <VerticalSpacer eightPx />
                    <FormSection name={valgtVilkarResultatType}>
                      {valgtVilkarResultatType === VilkarResultat.GOD_TRO && (
                        <BelopetMottattIGodTroFormPanel readOnly={readOnly} erBelopetIBehold={erBelopetIBehold} />
                      )}
                      {valgtVilkarResultatType !== VilkarResultat.GOD_TRO && (
                        <AktsomhetFormPanel
                          harGrunnerTilReduksjon={harGrunnerTilReduksjon}
                          readOnly={readOnly}
                          handletUaktsomhetGrad={handletUaktsomhetGrad}
                          resetFields={this.resetFields}
                          erSerligGrunnAnnetValgt={erSerligGrunnAnnetValgt}
                          erValgtResultatTypeForstoBurdeForstaatt={
                            valgtVilkarResultatType === VilkarResultat.FORSTO_BURDE_FORSTAATT
                          }
                          aktsomhetTyper={aktsomhetTyper}
                          sarligGrunnTyper={sarligGrunnTyper}
                          antallYtelser={data.ytelser.length}
                          feilutbetalingBelop={data.feilutbetaling}
                          erTotalBelopUnder4Rettsgebyr={data.erTotalBelopUnder4Rettsgebyr}
                          andelSomTilbakekreves={andelSomTilbakekreves}
                        />
                      )}
                    </FormSection>
                  </>
                )}
              </Column>
            </Row>
          </Column>
        </Row>
        <VerticalSpacer twentyPx />
        <FlexRow>
          <FlexColumn>
            <Button
              variant="primary"
              size="small"
              type="button"
              onClick={this.saveOrToggleModal}
              disabled={formProps.pristine || readOnly}
            >
              <FormattedMessage id="TilbakekrevingPeriodeForm.Oppdater" />
            </Button>
          </FlexColumn>
          <FlexColumn>
            <Button variant="secondary" size="small" type="button" onClick={skjulPeriode}>
              <FormattedMessage id="TilbakekrevingPeriodeForm.Avbryt" />
            </Button>
          </FlexColumn>
        </FlexRow>
        {showModal && (
          <AdvarselModal
            bodyText={intl.formatMessage({ id: 'TilbakekrevingPeriodeForm.TotalbelopetUnder4Rettsgebyr' })}
            showModal
            submit={this.saveForm}
          />
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
  ...bindActionCreators(
    {
      clearFields,
      change,
    },
    dispatch,
  ),
});

const validate = (values: any, sarligGrunnTyper: KodeverkMedNavn[], data: DataForPeriode) => {
  let errors = {};
  if (!values) {
    return errors;
  }
  const vilkarResultatInfo = values[values.valgtVilkarResultatType];
  if (
    vilkarResultatInfo &&
    vilkarResultatInfo.handletUaktsomhetGrad &&
    vilkarResultatInfo.handletUaktsomhetGrad !== Aktsomhet.FORSETT
  ) {
    const aktsomhetInfo = vilkarResultatInfo[vilkarResultatInfo.handletUaktsomhetGrad];
    if (aktsomhetInfo && !sarligGrunnTyper.some((type: KodeverkMedNavn) => aktsomhetInfo[type.kode])) {
      errors = {
        [values.valgtVilkarResultatType]: {
          [vilkarResultatInfo.handletUaktsomhetGrad]: {
            [SarligGrunn.ANNET]: [{ id: 'TilbakekrevingPeriodeForm.MaVelgeSarligGrunn' }],
          },
        },
      };
    }
    if (
      aktsomhetInfo &&
      aktsomhetInfo.belopSomSkalTilbakekreves &&
      aktsomhetInfo.belopSomSkalTilbakekreves >= data.feilutbetaling
    ) {
      errors = {
        ...errors,
        [values.valgtVilkarResultatType]: {
          [vilkarResultatInfo.handletUaktsomhetGrad]: {
            belopSomSkalTilbakekreves: [{ id: 'TilbakekrevingPeriodeForm.BelopMaVereMindreEnnFeilutbetalingen' }],
          },
        },
      };
    }
  }
  if (
    vilkarResultatInfo &&
    vilkarResultatInfo.tilbakekrevdBelop &&
    vilkarResultatInfo.tilbakekrevdBelop > data.feilutbetaling
  ) {
    errors = {
      ...errors,
      [values.valgtVilkarResultatType]: {
        tilbakekrevdBelop: [{ id: 'TilbakekrevingPeriodeForm.BelopKanIkkeVereStorreEnnFeilutbetalingen' }],
      },
    };
  }

  return errors;
};

interface PureOwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  oppdaterPeriode: (values: any) => any;
  data: DataForPeriode;
  periode: CustomVilkarsVurdertePeriode;
}

const mapStateToPropsFactory = (_initialState: any, ownProps: PureOwnProps) => {
  const sarligGrunnTyper = ownProps.alleKodeverk[tilbakekrevingKodeverkTyper.SARLIG_GRUNN];
  const vilkarResultatTyper = ownProps.alleKodeverk[tilbakekrevingKodeverkTyper.VILKAR_RESULTAT];
  const aktsomhetTyper = ownProps.alleKodeverk[tilbakekrevingKodeverkTyper.AKTSOMHET];
  const sorterteAktsomhetTyper = AKTSOMHET_REKKEFØLGE.map((a: Aktsomhet) =>
    aktsomhetTyper.find((el: KodeverkMedNavn) => el.kode === a),
  );

  const submitCallback = values => ownProps.oppdaterPeriode(values);
  const validateForm = values => validate(values, sarligGrunnTyper, ownProps.data);

  return (state: any, oProps: PureOwnProps) => {
    const { behandlingId, behandlingVersjon } = oProps;
    const sel = behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME, behandlingId, behandlingVersjon);
    const valgtVilkarResultatType = sel(state, 'valgtVilkarResultatType');
    const handletUaktsomhetGrad = sel(state, `${valgtVilkarResultatType}.handletUaktsomhetGrad`);
    return {
      harGrunnerTilReduksjon: sel(state, `${valgtVilkarResultatType}.${handletUaktsomhetGrad}.harGrunnerTilReduksjon`),
      andelSomTilbakekreves: sel(state, `${valgtVilkarResultatType}.${handletUaktsomhetGrad}.andelSomTilbakekreves`),
      tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: sel(
        state,
        `${valgtVilkarResultatType}.${handletUaktsomhetGrad}.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr`,
      ),
      erSerligGrunnAnnetValgt: sel(state, `${valgtVilkarResultatType}.${handletUaktsomhetGrad}.${SarligGrunn.ANNET}`),
      erBelopetIBehold: sel(state, `${valgtVilkarResultatType}.erBelopetIBehold`),
      initialValues: oProps.periode,
      reduserteBelop: ownProps.data.redusertBeloper,
      onSubmit: submitCallback,
      validate: validateForm,
      valgtVilkarResultatType,
      handletUaktsomhetGrad,
      vilkarResultatTyper,
      aktsomhetTyper: sorterteAktsomhetTyper,
      sarligGrunnTyper,
    };
  };
};

const TilbakekrevingPeriodeForm = connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  behandlingForm({
    form: TILBAKEKREVING_PERIODE_FORM_NAME,
    enableReinitialize: true,
  })(injectIntl(TilbakekrevingPeriodeFormImpl)),
);

// TODO Fiks typen til periode
export const periodeFormBuildInitialValues = (
  periode: any,
  foreldelsePerioder: ForeldelsePerioderWrapper,
): InitialValuesDetailForm => {
  const { vilkarResultat, begrunnelse, vilkarResultatInfo } = periode;

  const vilkarResultatKode = vilkarResultat && vilkarResultat.kode ? vilkarResultat.kode : vilkarResultat;
  let foreldetData = { erForeldet: false, periodenErForeldet: undefined, foreldetBegrunnelse: undefined };
  const erForeldet = periode.erForeldet ? periode.erForeldet : periode.foreldet;
  if (erForeldet) {
    const foreldelsePeriode = foreldelsePerioder.perioder.find(
      (p: any) => p.fom === periode.fom && p.tom === periode.tom,
    );
    foreldetData = {
      erForeldet,
      periodenErForeldet: true,
      foreldetBegrunnelse: decodeHtmlEntity(foreldelsePeriode.begrunnelse),
    };
  }

  const initialValues = {
    valgtVilkarResultatType: vilkarResultatKode,
    begrunnelse: decodeHtmlEntity(begrunnelse),
    harMerEnnEnYtelse: periode.ytelser.length > 1,
    ...foreldetData,
  };

  const godTroData =
    vilkarResultatKode === VilkarResultat.GOD_TRO
      ? BelopetMottattIGodTroFormPanel.buildIntialValues(vilkarResultatInfo)
      : {};
  const annetData =
    vilkarResultatKode !== undefined && vilkarResultatKode !== VilkarResultat.GOD_TRO
      ? AktsomhetFormPanel.buildInitalValues(vilkarResultatInfo)
      : {};
  return {
    ...initialValues,
    vurderingBegrunnelse: vilkarResultatInfo ? decodeHtmlEntity(vilkarResultatInfo.begrunnelse) : undefined,
    [initialValues.valgtVilkarResultatType]: {
      ...godTroData,
      ...annetData,
    },
  };
};

export const periodeFormTransformValues = (
  values: CustomVilkarsVurdertePeriode,
  sarligGrunnTyper: KodeverkMedNavn[],
) => {
  const { valgtVilkarResultatType, begrunnelse, vurderingBegrunnelse } = values;
  const info = values[valgtVilkarResultatType];

  const godTroData =
    valgtVilkarResultatType === VilkarResultat.GOD_TRO
      ? BelopetMottattIGodTroFormPanel.transformValues(info, vurderingBegrunnelse)
      : {};
  const annetData =
    valgtVilkarResultatType !== VilkarResultat.GOD_TRO
      ? AktsomhetFormPanel.transformValues(info, sarligGrunnTyper, vurderingBegrunnelse)
      : {};

  return {
    begrunnelse,
    fom: values.fom,
    tom: values.tom,
    vilkarResultat: valgtVilkarResultatType,
    vilkarResultatInfo: {
      ...godTroData,
      ...annetData,
    },
  };
};

export default TilbakekrevingPeriodeForm;
