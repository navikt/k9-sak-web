import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { TabsPure } from 'nav-frontend-tabs';
import moment from 'moment';
import FordelBeregningsgrunnlagPanel from './components/FordelBeregningsgrunnlagPanel';
import fordelBeregningsgrunnlagAksjonspunkterPropType from './propTypes/fordelBeregningsgrunnlagAksjonspunkterPropType';
import beregningsgrunnlagPropType from './propTypes/beregningsgrunnlagPropType';
import fordelBeregningsgrunnlagBehandlingPropType from './propTypes/fordelBeregningsgrunnlagBehandlingPropType';
import messages from '../i18n/nb_NO.json';

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

const kreverManuellBehandling = bg => {
  const fordeling = bg.faktaOmFordeling;
  if (fordeling) {
    const fordelBg = fordeling.fordelBeregningsgrunnlag;
    if (fordelBg) {
      return fordelBg.fordelBeregningsgrunnlagPerioder.some(p => p.skalRedigereInntekt || p.skalKunneEndreRefusjon);
    }
  }
  return false;
};

const FordelBeregningsgrunnlagFaktaIndex = ({
  behandling,
  beregningsgrunnlag,
  alleKodeverk,
  alleMerknaderFraBeslutter,
  aksjonspunkter,
  submitCallback,
  readOnly,
  harApneAksjonspunkter,
  submittable,
}) => {
  const harFlereBeregningsgrunnlag = Array.isArray(beregningsgrunnlag);
  const skalBrukeTabs = harFlereBeregningsgrunnlag && beregningsgrunnlag.length > 1;
  const [aktivtBeregningsgrunnlagIndeks, setAktivtBeregningsgrunnlagIndeks] = useState(0);
  const aktivtBeregningsrunnlag = harFlereBeregningsgrunnlag
    ? beregningsgrunnlag[aktivtBeregningsgrunnlagIndeks]
    : beregningsgrunnlag;

  const vilkårsperioder = behandling?.behandlingsresultat?.vilkårResultat.BEREGNINGSGRUNNLAGVILKÅR;

  return (
    <RawIntlProvider value={intl}>
      {skalBrukeTabs && (
        <TabsPure
          tabs={beregningsgrunnlag.map((currentBeregningsgrunnlag, currentBeregningsgrunnlagIndex) => ({
            aktiv: aktivtBeregningsgrunnlagIndeks === currentBeregningsgrunnlagIndex,
            label: lagLabel(currentBeregningsgrunnlag, vilkårsperioder),
            className: kreverManuellBehandling(currentBeregningsgrunnlag) ? 'harAksjonspunkt' : '',
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
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          readOnly={readOnly}
          beregningsgrunnlag={aktivtBeregningsrunnlag}
          hasOpenAksjonspunkter={harApneAksjonspunkter}
          submittable={submittable}
          kreverManuellBehandling={kreverManuellBehandling(aktivtBeregningsrunnlag)}
          aktivtBeregningsgrunnlagIndex={aktivtBeregningsgrunnlagIndeks}
          vilkårsperioder={vilkårsperioder}
          alleBeregningsgrunnlag={harFlereBeregningsgrunnlag ? beregningsgrunnlag : [beregningsgrunnlag]}
        />
      </div>
    </RawIntlProvider>
  );
};

FordelBeregningsgrunnlagFaktaIndex.propTypes = {
  behandling: fordelBeregningsgrunnlagBehandlingPropType.isRequired,
  beregningsgrunnlag: beregningsgrunnlagPropType.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(fordelBeregningsgrunnlagAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  harApneAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
};

export default FordelBeregningsgrunnlagFaktaIndex;
