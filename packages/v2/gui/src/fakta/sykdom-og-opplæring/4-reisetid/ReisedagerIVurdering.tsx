import type { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidInfoFraSøker as ReisetidInfoFraSøker } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { Label, BodyLong, Tag } from '@navikt/ds-react';
import { Period } from '@navikt/ft-utils';

const formaterReisedager = (period: Period) => {
  return period.asListOfDays().length > 1 ? period.prettifyPeriod() : period.prettifyPeriod().split(' - ')[0];
};

const ReisedagerIVurdering = ({
  reisedagerOppgittISøknad,
  reisedagerIVurdering,
  size = 'medium',
}: {
  reisedagerOppgittISøknad: ReisetidInfoFraSøker['reisetidPeriodeOppgittISøknad'];
  reisedagerIVurdering: { fom: string; tom: string };
  size?: 'medium' | 'small';
}) => {
  const reisedagerPeriod = reisedagerOppgittISøknad
    ? new Period(reisedagerOppgittISøknad.fom, reisedagerOppgittISøknad.tom)
    : null;

  if (!reisedagerPeriod) {
    const reisedagerIVurderingPeriod = new Period(reisedagerIVurdering.fom, reisedagerIVurdering.tom);
    const reisedager = formaterReisedager(reisedagerIVurderingPeriod);
    return (
      <div>
        <Label size={size}>Reisedager:</Label>
        <div className="flex gap-2">
          <BodyLong size={size}>{reisedager}</BodyLong>
          <Tag data-color="info" size="small" variant="outline">
            Flyttet fra nødvendig opplæring
          </Tag>
        </div>
      </div>
    );
  }

  const reisedager = formaterReisedager(reisedagerPeriod);
  return (
    <div>
      <Label size={size}>Reisedager:</Label>{' '}
      <div className="flex gap-2">
        <BodyLong size={size}>{reisedager}</BodyLong>
        <Tag data-color="info" size="small" variant="outline">
          Fra søknad
        </Tag>
      </div>
    </div>
  );
};

export default ReisedagerIVurdering;
