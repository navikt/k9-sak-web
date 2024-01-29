import React from 'react';

import { createIntl, createIntlCache, RawIntlProvider, FormattedMessage } from 'react-intl';
import BarnDto from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import Seksjon from '@k9-sak-web/fakta-barn-og-overfoeringsdager/src/components/Seksjon';
import users from '@fpsak-frontend/assets/images/users.svg';
import user from '@fpsak-frontend/assets/images/user.svg';
import { Rammevedtak } from '@k9-sak-web/types';
import { RammevedtakEnum } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import MidlertidigAlene from './components/MidlertidigAlene';
import messages from '../i18n/nb_NO.json';
import BarnSeksjon from './components/BarnSeksjon';
import BarnMedRammevedtak from './dto/BarnMedRammevedtak';
import KombinertBarnOgRammevedtak from './dto/KombinertBarnOgRammevedtak';
import UidentifiserteRammevedtak from './components/UidentifiserteRammevedtak';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface FaktaBarnIndexProps {
  barn: BarnDto[];
  rammevedtak: Rammevedtak[];
  fagsaksType?: string;
}

const mapRammevedtakBarn = (
  tmpBarn: Record<string, BarnMedRammevedtak>,
  rammevedtak: Rammevedtak | Rammevedtak[],
  fnrFeltnavn: string,
  typeFeltnavn: string,
) => {
  const flereRammevedtak = Array.isArray(rammevedtak);
  const fnr = flereRammevedtak ? rammevedtak[0][fnrFeltnavn] : rammevedtak[fnrFeltnavn];

  if (!fnr) {
    return tmpBarn;
  }
  const eksisterendeBarn = tmpBarn[fnr] || {};
  let periodeRammevedtak;

  if (Array.isArray(rammevedtak)) {
    periodeRammevedtak = rammevedtak.map(rv => ({
      fom: rv.gyldigFraOgMed,
      tom: rv.gyldigTilOgMed,
    }));
  } else {
    periodeRammevedtak = {
      fom: rammevedtak.gyldigFraOgMed,
      tom: rammevedtak.gyldigTilOgMed,
    };
  }

  return {
    ...tmpBarn,
    [fnr]: {
      ...eksisterendeBarn,
      personIdent: fnr,
      [typeFeltnavn]: periodeRammevedtak,
    },
  };
};

const FaktaBarnIndex = ({ barn = [], rammevedtak = [], fagsaksType }: FaktaBarnIndexProps) => {
  const midlertidigAleneansvar = rammevedtak.find(rv => rv.type === RammevedtakEnum.MIDLERTIDIG_ALENEOMSORG);
  let vanligeBarnTekstId;
  switch (fagsaksType) {
    case FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN: {
      vanligeBarnTekstId = 'FaktaBarn.UtvidetRettKroniskSyk';
      break;
    }
    case FagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE: {
      vanligeBarnTekstId = 'FaktaBarn.UtvidetRettMidlertidigAlene';
      break;
    }
    default: {
      vanligeBarnTekstId = 'FaktaBarn.Behandlingsdato';
      break;
    }
  }

  const rammevedtakGruppertPerBarn: BarnMedRammevedtak[] = Object.values(
    rammevedtak.reduce((tmpBarn, rv) => {
      switch (rv.type) {
        case RammevedtakEnum.UTVIDET_RETT: {
          const alleUtvidetRettRammevedtak: Rammevedtak[] = rammevedtak.filter(
            rvedtak => rvedtak.utvidetRettFor === rv.utvidetRettFor,
          );
          return mapRammevedtakBarn(tmpBarn, alleUtvidetRettRammevedtak, 'utvidetRettFor', 'kroniskSykdom');
        }
        case RammevedtakEnum.ALENEOMSORG: {
          return mapRammevedtakBarn(tmpBarn, rv, 'aleneOmOmsorgenFor', 'aleneomsorg');
        }
        case RammevedtakEnum.FOSTERBARN: {
          return mapRammevedtakBarn(tmpBarn, rv, 'mottaker', 'fosterbarn');
        }
        case RammevedtakEnum.UTENLANDSK_BARN: {
          return mapRammevedtakBarn(tmpBarn, rv, 'fødselsdato', 'utenlandskBarn');
        }
        case RammevedtakEnum.DELT_BOSTED: {
          return mapRammevedtakBarn(tmpBarn, rv, 'deltBostedMed', 'deltBosted');
        }
        default: {
          return tmpBarn;
        }
      }
    }, {}),
  );

  const samletBarnOgRammevedtak: KombinertBarnOgRammevedtak[] = barn.map(b => {
    const kombinertBarnOgRammevedtak: KombinertBarnOgRammevedtak = {
      personIdent: b.personIdent,
      barnRelevantIBehandling: b,
    };

    rammevedtakGruppertPerBarn.forEach(barnMedRV => {
      const BarnRVFodselsnummer = barnMedRV.personIdent.substr(0, 6);
      const BarnFodselsnummer = b.personIdent.substr(0, 6);
      if (
        barnMedRV.personIdent === b.personIdent ||
        BarnRVFodselsnummer === b.personIdent ||
        barnMedRV.personIdent === BarnFodselsnummer
      ) {
        kombinertBarnOgRammevedtak.rammevedtak = barnMedRV;
      }
    });

    return kombinertBarnOgRammevedtak;
  });

  return (
    <RawIntlProvider value={intl}>
      <UidentifiserteRammevedtak type={RammevedtakEnum.UIDENTIFISERT} rammevedtak={rammevedtak} />
      <UidentifiserteRammevedtak type={RammevedtakEnum.UTVIDET_RETT} rammevedtak={rammevedtak} />
      <UidentifiserteRammevedtak type={RammevedtakEnum.ALENEOMSORG} rammevedtak={rammevedtak} />
      <UidentifiserteRammevedtak type={RammevedtakEnum.FOSTERBARN} rammevedtak={rammevedtak} />

      <Seksjon bakgrunn="hvit" title={{ id: 'FaktaBarn.Tittel' }} imgSrc={users} medMarg>
        {barn.length === 0 && <FormattedMessage id="FaktaBarn.IngenBarn" />}
        <BarnSeksjon barn={samletBarnOgRammevedtak} startIndex={0} tekstId={vanligeBarnTekstId} />
      </Seksjon>

      <Seksjon bakgrunn="grå" title={{ id: 'FaktaRammevedtak.ErMidlertidigAlene.Tittel' }} imgSrc={user} medMarg>
        <MidlertidigAlene midlertidigAlene={midlertidigAleneansvar} />
      </Seksjon>
    </RawIntlProvider>
  );
};

export default FaktaBarnIndex;
