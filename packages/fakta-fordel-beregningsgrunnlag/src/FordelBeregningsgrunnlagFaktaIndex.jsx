import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { TabsPure } from 'nav-frontend-tabs';
import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import FordelBeregningsgrunnlagPanel from './components/FordelBeregningsgrunnlagPanel';
import fordelBeregningsgrunnlagAksjonspunkterPropType from './propTypes/fordelBeregningsgrunnlagAksjonspunkterPropType';
import beregningsgrunnlagPropType from './propTypes/beregningsgrunnlagPropType';
import fordelBeregningsgrunnlagBehandlingPropType from './propTypes/fordelBeregningsgrunnlagBehandlingPropType';
import messages from '../i18n/nb_NO.json';

const { FORDEL_BEREGNINGSGRUNNLAG, VURDER_REFUSJON_BERGRUNN } = avklaringsbehovCodes;


const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const lagLabel = (bg, vilkårsperioder) => {
  const stpOpptjening = bg.faktaOmBeregning.avklarAktiviteter.skjæringstidspunkt;
  const vilkårPeriode = vilkårsperioder.find(({ periode }) => periode.fom === stpOpptjening);
  if (vilkårPeriode) {
    const { fom, tom } = vilkårPeriode.periode;
    if (tom) {
      return `${moment(fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(tom).format(DDMMYYYY_DATE_FORMAT)}`;
    }
    return `${moment(fom).format(DDMMYYYY_DATE_FORMAT)} - `;
  }
  return `${moment(stpOpptjening).format(DDMMYYYY_DATE_FORMAT)}`;
};

const kreverManuellBehandlingFn = bg => bg.avklaringsbehov.some(a => a.definisjon === VURDER_REFUSJON_BERGRUNN
  || a.definisjon === FORDEL_BEREGNINGSGRUNNLAG);


const finnAvklaringsbehov = (aksjonspunkter, beregningsgrunnlag) => {
  if (beregningsgrunnlag.avklaringsbehov) {
    return beregningsgrunnlag.avklaringsbehov;
  }
  return aksjonspunkter;
}

const FordelBeregningsgrunnlagFaktaIndex = ({
  behandling,
  beregningsgrunnlag,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  alleMerknaderFraBeslutter,
  aksjonspunkter,
  submitCallback,
  readOnly,
  submittable,
}) => {
  const bgMedAvklaringsbehov = beregningsgrunnlag.filter(bg => kreverManuellBehandlingFn(bg));


  if (bgMedAvklaringsbehov.length === 0) {
    return null;
  }

  const skalBrukeTabs = bgMedAvklaringsbehov.length > 1;
  const [aktivtBeregningsgrunnlagIndeks, setAktivtBeregningsgrunnlagIndeks] = useState(0);
  const aktivtBeregningsrunnlag = bgMedAvklaringsbehov[aktivtBeregningsgrunnlagIndeks];

  const kreverManuellBehandling = kreverManuellBehandlingFn(aktivtBeregningsrunnlag);

  const vilkårsperioder = behandling?.behandlingsresultat?.vilkårResultat.BEREGNINGSGRUNNLAGVILKÅR;

  const avklaringsbehov = finnAvklaringsbehov(aksjonspunkter, aktivtBeregningsrunnlag);

  return (
    <RawIntlProvider value={intl}>
      {skalBrukeTabs && (
        <TabsPure
          tabs={bgMedAvklaringsbehov.map((currentBeregningsgrunnlag, currentBeregningsgrunnlagIndex) => ({
            aktiv: aktivtBeregningsgrunnlagIndeks === currentBeregningsgrunnlagIndex,
            label: lagLabel(currentBeregningsgrunnlag, vilkårsperioder),
            className: kreverManuellBehandlingFn(currentBeregningsgrunnlag) ? 'harAksjonspunkt' : '',
          }))}
          onChange={(e, clickedIndex) => setAktivtBeregningsgrunnlagIndeks(clickedIndex)}
        />
      )}
      <div style={{ paddingTop: skalBrukeTabs ? '16px' : '' }}>
        <FordelBeregningsgrunnlagPanel
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          behandlingType={behandling.type}
          alleKodeverk={alleKodeverk}
          alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
          avklaringsbehov={avklaringsbehov}
          submitCallback={submitCallback}
          readOnly={readOnly}
          beregningsgrunnlag={aktivtBeregningsrunnlag}
          submittable={submittable}
          kreverManuellBehandling={kreverManuellBehandling}
          aktivtBeregningsgrunnlagIndex={aktivtBeregningsgrunnlagIndeks}
          vilkårsperioder={vilkårsperioder}
          alleBeregningsgrunnlag={bgMedAvklaringsbehov}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        />
      </div>
    </RawIntlProvider>
  );
};

FordelBeregningsgrunnlagFaktaIndex.propTypes = {
  behandling: fordelBeregningsgrunnlagBehandlingPropType.isRequired,
  beregningsgrunnlag: PropTypes.arrayOf(beregningsgrunnlagPropType).isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(fordelBeregningsgrunnlagAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
};

export default FordelBeregningsgrunnlagFaktaIndex;
