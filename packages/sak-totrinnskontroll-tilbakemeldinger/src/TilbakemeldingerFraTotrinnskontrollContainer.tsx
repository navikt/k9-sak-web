import * as React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { createLocationForHistorikkItems } from '@fpsak-frontend/fp-felles';
import { SkjermlenkeTyper } from '@fpsak-frontend/sak-totrinnskontroll/src/TotrinnskontrollSakIndex';
import { BehandlingKlageVurdering, BehandlingStatusType, TotrinnskontrollAksjonspunkter } from '@fpsak-frontend/types';
import { TilbakemeldingerFraTotrinnskontroll } from './TilbakemeldingerFraTotrinnskontroll';
import styles from './approvalPanel.less';

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
  alleKodeverk: object;
  location: object;
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
    <>
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
    </>
  );
};

export default TilbakemeldingerFraTotrinnskontrollContainer;
