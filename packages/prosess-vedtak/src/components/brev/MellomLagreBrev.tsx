import React, { useEffect, useState } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { useFormikContext } from 'formik';

import { Button } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';
import AlertStripe from 'nav-frontend-alertstriper';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DokumentDataType, LagreDokumentdataType } from '@k9-sak-web/types/src/dokumentdata';
import {
  kanHaFritekstbrev,
  kanHaManueltFritekstbrev,
  TilgjengeligeVedtaksbrev,
  TilgjengeligeVedtaksbrevMedMaler,
  VedtaksbrevMal,
} from '@fpsak-frontend/utils/src/formidlingUtils';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';

import { fieldnames } from '../../konstanter';
import { lagLagreHtmlDokumentdataRequest } from '../FritekstRedigering/RedigeringUtils';

/**
 * Noen typer brukt i denne komponenten, burde flyttes når fler av komponentene blir refaktorert til typescript
 */

interface OwnProps {
  lagreDokumentdata: LagreDokumentdataType;
  dokumentdata: DokumentDataType;
  overskrift: string;
  brødtekst: string;
  inkluderKalender: boolean;
  submitKnapp: JSX.Element;
  redigertHtml: string;
  originalHtml: string;
  tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev & TilgjengeligeVedtaksbrevMedMaler;
  editorHarLagret: boolean;
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
 * @param {string} redigertHtml
 * @returns {JSX.Element} komponenten som viser tilbakemelding og knapp for å mellomlagre
 */
const MellomLagreBrev = ({
  intl,
  lagreDokumentdata,
  dokumentdata,
  overskrift,
  brødtekst,
  redigertHtml,
  originalHtml,
  inkluderKalender,
  submitKnapp,
  tilgjengeligeVedtaksbrev,
  editorHarLagret,
}: OwnProps & WrappedComponentProps) => {
  const [originalBrev, setOriginalBrev] = useState(undefined);
  const [originalInkluderKalender, setOriginalInkluderKalender] = useState<boolean>(false);
  const [harEndringer, setHarEndringer] = useState<boolean>(false);
  const [erMellomlagret, setErMellomlagret] = useState<boolean>(false);
  const { values } = useFormikContext();

  /**
   * @param {string} overskriftStreng
   * @param {string} brødtekstStreng
   * @returns {string} Returnerer en sammenslått streng med overskrift og brødtekst, til bruk i sammenlikning
   */
  const brevTilStreng = (overskriftStreng: string, brødtekstStreng: string, redigertHtmlStreng: string) => {
    if (redigertHtmlStreng.length > 0) {
      return JSON.stringify(`${redigertHtmlStreng}`);
    }
    return `${overskriftStreng}-${brødtekstStreng}`;
  };

  /**
   * Håndter klikk på lagre knappen, send lagre kallet og oppdatert original strengen for å vise optimistisk
   * status til brukeren
   */
  const onMellomlagreClick = async event => {
    event.stopPropagation();
    if (kanHaManueltFritekstbrev(tilgjengeligeVedtaksbrev)) {
      const redigerbarDokumentmal: VedtaksbrevMal = tilgjengeligeVedtaksbrev.maler.find(
        vb => vb.dokumentMalType === dokumentMalType.MANUELL,
      );
      await lagreDokumentdata(
        lagLagreHtmlDokumentdataRequest({
          dokumentdata,
          redigerbarDokumentmal,
          redigertHtml,
          originalHtml,
          inkluderKalender,
        }),
      );
    } else if (kanHaFritekstbrev(tilgjengeligeVedtaksbrev)) {
      await lagreDokumentdata({ ...dokumentdata, FRITEKSTBREV: { brødtekst, overskrift } });
    }

    setErMellomlagret(true);
    setOriginalBrev(brevTilStreng(overskrift, brødtekst, redigertHtml));
    setOriginalInkluderKalender(inkluderKalender);
  };

  /**
   * Original streng for å se om innholdet i feltene har endret seg
   */
  useEffect(() => {
    if (dokumentdata) {
      if (dokumentdata.REDIGERTBREV) {
        setOriginalBrev(JSON.stringify(`${redigertHtml}`));
        setOriginalInkluderKalender(dokumentdata.REDIGERTBREV?.inkluderKalender);
      } else {
        setOriginalBrev(`${dokumentdata.FRITEKSTBREV?.overskrift}-${dokumentdata.FRITEKSTBREV?.brødtekst}`);
        setOriginalInkluderKalender(dokumentdata.FRITEKSTBREV.inkluderKalender);
      }
    } else {
      setOriginalBrev('-');
    }
  }, []);

  useEffect(() => {
    setOriginalBrev(brevTilStreng(overskrift, brødtekst, redigertHtml));
  }, [redigertHtml]);

  /**
   * Følg med på endringer i overskrift og brødtekst, og se om innholdet er endret
   */
  useEffect(() => {
    const brevStreng =
      overskrift === null && brødtekst === null && redigertHtml === null
        ? null
        : brevTilStreng(overskrift, brødtekst, redigertHtml);

    setHarEndringer(originalBrev !== brevStreng || originalInkluderKalender !== inkluderKalender);
  }, [originalBrev, originalInkluderKalender, overskrift, brødtekst, inkluderKalender]);

  const visningForBrevIkkeLagret = values[fieldnames.SKAL_BRUKE_OVERSTYRENDE_FRITEKST_BREV] === true;

  if (editorHarLagret && !harEndringer) {
    return (
      <>
        <VerticalSpacer sixteenPx />
        <AlertStripe type="suksess" form="inline">
          {intl.formatMessage({ id: 'VedtakForm.FritekstBrevLagret' })}
        </AlertStripe>
        {submitKnapp}
        <VerticalSpacer sixteenPx />
      </>
    );
  }

  if (erMellomlagret || harEndringer) {
    return (
      <Row>
        <Column xs="12">
          <>
            {editorHarLagret && <>Den har prøvd</>}
            {harEndringer && (
              <>
                <VerticalSpacer sixteenPx />
                {visningForBrevIkkeLagret && (
                  <>
                    <AlertStripe type="advarsel" form="inline">
                      {intl.formatMessage({ id: 'VedtakForm.FritekstBrevIkkeLagret' })}
                    </AlertStripe>
                    <VerticalSpacer sixteenPx />
                  </>
                )}
                {submitKnapp}
                {visningForBrevIkkeLagret && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={onMellomlagreClick}
                    disabled={!harEndringer}
                  >
                    {intl.formatMessage({ id: 'VedtakForm.FritekstBrevLagre' })}
                  </Button>
                )}
                <VerticalSpacer sixteenPx />
              </>
            )}

            {!harEndringer && (
              <>
                <VerticalSpacer sixteenPx />
                <AlertStripe type="suksess" form="inline">
                  {intl.formatMessage({ id: 'VedtakForm.FritekstBrevLagret' })}
                </AlertStripe>
                {submitKnapp}
                <VerticalSpacer sixteenPx />
              </>
            )}
          </>
        </Column>
      </Row>
    );
  }
  return (
    <Row>
      <Column xs="12">
        <VerticalSpacer sixteenPx />
        {submitKnapp}
        <VerticalSpacer sixteenPx />
      </Column>
    </Row>
  );
};

export default injectIntl(MellomLagreBrev);
