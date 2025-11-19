import type { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidInfoFraSøker as ReisetidInfoFraSøker } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { Label, BodyLong, Tag } from '@navikt/ds-react';
import { Period } from '@navikt/ft-utils';

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
    const reisedager =
      reisedagerIVurderingPeriod.asListOfDays().length > 1
        ? reisedagerIVurderingPeriod.prettifyPeriod()
        : reisedagerIVurderingPeriod.prettifyPeriod().split(' - ')[0];
    return (
      <div>
        <Label size={size}>Reisedager:</Label>
        <div className="flex gap-2">
          <BodyLong size={size}>{reisedager}</BodyLong>
          <Tag size="small" variant="info">
            Flyttet fra nødvendig opplæring
          </Tag>
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

export default ReisedagerIVurdering;
