import { createLocationForHistorikkItems } from '@fpsak-frontend/fp-felles';
import {
  BehandlingKlageVurdering,
  BehandlingStatusType,
  SkjermlenkeTyper,
  TotrinnskontrollAksjonspunkter,
  Kodeverk,
} from '@fpsak-frontend/types';
import * as React from 'react';
import { createIntl, createIntlCache, FormattedHTMLMessage, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import TilbakemeldingerFraTotrinnskontroll from './TilbakemeldingerFraTotrinnskontroll';
import styles from './tilbakemeldingerFraTotrinnskontrollContainer.less';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const createApprovalList = (skjermlenkeTyper, location, totrinnskontrollContext) =>
  totrinnskontrollContext.map(context => {
    const skjermlenkeTypeKodeverk = skjermlenkeTyper.find(
      skjermlenkeType => skjermlenkeType.kode === context.skjermlenkeType,
    );
    return {
      contextCode: context.skjermlenkeType,
      skjermlenke: createLocationForHistorikkItems(location, context.skjermlenkeType),
      skjermlenkeNavn: skjermlenkeTypeKodeverk?.navn,
      aksjonspunkter: context.totrinnskontrollAksjonspunkter,
    };
  });

interface TilbakemeldingerFraTotrinnskontrollContainerProps {
  isForeldrepengerFagsak: boolean;
  behandlingKlageVurdering?: BehandlingKlageVurdering;
  behandlingStatus: BehandlingStatusType;
  alleKodeverk: Kodeverk;
  location: Location;
  skjermlenkeTyper: SkjermlenkeTyper[];
  totrinnskontrollContext: TotrinnskontrollAksjonspunkter[];
}

const TilbakemeldingerFraTotrinnskontrollContainer = ({
  skjermlenkeTyper,
  location,
  totrinnskontrollContext,
  isForeldrepengerFagsak,
  behandlingKlageVurdering,
  behandlingStatus,
  alleKodeverk,
}: TilbakemeldingerFraTotrinnskontrollContainerProps) => {
  const [approvals, setApprovals] = React.useState([]);
  React.useEffect(() => {
    setApprovals(createApprovalList(skjermlenkeTyper, location, totrinnskontrollContext));
  }, [totrinnskontrollContext]);
  return (
    <RawIntlProvider value={intl}>
      <div className={styles.approvalContainer}>
        <div className={styles.resultatFraGodkjenningTextContainer}>
          <FormattedHTMLMessage id="ToTrinnsForm.LøstAksjonspunkt" />
        </div>
        <TilbakemeldingerFraTotrinnskontroll
          approvalList={approvals}
          isForeldrepengerFagsak={isForeldrepengerFagsak}
          behandlingKlageVurdering={behandlingKlageVurdering}
          behandlingStatus={behandlingStatus}
          alleKodeverk={alleKodeverk}
        />
      </div>
    </RawIntlProvider>
  );
};

export default TilbakemeldingerFraTotrinnskontrollContainer;
