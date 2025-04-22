import { BasicList } from '@k9-sak-web/gui/shared/basicList/BasicList.js';
import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { Box } from '@navikt/ds-react';
import { type JSX } from 'react';
import Vurdering from '../../../types/Vurdering';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import DekketAvInnleggelsesperiodeMelding from '../dekket-av-innleggelsesperiode-melding/DekketAvInnleggelsesperiodeMelding';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';
import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';
import DokumentLink from '../dokument-link/DokumentLink';

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
  const gjeldendeVurdering = vurdering.versjoner[0];
  const { dokumenter, perioder, tekst, resultat } = gjeldendeVurdering;
  const brukerId = gjeldendeVurdering.endretAv;

  return (
    <DetailViewVurdering
      title="Vurdering av livets sluttfase"
      perioder={perioder}
      redigerVurdering={!erInnleggelsesperiode ? redigerVurdering : null}
    >
      <Box marginBlock="6 0">
        {erInnleggelsesperiode && <DekketAvInnleggelsesperiodeMelding />}
        <Box marginBlock="4 0">
          <LabelledContent
            label="Hvilke dokumenter er brukt i vurderingen om livets sluttfase?"
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
            label="Er/var den pleietrengende i livets sluttfase?"
            content={<span>{resultat === Vurderingsresultat.OPPFYLT ? 'Ja' : 'Nei'}</span>}
          />
        </Box>
        <Box marginBlock="8 0">
          <LabelledContent
            label="Skriv begrunnelsen for at den pleietrengende er/var i livets sluttfase etter § 9-13."
            content={<span className="whitespace-pre-wrap">{tekst}</span>}
            indentContent
          />
          <VurdertAv ident={brukerId} date={gjeldendeVurdering?.endretTidspunkt} />
        </Box>
      </Box>
    </DetailViewVurdering>
  );
};

export default VurderingsoppsummeringForSluttfase;
