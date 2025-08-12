import {
  OpplæringVurderingDtoAvslagsårsak,
  OpplæringVurderingDtoResultat,
  type OpplæringVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import { LabelledContent } from '../../../shared/labelled-content/LabelledContent';
import { Lovreferanse } from '../../../shared/lovreferanse/Lovreferanse';
import { VurdertAv } from '../../../shared/vurdert-av/VurdertAv';
import { K9KodeverkoppslagContext } from '../../../kodeverk/oppslag/K9KodeverkoppslagContext';
import { useContext } from 'react';
import { Periodevisning } from '../../../shared/detailView/DetailView';
import { Period } from '@navikt/ft-utils';

const NødvendigOpplæringFerdigvisning = ({
  vurdering,
}: {
  vurdering: OpplæringVurderingDto & { perioder: Period[] };
}) => {
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
        label="Har vi fått legeerklæring?"
        description="Legeerklæringen skal dokumentere om opplæringen er nødvendig for at søker skal kunne ta seg av og behandle barnet."
        size="small"
        content={
          <BodyShort size="small">
            {vurdering.resultat === OpplæringVurderingDtoResultat.GODKJENT ? 'Ja' : 'Nei'}
          </BodyShort>
        }
      />
      <div className="mt-4">
        <Heading size="small" level="2" className="!mb-0">
          Vurdering av nødvendig opplæring
        </Heading>
        <Periodevisning perioder={vurdering.perioder} />
      </div>
      <div className="border-none bg-border-subtle h-[2px]" />
      <div>
        <LabelledContent
          label={
            <>
              Vurder om opplæringen er nødvendig for at søker skal kunne ta seg av og behandle barnet etter
              <Lovreferanse> § 9-14, første ledd</Lovreferanse>
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
        label="Har søker opplæring som er nødvendig?"
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
