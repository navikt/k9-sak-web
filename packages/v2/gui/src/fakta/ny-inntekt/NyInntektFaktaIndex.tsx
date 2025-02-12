import { Tabs } from '@navikt/ds-react';

import { VerticalSpacer } from '@navikt/ft-ui-komponenter';
import { DDMMYYYY_DATE_FORMAT } from '@navikt/ft-utils';
import dayjs from 'dayjs';
import { useState } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { finnVilkårsperiode, vurderesIBehandlingen } from './src/components/felles/vilkårsperiodeUtils.js';
import { FordelBeregningsgrunnlagPanel } from './src/components/FordelBeregningsgrunnlagPanel.js';
import type { TilkommetAktivitetFormValues } from './src/types/FordelBeregningsgrunnlagPanelValues.js';
import { FaktaFordelBeregningAvklaringsbehovCode } from './src/types/interface/FaktaFordelBeregningAvklaringsbehovCode.js';
import { type VurderNyttInntektsforholdAP } from './src/types/interface/VurderNyttInntektsforholdAP.js';
import type { Vilkår, Vilkårperiode } from './src/types/Vilkår.js';

import messages from './i18n/nb_NO.json';
import type { ArbeidsgiverOpplysningerPerId } from './src/types/ArbeidsgiverOpplysninger.js';
import type { Beregningsgrunnlag } from './src/types/Beregningsgrunnlag.js';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const { VURDER_NYTT_INNTKTSFRHLD } = FaktaFordelBeregningAvklaringsbehovCode;

const lagLabel = (bg: Beregningsgrunnlag, vilkårsperioder: Vilkårperiode[]): string => {
  const vilkårPeriode = finnVilkårsperiode(vilkårsperioder, bg.vilkårsperiodeFom);
  if (vilkårPeriode) {
    const { fom, tom } = vilkårPeriode.periode;
    if (tom !== null) {
      return `${dayjs(fom).format(DDMMYYYY_DATE_FORMAT)} - ${dayjs(tom).format(DDMMYYYY_DATE_FORMAT)}`;
    }
    return `${dayjs(fom).format(DDMMYYYY_DATE_FORMAT)} - `;
  }
  return `${dayjs(bg.vilkårsperiodeFom).format(DDMMYYYY_DATE_FORMAT)}`;
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
      <VerticalSpacer eightPx />
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
    </RawIntlProvider>
  );
};
