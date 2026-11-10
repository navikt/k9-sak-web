import type { AksjonspunktDto } from '@k9-sak-web/backend/combined/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { ExclamationmarkTriangleFillIcon, InformationSquareFillIcon } from '@navikt/aksel-icons';
import { InfoCard } from '@navikt/ds-react';
import type { JSX } from 'react';
import {
  finnOverstyringsaksjonspunktStatus,
  skalViseOverstyringAksjonspunktVarsel,
} from './overstyringsaksjonspunkt.js';

const overstyrtHvaTekst = {
  vilkår: 'vilkåret',
  unntak: 'vilkårsvurderingen',
  uttak: 'uttaksgrad og utbetalingsgrad',
};

interface OverstyringAksjonspunktVarselProps {
  /** Aksjonspunktene som hører til panelet. Varselet vises bare når ett av dem har aksjonspunktType OVST. */
  aksjonspunkter: ReadonlyArray<AksjonspunktDto>;
  erOverstyrer: boolean;
  isReadOnly: boolean;
  område: keyof typeof overstyrtHvaTekst;
}

/**
 * Varsel til saksbehandlere uten overstyrerrolle når panelet har et overstyringsaksjonspunkt som er åpent eller utført.
 * Overstyrere får ikke varselet.
 */
const OverstyringAksjonspunktVarsel = ({
  aksjonspunkter,
  erOverstyrer,
  isReadOnly,
  område,
}: OverstyringAksjonspunktVarselProps): JSX.Element | null => {
  if (!skalViseOverstyringAksjonspunktVarsel(aksjonspunkter, erOverstyrer, isReadOnly)) {
    return null;
  }
  const status = finnOverstyringsaksjonspunktStatus(aksjonspunkter);
  const overstyrtHva = overstyrtHvaTekst[område];

  if (status === 'UTFØRT') {
    return (
      <InfoCard data-color="info" size="small">
        <InfoCard.Message icon={<InformationSquareFillIcon aria-hidden />}>
          <strong>{`Overstyring av ${overstyrtHva} er utført.`}</strong> Den er gjort i denne eller en tidligere
          behandling. Bare en saksbehandler med overstyrerrolle kan endre den. Du har ikke overstyrerrolle.
        </InfoCard.Message>
      </InfoCard>
    );
  }

  return (
    <InfoCard data-color="warning" size="small">
      <InfoCard.Message icon={<ExclamationmarkTriangleFillIcon aria-hidden />}>
        <strong>{`Overstyring av ${overstyrtHva} må vurderes.`}</strong> Bare en saksbehandler med overstyrerrolle kan
        vurdere den. Du har ikke overstyrerrolle.
      </InfoCard.Message>
    </InfoCard>
  );
};

export default OverstyringAksjonspunktVarsel;
