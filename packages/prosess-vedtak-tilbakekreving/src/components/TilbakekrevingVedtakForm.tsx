import classNames from 'classnames';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';

import {
  behandlingForm,
  getBehandlingFormValues,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { omit } from '@fpsak-frontend/utils';
import { ProsessStegSubmitButton } from '@k9-sak-web/prosess-felles';

import advarselIcon from '@fpsak-frontend/assets/images/advarsel_ny.svg?react';
import underavsnittType from '../kodeverk/avsnittType';
import VedtaksbrevAvsnitt from '../types/vedtaksbrevAvsnittTsType';
import TilbakekrevingEditerVedtaksbrevPanel from './brev/TilbakekrevingEditerVedtaksbrevPanel';

import styles from './tilbakekrevingVedtakForm.module.css';

const formName = 'TilbakekrevingVedtakForm';

const formatVedtakData = (values: any) => {
  const perioder = omit(values, underavsnittType.OPPSUMMERING);
  return {
    oppsummeringstekst: values[underavsnittType.OPPSUMMERING],
    perioderMedTekst: Object.keys(perioder).map(key => ({
      fom: key.split('_')[0],
      tom: key.split('_')[1],
      faktaAvsnitt: perioder[key][underavsnittType.FAKTA],
      vilkaarAvsnitt: perioder[key][underavsnittType.VILKAR],
      saerligeGrunnerAvsnitt: perioder[key][underavsnittType.SARLIGEGRUNNER],
      saerligeGrunnerAnnetAvsnitt: perioder[key][underavsnittType.SARLIGEGRUNNER_ANNET],
    })),
  };
};

const fetchPreview = (fetchPreviewVedtaksbrev: (data: any) => Promise<any>, uuid: string, formVerdier: any) => e => {
  fetchPreviewVedtaksbrev({
    uuid,
    ...formatVedtakData(formVerdier),
  });
  e.preventDefault();
};

interface OwnProps {
  readOnly: boolean;
  fetchPreviewVedtaksbrev: (data: any) => Promise<any>;
  vedtaksbrevAvsnitt: VedtaksbrevAvsnitt[];
  formVerdier: any;
  behandlingId: number;
  behandlingUuid: string;
  behandlingVersjon: number;
  perioderSomIkkeHarUtfyltObligatoriskVerdi: string[];
  erRevurderingTilbakekrevingKlage?: boolean;
  erRevurderingTilbakekrevingFeilBeløpBortfalt?: boolean;
  fritekstOppsummeringPakrevdMenIkkeUtfylt?: boolean;
  submitCallback: (aksjonspunktData: { kode: string }[]) => Promise<any>;
}

export const TilbakekrevingVedtakFormImpl = ({
  intl,
  readOnly,
  fetchPreviewVedtaksbrev,
  vedtaksbrevAvsnitt,
  formVerdier,
  behandlingId,
  behandlingUuid,
  behandlingVersjon,
  perioderSomIkkeHarUtfyltObligatoriskVerdi,
  erRevurderingTilbakekrevingKlage,
  erRevurderingTilbakekrevingFeilBeløpBortfalt,
  fritekstOppsummeringPakrevdMenIkkeUtfylt,
  ...formProps
}: OwnProps & InjectedFormProps & WrappedComponentProps) => (
  <form aria-label="form" onSubmit={formProps.handleSubmit}>
    <VerticalSpacer twentyPx />
    <TilbakekrevingEditerVedtaksbrevPanel
      vedtaksbrevAvsnitt={vedtaksbrevAvsnitt}
      formName={formName}
      readOnly={readOnly}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      perioderSomIkkeHarUtfyltObligatoriskVerdi={perioderSomIkkeHarUtfyltObligatoriskVerdi}
      fritekstOppsummeringPakrevdMenIkkeUtfylt={fritekstOppsummeringPakrevdMenIkkeUtfylt}
      erRevurderingTilbakekrevingFeilBeløpBortfalt={erRevurderingTilbakekrevingFeilBeløpBortfalt}
    />
    <VerticalSpacer twentyPx />
    <FlexContainer>
      <FlexRow>
        <FlexColumn>
          <ProsessStegSubmitButton
            text={intl.formatMessage({ id: 'TilbakekrevingVedtakForm.TilGodkjenning' })}
            // @ts-ignore Fjern denne når komponent er over på TS
            formName={formName}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            isReadOnly={readOnly}
            isSubmittable={
              perioderSomIkkeHarUtfyltObligatoriskVerdi.length === 0 && !fritekstOppsummeringPakrevdMenIkkeUtfylt
            }
            isBehandlingFormSubmitting={isBehandlingFormSubmitting}
            isBehandlingFormDirty={isBehandlingFormDirty}
            hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
          />
        </FlexColumn>
        {perioderSomIkkeHarUtfyltObligatoriskVerdi.length === 0 && (
          <FlexColumn>
            <div className={styles.padding}>
              <a
                href=""
                onClick={fetchPreview(fetchPreviewVedtaksbrev, behandlingUuid, formVerdier)}
                onKeyDown={e =>
                  e.keyCode === 13 ? fetchPreview(fetchPreviewVedtaksbrev, behandlingUuid, formVerdier)(e) : null
                }
                className={classNames(styles.buttonLink, 'lenke lenke--frittstaende')}
              >
                <FormattedMessage id="TilbakekrevingVedtakForm.ForhandvisBrev" />
              </a>
            </div>
          </FlexColumn>
        )}
        {erRevurderingTilbakekrevingKlage && (
          <FlexColumn className={classNames(styles.infoTextContainer)}>
            <FlexRow>
              <FlexColumn className={classNames(styles.padding, styles.infoTextIconColumn)}>
                <Image className={styles.infoTextIcon} src={advarselIcon} />
              </FlexColumn>
              <FlexColumn className={classNames(styles.infotextColumn)}>
                <FormattedMessage id="TilbakekrevingVedtakForm.Infotekst.Klage" />
              </FlexColumn>
            </FlexRow>
          </FlexColumn>
        )}
      </FlexRow>
    </FlexContainer>
  </form>
);

const transformValues = (values: any, apKode: string) => [
  {
    kode: apKode,
    ...formatVedtakData(values),
  },
];

interface PureOwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  aksjonspunktKodeForeslaVedtak: string;
  submitCallback: (aksjonspunktData: { kode: string }[]) => Promise<any>;
  avsnittsliste: VedtaksbrevAvsnitt[];
}

const finnPerioderSomIkkeHarVerdiForObligatoriskFelt = createSelector(
  [
    (ownProps: { vedtaksbrevAvsnitt: VedtaksbrevAvsnitt[] }) => ownProps.vedtaksbrevAvsnitt,
    (ownProps: { formVerdier: any }) => ownProps.formVerdier,
  ],
  (vedtaksbrevAvsnitt, formVerdier) =>
    vedtaksbrevAvsnitt.reduce((acc: string[], va: VedtaksbrevAvsnitt) => {
      const periode = `${va.fom}_${va.tom}`;
      const friteksterForPeriode = formVerdier[periode];

      const harObligatoriskFaktaTekst = va.underavsnittsliste.some(
        (ua: any) => ua.fritekstPåkrevet && ua.underavsnittstype === underavsnittType.FAKTA,
      );
      if (harObligatoriskFaktaTekst && (!friteksterForPeriode || !friteksterForPeriode[underavsnittType.FAKTA])) {
        return acc.concat(periode);
      }

      const harObligatoriskSarligeGrunnerAnnetTekst = va.underavsnittsliste.some(
        (ua: any) => ua.fritekstPåkrevet && ua.underavsnittstype === underavsnittType.SARLIGEGRUNNER_ANNET,
      );
      if (
        harObligatoriskSarligeGrunnerAnnetTekst &&
        (!friteksterForPeriode || !friteksterForPeriode[underavsnittType.SARLIGEGRUNNER_ANNET])
      ) {
        return acc.concat(periode);
      }
      return acc;
    }, []),
);

const harFritekstOppsummeringPakrevdMenIkkeUtfylt = (vedtaksbrevAvsnitt: VedtaksbrevAvsnitt[]) =>
  vedtaksbrevAvsnitt
    .filter((avsnitt: VedtaksbrevAvsnitt) => avsnitt.avsnittstype === underavsnittType.OPPSUMMERING)
    .some((avsnitt: VedtaksbrevAvsnitt) =>
      avsnitt.underavsnittsliste.some((underAvsnitt: any) => underAvsnitt.fritekstPåkrevet && !underAvsnitt.fritekst),
    );

const lagSubmitFn = createSelector(
  [
    (ownProps: PureOwnProps) => ownProps.submitCallback,
    (ownProps: PureOwnProps) => ownProps.aksjonspunktKodeForeslaVedtak,
  ],
  (submitCallback, aksjonspunktKodeForeslaVedtak) => (values: any) =>
    submitCallback(transformValues(values, aksjonspunktKodeForeslaVedtak)),
);

const mapStateToPropsFactory = (state: any, ownProps: PureOwnProps) => {
  const vedtaksbrevAvsnitt = ownProps.avsnittsliste;
  const initialValues = TilbakekrevingEditerVedtaksbrevPanel.buildInitialValues(vedtaksbrevAvsnitt);
  const formVerdier = getBehandlingFormValues(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(state) || {};
  const fritekstOppsummeringPakrevdMenIkkeUtfylt = harFritekstOppsummeringPakrevdMenIkkeUtfylt(vedtaksbrevAvsnitt);
  return {
    initialValues,
    formVerdier,
    vedtaksbrevAvsnitt,
    onSubmit: lagSubmitFn(ownProps),
    perioderSomIkkeHarUtfyltObligatoriskVerdi: finnPerioderSomIkkeHarVerdiForObligatoriskFelt({
      vedtaksbrevAvsnitt,
      formVerdier,
    }),
    fritekstOppsummeringPakrevdMenIkkeUtfylt,
  };
};

export const TilbakekrevingVedtakFormImplWithIntl = injectIntl(TilbakekrevingVedtakFormImpl);

const TilbakekrevingVedtakForm = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
  })(TilbakekrevingVedtakFormImplWithIntl),
);

export default TilbakekrevingVedtakForm;
