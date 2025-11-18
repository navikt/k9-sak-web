import type { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidInfoFraSøker as ReisetidInfoFraSøker } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { Label, BodyLong, Tag } from '@navikt/ds-react';
import { Period } from '@navikt/ft-utils';

// TODO ikke glem readonly når feltet kan redigeres
const OppgittReisetid = ({
  reisedagerOppgittISøknad,
  size = 'medium',
}: {
  reisedagerOppgittISøknad: ReisetidInfoFraSøker['reisetidPeriodeOppgittISøknad'];
  size?: 'medium' | 'small';
}) => {
  const reisedagerPeriod = reisedagerOppgittISøknad
    ? new Period(reisedagerOppgittISøknad.fom, reisedagerOppgittISøknad.tom)
    : null;

  if (!reisedagerPeriod) {
    return (
      <div>
        <Label size={size}>Reisedager:</Label>
        <div>
          <BodyLong size={size}>Ingen reisedager oppgitt</BodyLong>
        </div>
      </div>
    );
  }

  const reisedager =
    reisedagerPeriod.asListOfDays().length > 1
      ? reisedagerPeriod.prettifyPeriod()
      : reisedagerPeriod.prettifyPeriod().split(' - ')[0];
  return (
    <div>
      <Label size={size}>Reisedager:</Label>{' '}
      <div className="flex gap-2">
        <BodyLong size={size}>{reisedager}</BodyLong>
        <Tag size="small" variant="info">
          Fra søknad
        </Tag>
      </div>
    </div>
  );
};

export default OppgittReisetid;
