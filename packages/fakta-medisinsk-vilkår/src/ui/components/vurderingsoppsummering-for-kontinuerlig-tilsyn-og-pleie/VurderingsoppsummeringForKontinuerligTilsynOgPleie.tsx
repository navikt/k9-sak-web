import { BasicList } from '@k9-sak-web/gui/shared/basicList/BasicList.js';
import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { Alert, BodyShort, Box } from '@navikt/ds-react';
import { type JSX } from 'react';
import Vurdering from '../../../types/Vurdering';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import DekketAvInnleggelsesperiodeMelding from '../dekket-av-innleggelsesperiode-melding/DekketAvInnleggelsesperiodeMelding';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';
import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';
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
  const { dokumenter, perioder, tekst, resultat, manglerLegeerklæring } = gjeldendeVurdering;
  const brukerId = gjeldendeVurdering.endretAv;

  return (
    <DetailViewVurdering
      title="Vurdering av tilsyn og pleie"
      perioder={perioder}
      redigerVurdering={!erInnleggelsesperiode ? redigerVurdering : undefined}
    >
      <Box marginBlock="6 0">
        {erInnleggelsesperiode && <DekketAvInnleggelsesperiodeMelding />}
        {!manglerLegeerklæring && (
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
        )}

        {manglerLegeerklæring && (
          <Alert inline variant="error" size="small">
            Det foreligger ikke legeerklæring for perioden - vurdering av tilsyn og pleie er ikke gjennomført.
          </Alert>
        )}
        <Box marginBlock="8 0">
          {!manglerLegeerklæring && (
            <LabelledContent
              label="Gjør en vurdering av om det er behov for kontinuerlig tilsyn og pleie som følge
            av sykdommen etter § 9-10, første ledd."
              content={<span className="whitespace-pre-wrap">{tekst}</span>}
              indentContent
              size="small"
            />
          )}
          <VurdertAv ident={brukerId} date={gjeldendeVurdering?.endretTidspunkt} size="small" />
        </Box>

        {!manglerLegeerklæring && (
          <Box marginBlock="8 0">
            <LabelledContent
              size="small"
              label="Er det behov for tilsyn og pleie?"
              content={<span>{resultat === Vurderingsresultat.OPPFYLT ? 'Ja' : 'Nei'}</span>}
            />
          </Box>
        )}

        <Box marginBlock="8 0">
          <LabelledContent
            label={resultat === Vurderingsresultat.OPPFYLT ? 'Perioder innvilget' : 'Perioder avslått'}
            size="small"
            content={
              <ul style={{ margin: 0, listStyleType: 'none', padding: 0 }}>
                {perioder.map(period => {
                  const prettyPeriod = period.prettifyPeriod();
                  return (
                    <li key={prettyPeriod}>
                      <BodyShort size="small">{prettyPeriod}</BodyShort>
                    </li>
                  );
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
