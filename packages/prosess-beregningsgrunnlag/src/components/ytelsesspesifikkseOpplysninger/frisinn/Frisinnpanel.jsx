import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import Panel from 'nav-frontend-paneler';
import beregningsgrunnlagPropType from '../../../propTypes/beregningsgrunnlagPropType';
import styles from './søknadsopplysninger.less';
import Søknadsopplysninger from './Søknadsopplysninger';
import Beregningsresultat from './Beregningsresultat';
import Inntektsopplysninger from './Inntektsopplysninger';
import Grenseverdi from './Grenseverdi';
import GrenseverdiOld from './GrenseverdiOld';
import BeregningsresultatOld from './BeregningsresultatOld';
import SøknadsopplysningerOld from './SøknadsopplysningerOld';
import InntektsopplysningerOld from './InntektsopplysningerOld';

const erDagsatsBeregnet = bg => bg.beregningsgrunnlagPeriode.some(p => p.dagsats || p.dagsats === 0);

const gammelSøknadOgInntektsOpplysninger = bg => {
  return (
    <>
      <VerticalSpacer sixteenPx />
      <SøknadsopplysningerOld beregningsgrunnlag={bg} />
      <VerticalSpacer sixteenPx />
      <InntektsopplysningerOld beregningsgrunnlag={bg} />
      <VerticalSpacer sixteenPx />
    </>
  );
};

const nySøknadOgInntektsOpplysninger = bg => {
  return (
    <>
      <VerticalSpacer sixteenPx />
      <Søknadsopplysninger beregningsgrunnlag={bg} />
      <VerticalSpacer sixteenPx />
      <Inntektsopplysninger beregningsgrunnlag={bg} />
      <VerticalSpacer sixteenPx />
    </>
  );
};

const nyttResultatOgGrenseverdi = bg => {
  return (
    <>
      <Grenseverdi beregningsgrunnlag={bg} />
      <VerticalSpacer sixteenPx />
      <Beregningsresultat beregningsgrunnlag={bg} />
    </>
  );
};

const gammeltResultatOgGrenseverdi = bg => {
  return (
    <>
      <GrenseverdiOld beregningsgrunnlag={bg} />
      <VerticalSpacer sixteenPx />
      <BeregningsresultatOld beregningsgrunnlag={bg} />
    </>
  );
};

const Frisinnpanel = ({ beregningsgrunnlag }) => {
  const frisinngrunnlag = beregningsgrunnlag.ytelsesspesifiktGrunnlag;
  // TODO fjern denne og alle "Old" komponenter når vi kontrakt er ute i P
  const harPeriodisertGrunnlag = frisinngrunnlag.frisinnPerioder && frisinngrunnlag.frisinnPerioder.length > 0;
  return (
    <>
      <div className={styles.aksjonspunktBehandlerContainer}>
        <Panel>
          <Undertittel>
            <FormattedMessage id="Beregningsgrunnlag.Frisinn.Tittel" />
          </Undertittel>
          {harPeriodisertGrunnlag && <>{nySøknadOgInntektsOpplysninger(beregningsgrunnlag)}</>}
          {!harPeriodisertGrunnlag && <>{gammelSøknadOgInntektsOpplysninger(beregningsgrunnlag)}</>}
          {erDagsatsBeregnet(beregningsgrunnlag) && (
            <>
              {harPeriodisertGrunnlag && <>{nyttResultatOgGrenseverdi(beregningsgrunnlag)}</>}
              {!harPeriodisertGrunnlag && <>{gammeltResultatOgGrenseverdi(beregningsgrunnlag)}</>}
            </>
          )}
        </Panel>
      </div>
    </>
  );
};
Frisinnpanel.propTypes = {
  beregningsgrunnlag: beregningsgrunnlagPropType,
};

Frisinnpanel.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default Frisinnpanel;
