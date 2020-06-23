import * as React from 'react';
import { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider, FormattedMessage } from 'react-intl';
import BarnDto, { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { Element } from 'nav-frontend-typografi';
import Seksjon from '@k9-sak-web/fakta-barn-og-overfoeringsdager/src/components/Seksjon';
import users from '@fpsak-frontend/assets/images/users.svg';
import messages from '../i18n/nb_NO.json';
import BarnInfo from './components/BarnInfo';

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
        <Element>
          <FormattedMessage id="FaktaBarn.Behandlingsdato" />
        </Element>
        {barn.length === 0 && <FormattedMessage id="FaktaBarn.IngenBarn" />}
        {vanligeBarn.map((barnet, index) => (
          <BarnInfo barnet={barnet} index={index} key={barnet.personIdent} />
        ))}
        {/* TODO: legge i egne components og skrive at vanlige barn er lagret, mens de andre er 'live' */}
        {barnFraRammeVedtak.map((barnet, index) => (
          <BarnInfo barnet={barnet} index={index + vanligeBarn.length} key={barnet.personIdent} />
        ))}
      </Seksjon>
    </RawIntlProvider>
  );
};

export default FaktaBarnIndex;
