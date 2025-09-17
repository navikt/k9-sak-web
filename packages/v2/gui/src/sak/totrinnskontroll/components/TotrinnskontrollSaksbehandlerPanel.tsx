import type { k9_klage_kontrakt_klage_KlagebehandlingDto as KlagebehandlingDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import { CheckmarkIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { BodyShort, Link } from '@navikt/ds-react';
import { decodeHtmlEntity } from '@navikt/ft-utils';
import type { Location } from 'history';
import React from 'react';
import { NavLink } from 'react-router';
import type { Behandling } from '../types/Behandling';
import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import getAksjonspunkttekst from './aksjonspunktTekster/aksjonspunktTekstUtleder';
import styles from './totrinnskontrollSaksbehandlerPanel.module.css';

interface OwnProps {
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContextDto[];
  behandlingKlageVurdering?: KlagebehandlingDto;
  behandlingStatus: Behandling['status'];
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
            <Link
              as={NavLink}
              to={lagLenke(context.skjermlenkeTypeEnum)}
              onClick={() => window.scroll(0, 0)}
              className={styles.lenke}
            >
              {skjermlenkeTypeKodeverk?.navn}
            </Link>
            {aksjonspunkter.map(aksjonspunkt => {
              const aksjonspunktTexts = getAksjonspunkttekst(
                behandlingStatus,
                arbeidsforholdHandlingTyper,
                aksjonspunkt,
                behandlingKlageVurdering,
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
