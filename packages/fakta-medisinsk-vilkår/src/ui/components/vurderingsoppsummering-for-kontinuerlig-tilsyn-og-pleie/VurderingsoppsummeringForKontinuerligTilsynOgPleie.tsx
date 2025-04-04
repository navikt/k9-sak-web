import { LabelledContent } from '@k9-sak-web/gui/shared/labelledContent/LabelledContent.js';
import { Box } from '@navikt/ds-react';
import { AssessedBy, BasicList } from '@navikt/ft-plattform-komponenter';
import { type JSX } from 'react';
import Vurdering from '../../../types/Vurdering';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import DekketAvInnleggelsesperiodeMelding from '../dekket-av-innleggelsesperiode-melding/DekketAvInnleggelsesperiodeMelding';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';
import DokumentLink from '../dokument-link/DokumentLink';

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
  const gjeldendeVurdering = vurdering.versjoner[0];
  const { dokumenter, perioder, tekst, resultat } = gjeldendeVurdering;
  const brukerId = gjeldendeVurdering.endretAv;

  return (
    <DetailViewVurdering
      title="Vurdering av tilsyn og pleie"
      perioder={perioder}
      redigerVurdering={!erInnleggelsesperiode ? redigerVurdering : null}
    >
      <Box marginBlock="6 0">
        {erInnleggelsesperiode && <DekketAvInnleggelsesperiodeMelding />}
        <Box marginBlock="4 0">
          <LabelledContent
            label="Hvilke dokumenter er brukt i vurderingen av tilsyn og pleie?"
            content={
              <Box marginBlock="4 0">
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
        <Box marginBlock="8 0">
          <LabelledContent
            label="Gjør en vurdering av om det er behov for kontinuerlig tilsyn og pleie som følge
                                        av sykdommen etter § 9-10, første ledd."
            content={<span className="whitespace-pre-wrap">{tekst}</span>}
            indentContent
          />
          <AssessedBy ident={brukerId} date={gjeldendeVurdering?.endretTidspunkt} />
        </Box>
        <Box marginBlock="8 0">
          <LabelledContent
            label="Er det behov for tilsyn og pleie?"
            content={<span>{resultat === Vurderingsresultat.OPPFYLT ? 'Ja' : 'Nei'}</span>}
          />
        </Box>
        <Box marginBlock="8 0">
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
