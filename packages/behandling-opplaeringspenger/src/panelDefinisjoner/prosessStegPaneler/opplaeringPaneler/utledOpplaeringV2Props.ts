import type { Aksjonspunkt } from '@k9-sak-web/types';
import type { Vilkar } from '@k9-sak-web/types';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { VilkårPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårPeriodeDto.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { VilkårUtfallMerknad } from '@k9-sak-web/backend/k9sak/kodeverk/vilkår/VilkårUtfallMerknad.js';
import {
  opplaeringsvilkar,
  type OpplaeringProsessIndexProps,
} from '@k9-sak-web/gui/prosess/opplaering/OpplaeringProsessIndex.js';

type LegacyProps = {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  visAllePerioder?: boolean;
};

const toGeneratedCode = <T extends string>(code: string, generatedCodes: readonly T[], field: string): T => {
  const generatedCode = generatedCodes.find(candidate => candidate === code);
  if (generatedCode === undefined) {
    throw new Error(`Ukjent ${field}: ${code}`);
  }
  return generatedCode;
};

const mapVilkårPeriode = (periode: Vilkar['perioder'][number]): VilkårPeriodeDto => ({
  periode: {
    fom: periode.periode.fom,
    tom: periode.periode.tom,
  },
  vilkarStatus: toGeneratedCode(periode.vilkarStatus.kode, Object.values(vilkårStatus), 'vilkårsstatus'),
  ...(periode.vurderesIBehandlingen !== undefined && {
    vurderesIBehandlingen: periode.vurderesIBehandlingen,
  }),
  ...(periode.avslagKode !== undefined && { avslagKode: periode.avslagKode }),
  ...(periode.begrunnelse !== undefined && { begrunnelse: periode.begrunnelse }),
  ...(periode.merknad !== undefined && {
    merknad: toGeneratedCode(periode.merknad.kode, Object.values(VilkårUtfallMerknad), 'vilkårsmerknad'),
  }),
  merknadParametere: periode.merknadParametere,
});

const mapVilkår = (vilkår: Vilkar): VilkårMedPerioderDto => ({
  lovReferanse: vilkår.lovReferanse,
  vilkarType: toGeneratedCode(vilkår.vilkarType.kode, Object.values(VilkårType), 'vilkårstype'),
  overstyrbar: vilkår.overstyrbar,
  relevanteInnvilgetMerknader: vilkår.relevanteInnvilgetMerknader.map(merknad => ({
    merknad: toGeneratedCode(merknad.merknad.kode, Object.values(VilkårUtfallMerknad), 'innvilgetmerknad'),
    navn: merknad.navn,
  })),
  perioder: vilkår.perioder.map(mapVilkårPeriode),
});

const mapAksjonspunkter = (
  aksjonspunkter: Aksjonspunkt[],
  aksjonspunktKoder: (typeof opplaeringsvilkar)[keyof typeof opplaeringsvilkar]['aksjonspunktKoder'],
): AksjonspunktDto[] =>
  aksjonspunkter.flatMap(aksjonspunkt => {
    const definisjon = aksjonspunktKoder.find(kode => kode === aksjonspunkt.definisjon.kode);
    if (definisjon === undefined || aksjonspunkt.status.kode !== aksjonspunktStatus.OPPRETTET) {
      return [];
    }
    return [{ definisjon, status: aksjonspunktStatus.OPPRETTET }];
  });

export const utledOpplaeringV2Props = (
  props: LegacyProps,
  vilkarPanel: keyof typeof opplaeringsvilkar,
): OpplaeringProsessIndexProps => {
  const panel = opplaeringsvilkar[vilkarPanel];
  return {
    aksjonspunkter: mapAksjonspunkter(props.aksjonspunkter, panel.aksjonspunktKoder),
    vilkar: props.vilkar.map(mapVilkår),
    vilkarPanel,
    visAllePerioder: props.visAllePerioder ?? false,
  };
};
