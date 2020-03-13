import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import Behandling from '@k9-sak-web/types/src/behandlingTsType';
import Personopplysninger from '@k9-sak-web/types/src/personopplysningerTsType';
import messages from '../i18n/nb_NO.json';
import UttakFaktaPanel from './components/UttakFaktaPanel';
import Arbeid from './components/types/Arbeid';
import ArbeidDto from './components/dto/ArbeidDto';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface UttakFaktaIndexProps {
  behandling: Behandling;
  arbeidDto: ArbeidDto[];
  // TODO: return type: { begrunnelse: arbeidDto, kode }
  submitCallback: (values: any[]) => void;
  personopplysninger: Personopplysninger;
}

// Gjør om periode på ISO 8601-format til timer. Henter ut kun timer og minutter, så den er ikke komplett
export const ISO_8601DurationToHours: (isoDuration: string) => number = isoDuration => {
  const utenPT = isoDuration.replace('PT', '');
  const [timer, rest] = utenPT.split('H');
  const [minutter] = rest.split('M');

  return Number(timer) + Number(minutter) / 60;
};

export const mapDtoTilInternobjekt: (arbeid: ArbeidDto[]) => Arbeid[] = arbeid =>
  arbeid.map(({ perioder, arbeidsforhold }) => ({
    arbeidsforhold: { ...arbeidsforhold },
    perioder: Object.entries(perioder).map(([fomTom, { jobberNormaltPerUke, skalJobbeProsent }]) => {
      const [fom, tom] = fomTom.split('/');
      const timerIJobbTilVanlig = ISO_8601DurationToHours(jobberNormaltPerUke);
      return {
        fom,
        tom,
        timerIJobbTilVanlig,
        timerFårJobbet: (Number(skalJobbeProsent) * timerIJobbTilVanlig) / 100,
      };
    }),
  }));

const UttakFaktaIndex: FunctionComponent<UttakFaktaIndexProps> = ({
  behandling,
  arbeidDto,
  submitCallback,
  personopplysninger,
}) => (
  <RawIntlProvider value={intl}>
    <UttakFaktaPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      arbeid={mapDtoTilInternobjekt(arbeidDto)}
      submitCallback={submitCallback}
      personopplysninger={personopplysninger}
    />
  </RawIntlProvider>
);

export default UttakFaktaIndex;
