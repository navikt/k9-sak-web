import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { ProsessBehandling } from '@k9-sak-web/gui/behandling/prosess/vilkårpaneler/types.js';
import { TiDagerProsessIndex } from '@k9-sak-web/gui/prosess/ti-dager/TiDagerProsessIndex.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { useMemo } from 'react';

const RELEVANTE_VILKÅR_KODER = [VilkårType.ARBEIDSGIVER_UTBETALT_PLIKTIGE_DAGER];
const RELEVANTE_AKSJONSPUNKT_KODER = [AksjonspunktDefinisjon.VURDER_RETT_FRA_DAG_EN];

interface Props {
  behandling: ProsessBehandling;
  aksjonspunkter: AksjonspunktDto[];
  vilkår: VilkårMedPerioderDto[];
  arbeidsgiverOpplysningerPerId: { [key: string]: { navn: string } };
  saksnummer: string;
  isReadOnly: boolean;
  submitCallback: (data: any[], aksjonspunkter?: AksjonspunktDto[]) => Promise<any>;
}

export const TiDagerProsessStegInitPanel = (props: Props) => {
  const vilkårForSteg = useMemo(
    () => props.vilkår.filter(vilkår => RELEVANTE_VILKÅR_KODER.some(kode => kode === vilkår.vilkarType)),
    [props.vilkår],
  );
  const aksjonspunkterForSteg = useMemo(
    () => props.aksjonspunkter.filter(ap => RELEVANTE_AKSJONSPUNKT_KODER.some(kode => kode === ap.definisjon)),
    [props.aksjonspunkter],
  );

  if (vilkårForSteg.length === 0) {
    return null;
  }

  const indexProps = {
    aksjonspunkter: aksjonspunkterForSteg,
    arbeidsgiverOpplysningerPerId: props.arbeidsgiverOpplysningerPerId,
    vilkar: vilkårForSteg,
    saksnummer: props.saksnummer,
  };
  const deepCopyProps = JSON.parse(JSON.stringify(indexProps));
  konverterKodeverkTilKode(deepCopyProps, false);

  return (
    <TiDagerProsessIndex
      submitCallback={props.submitCallback}
      aksjonspunkter={deepCopyProps.aksjonspunkter}
      isReadOnly={props.isReadOnly}
      behandlingUUID={props.behandling.uuid}
      arbeidsgiverOpplysningerPerId={deepCopyProps.arbeidsgiverOpplysningerPerId}
      vilkar={deepCopyProps.vilkar}
      saksnummer={deepCopyProps.saksnummer}
    />
  );
};
