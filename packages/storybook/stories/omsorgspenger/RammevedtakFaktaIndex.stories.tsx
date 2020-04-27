import * as React from 'react';
import FaktaRammevedtakIndex from '@k9-sak-web/fakta-barn-og-overfoeringsdager';
import OmsorgsdagerGrunnlagDto from '@k9-sak-web/fakta-barn-og-overfoeringsdager/src/dto/OmsorgsdagerGrunnlagDto';
import { Behandling } from '@k9-sak-web/types';
import { action } from '@storybook/addon-actions';
import {
  BarnAutomatiskHentetDto,
  BarnLagtTilAvSaksbehandlerDto,
} from '@k9-sak-web/fakta-barn-og-overfoeringsdager/src/dto/BarnDto';
import withReduxProvider from '../../decorators/withRedux';

export default {
  title: 'omsorgspenger/fakta/Dager til utbetaling',
  component: FaktaRammevedtakIndex,
  decorators: [withReduxProvider],
};

const behandling: Behandling = {
  id: 1,
  versjon: 1,
  status: {
    kode: '',
    kodeverk: '',
  },
  type: {
    kode: '',
    kodeverk: 'BEHANDLING_TYPE',
  },
  behandlingPaaVent: false,
  behandlingHenlagt: false,
  links: [],
};

const tomOmsorgsdagerGrunnlag: OmsorgsdagerGrunnlagDto = {
  barn: [],
  barnLagtTilAvSakbehandler: [],
  utvidetRett: [],
  overføringFår: [],
  overføringGir: [],
  fordelingFår: [],
  fordelingGir: [],
  koronaoverføringFår: [],
  koronaoverføringGir: [],
  uidentifiserteRammevedtak: [],
};

const barn: BarnAutomatiskHentetDto[] = [
  {
    fødselsnummer: '12121212121',
    aleneomsorg: false,
  },
];

const barnLagtTilAvSakbehandler: BarnLagtTilAvSaksbehandlerDto[] = [
  {
    id: '1',
    fødselsdato: '12.12.2012',
    aleneomsorg: true,
  },
];

export const medBarn = () => (
  <FaktaRammevedtakIndex
    omsorgsdagerGrunnlagDto={{ ...tomOmsorgsdagerGrunnlag, barn, barnLagtTilAvSakbehandler }}
    behandling={behandling}
    submitCallback={action('Send inn')}
  />
);

export const ingenBarn = () => (
  <FaktaRammevedtakIndex
    omsorgsdagerGrunnlagDto={tomOmsorgsdagerGrunnlag}
    behandling={behandling}
    submitCallback={action('Send inn')}
  />
);
