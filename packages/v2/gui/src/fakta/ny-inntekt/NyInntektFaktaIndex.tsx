import { Box, Button, Tabs, VStack } from '@navikt/ds-react';
import { AvklaringsbehovDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/AvklaringsbehovDefinisjon.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';

import { useState } from 'react';
import { useReaktiverAksjonspunktNyInntekt } from './api/NyInntektQueries.js';
import { harÅpentAksjonspunkt } from '../../utils/aksjonspunktUtils.js';
import { finnVilkårsperiode, vurderesIBehandlingen } from './src/components/felles/vilkårsperiodeUtils.js';
import { TilkommetAktivitet } from './src/components/tilkommetAktivitet/TilkommetAktivitet.js';
import type { TilkommetAktivitetFormValues } from './src/types/FordelBeregningsgrunnlagPanelValues.js';
import { type VurderNyttInntektsforholdAP } from './src/types/interface/VurderNyttInntektsforholdAP.js';
import type { Vilkår, Vilkårperiode } from './src/types/Vilkår.js';

import { DateLabel, PeriodLabel } from '@navikt/ft-ui-komponenter';
import type { ArbeidsgiverOpplysningerPerId } from './src/types/ArbeidsgiverOpplysninger.js';
import type { Beregningsgrunnlag } from './src/types/Beregningsgrunnlag.js';
import { PencilFillIcon } from '@navikt/aksel-icons';
import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';

const { VURDER_NYTT_INNTKTSFRHLD } = AvklaringsbehovDefinisjon;

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
  aksjonspunkter: AksjonspunktDto[];
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
  aksjonspunkter,
  formData,
  setFormData,
}: NyInntektFaktaIndexProps) => {
  const bgMedAvklaringsbehov = beregningsgrunnlagListe.filter(bg => kreverManuellBehandlingFn(bg));
  const [aktivtBeregningsgrunnlagIndeks, setAktivtBeregningsgrunnlagIndeks] = useState(0);
  const { mutate: reaktiverAksjonspunkt, isPending: reaktivererAksjonspunkt } = useReaktiverAksjonspunktNyInntekt();

  if (bgMedAvklaringsbehov.length === 0) {
    return null;
  }

  const harAksjonspunkt = harÅpentAksjonspunkt(
    aksjonspunkter,
    aksjonspunktkodeDefinisjonType.VURDER_NYTT_INNTKTSFORHOLD,
  );

  const skalBrukeTabs = bgMedAvklaringsbehov.length > 1;

  return (
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
      <TilkommetAktivitet
        aktivtBeregningsgrunnlagIndeks={aktivtBeregningsgrunnlagIndeks}
        formData={formData}
        setFormData={setFormData}
        submittable={submittable}
        readOnly={readOnly}
        submitCallback={submitCallback}
        beregningsgrunnlagListe={bgMedAvklaringsbehov}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        vilkarperioder={beregningsgrunnlagVilkår.perioder}
        aksjonspunkter={aksjonspunkter}
      />
      {!readOnly && !harAksjonspunkt && (
        <Box marginBlock="space-16 space-0">
          <Button icon={<PencilFillIcon />} loading={reaktivererAksjonspunkt} onClick={() => reaktiverAksjonspunkt()}>
            Aktiver aksjonspunkt
          </Button>
        </Box>
      )}
    </VStack>
  );
};

export default NyInntektFaktaIndex;
