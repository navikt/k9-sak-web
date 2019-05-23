import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Column } from 'nav-frontend-grid';
import { createSelector } from 'reselect';

import { getSoknad, getFamiliehendelseGjeldende, getAksjonspunkter } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import DokumentasjonFaktaForm from 'behandlingForstegangOgRevurdering/src/fakta/components/adopsjon/DokumentasjonFaktaForm';
import MannAdoptererAleneFaktaForm from 'behandlingForstegangOgRevurdering/src/fakta/components/adopsjon/MannAdoptererAleneFaktaForm';
import EktefelleFaktaForm from 'behandlingForstegangOgRevurdering/src/fakta/components/adopsjon/EktefelleFaktaForm';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import {
  FaktaBegrunnelseTextField,
  FaktaEkspandertpanel,
  withDefaultToggling,
} from '@fpsak-frontend/fp-behandling-felles';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import { adopsjonsvilkarene } from '@fpsak-frontend/kodeverk/src/vilkarType';
import { AksjonspunktHelpText, VerticalSpacer, ElementWrapper } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

const { ADOPSJONSDOKUMENTAJON, OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, OM_ADOPSJON_GJELDER_EKTEFELLES_BARN } = aksjonspunktCodes;
const adopsjonAksjonspunkter = [OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, ADOPSJONSDOKUMENTAJON, OM_ADOPSJON_GJELDER_EKTEFELLES_BARN];

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

const getHelpTexts = (aksjonspunkter) => {
  const helpTexts = [
    <FormattedMessage key="KontrollerMotDok" id="AdopsjonInfoPanel.KontrollerMotDok" />,
  ];

  if (hasAksjonspunkt(OM_ADOPSJON_GJELDER_EKTEFELLES_BARN, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="VurderOmEktefellesBarn" id="AdopsjonInfoPanel.VurderOmEktefellesBarn" />);
  }
  if (hasAksjonspunkt(OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="VurderOmMannAdoptererAlene" id="AdopsjonInfoPanel.VurderOmMannAdoptererAlene" />);
  }
  return helpTexts;
};

/**
 * AdopsjonInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for faktapenelet til Adopsjonsvilkåret.
 * Denne brukes også funksjonen withDefaultToggling for å håndtere automatisk åpning av panelet
 * når det finnes åpne aksjonspunkter.
 */
export const AdopsjonInfoPanelImpl = ({
  intl,
  aksjonspunkter,
  openInfoPanels,
  toggleInfoPanelCallback,
  hasOpenAksjonspunkter,
  submittable,
  readOnly,
  initialValues,
  ...formProps
}) => (
  <FaktaEkspandertpanel
    title={intl.formatMessage({ id: 'AdopsjonInfoPanel.Adopsjon' })}
    hasOpenAksjonspunkter={hasOpenAksjonspunkter}
    isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.ADOPSJONSVILKARET)}
    toggleInfoPanelCallback={toggleInfoPanelCallback}
    faktaId={faktaPanelCodes.ADOPSJONSVILKARET}
    readOnly={readOnly}
  >
    <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
      {getHelpTexts(aksjonspunkter)}
    </AksjonspunktHelpText>
    <form onSubmit={formProps.handleSubmit}>
      <VerticalSpacer eightPx />
      <Row>
        <Column xs="6">
          <DokumentasjonFaktaForm
            readOnly={readOnly}
            hasEktefellesBarnAksjonspunkt={hasAksjonspunkt(
              OM_ADOPSJON_GJELDER_EKTEFELLES_BARN,
              aksjonspunkter,
            )}
          />
        </Column>
        <Column xs="6">
          {hasAksjonspunkt(OM_ADOPSJON_GJELDER_EKTEFELLES_BARN, aksjonspunkter) && (
          <EktefelleFaktaForm readOnly={readOnly} />
          )}
          {hasAksjonspunkt(OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, aksjonspunkter) && (
          <MannAdoptererAleneFaktaForm readOnly={readOnly} />
          )}
        </Column>
      </Row>
      {aksjonspunkter && aksjonspunkter.length > 0 && (
      <ElementWrapper>
        <VerticalSpacer twentyPx />
        <FaktaBegrunnelseTextField
          isDirty={formProps.dirty}
          isSubmittable={submittable}
          isReadOnly={readOnly}
          hasBegrunnelse={!!initialValues.begrunnelse}
        />
        <VerticalSpacer twentyPx />
        <FaktaSubmitButton
          formName={formProps.form}
          isSubmittable={submittable}
          isReadOnly={readOnly}
          hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        />
      </ElementWrapper>
      )}
    </form>
  </FaktaEkspandertpanel>
);

AdopsjonInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired).isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  ...formPropTypes,
};

const buildInitialValues = createSelector([getSoknad, getFamiliehendelseGjeldende, getAksjonspunkter], (soknad, familiehendelse, allAksjonspunkter) => {
  const aksjonspunkter = allAksjonspunkter.filter(ap => adopsjonAksjonspunkter.includes(ap.definisjon.kode));

  let mannAdoptererAleneValues = {};
  if (hasAksjonspunkt(OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, aksjonspunkter)) {
    mannAdoptererAleneValues = MannAdoptererAleneFaktaForm.buildInitialValues(soknad, familiehendelse);
  }
  let omAdopsjonGjelderEktefellesBarn = {};
  if (hasAksjonspunkt(OM_ADOPSJON_GJELDER_EKTEFELLES_BARN, aksjonspunkter)) {
    omAdopsjonGjelderEktefellesBarn = EktefelleFaktaForm.buildInitialValues(familiehendelse);
  }

  return {
    ...DokumentasjonFaktaForm.buildInitialValues(soknad, familiehendelse),
    ...omAdopsjonGjelderEktefellesBarn,
    ...mannAdoptererAleneValues,
    ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkter[0]),
  };
});

const transformValues = (values, aksjonspunkter) => {
  const aksjonspunkterArray = [DokumentasjonFaktaForm.transformValues(values)];
  if (hasAksjonspunkt(OM_ADOPSJON_GJELDER_EKTEFELLES_BARN, aksjonspunkter)) {
    aksjonspunkterArray.push(EktefelleFaktaForm.transformValues(values));
  }
  if (hasAksjonspunkt(OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, aksjonspunkter)) {
    aksjonspunkterArray.push(MannAdoptererAleneFaktaForm.transformValues(values));
  }

  return aksjonspunkterArray.map(ap => ({
    ...ap,
    begrunnelse: values.begrunnelse,
  }));
};

const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = values => ownProps.submitCallback(transformValues(values, ownProps.aksjonspunkter));
  return state => ({
    initialValues: buildInitialValues(state),
    onSubmit,
  });
};

const AdopsjonInfoPanel = withDefaultToggling(faktaPanelCodes.ADOPSJONSVILKARET, adopsjonAksjonspunkter)(connect(mapStateToPropsFactory)(behandlingForm({
  form: 'AdopsjonInfoPanel',
})(injectIntl(AdopsjonInfoPanelImpl))));

AdopsjonInfoPanel.supports = (vilkarCodes, aksjonspunkter) => aksjonspunkter.some(ap => adopsjonAksjonspunkter.includes(ap.definisjon.kode))
  || vilkarCodes.some(code => adopsjonsvilkarene.includes(code));

export default AdopsjonInfoPanel;
