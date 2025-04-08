import { BasicList } from '@k9-sak-web/gui/shared/basicList/BasicList.js';
import { LabelledContent } from '@k9-sak-web/gui/shared/labelledContent/LabelledContent.js';
import { Box } from '@navikt/ds-react';
import { AssessedBy } from '@navikt/ft-plattform-komponenter';
import { type JSX } from 'react';
import Vurdering from '../../../types/Vurdering';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';
import DokumentLink from '../dokument-link/DokumentLink';

interface VurderingsoppsummeringLangvarigSykdom {
  vurdering: Vurdering;
  redigerVurdering: () => void;
}

const VurderingsoppsummeringLangvarigSykdom = ({
  vurdering,
  redigerVurdering,
}: VurderingsoppsummeringLangvarigSykdom): JSX.Element => {
  const gjeldendeVurdering = vurdering.versjoner[0];
  const { dokumenter, perioder, tekst, resultat } = gjeldendeVurdering;
  const brukerId = gjeldendeVurdering.endretAv;

  return (
    <DetailViewVurdering title="Vurdering av langvarig sykdom" perioder={perioder} redigerVurdering={redigerVurdering}>
      <Box marginBlock="6 0">
        <Box marginBlock="4 0">
          <LabelledContent
            label="Hvilke dokumenter er brukt i vurderingen om sykdom?"
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
            // eslint-disable-next-line max-len
            label="Gjør en vurdering av om den pleietrengende har en funksjonshemning eller en langvarig sykdom antatt å være i mer enn ett år som følge av § 9-14."
            content={<span className="whitespace-pre-wrap">{tekst}</span>}
            indentContent
          />
          <AssessedBy ident={brukerId} date={gjeldendeVurdering?.endretTidspunkt} />
        </Box>
        <Box marginBlock="8 0">
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
