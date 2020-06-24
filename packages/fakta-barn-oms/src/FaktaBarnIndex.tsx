import * as React from 'react';
import { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider, FormattedMessage } from 'react-intl';
import BarnDto, { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import Seksjon from '@k9-sak-web/fakta-barn-og-overfoeringsdager/src/components/Seksjon';
import users from '@fpsak-frontend/assets/images/users.svg';
import messages from '../i18n/nb_NO.json';
import VanligeBarn from './components/VanligeBarn';
import BarnFraRammevedtak from './components/BarnFraRammevedtak';

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
}

const FaktaBarnIndex: FunctionComponent<FaktaBarnIndexProps> = ({ barn = [] }) => {
  const vanligeBarn = barn.filter(({ barnType }) => barnType === BarnType.VANLIG);
  const barnFraRammeVedtak = barn.filter(({ barnType }) => barnType !== BarnType.VANLIG);

  return (
    <RawIntlProvider value={intl}>
      <Seksjon bakgrunn="hvit" title={{ id: 'FaktaBarn.Tittel' }} imgSrc={users}>
        {barn.length === 0 && <FormattedMessage id="FaktaBarn.IngenBarn" />}
        <VanligeBarn barn={vanligeBarn} />
        <BarnFraRammevedtak barn={barnFraRammeVedtak} startIndex={vanligeBarn.length + 1} />
      </Seksjon>
    </RawIntlProvider>
  );
};

export default FaktaBarnIndex;
