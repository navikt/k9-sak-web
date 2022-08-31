import avklaringsbehovCodes, { harAvklaringsbehov } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { TabsPure } from 'nav-frontend-tabs';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import React, { useState } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import VurderFaktaBeregningPanel from './components/fellesFaktaForATFLogSN/VurderFaktaBeregningPanel';
import beregningBehandlingPropType from './propTypes/beregningBehandlingPropType';
import beregningsgrunnlagPropType from './propTypes/beregningsgrunnlagPropType';
import beregningKoblingPropType from './propTypes/beregningKoblingPropType';
import AvklareAktiviteterPanel from './components/avklareAktiviteter/AvklareAktiviteterPanel';
import styles from './beregningFaktaIndex.less';

const BeregningFaktaIndexPropTypes = {
  behandling: beregningBehandlingPropType.isRequired,
  beregningsgrunnlag: PropTypes.arrayOf(beregningsgrunnlagPropType),
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  alleKodeverk: PropTypes.shape({}).isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  erOverstyrer: PropTypes.bool.isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape({}).isRequired,
  vilkar: PropTypes.any.isRequired,
  beregningErBehandlet: PropTypes.bool,
  aksjonspunkter: PropTypes.any,
  beregningreferanserTilVurdering: PropTypes.arrayOf(beregningKoblingPropType).isRequired,
};

type OwnProps = PropTypes.InferProps<typeof BeregningFaktaIndexPropTypes>;

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const {
  VURDER_FAKTA_FOR_ATFL_SN,
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
  OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
  AVKLAR_AKTIVITETER,
} = avklaringsbehovCodes;

const relevanteKoder = [
  VURDER_FAKTA_FOR_ATFL_SN,
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
  OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
  AVKLAR_AKTIVITETER,
];

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

const harAvklaringsbehovIPanel = avklaringsbehov => {
  const harBehovForAvklaring = !!avklaringsbehov;
  if (harBehovForAvklaring) {
    const harVurderFaktaAksjonspunkt = avklaringsbehov.some(
      ap => ap.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN && ap.kanLoses !== false,
    );
    const harAvklarAktiviteterAP = avklaringsbehov.some(
      ap => ap.definisjon.kode === AVKLAR_AKTIVITETER && ap.kanLoses !== false,
    );
    return harVurderFaktaAksjonspunkt || harAvklarAktiviteterAP;
  }
  return false;
};

function erTilVurderingOgIkkeForlengelse(beregningreferanserTilVurdering, bg) {
  return beregningreferanserTilVurdering.some(r => !r.erForlengelse && r.skjæringstidspunkt === bg.vilkårsperiodeFom);
}

const skalVurderes = (bg, beregningreferanserTilVurdering) =>
  harAvklaringsbehovIPanel(bg.avklaringsbehov) && erTilVurderingOgIkkeForlengelse(beregningreferanserTilVurdering, bg);

function kanLøseMinstEtt(aktiveAvklaringsBehov) {
  return aktiveAvklaringsBehov.some(ap => relevanteKoder.includes(ap.definisjon.kode) && ap.kanLoses !== false);
}

const BeregningFaktaIndex = ({
  vilkar,
  behandling,
  beregningsgrunnlag,
  alleKodeverk,
  submitCallback,
  readOnly,
  submittable,
  erOverstyrer,
  arbeidsgiverOpplysningerPerId,
  beregningErBehandlet,
  aksjonspunkter,
  beregningreferanserTilVurdering,
}: OwnProps) => {
  const skalBrukeTabs = beregningsgrunnlag.length > 1;
  const [aktivtBeregningsgrunnlagIndeks, setAktivtBeregningsgrunnlagIndeks] = useState(0);
  const aktivtBeregningsgrunnlag = beregningsgrunnlag[aktivtBeregningsgrunnlagIndeks];
  const beregningsgrunnlagVilkår = vilkar.find(
    vilkår => vilkår?.vilkarType?.kode === vilkarType.BEREGNINGSGRUNNLAGVILKARET,
  );
  if (beregningErBehandlet === false && !aksjonspunkter.length) {
    return <>Beregningssteget er ikke behandlet.</>;
  }

  if ((!aktivtBeregningsgrunnlag || !beregningsgrunnlagVilkår) && !aksjonspunkter.length) {
    return <>Har ikke beregningsgrunnlag.</>;
  }

  const aktiveAvklaringsBehov = aktivtBeregningsgrunnlag.avklaringsbehov;
  const skalKunneLøseAvklaring =
    erTilVurderingOgIkkeForlengelse(beregningreferanserTilVurdering, aktivtBeregningsgrunnlag) &&
    kanLøseMinstEtt(aktiveAvklaringsBehov);
  const vilkårsperioder = beregningsgrunnlagVilkår.perioder;

  const avklarAktiviteterReadOnly =
    readOnly ||
    !skalKunneLøseAvklaring ||
    (harAvklaringsbehov(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aktiveAvklaringsBehov) && !erOverstyrer);
  const avklarFaktaBeregningReadOnly =
    readOnly ||
    !skalKunneLøseAvklaring ||
    (harAvklaringsbehov(OVERSTYRING_AV_BEREGNINGSGRUNNLAG, aktiveAvklaringsBehov) && !erOverstyrer);
  return (
    <RawIntlProvider value={intl}>
      {skalBrukeTabs && (
        <div className={styles.tabsContainer}>
          <TabsPure
            tabs={beregningsgrunnlag.map((currentBeregningsgrunnlag, currentBeregningsgrunnlagIndex) => ({
              aktiv: aktivtBeregningsgrunnlagIndeks === currentBeregningsgrunnlagIndex,
              label: lagLabel(currentBeregningsgrunnlag, vilkårsperioder),
              className: skalVurderes(currentBeregningsgrunnlag, beregningreferanserTilVurdering)
                ? 'harAksjonspunkt'
                : '',
            }))}
            onChange={(e, clickedIndex) => setAktivtBeregningsgrunnlagIndeks(clickedIndex)}
          />
        </div>
      )}
      <div style={{ paddingTop: skalBrukeTabs ? '16px' : '' }}>
        <AvklareAktiviteterPanel
          readOnly={avklarAktiviteterReadOnly}
          harAndreAvklaringsbehovIPanel={harAvklaringsbehov(VURDER_FAKTA_FOR_ATFL_SN, aktiveAvklaringsBehov)}
          submitCallback={submitCallback}
          submittable={submittable}
          erOverstyrer={false}
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
          readOnly={avklarFaktaBeregningReadOnly}
          submitCallback={submitCallback}
          submittable={submittable}
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

BeregningFaktaIndex.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default BeregningFaktaIndex;
