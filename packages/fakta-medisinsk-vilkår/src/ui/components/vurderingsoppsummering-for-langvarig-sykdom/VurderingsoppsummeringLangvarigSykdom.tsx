import React from 'react';
import { Box, Margin, BasicList, LabelledContent, AssessedBy } from '@navikt/ft-plattform-komponenter';
import { useSaksbehandlerOppslag } from '@fpsak-frontend/shared-components';
import Vurdering from '../../../types/Vurdering';
import DokumentLink from '../dokument-link/DokumentLink';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';

interface VurderingsoppsummeringLangvarigSykdom {
  vurdering: Vurdering;
  redigerVurdering: () => void;
}

const VurderingsoppsummeringLangvarigSykdom = ({
  vurdering,
  redigerVurdering,
}: VurderingsoppsummeringLangvarigSykdom): JSX.Element => {
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();

  const gjeldendeVurdering = vurdering.versjoner[0];
  const { dokumenter, perioder, tekst, resultat } = gjeldendeVurdering;
  const brukerId = gjeldendeVurdering.endretAv;

  return (
    <DetailViewVurdering title="Vurdering av langvarig sykdom" perioder={perioder} redigerVurdering={redigerVurdering}>
      <Box marginTop={Margin.large}>
        <Box marginTop={Margin.medium}>
          <LabelledContent
            label="Hvilke dokumenter er brukt i vurderingen om sykdom?"
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
            // eslint-disable-next-line max-len
            label="Gjør en vurdering av om den pleietrengende har en funksjonshemning eller en langvarig sykdom antatt å være i mer enn ett år som følge av § 9-14."
            content={<span>{tekst}</span>}
            indentContent
          />
          <AssessedBy name={hentSaksbehandlerNavn(brukerId)} date={gjeldendeVurdering?.endretTidspunkt} />
        </Box>
        <Box marginTop={Margin.xLarge}>
          <LabelledContent
            label="Har den pleietrengende en langvarig sykdom?"
            content={<span>{resultat === Vurderingsresultat.OPPFYLT ? 'Ja' : 'Nei'}</span>}
          />
        </Box>
      </Box>
    </DetailViewVurdering>
  );
};

export default VurderingsoppsummeringLangvarigSykdom;
