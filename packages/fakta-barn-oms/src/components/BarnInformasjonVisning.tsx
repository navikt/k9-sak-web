import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import KombinertBarnOgRammevedtak from '@k9-sak-web/fakta-barn-oms/src/dto/KombinertBarnOgRammevedtak';
import { formatereLukketPeriode, visningsdato } from '@fpsak-frontend/utils';
import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { VerticalSpacer } from "@fpsak-frontend/shared-components";

interface BarnInputProps {
  barnet: KombinertBarnOgRammevedtak;
}

const BarnInformasjonVisning = ({ barnet }: BarnInputProps) => {
  const { harSammeBosted, dødsdato, barnType, deltBostedPerioder, sammeBostedPerioder } = barnet.barnRelevantIBehandling;
  const skalViseDeltBostedMedPerioder = deltBostedPerioder && deltBostedPerioder.length > 0;

  return (
    <div>
      {typeof harSammeBosted !== 'undefined' && <Normaltekst>
        <FormattedMessage
          id={harSammeBosted ? 'FaktaBarn.BorMedSøker' : 'FaktaBarn.BorIkkeMedSøker'}
          values={{ b: chunks => <b>{chunks}</b> }}
        />
      </Normaltekst>}


      {skalViseDeltBostedMedPerioder && <>
        <Normaltekst>
          <FormattedMessage id="FaktaBarn.DeltBostedMedPerioder" />
        </Normaltekst>
        {deltBostedPerioder.map(periode => (<Normaltekst>{formatereLukketPeriode(periode)}</Normaltekst>))}
        <VerticalSpacer sixteenPx />
      </>
      }

      {sammeBostedPerioder && sammeBostedPerioder.length > 0 && <>
        <Normaltekst>
          <FormattedMessage id="FaktaBarn.SammeBostedMedPerioder" />
        </Normaltekst>
        {sammeBostedPerioder.map(periode => (<Normaltekst>{formatereLukketPeriode(periode)}</Normaltekst>))}
        <VerticalSpacer sixteenPx />
      </>}

      {dødsdato && (
        <Normaltekst>
          <FormattedMessage id="FaktaBarn.Død" values={{ dødsdato: visningsdato(dødsdato) }} />
        </Normaltekst>
      )}
      {barnType === BarnType.FOSTERBARN && (
        <Normaltekst>
          <FormattedMessage id="FaktaBarn.Fosterbarn" />
        </Normaltekst>
      )}
      {barnType === BarnType.UTENLANDSK_BARN && (
        <Normaltekst>
          <FormattedMessage id="FaktaBarn.UtenlandskBarn" />
        </Normaltekst>
      )}
    </div>
  );
};

export default BarnInformasjonVisning;
