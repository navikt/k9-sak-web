import type { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidVurderingDto as ReisetidVurderingDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import OppgittReisetid from './OppgittReisetid';
import type { Period } from '@navikt/ft-utils';
import { LabelledContent } from '../../../shared/labelled-content/LabelledContent';
import { BodyLong, Link } from '@navikt/ds-react';
import { VurdertAv } from '../../../shared/vurdert-av/VurdertAv';
import { resultatTilJaNei } from './utils';

const ReisetidFerdigvisning = ({ vurdering }: { vurdering: ReisetidVurderingDto & { perioder: Period[] } }) => {
  const vurderingGjelderEnkeltdag = vurdering.perioder[0]?.asListOfDays().length === 1;
  const innvilgesEllerAvslås = vurdering.reisetid.resultat === 'GODKJENT' ? 'innvilges' : 'avslås';
  return (
    <div className="flex flex-col gap-6">
      <OppgittReisetid
        reisedagerOppgittISøknad={vurdering.informasjonFraSøker.reisetidPeriodeOppgittISøknad}
        size="small"
      />
      <div>
        <LabelledContent
          label="Vurder om det er nødvendig å reise en annen dag enn kursdagene"
          indentContent={true}
          size="small"
          description={
            <BodyLong size="small">
              Ta utgangspunkt i{' '}
              <Link target="_blank" href="https://lovdata.no/pro/lov/1997-02-28-19/§9-14">
                lovtekst
              </Link>{' '}
              og{' '}
              <Link target="_blank" href="https://lovdata.no/pro/#document/NAV/rundskriv/r09-00/KAPITTEL_4-5">
                rundskriv
              </Link>{' '}
              til §9-14
            </BodyLong>
          }
          content={
            <BodyLong size="small" className="whitespace-pre-wrap">
              {vurdering.reisetid.begrunnelse}
            </BodyLong>
          }
        />
        <VurdertAv ident={vurdering.reisetid.vurdertAv} date={vurdering.reisetid.vurdertTidspunkt} size="small" />
      </div>
      <LabelledContent
        label={vurderingGjelderEnkeltdag ? 'Innvilges reisedag?' : 'Innvilges reisedager?'}
        size="small"
        content={
          <BodyLong size="small" className="capitalize">
            {resultatTilJaNei(vurdering.reisetid.resultat)}
          </BodyLong>
        }
      />
      {!vurderingGjelderEnkeltdag && (
        <LabelledContent
          label={`I hvilken periode ${innvilgesEllerAvslås} reisetid?`}
          size="small"
          content={<BodyLong size="small">{vurdering.perioder[0]?.prettifyPeriod()}</BodyLong>}
        />
      )}
    </div>
  );
};

export default ReisetidFerdigvisning;
