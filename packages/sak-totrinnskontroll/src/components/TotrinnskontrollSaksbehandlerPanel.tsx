import avslattImg from '@fpsak-frontend/assets/images/avslaatt.svg';
import checkImg from '@fpsak-frontend/assets/images/check.svg';
import { Image } from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import { BodyShort } from '@navikt/ds-react';
import { Location } from 'history';
import React from 'react';
import { NavLink } from 'react-router';

import getAksjonspunkttekst from './aksjonspunktTekster/aksjonspunktTekstUtleder';

import { KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import { KlagebehandlingDto } from '@navikt/k9-klage-typescript-client';
import { Behandling } from '../types/Behandling';
import { TotrinnskontrollSkjermlenkeContext } from '../types/TotrinnskontrollSkjermlenkeContext';
import styles from './totrinnskontrollSaksbehandlerPanel.module.css';

interface OwnProps {
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContext[];
  behandlingKlageVurdering?: KlagebehandlingDto;
  behandlingStatus: Behandling['status'];
  erTilbakekreving: boolean;
  arbeidsforholdHandlingTyper: KodeverkObject[];
  skjermlenkeTyper: KodeverkObject[];
  vurderArsaker: KodeverkObject[];
  lagLenke: (skjermlenkeCode: string) => Location;
}

const TotrinnskontrollSaksbehandlerPanel = ({
  totrinnskontrollSkjermlenkeContext,
  behandlingKlageVurdering,
  behandlingStatus,
  arbeidsforholdHandlingTyper,
  skjermlenkeTyper,
  vurderArsaker,
  lagLenke,
}: OwnProps) => (
  <>
    <div className={styles.resultatFraGodkjenningTextContainer}>
      <b>Løst aksjonspunkt:</b> Kontroller endrede opplysninger og faglige vurderinger
    </div>
    {totrinnskontrollSkjermlenkeContext.map(context => {
      const aksjonspunkter = context.totrinnskontrollAksjonspunkter;
      const skjermlenkeTypeKodeverk = skjermlenkeTyper.find(
        skjermlenkeType => skjermlenkeType.kode === context.skjermlenkeType,
      );

      if (aksjonspunkter.length > 0) {
        return (
          <React.Fragment key={context.skjermlenkeType}>
            <NavLink
              to={lagLenke(context.skjermlenkeType)}
              onClick={() => window.scroll(0, 0)}
              className={styles.lenke}
            >
              {skjermlenkeTypeKodeverk?.navn}
            </NavLink>
            {aksjonspunkter.map(aksjonspunkt => {
              const aksjonspunktTexts = getAksjonspunkttekst(
                behandlingStatus,
                arbeidsforholdHandlingTyper,
                aksjonspunkt,
                behandlingKlageVurdering,
              );

              return (
                <div key={aksjonspunkt.aksjonspunktKode} className={styles.approvalItemContainer}>
                  {aksjonspunktTexts?.map((formattedMessage: string, index: number) => (
                    <div
                      key={aksjonspunkt.aksjonspunktKode.concat('_'.concat(index.toString()))}
                      className={styles.aksjonspunktTextContainer}
                    >
                      <BodyShort size="small">{formattedMessage}</BodyShort>
                    </div>
                  ))}
                  <div className={styles.approvalItem}>
                    {aksjonspunkt.totrinnskontrollGodkjent ? (
                      <div>
                        <span>
                          <Image src={checkImg} className={styles.image} />
                        </span>
                        <span>Godkjent</span>
                      </div>
                    ) : (
                      <div className={styles.approvalItem}>
                        {aksjonspunkt.vurderPaNyttArsaker?.map(item => (
                          <div key={`${item}${aksjonspunkt.aksjonspunktKode}`}>
                            <span>
                              <Image src={avslattImg} className={styles.image} />
                            </span>
                            <span>{vurderArsaker.find(arsak => item === arsak.kode)?.navn}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <pre className={styles.approvalItem}>
                    {aksjonspunkt.besluttersBegrunnelse && decodeHtmlEntity(aksjonspunkt.besluttersBegrunnelse)}
                  </pre>
                </div>
              );
            })}
          </React.Fragment>
        );
      }
      return null;
    })}
  </>
);

export default TotrinnskontrollSaksbehandlerPanel;
