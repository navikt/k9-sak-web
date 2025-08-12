import type { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringVurderingDto as OpplæringVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import { BodyShort } from '@navikt/ds-react';
import type { Period } from '@navikt/ft-utils';
import { LabelledContent } from '../../../shared/labelled-content/LabelledContent';
import { Lovreferanse } from '../../../shared/lovreferanse/Lovreferanse';
import { VurdertAv } from '../../../shared/vurdert-av/VurdertAv';
const NødvendigOpplæringFerdigvisning = ({
  vurdering,
}: {
  vurdering: OpplæringVurderingDto & { perioder: Period[] };
}) => {
  return (
    <div className="flex flex-col gap-6">
      <LabelledContent
        label="Er nødvendig opplæring dokumentert med legeerklæring?"
        size="small"
        content={<BodyShort size="small">{vurdering.dokumentertOpplæring ? 'Ja' : 'Nei'}</BodyShort>}
      />
      <div>
        <LabelledContent
          label={
            <>
              Vurder om opplæringen er nødvendig for at søker skal kunne ta seg av og behandle barnet etter
              <Lovreferanse> § 9-14</Lovreferanse>
            </>
          }
          indentContent
          size="small"
          content={
            vurdering.begrunnelse && (
              <BodyShort size="small" className="whitespace-pre-wrap">
                {vurdering.begrunnelse}
              </BodyShort>
            )
          }
        />
        <VurdertAv ident={vurdering.vurdertAv} date={vurdering.vurdertTidspunkt} size="small" />
      </div>
      <LabelledContent
        label="Har søker hatt opplæring som er nødvendig for å kunne ta seg av og behandle barnet?"
        size="small"
        content={<BodyShort size="small">{vurdering.nødvendigOpplæring ? 'Ja' : 'Nei'}</BodyShort>}
      />
    </div>
  );
};

export default NødvendigOpplæringFerdigvisning;
