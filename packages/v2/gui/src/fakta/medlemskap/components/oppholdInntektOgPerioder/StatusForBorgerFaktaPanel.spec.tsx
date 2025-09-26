import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import type { Aksjonspunkt } from '../../types/Aksjonspunkt';
import type { Periode } from '../../types/Periode';
import { buildInitialValuesStatusForBorgerFaktaPanel } from './StatusForBorgerFaktaPanel';

describe('<StatusForBorgerFaktaPanel>', () => {
  it('skal sette initielle verdi når det er EØS borger og ingen vurdering er lagret', () => {
    const periode: Periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT],
      id: '',
      vurderingsdato: '',
      årsaker: [],
      begrunnelse: '',
      personopplysninger: {},
      bosattVurdering: false,
      vurdertAv: '',
      vurdertTidspunkt: '',
      isBosattAksjonspunktClosed: false,
      isPeriodAksjonspunktClosed: false,
      medlemskapManuellVurderingType: '',
      oppholdsrettVurdering: undefined,
      erEosBorger: true,
    };
    const aksjonspunkter: Aksjonspunkt[] = [
      {
        definisjon: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
        status: 'UTFO',
        erAktivt: false,
      },
    ];
    const initialValues = buildInitialValuesStatusForBorgerFaktaPanel(periode, aksjonspunkter);

    expect(initialValues).toStrictEqual({
      apKode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      erEosBorger: true,
      oppholdsrettVurdering: undefined,
      lovligOppholdVurdering: undefined,
      isBorgerAksjonspunktClosed: true,
    });
  });

  it('skal sette initielle verdi når det er EØS borger og vurdering er lagret', () => {
    const periode: Periode = {
      aksjonspunkter: [],
      erEosBorger: true,
      oppholdsrettVurdering: true,
      id: '',
      vurderingsdato: '',
      årsaker: [],
      begrunnelse: '',
      personopplysninger: {},
      bosattVurdering: false,
      vurdertAv: '',
      vurdertTidspunkt: '',
      isBosattAksjonspunktClosed: false,
      isPeriodAksjonspunktClosed: false,
      medlemskapManuellVurderingType: '',
    };

    const aksjonspunkter: Aksjonspunkt[] = [];

    const initialValues = buildInitialValuesStatusForBorgerFaktaPanel(periode, aksjonspunkter);

    expect(initialValues).toStrictEqual({
      apKode: '',
      erEosBorger: true,
      oppholdsrettVurdering: true,
      lovligOppholdVurdering: undefined,
      isBorgerAksjonspunktClosed: false,
    });
  });

  it('skal sette initielle verdi når regionkode ikke finnes men en har oppholdsrett-aksjonspunkt', () => {
    const periode: Periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT],
      id: '',
      vurderingsdato: '',
      årsaker: [],
      begrunnelse: '',
      personopplysninger: {},
      bosattVurdering: false,
      vurdertAv: '',
      vurdertTidspunkt: '',
      isBosattAksjonspunktClosed: false,
      isPeriodAksjonspunktClosed: false,
      erEosBorger: true,
      medlemskapManuellVurderingType: '',
      oppholdsrettVurdering: false,
    };
    const aksjonspunkter: Aksjonspunkt[] = [
      {
        definisjon: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
        status: 'UTFO',
        erAktivt: false,
      },
    ];

    const initialValues = buildInitialValuesStatusForBorgerFaktaPanel(periode, aksjonspunkter);

    expect(initialValues).toStrictEqual({
      apKode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      erEosBorger: true,
      oppholdsrettVurdering: false,
      lovligOppholdVurdering: undefined,
      isBorgerAksjonspunktClosed: true,
    });
  });

  it('skal sette initielle verdi når det ikke er EØS borger', () => {
    const periode: Periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT],
      erEosBorger: false,
      lovligOppholdVurdering: false,
      id: '',
      vurderingsdato: '',
      årsaker: [],
      begrunnelse: '',
      personopplysninger: {},
      bosattVurdering: false,
      vurdertAv: '',
      vurdertTidspunkt: '',
      isBosattAksjonspunktClosed: false,
      isPeriodAksjonspunktClosed: false,

      medlemskapManuellVurderingType: '',
      oppholdsrettVurdering: undefined,
    };
    const aksjonspunkter: Aksjonspunkt[] = [];

    const initialValues = buildInitialValuesStatusForBorgerFaktaPanel(periode, aksjonspunkter);

    expect(initialValues).toStrictEqual({
      apKode: '',
      erEosBorger: false,
      oppholdsrettVurdering: undefined,
      lovligOppholdVurdering: false,
      isBorgerAksjonspunktClosed: false,
    });
  });
});
