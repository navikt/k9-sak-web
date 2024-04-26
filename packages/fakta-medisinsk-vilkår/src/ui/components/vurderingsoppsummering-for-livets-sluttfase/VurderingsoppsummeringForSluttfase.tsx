import React from 'react';
import { Box, Margin, BasicList, LabelledContent, AssessedBy } from '@navikt/ft-plattform-komponenter';
import { useSaksbehandlerOppslag } from 'shared-components';
import Vurdering from '../../../types/Vurdering';
import DokumentLink from '../dokument-link/DokumentLink';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import DekketAvInnleggelsesperiodeMelding from '../dekket-av-innleggelsesperiode-melding/DekketAvInnleggelsesperiodeMelding';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';

interface VurderingsoppsummeringForSluttfaseProps {
  vurdering: Vurdering;
  redigerVurdering: () => void;
  erInnleggelsesperiode: boolean;
}

const VurderingsoppsummeringForSluttfase = ({
  vurdering,
  redigerVurdering,
  erInnleggelsesperiode,
}: VurderingsoppsummeringForSluttfaseProps): JSX.Element => {
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();

  const gjeldendeVurdering = vurdering.versjoner[0];
  const { dokumenter, perioder, tekst, resultat } = gjeldendeVurdering;
  const brukerId = gjeldendeVurdering.endretAv;

  return (
    <DetailViewVurdering
      title="Vurdering av livets sluttfase"
      perioder={perioder}
      redigerVurdering={!erInnleggelsesperiode ? redigerVurdering : null}
    >
      <Box marginTop={Margin.large}>
        {erInnleggelsesperiode && <DekketAvInnleggelsesperiodeMelding />}
        <Box marginTop={Margin.medium}>
          <LabelledContent
            label="Hvilke dokumenter er brukt i vurderingen om livets sluttfase?"
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
            label="Er/var den pleietrengende i livets sluttfase?"
            content={<span>{resultat === Vurderingsresultat.OPPFYLT ? 'Ja' : 'Nei'}</span>}
          />
        </Box>
        <Box marginTop={Margin.xLarge}>
          <LabelledContent
            label="Skriv begrunnelsen for at den pleietrengende er/var i livets sluttfase etter § 9-13."
            content={<span>{tekst}</span>}
            indentContent
          />
          <AssessedBy name={hentSaksbehandlerNavn(brukerId)} date={gjeldendeVurdering?.endretTidspunkt} />
        </Box>
      </Box>
    </DetailViewVurdering>
  );
};

export default VurderingsoppsummeringForSluttfase;
