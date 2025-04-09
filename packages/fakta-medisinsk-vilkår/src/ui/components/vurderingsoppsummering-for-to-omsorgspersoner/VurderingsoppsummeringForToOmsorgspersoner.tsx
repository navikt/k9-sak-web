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
      <Box marginBlock="6 0">
        {erInnleggelsesperiode && <DekketAvInnleggelsesperiodeMelding />}
        <Box marginBlock="4 0">
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
        <Box marginBlock="8 0">
          <LabelledContent
            label="Gjør en vurdering av om det er behov for to omsorgspersoner samtidig etter § 9-10, andre ledd."
            content={<span className="whitespace-pre-wrap">{tekst}</span>}
            indentContent
          />
          <VurdertAv ident={brukerId} date={gjeldendeVurdering?.endretTidspunkt} />
        </Box>
        <Box marginBlock="8 0">
          <LabelledContent
            label="Er det behov for to omsorgspersoner samtidig?"
            content={<span>{resultat === Vurderingsresultat.OPPFYLT ? 'Ja' : 'Nei'}</span>}
          />
        </Box>
        <Box marginBlock="8 0">
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
