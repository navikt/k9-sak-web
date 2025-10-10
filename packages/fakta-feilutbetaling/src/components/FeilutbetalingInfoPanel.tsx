import {
  behandlingForm,
  behandlingFormValueSelector,
  CheckboxField,
  getBehandlingFormName,
  getBehandlingFormPrefix,
  TextAreaField,
} from '@fpsak-frontend/form';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { AksjonspunktHelpText, FaktaGruppe, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  decodeHtmlEntity,
  getKodeverknavnFn,
  hasValidText,
  maxLength,
  minLength,
  required,
} from '@fpsak-frontend/utils';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { KodeverkMedUndertype } from '@k9-sak-web/lib/kodeverk/types.js';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { BodyShort, Button, Detail, HGrid, Label } from '@navikt/ds-react';
import moment from 'moment';
import { FormattedMessage, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { change, clearFields, getFormValues, InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import { FeilutbetalingAarsak } from './feilutbetalingAarsak';
import { FeilutbetalingFakta } from './feilutbetalingFakta';
import styles from './feilutbetalingInfoPanel.module.css';
import FeilutbetalingPerioderTable from './FeilutbetalingPerioderTable';

const formName = 'FaktaFeilutbetalingForm';
const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const feilutbetalingAksjonspunkter = [aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING];

interface FeilutbetalingInfoPanelProps {
  behandlingId: number;
  behandlingVersjon: number;
  feilutbetalingFakta: FeilutbetalingFakta['behandlingFakta'];
  feilutbetalingAarsak?: FeilutbetalingAarsak;
  aksjonspunkter: Aksjonspunkt[];
  alleMerknaderFraBeslutter: {
    [key: string]: {
      notAccepted?: boolean;
    };
  };
  tilbakeKodeverk: KodeverkMedUndertype;
  sakKodeverk: KodeverkMedUndertype;
  submitCallback: (data: any) => void;
  readOnly: boolean;
  hasOpenAksjonspunkter: boolean;
}

interface MappedOwnProps {
  behandlingFormPrefix: string;
  formValues: any;
  behandlePerioderSamlet: any;
  feilutbetaling: FeilutbetalingFakta['behandlingFakta'];
  årsaker: FeilutbetalingAarsak['hendelseTyper'];
  merknaderFraBeslutter: {
    notAccepted?: boolean | undefined;
  };
}

interface DispatchProps {
  clearFields: (form: string, keepTouched: boolean, persistentSubmitErrors: boolean, ...fields: string[]) => void;
  change: (form: string, field: string, value: any, touch?: boolean, persistentSubmitErrors?: boolean) => void;
}

export const FeilutbetalingInfoPanelImpl = (
  props: FeilutbetalingInfoPanelProps & MappedOwnProps & InjectedFormProps & WrappedComponentProps & DispatchProps,
) => {
  const onChangeÅrsak = (event: React.ChangeEvent<HTMLInputElement>, elementId: number, årsak: string) => {
    const {
      behandlingFormPrefix,
      clearFields: clearFormFields,
      change: changeValue,
      formValues,
      behandlePerioderSamlet,
    } = props;

    if (behandlePerioderSamlet) {
      const { perioder } = formValues;
      const { value: nyÅrsak } = event.target;

      for (let i = 0; i < perioder.length; i += 1) {
        if (i !== elementId) {
          const { årsak: periodeÅrsak } = perioder[i];
          const periodeÅrsaker = [`perioder.${i}.${periodeÅrsak}`];
          clearFormFields(`${behandlingFormPrefix}.${formName}`, false, false, ...periodeÅrsaker);
          changeValue(`perioder.${i}.årsak`, nyÅrsak, true, false);
        }
      }
    }

    const fields = [`perioder.${elementId}.${årsak}`];
    clearFormFields(`${behandlingFormPrefix}.${formName}`, false, false, ...fields);
  };

  const onChangeUnderÅrsak = (event: React.ChangeEvent<HTMLInputElement>, elementId: number, årsak: string) => {
    const { change: changeValue, formValues, behandlePerioderSamlet } = props;

    if (behandlePerioderSamlet) {
      const { perioder } = formValues;
      const { value: nyUnderÅrsak } = event.target;

      for (let i = 0; i < perioder.length; i += 1) {
        const { årsak: elementÅrsak } = perioder[i];
        /*
          Passer på at man endrer bare for perioder med samme årsak.
          Just in case noen har klikket av behandlePerioderSamlet, endret årsak og underÅrsak på element, og så klikket på behandlePerioderSamlet igjen.
        */
        if (i !== elementId && elementÅrsak === årsak) {
          changeValue(`perioder.${i}.${årsak}.underÅrsak`, nyUnderÅrsak, true, false);
        }
      }
    }
  };

  const {
    hasOpenAksjonspunkter,
    feilutbetaling,
    årsaker,
    readOnly,
    merknaderFraBeslutter,
    behandlingId,
    behandlingVersjon,
    tilbakeKodeverk,
    sakKodeverk,
    ...formProps
  } = props;

  const getKodeverknavn = getKodeverknavnFn(tilbakeKodeverk, kodeverkTyper);
  const getFpsakKodeverknavn = getKodeverknavnFn(sakKodeverk, kodeverkTyper);

  return (
    <>
      <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
        {[<FormattedMessage key="1" id="FeilutbetalingInfoPanel.Aksjonspunkt" />]}
      </AksjonspunktHelpText>
      <VerticalSpacer sixteenPx />
      <form onSubmit={formProps.handleSubmit}>
        <HGrid gap="space-16" columns={{ xs: '12fr', md: '6fr 6fr' }} className={styles.smallMarginBottom}>
          <div>
            <div className={styles.smallMarginBottom}>
              <Label size="small" as="p">
                <FormattedMessage id="FeilutbetalingInfoPanel.Feilutbetaling" />
              </Label>
            </div>
            <HGrid gap="space-16" columns={{ xs: '12fr', md: '4fr 4fr 4fr' }}>
              <div>
                <Detail className={styles.undertekstMarginBottom}>
                  <FormattedMessage id="FeilutbetalingInfoPanel.PeriodeMedFeilutbetaling" />
                </Detail>
                <BodyShort size="small" className={styles.smallPaddingRight}>
                  {`${moment(feilutbetaling.totalPeriodeFom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(
                    feilutbetaling.totalPeriodeTom,
                  ).format(DDMMYYYY_DATE_FORMAT)}`}
                </BodyShort>
              </div>
              <div>
                <Detail className={styles.undertekstMarginBottom}>
                  <FormattedMessage id="FeilutbetalingInfoPanel.FeilutbetaltBeløp" />
                </Detail>
                <BodyShort size="small" className={styles.redText}>
                  {feilutbetaling.aktuellFeilUtbetaltBeløp}
                </BodyShort>
              </div>
              <div>
                <Detail className={styles.undertekstMarginBottom}>
                  <FormattedMessage id="FeilutbetalingInfoPanel.TidligereVarseltBeløp" />
                </Detail>
                <BodyShort size="small" className={styles.smallPaddingRight}>
                  {feilutbetaling.tidligereVarseltBeløp ? (
                    feilutbetaling.tidligereVarseltBeløp
                  ) : (
                    <FormattedMessage id="FeilutbetalingInfoPanel.IkkeVarslet" />
                  )}
                </BodyShort>
              </div>
            </HGrid>
            <HGrid gap="space-16" columns={{ xs: '11fr 1fr' }} className={styles.smallMarginTop}>
              <CheckboxField
                name="behandlePerioderSamlet"
                label={{ id: 'FeilutbetalingInfoPanel.BehandlePerioderSamlet' }}
                readOnly={readOnly}
              />
            </HGrid>
            <HGrid gap="space-16" columns={{ xs: '11fr 1fr' }} className={styles.smallMarginTop}>
              <div>
                <FaktaGruppe merknaderFraBeslutter={merknaderFraBeslutter} withoutBorder>
                  <FeilutbetalingPerioderTable
                    behandlingId={behandlingId}
                    behandlingVersjon={behandlingVersjon}
                    perioder={feilutbetaling.perioder}
                    formName={formName}
                    årsaker={årsaker}
                    readOnly={readOnly}
                    onChangeÅrsak={onChangeÅrsak}
                    onChangeUnderÅrsak={onChangeUnderÅrsak}
                  />
                </FaktaGruppe>
              </div>
            </HGrid>
          </div>
          <div>
            <div className={styles.smallMarginBottom}>
              <Label size="small" as="p">
                <FormattedMessage id="FeilutbetalingInfoPanel.Revurdering" />
              </Label>
            </div>
            <HGrid gap="space-16" columns={{ xs: '6fr 6fr' }}>
              <div>
                <Detail className={styles.undertekstMarginBottom}>
                  <FormattedMessage id="FeilutbetalingInfoPanel.Årsaker" />
                </Detail>
                {feilutbetaling.behandlingÅrsaker && (
                  <BodyShort size="small" className={styles.smallPaddingRight}>
                    {feilutbetaling.behandlingÅrsaker
                      .map(ba => getFpsakKodeverknavn(ba.behandlingArsakType))
                      .join(', ')}
                  </BodyShort>
                )}
              </div>
              {feilutbetaling.datoForRevurderingsvedtak && (
                <div>
                  <Detail className={styles.undertekstMarginBottom}>
                    <FormattedMessage id="FeilutbetalingInfoPanel.DatoForRevurdering" />
                  </Detail>
                  <BodyShort size="small" className={styles.smallPaddingRight}>
                    {moment(feilutbetaling.datoForRevurderingsvedtak).format(DDMMYYYY_DATE_FORMAT)}
                  </BodyShort>
                </div>
              )}
            </HGrid>
            <HGrid gap="space-16" columns={{ xs: '6fr 6fr' }} className={styles.smallMarginTop}>
              <div>
                <Detail className={styles.undertekstMarginBottom}>
                  <FormattedMessage id="FeilutbetalingInfoPanel.Resultat" />
                </Detail>
                {feilutbetaling.behandlingsresultat && (
                  <BodyShort size="small" className={styles.smallPaddingRight}>
                    {getFpsakKodeverknavn(feilutbetaling.behandlingsresultat.type)}
                  </BodyShort>
                )}
              </div>
              <div>
                <Detail className={styles.undertekstMarginBottom}>
                  <FormattedMessage id="FeilutbetalingInfoPanel.Konsekvens" />
                </Detail>
                {feilutbetaling.behandlingsresultat && (
                  <BodyShort size="small" className={styles.smallPaddingRight}>
                    {feilutbetaling.behandlingsresultat.konsekvenserForYtelsen &&
                      feilutbetaling.behandlingsresultat.konsekvenserForYtelsen
                        .map(ba => getFpsakKodeverknavn(ba))
                        .join(', ')}
                  </BodyShort>
                )}
              </div>
            </HGrid>
            <HGrid gap="space-16" columns={{ xs: '6fr 6fr' }} className={styles.smallMarginTop}>
              <div>
                <Detail className={styles.undertekstMarginBottom}>
                  <FormattedMessage id="FeilutbetalingInfoPanel.Tilbakekrevingsvalg" />
                </Detail>
                {feilutbetaling.tilbakekrevingValg && (
                  <BodyShort size="small" className={styles.smallPaddingRight}>
                    {getKodeverknavn(feilutbetaling.tilbakekrevingValg.videreBehandling)}
                  </BodyShort>
                )}
              </div>
            </HGrid>
          </div>
        </HGrid>
        <HGrid gap="space-16" columns={{ xs: '6fr 6fr' }}>
          <TextAreaField
            name="begrunnelse"
            label={{ id: 'FeilutbetalingInfoPanel.Begrunnelse' }}
            validate={[required, minLength3, maxLength1500, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
            id="begrunnelse"
          />
        </HGrid>
        <VerticalSpacer eightPx />
        <HGrid gap="space-16" columns={{ xs: '6fr 6fr' }}>
          <div>
            <Button
              variant="primary"
              size="small"
              type="button"
              onClick={formProps.handleSubmit}
              disabled={formProps.pristine || formProps.submitting}
              loading={formProps.submitting}
            >
              <FormattedMessage id="FeilutbetalingInfoPanel.Confirm" />
            </Button>
          </div>
        </HGrid>
      </form>
    </>
  );
};

const buildInitialValues = createSelector(
  [(ownProps: FeilutbetalingInfoPanelProps) => ownProps.feilutbetalingFakta],
  feilutbetalingFakta => {
    const { perioder, begrunnelse } = feilutbetalingFakta;
    return {
      begrunnelse: decodeHtmlEntity(begrunnelse),
      perioder: Array.isArray(perioder)
        ? perioder
            .sort((a, b) => moment(a.fom).diff(moment(b.fom)))
            .map(p => {
              const { fom, tom, feilutbetalingÅrsakDto } = p;

              const period = { fom, tom };

              if (!feilutbetalingÅrsakDto) {
                return period;
              }

              const { hendelseType, hendelseUndertype } = feilutbetalingÅrsakDto;

              return {
                ...period,
                årsak: hendelseType.kode,
                [hendelseType.kode]: {
                  underÅrsak: hendelseUndertype ? hendelseUndertype.kode : null,
                },
              };
            })
        : [],
    };
  },
);

const getSortedFeilutbetalingArsaker = createSelector(
  [(ownProps: FeilutbetalingInfoPanelProps) => ownProps.feilutbetalingAarsak],
  feilutbetalingArsaker => {
    const { hendelseTyper } = feilutbetalingArsaker || {};
    return Array.isArray(hendelseTyper)
      ? hendelseTyper.sort((ht1, ht2) => {
          const hendelseType1 = ht1.hendelseType.navn;
          const hendelseType2 = ht2.hendelseType.navn;
          const hendelseType1ErParagraf = hendelseType1.startsWith('§');
          const hendelseType2ErParagraf = hendelseType2.startsWith('§');
          const ht1v = hendelseType1ErParagraf ? hendelseType1.replace(/\D/g, '') : hendelseType1;
          const ht2v = hendelseType2ErParagraf ? hendelseType2.replace(/\D/g, '') : hendelseType2;
          return ht1v.localeCompare(ht2v);
        })
      : [];
  },
);

const transformValues = (values, aksjonspunkter: Aksjonspunkt[], årsaker: FeilutbetalingAarsak['hendelseTyper']) => {
  const apCode = aksjonspunkter.find(ap => ap.definisjon.kode === feilutbetalingAksjonspunkter[0]);

  const feilutbetalingFakta = values.perioder.map(periode => {
    const feilutbetalingÅrsak = årsaker.find(el => el.hendelseType.kode === periode.årsak);
    const findUnderÅrsakObjekt = underÅrsak =>
      feilutbetalingÅrsak?.hendelseUndertyper.find(el => el.kode === underÅrsak);
    const feilutbetalingUnderÅrsak = periode[periode.årsak]
      ? findUnderÅrsakObjekt(periode[periode.årsak].underÅrsak)
      : false;

    return {
      fom: periode.fom,
      tom: periode.tom,
      årsak: {
        hendelseType: feilutbetalingÅrsak?.hendelseType,
        hendelseUndertype: feilutbetalingUnderÅrsak,
      },
    };
  });

  return [
    {
      kode: apCode?.definisjon.kode,
      begrunnelse: values.begrunnelse,
      feilutbetalingFakta,
    },
  ];
};
const mapStateToPropsFactory = (initialState, initialOwnProps: FeilutbetalingInfoPanelProps) => {
  const årsaker = getSortedFeilutbetalingArsaker(initialOwnProps);
  const submitCallback = values =>
    initialOwnProps.submitCallback(transformValues(values, initialOwnProps.aksjonspunkter, årsaker));
  return (state, ownProps: FeilutbetalingInfoPanelProps) => ({
    årsaker,
    feilutbetaling: initialOwnProps.feilutbetalingFakta,
    initialValues: buildInitialValues(ownProps),
    behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
    merknaderFraBeslutter:
      ownProps.alleMerknaderFraBeslutter[aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING],
    behandlePerioderSamlet: behandlingFormValueSelector(
      formName,
      ownProps.behandlingId,
      ownProps.behandlingVersjon,
    )(state, 'behandlePerioderSamlet'),
    formValues:
      getFormValues(getBehandlingFormName(ownProps.behandlingId, ownProps.behandlingVersjon, formName))(state) || {},
    onSubmit: submitCallback,
  });
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators(
    {
      clearFields,
      change,
    },
    dispatch,
  ),
});

const FeilutbetalingForm = behandlingForm({
  form: formName,
})(FeilutbetalingInfoPanelImpl);
export default connect(mapStateToPropsFactory, mapDispatchToProps)(FeilutbetalingForm);
