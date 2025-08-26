import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import type { Aksjonspunkt } from '../../types/Aksjonspunkt';
import type { MedlemskapPeriode } from '../../types/Medlemskap';
import type { Periode } from '../../types/Periode';
import type { Søknad } from '../../types/Søknad';
import { buildInitialValuesPerioderMedMedlemskapFaktaPanel } from './PerioderMedMedlemskapFaktaPanel';

describe('<PerioderMedMedlemskapFaktaPanel>', () => {
  it('skal sette opp initielle verdier og sorterte perioder etter periodestart', () => {
    const periode: Periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE],
      medlemskapManuellVurderingType: 'manuellType',
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
      erEosBorger: false,
    };
    const medlemskapPerioder: MedlemskapPeriode[] = [
      {
        fom: '2016-01-15',
        tom: '2016-10-15',
        dekningType: 'DEK_TYPE',
        medlemskapType: 'M_STATUS',
        beslutningsdato: '2016-10-16',
        kildeType: '',
      },
      {
        fom: '2017-01-15',
        tom: '2017-10-15',
        dekningType: 'DEK_TYPE2',
        medlemskapType: 'M_STATUS2',
        beslutningsdato: '2017-10-16',
        kildeType: '',
      },
    ];

    const soknad: Søknad = {
      fodselsdatoer: ['2017-10-15'],
      oppgittTilknytning: {
        utlandsopphold: [],
      },
    };

    const aksjonspunkter: Aksjonspunkt[] = [
      {
        definisjon: aksjonspunktCodes.AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE,
        status: aksjonspunktStatus.OPPRETTET,
        erAktivt: false,
      },
    ];

    const initialValues = buildInitialValuesPerioderMedMedlemskapFaktaPanel(
      medlemskapPerioder,
      soknad,
      aksjonspunkter,
      periode,
    );

    expect(initialValues).toStrictEqual({
      fixedMedlemskapPerioder: [
        {
          fom: '2016-01-15',
          tom: '2016-10-15',
          dekning: 'DEK_TYPE',
          status: 'M_STATUS',
          beslutningsdato: '2016-10-16',
        },
        {
          fom: '2017-01-15',
          tom: '2017-10-15',
          dekning: 'DEK_TYPE2',
          status: 'M_STATUS2',
          beslutningsdato: '2017-10-16',
        },
      ],
      isPeriodAksjonspunktClosed: false,
      medlemskapManuellVurderingType: 'manuellType',
      fodselsdato: '2017-10-15',
      hasPeriodeAksjonspunkt: true,
    });
  });
});
