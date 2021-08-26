import avklaringsbehovCodes, { harAvklaringsbehov } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { TabsPure } from 'nav-frontend-tabs';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import React, { useState } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import VurderFaktaBeregningPanel from './components/fellesFaktaForATFLogSN/VurderFaktaBeregningPanel';
import beregningAvklaringsbehovPropType from './propTypes/beregningAvklaringsbehovPropType';
import beregningBehandlingPropType from './propTypes/beregningBehandlingPropType';
import beregningsgrunnlagPropType from './propTypes/beregningsgrunnlagPropType';
import AvklareAktiviteterPanel from './components/avklareAktiviteter/AvklareAktiviteterPanel';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const { VURDER_FAKTA_FOR_ATFL_SN, OVERSTYRING_AV_BEREGNINGSAKTIVITETER, OVERSTYRING_AV_BEREGNINGSGRUNNLAG, AVKLAR_AKTIVITETER } =
avklaringsbehovCodes;

const lagLabel = (bg, vilkårsperioder) => {
  const stpOpptjening = bg.faktaOmBeregning.avklarAktiviteter.skjæringstidspunkt;
  const vilkårPeriode = vilkårsperioder.find(({ periode }) => periode.fom === stpOpptjening);
  if (vilkårPeriode) {
    const { fom, tom } = vilkårPeriode.periode;
    if (tom !== null) {
      return `${moment(fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(tom).format(DDMMYYYY_DATE_FORMAT)}`;
    }
    return `${moment(fom).format(DDMMYYYY_DATE_FORMAT)} - `;
  }
  return `${moment(stpOpptjening).format(DDMMYYYY_DATE_FORMAT)}`;
};

const harTilfeller = beregningsgrunnlag =>
  beregningsgrunnlag.faktaOmBeregning &&
  beregningsgrunnlag.faktaOmBeregning.faktaOmBeregningTilfeller &&
  beregningsgrunnlag.faktaOmBeregning.faktaOmBeregningTilfeller.length > 0;

const harAvklaringsbehovIPanel = (avklaringsbehov, beregningsgrunnlag) => {
  const harBehovForAvklaring = !!avklaringsbehov;
  if (harBehovForAvklaring) {
    const harVurderFaktaAksjonspunkt = avklaringsbehov.some(ap => ap.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN) && harTilfeller(beregningsgrunnlag);
    const harAvklarAktiviteterAP = avklaringsbehov.some(ap => ap.definisjon.kode === AVKLAR_AKTIVITETER);
    return harVurderFaktaAksjonspunkt || harAvklarAktiviteterAP
  }
  return false;
}


const finnAvklaringsbehov = (aksjonspunkter, beregningsgrunnlag) => {
  if (beregningsgrunnlag.avklaringsbehov && beregningsgrunnlag.avklaringsbehov.length > 0) {
    return beregningsgrunnlag.avklaringsbehov;
  }
  return aksjonspunkter;
}

const BeregningFaktaIndex = ({
  behandling,
  beregningsgrunnlag,
  alleKodeverk,
  aksjonspunkter,
  submitCallback,
  readOnly,
  submittable,
  erOverstyrer,
  arbeidsgiverOpplysningerPerId,
}) => {
  const skalBrukeTabs = beregningsgrunnlag.length > 1;
  const [aktivtBeregningsgrunnlagIndeks, setAktivtBeregningsgrunnlagIndeks] = useState(0);
  const aktivtBeregningsgrunnlag = beregningsgrunnlag[aktivtBeregningsgrunnlagIndeks];

  const vilkårsperioder = behandling?.behandlingsresultat?.vilkårResultat.BEREGNINGSGRUNNLAGVILKÅR;

  const aktiveAvklaringsBehov = finnAvklaringsbehov(aksjonspunkter, aktivtBeregningsgrunnlag);

  return (
    <RawIntlProvider value={intl}>
      {skalBrukeTabs && (
        <TabsPure
          tabs={beregningsgrunnlag.map((currentBeregningsgrunnlag, currentBeregningsgrunnlagIndex) => ({
            aktiv: aktivtBeregningsgrunnlagIndeks === currentBeregningsgrunnlagIndex,
            label: lagLabel(currentBeregningsgrunnlag, vilkårsperioder),
            className: harAvklaringsbehovIPanel(
              finnAvklaringsbehov(aksjonspunkter, currentBeregningsgrunnlag), 
                currentBeregningsgrunnlag) ? 'harAksjonspunkt' : '',
          }))}
          onChange={(e, clickedIndex) => setAktivtBeregningsgrunnlagIndeks(clickedIndex)}
        />
      )}
      <div style={{ paddingTop: skalBrukeTabs ? '16px' : '' }}>
        <AvklareAktiviteterPanel
          readOnly={
            readOnly || (harAvklaringsbehov(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aktiveAvklaringsBehov) && !erOverstyrer)
          }
          harAndreAvklaringsbehovIPanel={harAvklaringsbehov(VURDER_FAKTA_FOR_ATFL_SN, aktiveAvklaringsBehov)}
          submitCallback={submitCallback}
          submittable={submittable}
          erOverstyrer={erOverstyrer}
          avklaringsbehov={aktiveAvklaringsBehov}
          alleKodeverk={alleKodeverk}
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          beregningsgrunnlag={aktivtBeregningsgrunnlag}
          behandlingResultatPerioder={vilkårsperioder}
          aktivtBeregningsgrunnlagIndex={aktivtBeregningsgrunnlagIndeks}
          alleBeregningsgrunnlag={beregningsgrunnlag}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        />
        <VerticalSpacer thirtyTwoPx />
        <VurderFaktaBeregningPanel
          readOnly={readOnly || (harAvklaringsbehov(OVERSTYRING_AV_BEREGNINGSGRUNNLAG, aktiveAvklaringsBehov) && !erOverstyrer)}
          submitCallback={submitCallback}
          submittable={submittable}
          avklaringsbehov={aktiveAvklaringsBehov}
          alleKodeverk={alleKodeverk}
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          beregningsgrunnlag={aktivtBeregningsgrunnlag}
          behandlingResultatPerioder={vilkårsperioder}
          erOverstyrer={erOverstyrer}
          alleBeregningsgrunnlag={beregningsgrunnlag}
          aktivtBeregningsgrunnlagIndex={aktivtBeregningsgrunnlagIndeks}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        />
      </div>
    </RawIntlProvider>
  );
};

BeregningFaktaIndex.propTypes = {
  behandling: beregningBehandlingPropType.isRequired,
  beregningsgrunnlag: PropTypes.arrayOf(beregningsgrunnlagPropType),
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningAvklaringsbehovPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  erOverstyrer: PropTypes.bool.isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
};

BeregningFaktaIndex.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default BeregningFaktaIndex;
