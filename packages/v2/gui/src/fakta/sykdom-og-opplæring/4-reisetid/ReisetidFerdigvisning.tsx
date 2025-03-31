import type { ReisetidVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import OppgittReisetid from './OppgittReisetid';
import type { Period } from '@navikt/ft-utils';
import { LabelledContent } from '../../../shared/LabelledContent/LabelledContent';
import { BodyLong } from '@navikt/ds-react';
import { VurdertAv } from '../../../shared/vurdert-av/VurdertAv';
import { resultatTilJaNei } from './utils';

const ReisetidFerdigvisning = ({ vurdering }: { vurdering: ReisetidVurderingDto & { perioder: Period[] } }) => {
  const vurderingGjelderEnkeltdag = vurdering.perioder[0]?.asListOfDays().length === 1;
  const innvilgesEllerAvslås = vurdering.reisetid.resultat === 'GODKJENT' ? 'innvilges' : 'avslås';
  return (
    <div className="flex flex-col gap-6">
      <OppgittReisetid reisedagerOppgittISøknad={vurdering.informasjonFraSøker.reisetidPeriodeOppgittISøknad} />
      <div>
        <LabelledContent label="Vurdering" indentContent={true}>
          <BodyLong className="whitespace-pre-wrap">{vurdering.reisetid.begrunnelse}</BodyLong>
        </LabelledContent>
        <VurdertAv ident={vurdering.reisetid.vurdertAv} date={vurdering.reisetid.vurdertTidspunkt} />
      </div>
      <LabelledContent label={vurderingGjelderEnkeltdag ? 'Innvilges reisedag?' : 'Innvilges reisedager?'}>
        <BodyLong className="capitalize">{resultatTilJaNei(vurdering.reisetid.resultat)}</BodyLong>
      </LabelledContent>
      {!vurderingGjelderEnkeltdag && (
        <LabelledContent label={`I hvilken periode ${innvilgesEllerAvslås} reisetid?`}>
          <BodyLong>{vurdering.perioder[0]?.prettifyPeriod()}</BodyLong>
        </LabelledContent>
      )}
    </div>
  );
};

export default ReisetidFerdigvisning;
