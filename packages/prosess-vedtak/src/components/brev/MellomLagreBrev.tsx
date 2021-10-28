import React, { useEffect, useState } from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Knapp } from 'nav-frontend-knapper';
import { Column, Row } from 'nav-frontend-grid';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

/**
 * Noen typer brukt i denne komponenten, burde flyttes når fler av komponentene blir refaktorert til typescript
 */
type LagreDokumentdataType = (params?: any, keepData?: boolean) => Promise<any>;
type DokumentDataType = { FRITEKSTBREV?: { brødtekst?, overskrift?} };

interface OwnProps {
  lagreDokumentdata: LagreDokumentdataType;
  dokumentdata: DokumentDataType;
  overskrift: string;
  brødtekst: string;
}

/**
 * MellomLagreBrev
 *
 * Viser "lagre" knapp for å kunne mellomlagre fritekstbrev uten å sende aksjonspunktet til godkjenning eller 
 * fatte vedtak. Vil dukke opp når brukeren begynner å skrive, og teksten har endret seg. Viser en advarsel
 * om teksten er endret uten å lagre, og en bekreftelse om den er mellomlagret.
 * 
 * Har skilt den ut i egen komponent i påvente av å skrive om BrevPanel.jsx til typescript. Burde også vurdere
 * bakgrunnen for tilbakemelding til bruker, da den foreløpig er "dum" og optimistisk. Altså, den forholder 
 * ikke til om kalle for mellomlagring feiler eller går igjennom. Men om kallet som mellomlagrer feiler vil 
 * applikasjonen feile også. 
 * 
 * lagreDokumentdata()
 * funksjon for api kallet for å lagre dokumentdata. Defineres i {behandling}Prosess.tsx filene og prop-drilles 
 * ned hit for å sende lagre dokumentdata kallet isolert. Brukes også som sideeffekt i fullfør aksjonspunkt. 
 * Vurder å flytte denne funksjonaliteten ut i en egen hook ved en senere refaktorering
 * 
 * @param {intlShape} intl injiserte formatJS funksjoner
 * @param {LagreDokumentdataType} lagreDokumentdata beskrevet ovenfor
 * @param {DokumentDataType} dokumentData object med data returnert fra formidling, brukes også som mal for lagre-kall
 * @param {string} overskrift overskriften fra fritekstbrev-skjeamet, kommer fra redux-forms
 * @param {string} brødtekst brødteksten fra fritekstbrev-skjemaet, kommer fra redux-forms
 * @returns {JSX.Element} komponenten som viser tilbakemelding og knapp for å mellomlagre
 */
const MellomLagreBrev = ({
  intl,
  lagreDokumentdata,
  dokumentdata,
  overskrift,
  brødtekst
}: OwnProps & WrappedComponentProps) => {
  const [originalBrev, setOriginalBrev] = useState(undefined);
  const [erTekstLik, setErTekstLik] = useState(false);
  const [erTekstEndret, setErTekstEndret] = useState(false);

  /**
   * @param {string} overskriftStreng
   * @param {string} brødtekstStreng
   * @returns {string} Returnerer en sammenslått streng med overskrift og brødtekst, til bruk i sammenlikning
   */
  const brevTilStreng = (overskriftStreng: string, brødtekstStreng: string) => `${overskriftStreng}-${brødtekstStreng}`;

  /**
   * Håndter klikk på lagre knappen, send lagre kallet og oppdatert original strengen for å vise optimistisk 
   * status til brukeren
   */
  const onMellomlagreClick = async () => {
    await lagreDokumentdata({ ...dokumentdata, FRITEKSTBREV: { brødtekst, overskrift } });
    setOriginalBrev(brevTilStreng(overskrift, brødtekst));
  }

  /**
   * Original streng for å se om innholdet i feltene har endret seg
   */
  useEffect(() => {
    if (dokumentdata) {
      setOriginalBrev(`${dokumentdata.FRITEKSTBREV?.overskrift}-${dokumentdata.FRITEKSTBREV?.brødtekst}`);
    } else {
      setOriginalBrev("-");
    }
  }, [])

  /**
   * Følg med på endringer i overskrift og brødtekst, og se om innholdet er endret
   */
  useEffect(() => {
    if (originalBrev !== undefined && originalBrev !== brevTilStreng(overskrift, brødtekst)) {
      setErTekstEndret(true);
      setErTekstLik(false);
    } else {
      setErTekstLik(true);
    }
  }, [originalBrev, overskrift, brødtekst])

  return (<>
    {erTekstEndret && (
      <Row>
        <Column xs="12">
          {!erTekstLik && (<>
            <VerticalSpacer sixteenPx />
            <AlertStripe type="advarsel" form="inline">
              {intl.formatMessage({ id: 'VedtakForm.FritekstBrevIkkeLagret' })}
            </AlertStripe>
            <VerticalSpacer sixteenPx />
            <Knapp
              htmlType="button"
              kompakt
              mini
              onClick={onMellomlagreClick}
              disabled={erTekstLik}
            >
              {intl.formatMessage({ id: 'VedtakForm.FritekstBrevLagre' })}</Knapp>
            <VerticalSpacer sixteenPx />
          </>
          )}
          {erTekstLik && (
            <>
              <VerticalSpacer sixteenPx />
              <AlertStripe type="suksess" form="inline">{intl.formatMessage({ id: 'VedtakForm.FritekstBrevLagret' })}</AlertStripe>
              <VerticalSpacer sixteenPx />
            </>
          )}
        </Column>
      </Row>
    )}
  </>
  )
}

export default injectIntl(MellomLagreBrev);