import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import KombinertBarnOgRammevedtak from '@k9-sak-web/fakta-barn-oms/src/dto/KombinertBarnOgRammevedtak';
import { visningsdato } from '@fpsak-frontend/utils';
import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';

interface BarnInputProps {
  barnet: KombinertBarnOgRammevedtak;
}

const BarnInformasjonVisning: FunctionComponent<BarnInputProps> = ({ barnet }) => {
  const { harSammeBosted, dødsdato, barnType } = barnet.barnRelevantIBehandling;

  return (
    <div>
      <Normaltekst>
        <FormattedMessage
          id={harSammeBosted ? 'FaktaBarn.BorMedSøker' : 'FaktaBarn.BorIkkeMedSøker'}
          values={{ b: chunks => <b>{chunks}</b> }}
        />
      </Normaltekst>
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
