import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import arbeidType from '@fpsak-frontend/kodeverk/src/arbeidType';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';

import { getKodeverknavnFn, getKodeverknavnFraKode } from './kodeverkUtils';

describe('<kodeverkUtils>', () => {
  it('skal finne navn til gitt kodeverk-kode', () => {
    const alleKodeverk = {
      [KodeverkType.ARBEID_TYPE]: [
        {
          kode: arbeidType.LONN_UNDER_UTDANNING,
          kodeverk: 'ARBEID_TYPE',
          navn: 'Lønn under utdanning',
        },
      ],
    };

    const kodeverkType = KodeverkType.ARBEID_TYPE;
    const kode = arbeidType.LONN_UNDER_UTDANNING;

    const navn = getKodeverknavnFraKode(alleKodeverk, kodeverkType, kode);

    expect(navn).toBe('Lønn under utdanning');
  });

  it('skal finne navn til gitt kodeverk-objekt', () => {
    const alleKodeverk = {
      [KodeverkType.ARBEID_TYPE]: [
        {
          kode: arbeidType.LONN_UNDER_UTDANNING,
          kodeverk: 'ARBEID_TYPE',
          navn: 'Lønn under utdanning',
        },
      ],
    };

    const navn = getKodeverknavnFn(alleKodeverk)(arbeidType.LONN_UNDER_UTDANNING, KodeverkType.ARBEID_TYPE);

    expect(navn).toBe('Lønn under utdanning');
  });

  it('skal finne navn til gitt kodeverk-objekt når en har underkategori i kodeverk-json', () => {
    const alleKodeverk = {
      [KodeverkType.AVSLAGSARSAK]: {
        [vilkarType.MEDLEMSKAPSVILKARET]: [
          {
            kode: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
            kodeverk: 'AVSLAGSARSAK',
            navn: 'Ingen beregningsregler',
          },
        ],
        [vilkarType.SOKERSOPPLYSNINGSPLIKT]: [
          {
            kode: 'test 2',
            kodeverk: 'AVSLAGSARSAK',
            navn: 'test 2',
          },
        ],
      },
    };

    // @ts-ignore (Kodeverket for avslagsårsak er anleis enn alle andre. Bør nok flyttast til eigen resttjeneste,
    // evt. må typen til alle-kodeverk endrast i heile appen)
    const navn = getKodeverknavnFn(alleKodeverk, KodeverkType)(
      avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
      KodeverkType.AVSLAGSARSAK,
    );

    expect(navn).toBe('Ingen beregningsregler');
  });
});
