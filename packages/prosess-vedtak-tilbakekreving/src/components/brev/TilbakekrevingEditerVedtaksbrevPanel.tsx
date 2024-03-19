import { ExpansionCard, Heading } from '@navikt/ds-react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import underavsnittType from '../../kodeverk/avsnittType';
import VedtaksbrevAvsnitt from '../../types/vedtaksbrevAvsnittTsType';
import TilbakekrevingVedtakUtdypendeTekstPanel from './TilbakekrevingVedtakUtdypendeTekstPanel';

import styles from './tilbakekrevingEditerVedtaksbrevPanel.module.css';

interface OwnProps {
  vedtaksbrevAvsnitt: VedtaksbrevAvsnitt[];
  formName: string;
  readOnly: boolean;
  behandlingId: number;
  behandlingVersjon: number;
  perioderSomIkkeHarUtfyltObligatoriskVerdi: string[];
  fritekstOppsummeringPakrevdMenIkkeUtfylt?: boolean;
  erRevurderingTilbakekrevingFeilBeløpBortfalt?: boolean;
}

const TilbakekrevingEditerVedtaksbrevPanel = ({
  vedtaksbrevAvsnitt,
  formName,
  readOnly,
  behandlingId,
  behandlingVersjon,
  perioderSomIkkeHarUtfyltObligatoriskVerdi,
  fritekstOppsummeringPakrevdMenIkkeUtfylt = false,
  erRevurderingTilbakekrevingFeilBeløpBortfalt,
}: OwnProps) => (
  <div className={styles.container}>
    <VerticalSpacer twentyPx />
    <Heading size="small" level="2">
      <FormattedMessage id="TilbakekrevingVedtak.Vedtaksbrev" />
    </Heading>
    <VerticalSpacer eightPx />
    {vedtaksbrevAvsnitt.map((avsnitt: VedtaksbrevAvsnitt) => {
      const underavsnitter = avsnitt.underavsnittsliste;
      const periode = `${avsnitt.fom}_${avsnitt.tom}`;
      const harPeriodeSomManglerObligatoriskVerdi = perioderSomIkkeHarUtfyltObligatoriskVerdi.some(p => p === periode);
      const visApen =
        avsnitt.avsnittstype === underavsnittType.OPPSUMMERING && fritekstOppsummeringPakrevdMenIkkeUtfylt;
      return (
        <React.Fragment key={avsnitt.avsnittstype + avsnitt.fom}>
          <ExpansionCard
            size="small"
            aria-label={avsnitt.overskrift}
            className={harPeriodeSomManglerObligatoriskVerdi || visApen ? styles.panelMedGulmarkering : ''}
            defaultOpen={harPeriodeSomManglerObligatoriskVerdi || visApen}
          >
            <ExpansionCard.Header>
              <ExpansionCard.Title size="small">
                {avsnitt.overskrift ? (
                  avsnitt.overskrift
                ) : (
                  <FormattedMessage id="TilbakekrevingEditerVedtaksbrevPanel.LovhjemlerOgKlagerettOverskrift" />
                )}
              </ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
              {underavsnitter.map((underavsnitt: any) => (
                <React.Fragment key={underavsnitt.underavsnittstype + underavsnitt.overskrift + underavsnitt.brødtekst}>
                  {underavsnitt.overskrift && <Element>{underavsnitt.overskrift}</Element>}
                  {underavsnitt.brødtekst && <Normaltekst>{underavsnitt.brødtekst}</Normaltekst>}
                  {underavsnitt.fritekstTillatt && (
                    <>
                      <VerticalSpacer eightPx />
                      <TilbakekrevingVedtakUtdypendeTekstPanel
                        type={
                          underavsnitt.underavsnittstype
                            ? `${periode}.${underavsnitt.underavsnittstype}`
                            : avsnitt.avsnittstype
                        }
                        formName={formName}
                        readOnly={readOnly}
                        behandlingId={behandlingId}
                        behandlingVersjon={behandlingVersjon}
                        fritekstPakrevet={underavsnitt.fritekstPåkrevet}
                        maximumLength={erRevurderingTilbakekrevingFeilBeløpBortfalt ? 10000 : null}
                      />
                    </>
                  )}
                  <VerticalSpacer eightPx />
                </React.Fragment>
              ))}
            </ExpansionCard.Content>
          </ExpansionCard>
          <VerticalSpacer eightPx />
        </React.Fragment>
      );
    })}
  </div>
);

TilbakekrevingEditerVedtaksbrevPanel.buildInitialValues = (vedtaksbrevAvsnitt: VedtaksbrevAvsnitt[]) =>
  vedtaksbrevAvsnitt
    .filter((avsnitt: VedtaksbrevAvsnitt) =>
      avsnitt.underavsnittsliste.some((underavsnitt: any) => underavsnitt.fritekst),
    )
    .reduce((acc: any, avsnitt: VedtaksbrevAvsnitt) => {
      const underavsnitter = avsnitt.underavsnittsliste;
      const friteksterForUnderavsnitt = underavsnitter
        .filter((underavsnitt: any) => underavsnitt.fritekst)
        .reduce(
          (underAcc: any, underavsnitt: any) => ({
            ...underAcc,
            [underavsnitt.underavsnittstype ? underavsnitt.underavsnittstype : avsnitt.avsnittstype]: decodeHtmlEntity(
              underavsnitt.fritekst,
            ),
          }),
          {},
        );

      const nyeFritekster = avsnitt.fom
        ? { [`${avsnitt.fom}_${avsnitt.tom}`]: friteksterForUnderavsnitt }
        : friteksterForUnderavsnitt;

      return { ...acc, ...nyeFritekster };
    }, {});

export default TilbakekrevingEditerVedtaksbrevPanel;
