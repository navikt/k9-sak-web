import { AndreLivsoppholdsytelserIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserIkkeOppfyltÅrsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AndreLivsoppholdsytelserVurderingDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/vurdering/AndreLivsoppholdsytelserVurderingerResponse.js';
import { describe, expect, it } from 'vitest';
import type { VilkårPeriodeVisning } from '../../aktivitetspenger-felles/utils/visningsperioder.js';
import { buildInitialValues } from './andreLivsoppholdytelserFormData.js';

const lagVurdering = (
  vurdering: Pick<AndreLivsoppholdsytelserVurderingDto, 'periode' | 'erVilkårOppfylt'> &
    Partial<AndreLivsoppholdsytelserVurderingDto>,
): AndreLivsoppholdsytelserVurderingDto => ({
  erManuellVurdering: true,
  vilkårType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
  vurdertAv: 'Z123456',
  vurdertTidspunkt: '2024-01-15T10:00:00',
  ...vurdering,
});

describe('buildInitialValues', () => {
  it('fyller ut en frittstående avkortet periode fra vurderingen', () => {
    const perioder: VilkårPeriodeVisning[] = [
      { periode: { fom: '2024-07-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_OPPFYLT },
    ];
    const vurderinger = [
      lagVurdering({
        periode: { fom: '2024-07-01', tom: '2024-12-31' },
        erVilkårOppfylt: false,
        avslagsårsak: AndreLivsoppholdsytelserIkkeOppfyltÅrsak.AVKORTET,
        begrunnelse: 'Avkortet etter avtale.',
      }),
    ];

    expect(buildInitialValues(perioder, vurderinger).vurderinger['2024-07-01']).toEqual(
      expect.objectContaining({
        andreLivsoppholdytelser: 'ikkeOppfylt',
        avslagsårsak: AndreLivsoppholdsytelserIkkeOppfyltÅrsak.AVKORTET,
        begrunnelse: 'Avkortet etter avtale.',
        redigerMaksdato: false,
      }),
    );
  });

  it('bruker oppfylt vurdering for perioden og avkortet vurdering for kortere maksdato når de er slått sammen', () => {
    const perioder: VilkårPeriodeVisning[] = [
      {
        periode: { fom: '2024-01-01', tom: '2024-06-30' },
        vilkarStatus: Utfall.OPPFYLT,
        avkortetPeriodeInfo: { begrunnelse: '', periode: { fom: '2024-07-01', tom: '2024-12-31' } },
      },
    ];
    const vurderinger = [
      lagVurdering({
        periode: { fom: '2024-01-01', tom: '2024-06-30' },
        erVilkårOppfylt: true,
        begrunnelse: 'Ingen andre ytelser.',
      }),
      lagVurdering({
        periode: { fom: '2024-07-01', tom: '2024-12-31' },
        erVilkårOppfylt: false,
        avslagsårsak: AndreLivsoppholdsytelserIkkeOppfyltÅrsak.AVKORTET,
        begrunnelse: 'Avkortet etter avtale.',
      }),
    ];

    expect(buildInitialValues(perioder, vurderinger).vurderinger['2024-01-01']).toEqual(
      expect.objectContaining({
        andreLivsoppholdytelser: 'oppfylt',
        avslagsårsak: undefined,
        begrunnelse: 'Ingen andre ytelser.',
        redigerMaksdato: true,
        begrunnelseKortereMaksdato: 'Avkortet etter avtale.',
      }),
    );
  });

  it('gir tomt skjema når perioden mangler vurdering', () => {
    const perioder: VilkårPeriodeVisning[] = [
      { periode: { fom: '2024-01-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_VURDERT },
    ];

    expect(buildInitialValues(perioder, []).vurderinger['2024-01-01']).toEqual(
      expect.objectContaining({ andreLivsoppholdytelser: '', begrunnelse: '', ytelseNavn: '', harFritekstbrev: false }),
    );
  });
});
