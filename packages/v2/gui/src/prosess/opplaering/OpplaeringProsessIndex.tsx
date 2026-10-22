import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import VilkarresultatMedOverstyringProsessIndex from '../vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';

const opplaeringsvilkar = {
  INSTITUSJON: {
    vilkarType: VilkårType.GODKJENT_OPPLÆRINGSINSTITUSJON,
    aksjonspunktKoder: [AksjonspunktDefinisjon.VURDER_INSTITUSJON],
    panelTittel: 'Institusjon',
  },
  LANGVARIG_SYKDOM: {
    vilkarType: VilkårType.LANGVARIG_SYKDOM,
    aksjonspunktKoder: [AksjonspunktDefinisjon.VURDER_LANGVARIG_SYK],
    panelTittel: 'Langvarig sykdom',
  },
  NØDVENDIG_OPPLÆRING: {
    vilkarType: VilkårType.NØDVENDIG_OPPLÆRING,
    aksjonspunktKoder: [AksjonspunktDefinisjon.VURDER_OPPLÆRING, AksjonspunktDefinisjon.VURDER_REISETID],
    panelTittel: 'Nødvendig opplæring',
  },
} as const;

export interface OpplaeringProsessIndexProps {
  aksjonspunkter: AksjonspunktDto[];
  vilkar: VilkårMedPerioderDto[];
  vilkarPanel: keyof typeof opplaeringsvilkar;
  visAllePerioder: boolean;
}

const avvisInnsending = (): never => {
  throw new Error('Opplæringsvisningen støtter ikke innsending av overstyring');
};

const OpplaeringProsessIndex = ({
  aksjonspunkter,
  vilkar,
  vilkarPanel,
  visAllePerioder,
}: OpplaeringProsessIndexProps) => {
  const panel = opplaeringsvilkar[vilkarPanel];
  const matchingVilkår = vilkar.find(vilkår => vilkår.vilkarType === panel.vilkarType);

  if (!matchingVilkår) {
    return null;
  }

  return (
    <VilkarresultatMedOverstyringProsessIndex
      behandling={{ type: behandlingType.FØRSTEGANGSSØKNAD }}
      aksjonspunkter={aksjonspunkter.filter(aksjonspunkt =>
        panel.aksjonspunktKoder.some(kode => kode === aksjonspunkt.definisjon),
      )}
      submitCallback={avvisInnsending}
      overrideReadOnly={false}
      kanOverstyreAccess={{ isEnabled: true }}
      toggleOverstyring={() => undefined}
      erOverstyrt={false}
      panelTittelKode={panel.panelTittel}
      overstyringApKode=""
      erMedlemskapsPanel={false}
      visPeriodisering
      vilkar={[matchingVilkår]}
      visAllePerioder={visAllePerioder}
      skjulOverstyring
    />
  );
};

export default OpplaeringProsessIndex;
