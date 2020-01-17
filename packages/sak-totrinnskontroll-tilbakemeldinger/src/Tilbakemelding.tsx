import avslattImg from '@fpsak-frontend/assets/images/avslaatt.svg';
import checkImg from '@fpsak-frontend/assets/images/check.svg';
import getAksjonspunktText from '@fpsak-frontend/sak-totrinnskontroll/src/components/ApprovalTextUtils';
import { Image } from '@fpsak-frontend/shared-components';
import {
  BehandlingKlageVurdering,
  BehandlingStatusType,
  Kodeverk,
  TotrinnskontrollAksjonspunkter,
} from '@fpsak-frontend/types';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import { Normaltekst } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './tilbakemelding.less';

const godkjendAksjonspunkt = (aksjonspunkt: TotrinnskontrollAksjonspunkter) => {
  const { vurderPaNyttArsaker } = aksjonspunkt;
  return (
    <div className={styles.approvalItem}>
      {aksjonspunkt.totrinnskontrollGodkjent ? (
        <div>
          <span>
            <Image src={checkImg} className={styles.image} />
          </span>
          <span>
            <FormattedMessage id="ToTrinnsForm.Godkjent" />
          </span>
        </div>
      ) : (
        <div className={styles.approvalItem}>
          {vurderPaNyttArsaker.map((item, index) => (
            /* eslint-disable-next-line react/no-array-index-key */
            <div key={`${item.kode}${index}`}>
              <span>
                <Image src={avslattImg} className={styles.image} />
              </span>
              <span>{item.navn}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface TilbakemeldingProps {
  aksjonspunkt: TotrinnskontrollAksjonspunkter;
  isForeldrepengerFagsak: boolean;
  behandlingKlageVurdering?: BehandlingKlageVurdering;
  behandlingStatus: BehandlingStatusType;
  arbeidsforholdHandlingTyper: Kodeverk[];
}

const Tilbakemelding = ({
  isForeldrepengerFagsak,
  behandlingKlageVurdering,
  behandlingStatus,
  arbeidsforholdHandlingTyper,
  aksjonspunkt,
}: TilbakemeldingProps) => {
  const aksjonspunktText = React.useMemo(
    () =>
      getAksjonspunktText(
        isForeldrepengerFagsak,
        behandlingKlageVurdering,
        behandlingStatus,
        arbeidsforholdHandlingTyper,
        aksjonspunkt,
      ),
    [isForeldrepengerFagsak, behandlingKlageVurdering, behandlingStatus, arbeidsforholdHandlingTyper, aksjonspunkt],
  );
  return (
    <div className={styles.approvalItemContainer}>
      <span>{aksjonspunkt.navn}</span>
      {aksjonspunktText.map((formattedMessage, index) => (
        <div
          key={aksjonspunkt.aksjonspunktKode.concat('_'.concat(`${index}`))}
          className={styles.aksjonspunktTextContainer}
        >
          <Normaltekst key={aksjonspunkt.aksjonspunktKode.concat('_'.concat(`${index}`))}>
            {formattedMessage}
          </Normaltekst>
        </div>
      ))}
      <div>
        {godkjendAksjonspunkt(aksjonspunkt)}
        <pre className={styles.approvalItem}>{decodeHtmlEntity(aksjonspunkt.besluttersBegrunnelse)}</pre>
      </div>
    </div>
  );
};

export default Tilbakemelding;
