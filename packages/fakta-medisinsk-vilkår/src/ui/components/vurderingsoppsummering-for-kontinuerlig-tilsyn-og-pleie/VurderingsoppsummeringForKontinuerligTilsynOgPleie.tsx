import React from 'react';
import { Box, Margin, BasicList, LabelledContent, AssessedBy } from '@navikt/ft-plattform-komponenter';
import { useSaksbehandlerOppslag } from '@fpsak-frontend/shared-components';
import Vurdering from '../../../types/Vurdering';
import DokumentLink from '../dokument-link/DokumentLink';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import DekketAvInnleggelsesperiodeMelding from '../dekket-av-innleggelsesperiode-melding/DekketAvInnleggelsesperiodeMelding';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';

interface VurderingsoppsummeringForKontinuerligTilsynOgPleieProps {
  vurdering: Vurdering;
  redigerVurdering: () => void;
  erInnleggelsesperiode: boolean;
}

const VurderingsoppsummeringForKontinuerligTilsynOgPleie = ({
  vurdering,
  redigerVurdering,
  erInnleggelsesperiode,
}: VurderingsoppsummeringForKontinuerligTilsynOgPleieProps): JSX.Element => {
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();

  const gjeldendeVurdering = vurdering.versjoner[0];
  const { dokumenter, perioder, tekst, resultat } = gjeldendeVurdering;
  const brukerId = gjeldendeVurdering.endretAv;

  return (
    <DetailViewVurdering
      title="Vurdering av tilsyn og pleie"
      perioder={perioder}
      redigerVurdering={!erInnleggelsesperiode ? redigerVurdering : null}
    >
      <Box marginTop={Margin.large}>
        {erInnleggelsesperiode && <DekketAvInnleggelsesperiodeMelding />}
        <Box marginTop={Margin.medium}>
          <LabelledContent
            label="Hvilke dokumenter er brukt i vurderingen av tilsyn og pleie?"
            content={
              <Box marginTop={Margin.medium}>
                <BasicList
                  elements={dokumenter
                    .filter(({ benyttet }) => benyttet)
                    .map(dokument => (
                      <DokumentLink dokument={dokument} visDokumentIkon />
                    ))}
                />
              </Box>
            }
          />
        </Box>
        <Box marginTop={Margin.xLarge}>
          <LabelledContent
            label="Gjør en vurdering av om det er behov for kontinuerlig tilsyn og pleie som følge
                                        av sykdommen etter § 9-10, første ledd."
            content={<span className="whitespace-pre-wrap">{tekst}</span>}
            indentContent
          />
          <AssessedBy name={hentSaksbehandlerNavn(brukerId)} date={gjeldendeVurdering?.endretTidspunkt} />
        </Box>
        <Box marginTop={Margin.xLarge}>
          <LabelledContent
            label="Er det behov for tilsyn og pleie?"
            content={<span>{resultat === Vurderingsresultat.OPPFYLT ? 'Ja' : 'Nei'}</span>}
          />
        </Box>
        <Box marginTop={Margin.xLarge}>
          <LabelledContent
            label={resultat === Vurderingsresultat.OPPFYLT ? 'Perioder innvilget' : 'Perioder avslått'}
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

export default VurderingsoppsummeringForKontinuerligTilsynOgPleie;
