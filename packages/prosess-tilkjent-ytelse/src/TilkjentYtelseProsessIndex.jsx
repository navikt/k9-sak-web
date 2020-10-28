import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import tilkjentYtelseBehandlingPropType from './propTypes/tilkjentYtelseBehandlingPropType';
import tilkjentYtelseFagsakPropType from './propTypes/tilkjentYtelseFagsakPropType';
import tilkjentYtelseBeregningresultatPropType from './propTypes/tilkjentYtelseBeregningresultatPropType';
import tilkjentYtelseAksjonspunkterPropType from './propTypes/tilkjentYtelseAksjonspunkterPropType';
import TilkjentYtelsePanel from './components/TilkjentYtelsePanel';
import TilkjentYtelseForm from './components/manuellePerioder/TilkjentYtelseForm';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const { MANUELL_TILKJENT_YTELSE } = aksjonspunktCodes;

const TilkjentYtelseProsessIndex = ({
  behandling,
  beregningsresultat,
  fagsak,
  aksjonspunkter,
  alleKodeverk,
  isReadOnly,
  submitCallback,
  readOnlySubmitButton,
}) => (
  <RawIntlProvider value={intl}>
    <TilkjentYtelsePanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      beregningsresultat={beregningsresultat}
      fagsakYtelseTypeKode={fagsak.fagsakYtelseType.kode}
      aksjonspunkter={aksjonspunkter}
      alleKodeverk={alleKodeverk}
      readOnly={isReadOnly}
      submitCallback={submitCallback}
      readOnlySubmitButton={readOnlySubmitButton}
    />
    {hasAksjonspunkt(MANUELL_TILKJENT_YTELSE, aksjonspunkter) && (
      <TilkjentYtelseForm
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        beregningsresultat={beregningsresultat}
        fagsakYtelseTypeKode={fagsak.fagsakYtelseType.kode}
        aksjonspunkter={aksjonspunkter}
        alleKodeverk={alleKodeverk}
        readOnly={isReadOnly}
        submitCallback={submitCallback}
        readOnlySubmitButton={readOnlySubmitButton}
      />
    )}
  </RawIntlProvider>
);

TilkjentYtelseProsessIndex.propTypes = {
  behandling: tilkjentYtelseBehandlingPropType.isRequired,
  beregningsresultat: tilkjentYtelseBeregningresultatPropType.isRequired,
  fagsak: tilkjentYtelseFagsakPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(tilkjentYtelseAksjonspunkterPropType).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
};

export default TilkjentYtelseProsessIndex;
