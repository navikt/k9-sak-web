import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import KombinertBarnOgRammevedtak from '@k9-sak-web/fakta-barn-oms/src/dto/KombinertBarnOgRammevedtak';
import { formatDate, formatereLukketPeriode } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { BodyShort } from '@navikt/ds-react';

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
          {harSammeBosted ? (
            'Barnet bor med søker'
          ) : (
            <>
              Barnet bor <b>ikke</b> med søker
            </>
          )}
        </BodyShort>
      )}

      {skalViseDeltBostedMedPerioder && (
        <>
          <BodyShort size="small">
            Barnet har delt bosted med søker i følgende perioder:
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
            Barnet har samme bosted med søker i følgende perioder:
          </BodyShort>
          {sammeBostedPerioder.map(periode => (
            <BodyShort size="small">{formatereLukketPeriode(periode)}</BodyShort>
          ))}
          <VerticalSpacer sixteenPx />
        </>
      )}

      {dødsdato && (
        <BodyShort size="small">
          Barnet døde den {formatDate(dødsdato)}
        </BodyShort>
      )}
      {barnType === BarnType.FOSTERBARN && (
        <BodyShort size="small">
          Barnet er fosterbarn
        </BodyShort>
      )}
      {barnType === BarnType.UTENLANDSK_BARN && (
        <BodyShort size="small">
          Barnet bor i utlandet
        </BodyShort>
      )}
    </div>
  );
};

export default BarnInformasjonVisning;
