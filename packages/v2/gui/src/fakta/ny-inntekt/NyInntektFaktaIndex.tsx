import { Tabs, VStack } from '@navikt/ds-react';

import { useState } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { finnVilkårsperiode, vurderesIBehandlingen } from './src/components/felles/vilkårsperiodeUtils.js';
import { FordelBeregningsgrunnlagPanel } from './src/components/FordelBeregningsgrunnlagPanel.js';
import type { TilkommetAktivitetFormValues } from './src/types/FordelBeregningsgrunnlagPanelValues.js';
import { FaktaFordelBeregningAvklaringsbehovCode } from './src/types/interface/FaktaFordelBeregningAvklaringsbehovCode.js';
import { type VurderNyttInntektsforholdAP } from './src/types/interface/VurderNyttInntektsforholdAP.js';
import type { Vilkår, Vilkårperiode } from './src/types/Vilkår.js';

import { DateLabel, PeriodLabel } from '@navikt/ft-ui-komponenter';
import type { ArbeidsgiverOpplysningerPerId } from './src/types/ArbeidsgiverOpplysninger.js';
import type { Beregningsgrunnlag } from './src/types/Beregningsgrunnlag.js';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
  },
  cache,
);

const { VURDER_NYTT_INNTKTSFRHLD } = FaktaFordelBeregningAvklaringsbehovCode;

const lagLabel = (bg: Beregningsgrunnlag, vilkårsperioder: Vilkårperiode[]) => {
  const vilkårPeriode = finnVilkårsperiode(vilkårsperioder, bg.vilkårsperiodeFom);
  if (vilkårPeriode) {
    const { fom, tom } = vilkårPeriode.periode;
    return <PeriodLabel dateStringFom={fom} dateStringTom={tom} />;
  }
  return <DateLabel dateString={bg.vilkårsperiodeFom} />;
};

const kreverManuellBehandlingFn = (bg: Beregningsgrunnlag) =>
  bg.avklaringsbehov.some(a => a.definisjon === VURDER_NYTT_INNTKTSFRHLD);

const skalVurderes = (bg: Beregningsgrunnlag, vilkårsperioder: Vilkårperiode[]) =>
  kreverManuellBehandlingFn(bg) && vurderesIBehandlingen(vilkårsperioder, bg.vilkårsperiodeFom);

type NyInntektFaktaIndexProps = {
  beregningsgrunnlagVilkår: Vilkår;
  beregningsgrunnlagListe: Beregningsgrunnlag[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  submittable: boolean;
  submitCallback: (aksjonspunktData: VurderNyttInntektsforholdAP) => Promise<void>;
  readOnly: boolean;
  formData?: TilkommetAktivitetFormValues;
  setFormData: (data: TilkommetAktivitetFormValues) => void;
};

export const NyInntektFaktaIndex = ({
  beregningsgrunnlagVilkår,
  beregningsgrunnlagListe,
  submitCallback,
  readOnly,
  submittable,
  arbeidsgiverOpplysningerPerId,
  formData,
  setFormData,
}: NyInntektFaktaIndexProps) => {
  const bgMedAvklaringsbehov = beregningsgrunnlagListe.filter(bg => kreverManuellBehandlingFn(bg));
  const [aktivtBeregningsgrunnlagIndeks, setAktivtBeregningsgrunnlagIndeks] = useState(0);

  if (bgMedAvklaringsbehov.length === 0) {
    return null;
  }

  const skalBrukeTabs = bgMedAvklaringsbehov.length > 1;

  return (
    <RawIntlProvider value={intl}>
      <VStack gap="space-8">
        {skalBrukeTabs && (
          <Tabs
            value={aktivtBeregningsgrunnlagIndeks.toString()}
            onChange={(clickedIndex: string) => setAktivtBeregningsgrunnlagIndeks(Number(clickedIndex))}
          >
            <Tabs.List>
              {bgMedAvklaringsbehov.map((currentBeregningsgrunnlag, currentBeregningsgrunnlagIndex) => (
                <Tabs.Tab
                  key={currentBeregningsgrunnlag.skjaeringstidspunktBeregning}
                  value={currentBeregningsgrunnlagIndex.toString()}
                  label={lagLabel(currentBeregningsgrunnlag, beregningsgrunnlagVilkår.perioder)}
                  className={
                    skalVurderes(currentBeregningsgrunnlag, beregningsgrunnlagVilkår.perioder) ? 'harAksjonspunkt' : ''
                  }
                />
              ))}
            </Tabs.List>
          </Tabs>
        )}
        <FordelBeregningsgrunnlagPanel
          aktivtBeregningsgrunnlagIndeks={aktivtBeregningsgrunnlagIndeks}
          submitCallback={submitCallback}
          readOnly={readOnly}
          beregningsgrunnlagListe={bgMedAvklaringsbehov}
          vilkarperioder={beregningsgrunnlagVilkår.perioder}
          submittable={submittable}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          formData={formData}
          setFormData={setFormData}
        />
      </VStack>
    </RawIntlProvider>
  );
};

export default NyInntektFaktaIndex;
