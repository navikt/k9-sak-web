import type { sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidVurderingDto as ReisetidVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import ReisetidForm from './ReisetidForm';
import { Period } from '@navikt/ft-utils';
import ReisetidFerdigvisning from './ReisetidFerdigvisning';
import DetailView from '../../../shared/detailView/DetailView';
import { BodyLong, BodyShort, Button, Label } from '@navikt/ds-react';
import { PersonFillIcon, CalendarIcon, PencilIcon } from '@navikt/aksel-icons';
import { useState, useContext, useEffect } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
const ReisetidContainer = ({ vurdering }: { vurdering: ReisetidVurderingDto & { perioder: Period[] } }) => {
  const [redigering, setRedigering] = useState(false);

  useEffect(() => {
    if (redigering) {
      setRedigering(false);
    }
  }, [vurdering.perioder]);

  if (vurdering.reisetid.resultat === 'MÅ_VURDERES' || redigering) {
    return (
      <Wrapper vurdering={vurdering} setRedigering={setRedigering} redigering={redigering}>
        <ReisetidForm vurdering={vurdering} setRedigering={setRedigering} redigering={redigering} />
      </Wrapper>
    );
  }
  return (
    <Wrapper vurdering={vurdering} setRedigering={setRedigering} redigering={redigering}>
      <ReisetidFerdigvisning vurdering={vurdering} />
    </Wrapper>
  );
};

const Wrapper = ({
  children,
  vurdering,
  setRedigering,
  redigering,
}: {
  children: React.ReactNode;
  vurdering: ReisetidVurderingDto & { perioder: Period[] };
  setRedigering: React.Dispatch<React.SetStateAction<boolean>>;
  redigering: boolean;
}) => {
  const { readOnly } = useContext(SykdomOgOpplæringContext);
  const reisetidBeskrivelse = (
    <div data-testid="Periode" className="flex gap-2">
      <Description vurdering={vurdering} />
    </div>
  );
  return (
    <DetailView
      title="Vurdering av reisetid"
      border
      contentAfterTitleRenderer={() => {
        if (vurdering.reisetid.resultat === 'MÅ_VURDERES' || redigering || readOnly) {
          return null;
        }
        return (
          <Button variant="tertiary" size="small" icon={<PencilIcon />} onClick={() => setRedigering(v => !v)}>
            Rediger vurdering
          </Button>
        );
      }}
      belowTitleContent={reisetidBeskrivelse}
    >
      <div className="mt-6">{children}</div>
    </DetailView>
  );
};

const Description = ({ vurdering }: { vurdering: ReisetidVurderingDto & { perioder: Period[] } }) => {
  if (!vurdering.informasjonFraSøker.reisetidPeriodeOppgittISøknad) {
    return (
      <div className="flex gap-2 mt-2.5">
        <CalendarIcon fontSize="20" /> <BodyShort size="small">{vurdering.perioder[0]?.prettifyPeriod()}</BodyShort>
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
    <div className="flex gap-2 mt-1">
      <div className="mt-[3px]">
        <PersonFillIcon fontSize="20" />
      </div>
      <div>
        <Label size="small">{tekst}</Label>
        <div>
          <BodyLong size="small">{vurdering.informasjonFraSøker?.beskrivelseFraSøker}</BodyLong>
        </div>
      </div>
    </div>
  );
};

export default ReisetidContainer;
