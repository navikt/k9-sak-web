import type { k9_klage_kontrakt_klage_KlagebehandlingDto as KlagebehandlingDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { CheckmarkIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { BodyShort, Link } from '@navikt/ds-react';
import { decodeHtmlEntity } from '@navikt/ft-utils';
import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router';
import type { TotrinnskontrollBehandling } from '../types/TotrinnskontrollBehandling.js';
import getAksjonspunkttekst from './aksjonspunktTekster/aksjonspunktTekstUtleder';
import styles from './totrinnskontrollSaksbehandlerPanel.module.css';
import type { TotrinnskontrollData } from '../../../behandling/support/totrinnskontroll/TotrinnskontrollApi.js';
import { createPathForSkjermlenke } from '../../../utils/skjermlenke/createPathForSkjermlenke.js';
import { K9KodeverkoppslagContext } from '../../../kodeverk/oppslag/K9KodeverkoppslagContext.js';

interface OwnProps {
  totrinnskontrollData: TotrinnskontrollData;
  behandlingKlageVurdering?: KlagebehandlingDto;
  behandlingStatus: TotrinnskontrollBehandling['status'];
}

const TotrinnskontrollSaksbehandlerPanel = ({
  totrinnskontrollData,
  behandlingKlageVurdering,
  behandlingStatus,
}: OwnProps) => {
  const location = useLocation();
  const kodeverkoppslag = useContext(K9KodeverkoppslagContext);
  return (
    <>
      <div className={styles.resultatFraGodkjenningTextContainer}>
        <b>Løst aksjonspunkt:</b> Kontroller endrede opplysninger og faglige vurderinger
      </div>
      {totrinnskontrollData.prSkjermlenke.map(({ skjermlenke, aksjonspunkter }) => {
        if (aksjonspunkter.length > 0) {
          return (
            <React.Fragment key={skjermlenke.kilde}>
              <Link
                as={NavLink}
                to={createPathForSkjermlenke(location, skjermlenke.kilde)}
                onClick={() => window.scroll(0, 0)}
                className={styles.lenke}
              >
                {skjermlenke.navn}
              </Link>
              {aksjonspunkter.map(aksjonspunkt => {
                const aksjonspunktTexts = getAksjonspunkttekst(
                  behandlingStatus,
                  aksjonspunkt,
                  behandlingKlageVurdering,
                  kodeverkoppslag,
                );

                return (
                  <div key={aksjonspunkt.aksjonspunktKode} className={styles.approvalItemContainer}>
                    {aksjonspunktTexts?.map((formattedMessage: React.ReactNode, index: number) => (
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
                            <CheckmarkIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
                          </span>
                          <span>Godkjent</span>
                        </div>
                      ) : (
                        <div className={styles.approvalItem}>
                          {aksjonspunkt.vurderPaNyttArsaker?.map(item => (
                            <div key={`${item}${aksjonspunkt.aksjonspunktKode}`}>
                              <span>
                                <XMarkOctagonIcon fontSize={20} style={{ color: 'var(--ax-bg-danger-strong)' }} />
                              </span>
                              <span>{totrinnskontrollData.vurderPåNyttÅrsakNavn(item)}</span>
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
};

export default TotrinnskontrollSaksbehandlerPanel;
