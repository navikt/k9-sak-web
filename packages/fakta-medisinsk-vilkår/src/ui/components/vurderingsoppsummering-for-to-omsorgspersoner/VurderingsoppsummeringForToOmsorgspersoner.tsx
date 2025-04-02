import React, { type JSX } from 'react';
import { Box, Margin, BasicList, LabelledContent } from '@navikt/ft-plattform-komponenter';
import Vurdering from '../../../types/Vurdering';
import DokumentLink from '../dokument-link/DokumentLink';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import DekketAvInnleggelsesperiodeMelding from '../dekket-av-innleggelsesperiode-melding/DekketAvInnleggelsesperiodeMelding';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';
import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';

interface VurderingsoppsummeringForToOmsorgspersonerProps {
  vurdering: Vurdering;
  redigerVurdering: () => void;
  erInnleggelsesperiode: boolean;
}

const VurderingsoppsummeringForToOmsorgspersoner = ({
  vurdering,
  redigerVurdering,
  erInnleggelsesperiode,
}: VurderingsoppsummeringForToOmsorgspersonerProps): JSX.Element => {
  const gjeldendeVurdering = vurdering.versjoner[0];
  const { resultat, tekst, dokumenter, perioder } = gjeldendeVurdering;
  const brukerId = gjeldendeVurdering.endretAv;

  return (
    <DetailViewVurdering
      title="Vurdering av to omsorgspersoner"
      perioder={perioder}
      redigerVurdering={!erInnleggelsesperiode ? redigerVurdering : null}
    >
      <Box marginTop={Margin.large}>
        {erInnleggelsesperiode && <DekketAvInnleggelsesperiodeMelding />}
        <Box marginTop={Margin.medium}>
          <LabelledContent
            label="Hvilke dokumenter er brukt i vurderingen av behov for to omsorgspersoner samtidig?"
            content={
              <BasicList
                elements={dokumenter
                  .filter(({ benyttet }) => benyttet)
                  .map(dokument => (
                    <DokumentLink dokument={dokument} visDokumentIkon />
                  ))}
              />
            }
          />
        </Box>
        <Box marginTop={Margin.xLarge}>
          <LabelledContent
            label="Gjør en vurdering av om det er behov for to omsorgspersoner samtidig etter § 9-10, andre ledd."
            content={<span className="whitespace-pre-wrap">{tekst}</span>}
            indentContent
          />
          <VurdertAv ident={brukerId} date={gjeldendeVurdering?.endretTidspunkt} />
        </Box>
        <Box marginTop={Margin.xLarge}>
          <LabelledContent
            label="Er det behov for to omsorgspersoner samtidig?"
            content={<span>{resultat === Vurderingsresultat.OPPFYLT ? 'Ja' : 'Nei'}</span>}
          />
        </Box>
        <Box marginTop={Margin.xLarge}>
          <LabelledContent
            label="Perioder vurdert"
            content={
              <ul style={{ margin: 0, listStyleType: 'none', padding: 0 }}>
                {perioder.map(period => {
                  const prettyPeriod = period.prettifyPeriod();
                  return <li key={prettyPeriod}>{prettyPeriod}</li>;
                })}
              </ul>
            }
          />
        </Box>
      </Box>
    </DetailViewVurdering>
  );
};

export default VurderingsoppsummeringForToOmsorgspersoner;
