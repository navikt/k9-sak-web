import * as React from 'react';
import FaktaRammevedtakIndex from '@k9-sak-web/fakta-barn-og-overfoeringsdager';
import OmsorgsdagerGrunnlagDto from '@k9-sak-web/fakta-barn-og-overfoeringsdager/src/dto/OmsorgsdagerGrunnlagDto';
import { Behandling } from '@k9-sak-web/types';
import { action } from '@storybook/addon-actions';
import {
  BarnAutomatiskHentetDto,
  BarnLagtTilAvSaksbehandlerDto,
} from '@k9-sak-web/fakta-barn-og-overfoeringsdager/src/dto/BarnDto';
import {
  UidentifisertRammevedtak,
  UtvidetRettDto,
} from '@k9-sak-web/fakta-barn-og-overfoeringsdager/src/dto/RammevedtakDto';
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
  aleneOmOmsorgen: [],
  utvidetRett: [],
  overføringFår: [],
  overføringGir: [],
  fordelingFår: [],
  fordelingGir: [],
  koronaoverføringFår: [],
  koronaoverføringGir: [],
  uidentifiserteRammevedtak: [],
};

const fnrEtBarn = '12121212121';
const fnrEtAnnetBarn = '02020202020';
const barn: BarnAutomatiskHentetDto[] = [{ fødselsnummer: fnrEtBarn }, { fødselsnummer: fnrEtAnnetBarn }];

const barnLagtTilAvSakbehandler: BarnLagtTilAvSaksbehandlerDto[] = [
  {
    id: '1',
    fødselsdato: '2012-12-12',
  },
];

const uidentifiserteRammevedtak: UidentifisertRammevedtak[] = [{ fritekst: undefined }, { fritekst: undefined }];
const utvidetRettUkjentBarn: UtvidetRettDto = {
  kilde: 'hentetAutomatisk',
};

export const medBarnOgUidentifiserteRammevedtak = () => (
  <FaktaRammevedtakIndex
    omsorgsdagerGrunnlagDto={{
      ...tomOmsorgsdagerGrunnlag,
      barn,
      barnLagtTilAvSakbehandler,
      uidentifiserteRammevedtak,
      aleneOmOmsorgen: [
        {
          fnrBarnAleneOm: fnrEtBarn,
          kilde: 'hentetAutomatisk',
        },
      ],
      utvidetRett: [utvidetRettUkjentBarn],
      overføringFår: [
        {
          antallDager: 8,
          kilde: 'hentetAutomatisk',
          avsendersFnr: '12018926752',
        },
        {
          antallDager: 3,
          kilde: 'hentetAutomatisk',
          avsendersFnr: '12018926752',
        },
      ],
    }}
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

export const readOnly = () => (
  <FaktaRammevedtakIndex
    omsorgsdagerGrunnlagDto={{
      ...tomOmsorgsdagerGrunnlag,
      barn,
      barnLagtTilAvSakbehandler,
      aleneOmOmsorgen: [
        {
          fnrBarnAleneOm: fnrEtBarn,
          kilde: 'hentetAutomatisk',
        },
      ],
      overføringFår: [
        {
          kilde: 'hentetAutomatisk',
          antallDager: 10,
          avsendersFnr: '12312312312',
        },
      ],
    }}
    behandling={behandling}
    submitCallback={action('Send inn')}
    readOnly
  />
);
