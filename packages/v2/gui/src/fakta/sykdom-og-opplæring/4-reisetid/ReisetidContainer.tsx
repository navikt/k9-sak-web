import type { ReisetidVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import ReisetidForm from './ReisetidForm';
import { Period } from '@navikt/ft-utils';
import ReisetidFerdigvisning from './ReisetidFerdigvisning';
import DetailView from '../../../shared/detail-view/DetailView';
import { BodyLong, Label } from '@navikt/ds-react';
import { PersonFillIcon, CalendarIcon } from '@navikt/aksel-icons';

const ReisetidContainer = ({ vurdering }: { vurdering: ReisetidVurderingDto & { perioder: Period[] } }) => {
  if (vurdering.reisetid.resultat === 'MÅ_VURDERES') {
    return (
      <Wrapper vurdering={vurdering}>
        <ReisetidForm vurdering={vurdering} />
      </Wrapper>
    );
  }
  return (
    <Wrapper vurdering={vurdering}>
      <ReisetidFerdigvisning vurdering={vurdering} />
    </Wrapper>
  );
};

const Wrapper = ({
  children,
  vurdering,
}: {
  children: React.ReactNode;
  vurdering: ReisetidVurderingDto & { perioder: Period[] };
}) => {
  return (
    <DetailView title="Vurdering av reisetid">
      <div data-testid="Periode" className="flex gap-2">
        <Description vurdering={vurdering} />
      </div>
      <div className="border-none bg-border-subtle h-[2px] mt-4" />
      <div className="mt-6">{children}</div>
    </DetailView>
  );
};

const Description = ({ vurdering }: { vurdering: ReisetidVurderingDto & { perioder: Period[] } }) => {
  if (!vurdering.informasjonFraSøker.reisetidPeriodeOppgittISøknad) {
    return (
      <div className="flex gap-2 mt-2.5">
        <CalendarIcon fontSize="24" /> {vurdering.perioder[0]?.prettifyPeriod()}
      </div>
    );
  }
  const oppgittReisedager = vurdering.informasjonFraSøker.reisetidPeriodeOppgittISøknad;
  const oppgittReisedagerPeriod = new Period(oppgittReisedager.fom, oppgittReisedager.tom);

  const tekst =
    oppgittReisedagerPeriod.asListOfDays().length > 1
      ? `Beskrivelse fra søker for reisetid i perioden ${oppgittReisedagerPeriod.prettifyPeriod()}`
      : `Beskrivelse fra søker for reisetid ${oppgittReisedagerPeriod.prettifyPeriod().split(' - ')[0]}`;
  return (
    <div className="flex gap-2 mt-2.5">
      <div>
        <PersonFillIcon fontSize="24" />
      </div>
      <div>
        <Label>{tekst}</Label>
        <div>
          <BodyLong>{vurdering.informasjonFraSøker?.beskrivelseFraSøker}</BodyLong>
        </div>
      </div>
    </div>
  );
};

export default ReisetidContainer;
