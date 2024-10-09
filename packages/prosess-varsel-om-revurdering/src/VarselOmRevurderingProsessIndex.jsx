import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import revurderingBehandlingPropType from './propTypes/revurderingBehandlingPropType';
import revurderingAksjonspunkterPropType from './propTypes/revurderingAksjonspunkterPropType';
import revurderingFamilieHendelsePropType from './propTypes/revurderingFamilieHendelsePropType';
import revurderingSoknadPropType from './propTypes/revurderingSoknadPropType';
import VarselOmRevurderingForm from './components/VarselOmRevurderingForm';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const VarselOmRevurderingProsessIndex = ({
  behandling,
  familiehendelse,
  soknad,
  soknadOriginalBehandling,
  familiehendelseOriginalBehandling,
  aksjonspunkter,
  submitCallback,
  previewCallback,
  isReadOnly,
}) => (
  <RawIntlProvider value={intl}>
    <VarselOmRevurderingForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingArsaker={behandling.behandlingÅrsaker}
      sprakkode={behandling.sprakkode}
      behandlingType={behandling.type}
      familiehendelse={familiehendelse}
      soknad={soknad}
      soknadOriginalBehandling={soknadOriginalBehandling}
      familiehendelseOriginalBehandling={familiehendelseOriginalBehandling}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      previewCallback={previewCallback}
      readOnly={isReadOnly}
    />
  </RawIntlProvider>
);

VarselOmRevurderingProsessIndex.propTypes = {
  behandling: revurderingBehandlingPropType.isRequired,
  familiehendelse: revurderingFamilieHendelsePropType.isRequired,
  soknad: revurderingSoknadPropType.isRequired,
  soknadOriginalBehandling: revurderingSoknadPropType.isRequired,
  familiehendelseOriginalBehandling: revurderingFamilieHendelsePropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(revurderingAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
};

export default VarselOmRevurderingProsessIndex;
