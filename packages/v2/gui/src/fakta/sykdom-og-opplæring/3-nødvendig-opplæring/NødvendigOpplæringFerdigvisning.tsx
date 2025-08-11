import {
  OpplæringVurderingDtoAvslagsårsak,
  OpplæringVurderingDtoResultat,
  type OpplæringVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { Alert, BodyShort } from '@navikt/ds-react';
import { LabelledContent } from '../../../shared/labelled-content/LabelledContent';
import { Lovreferanse } from '../../../shared/lovreferanse/Lovreferanse';
import { VurdertAv } from '../../../shared/vurdert-av/VurdertAv';
import { K9KodeverkoppslagContext } from '../../../kodeverk/oppslag/K9KodeverkoppslagContext';
import { useContext } from 'react';

const NødvendigOpplæringFerdigvisning = ({ vurdering }: { vurdering: OpplæringVurderingDto }) => {
  if (vurdering.resultat === OpplæringVurderingDtoResultat.VURDERES_SOM_REISETID) {
    return (
      <Alert variant="info" size="small">
        Dag eller periode er flyttet til vurdering av reisetid.
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <LabelledContent
        label="Er nødvendig opplæring dokumentert med legeerklæring?"
        size="small"
        content={
          <BodyShort size="small">
            {vurdering.resultat === OpplæringVurderingDtoResultat.GODKJENT ? 'Ja' : 'Nei'}
          </BodyShort>
        }
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
        content={
          <BodyShort size="small">
            {vurdering.resultat === OpplæringVurderingDtoResultat.GODKJENT ? 'Ja' : 'Nei'}
          </BodyShort>
        }
      />
      {vurdering.avslagsårsak && vurdering.avslagsårsak !== OpplæringVurderingDtoAvslagsårsak.UDEFINERT && (
        <LabelledContent
          label="Avslagsårsak"
          size="small"
          content={<AvslagårsakTekst avslagsårsak={vurdering.avslagsårsak} />}
        />
      )}
    </div>
  );
};

const AvslagårsakTekst = ({ avslagsårsak }: { avslagsårsak: OpplæringVurderingDtoAvslagsårsak }) => {
  const k9Kodeverkoppslag = useContext(K9KodeverkoppslagContext);
  if (!avslagsårsak) {
    return null;
  }
  return <BodyShort size="small">{(k9Kodeverkoppslag as any).k9sak.avslagsårsaker(avslagsårsak).navn}</BodyShort>;
};

export default NødvendigOpplæringFerdigvisning;
