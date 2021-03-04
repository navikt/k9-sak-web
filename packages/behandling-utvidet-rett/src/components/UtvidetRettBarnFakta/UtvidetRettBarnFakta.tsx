import React from 'react';
import { createIntl, FormattedMessage, RawIntlProvider } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import users from '@fpsak-frontend/assets/images/users.svg';
import Seksjon from '@k9-sak-web/fakta-barn-og-overfoeringsdager/src/components/Seksjon';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import uuid from 'react-uuid';
import messages from '../../../i18n/nb_NO.json';
import styles from './utvidetRettBarnFakta.less';

interface OwnProps {
  personopplysninger: {
    barn: { fnr: string }[];
    barnSoktFor: { fnr: string }[];
  };
  fagsaksType: string;
}

const intl = createIntl({
  locale: 'nb-NO',
  messages,
});

const UtvidetRettBarnFakta: React.FunctionComponent<OwnProps> = ({ personopplysninger, fagsaksType }) => {
  const erFagsakYtelseTypeKroniskSyktBarn = FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN === fagsaksType;
  const barn = erFagsakYtelseTypeKroniskSyktBarn ? personopplysninger.barnSoktFor : personopplysninger.barn;
  const titelId = erFagsakYtelseTypeKroniskSyktBarn
    ? 'UtvidetRett.Barn.KroniskSyktBarn.Titel'
    : 'UtvidetRett.Barn.MidlertidigAlene.Titel';

  return (
    <RawIntlProvider value={intl}>
      <Seksjon bakgrunn="hvit" title={{ id: titelId }} imgSrc={users} medMarg>
        {!barn.length && <FormattedMessage id="UtvidetRett.Barn.IngaBarn" />}
        {barn.length > 0 && (
          <Panel border className={styles.barnInput}>
            {barn.map((barnet, index) => (
              <div key={uuid()} className={styles.header}>
                <h4>
                  <FormattedMessage id="UtvidetRett.Barn.BarnVisning" values={{ nummer: index + 1 }} />
                </h4>
                <span className={styles.italic}>{barnet.fnr}</span>
              </div>
            ))}
          </Panel>
        )}
      </Seksjon>
    </RawIntlProvider>
  );
};
export default UtvidetRettBarnFakta;
