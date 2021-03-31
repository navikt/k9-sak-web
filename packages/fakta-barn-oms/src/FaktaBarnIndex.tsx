import * as React from 'react';
import { FunctionComponent, useMemo } from 'react';
import { createIntl, createIntlCache, RawIntlProvider, FormattedMessage } from 'react-intl';
import BarnDto, { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import Seksjon from '@k9-sak-web/fakta-barn-og-overfoeringsdager/src/components/Seksjon';
import users from '@fpsak-frontend/assets/images/users.svg';
import user from '@fpsak-frontend/assets/images/user.svg';
import { Rammevedtak } from '@k9-sak-web/types';
import { RammevedtakEnum } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import MidlertidigAlene from './components/MidlertidigAlene';
import messages from '../i18n/nb_NO.json';
import VanligeBarn from './components/VanligeBarn';
import BarnFraRammevedtak from './components/BarnFraRammevedtak';
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

const FaktaBarnIndex: FunctionComponent<FaktaBarnIndexProps> = ({ barn = [], rammevedtak = [] }) => {
  const midlertidigAleneansvar = rammevedtak.find(rv => rv.type === RammevedtakEnum.MIDLERTIDIG_ALENEOMSORG);

  let rammevedtakGruppertPerBarn: BarnMedRammevedtak[] = Object.values(
    rammevedtak.reduce((tmpBarn, rv) => {
      if (rv.type === RammevedtakEnum.UTVIDET_RETT) {
        const alleUtvidetRettRammevedtak: Rammevedtak[] = rammevedtak.filter(
          rvedtak => rvedtak.utvidetRettFor === rv.utvidetRettFor,
        );
        return mapRammevedtakBarn(tmpBarn, alleUtvidetRettRammevedtak, 'utvidetRettFor', 'kroniskSykdom');
      }

      if (rv.type === RammevedtakEnum.ALENEOMSORG) {
        return mapRammevedtakBarn(tmpBarn, rv, 'aleneOmOmsorgenFor', 'aleneomsorg');
      }

      if (rv.type === RammevedtakEnum.FOSTERBARN) {
        return mapRammevedtakBarn(tmpBarn, rv, 'mottaker', 'fosterbarn');
      }

      if (rv.type === RammevedtakEnum.UTENLANDSK_BARN) {
        return mapRammevedtakBarn(tmpBarn, rv, 'fødselsdato', 'utenlandskBarn');
      }

      if (rv.type === RammevedtakEnum.DELT_BOSTED) {
        return mapRammevedtakBarn(tmpBarn, rv, 'deltBostedMed', 'deltBosted');
      }

      return tmpBarn;
    }, {}),
  );

  const samletBarnOgRammevedtak: KombinertBarnOgRammevedtak[] = barn.map(b => {
    let indexTilBarnVarsRammevedtakOverforsTilNyArray = null;

    const kombinertBarnOgRammevedtak: KombinertBarnOgRammevedtak = {
      personIdent: b.personIdent,
      barnRelevantIBehandling: b,
    };

    rammevedtakGruppertPerBarn.forEach((barnMedRV, index) => {
      if (barnMedRV.personIdent === b.personIdent) {
        indexTilBarnVarsRammevedtakOverforsTilNyArray = index;
        kombinertBarnOgRammevedtak.rammevedtak = barnMedRV;
      }
    });

    if (indexTilBarnVarsRammevedtakOverforsTilNyArray !== null)
      rammevedtakGruppertPerBarn.splice(indexTilBarnVarsRammevedtakOverforsTilNyArray, 1);

    return kombinertBarnOgRammevedtak;
  });

  rammevedtakGruppertPerBarn = rammevedtakGruppertPerBarn.map(rv => ({
    personIdent: rv.personIdent,
    rammevedtak: rv,
  }));

  const vanligeBarn: KombinertBarnOgRammevedtak[] = useMemo(
    () => samletBarnOgRammevedtak.filter(b => b.barnRelevantIBehandling.barnType === BarnType.VANLIG),
    [barn],
  );
  let barnFraRammeVedtak: KombinertBarnOgRammevedtak[] = useMemo(
    () => samletBarnOgRammevedtak.filter(b => b.barnRelevantIBehandling.barnType !== BarnType.VANLIG),
    [barn],
  );

  barnFraRammeVedtak = barnFraRammeVedtak.concat(rammevedtakGruppertPerBarn);

  return (
    <RawIntlProvider value={intl}>
      <UidentifiserteRammevedtak type={RammevedtakEnum.UIDENTIFISERT} rammevedtak={rammevedtak} />
      <UidentifiserteRammevedtak type={RammevedtakEnum.UTVIDET_RETT} rammevedtak={rammevedtak} />
      <UidentifiserteRammevedtak type={RammevedtakEnum.ALENEOMSORG} rammevedtak={rammevedtak} />
      <UidentifiserteRammevedtak type={RammevedtakEnum.FOSTERBARN} rammevedtak={rammevedtak} />

      <Seksjon bakgrunn="hvit" title={{ id: 'FaktaBarn.Tittel' }} imgSrc={users} medMarg>
        {barn.length === 0 && <FormattedMessage id="FaktaBarn.IngenBarn" />}
        <VanligeBarn barn={vanligeBarn} />
        <BarnFraRammevedtak barn={barnFraRammeVedtak} startIndex={vanligeBarn.length} />
      </Seksjon>

      <Seksjon bakgrunn="grå" title={{ id: 'FaktaRammevedtak.ErMidlertidigAlene.Tittel' }} imgSrc={user} medMarg>
        <MidlertidigAlene midlertidigAlene={midlertidigAleneansvar} />
      </Seksjon>
    </RawIntlProvider>
  );
};

export default FaktaBarnIndex;
