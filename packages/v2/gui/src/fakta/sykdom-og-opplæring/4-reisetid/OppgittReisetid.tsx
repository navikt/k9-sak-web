import type { ReisetidInfoFraSøker } from '@k9-sak-web/backend/k9sak/generated';
import { Label, BodyLong, Tag } from '@navikt/ds-react';
import { Period } from '@navikt/ft-utils';

// TODO ikke glem readonly når feltet kan redigeres
const OppgittReisetid = ({
  reisedagerOppgittISøknad,
}: {
  reisedagerOppgittISøknad: ReisetidInfoFraSøker['reisetidPeriodeOppgittISøknad'];
}) => {
  const reisedagerPeriod = reisedagerOppgittISøknad
    ? new Period(reisedagerOppgittISøknad.fom, reisedagerOppgittISøknad.tom)
    : null;

  if (!reisedagerPeriod) {
    return (
      <div>
        <Label>Reisedager:</Label>
        <div>
          <BodyLong>Ingen reisedager oppgitt</BodyLong>
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
      <Label>Reisedager:</Label>{' '}
      <div className="flex gap-2">
        <BodyLong>{reisedager}</BodyLong>
        <Tag size="small" variant="info">
          Fra søknad
        </Tag>
      </div>
    </div>
  );
};

export default OppgittReisetid;
