import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import KombinertBarnOgRammevedtak from '@k9-sak-web/fakta-barn-oms/src/dto/KombinertBarnOgRammevedtak';
import { formatDate, formatereLukketPeriode } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { BodyShort } from '@navikt/ds-react';
import { FormattedMessage } from 'react-intl';

interface BarnInputProps {
  barnet: KombinertBarnOgRammevedtak;
}

const BarnInformasjonVisning = ({ barnet }: BarnInputProps) => {
  const { harSammeBosted, dødsdato, barnType, deltBostedPerioder, sammeBostedPerioder } =
    barnet.barnRelevantIBehandling;
  const skalViseDeltBostedMedPerioder = deltBostedPerioder && deltBostedPerioder.length > 0;

  return (
    <div>
      {typeof harSammeBosted !== 'undefined' && (
        <BodyShort size="small">
          <FormattedMessage
            id={harSammeBosted ? 'FaktaBarn.BorMedSøker' : 'FaktaBarn.BorIkkeMedSøker'}
            values={{ b: chunks => <b>{chunks}</b> }}
          />
        </BodyShort>
      )}

      {skalViseDeltBostedMedPerioder && (
        <>
          <BodyShort size="small">
            <FormattedMessage id="FaktaBarn.DeltBostedMedPerioder" />
          </BodyShort>
          {deltBostedPerioder.map(periode => (
            <BodyShort size="small">{formatereLukketPeriode(periode)}</BodyShort>
          ))}
          <VerticalSpacer sixteenPx />
        </>
      )}

      {sammeBostedPerioder && sammeBostedPerioder.length > 0 && (
        <>
          <BodyShort size="small">
            <FormattedMessage id="FaktaBarn.SammeBostedMedPerioder" />
          </BodyShort>
          {sammeBostedPerioder.map(periode => (
            <BodyShort size="small">{formatereLukketPeriode(periode)}</BodyShort>
          ))}
          <VerticalSpacer sixteenPx />
        </>
      )}

      {dødsdato && (
        <BodyShort size="small">
          <FormattedMessage id="FaktaBarn.Død" values={{ dødsdato: formatDate(dødsdato) }} />
        </BodyShort>
      )}
      {barnType === BarnType.FOSTERBARN && (
        <BodyShort size="small">
          <FormattedMessage id="FaktaBarn.Fosterbarn" />
        </BodyShort>
      )}
      {barnType === BarnType.UTENLANDSK_BARN && (
        <BodyShort size="small">
          <FormattedMessage id="FaktaBarn.UtenlandskBarn" />
        </BodyShort>
      )}
    </div>
  );
};

export default BarnInformasjonVisning;
