import dayjs from 'dayjs';

const utenlandsopphold = {
  perioder: [
    {
      periode: `${dayjs().subtract(7, 'day').format('YYYY-MM-DD')}/${dayjs().format('YYYY-MM-DD')}`,
      landkode: {
        kode: 'LUX',
        navn: 'LUX',
        kodeverk: 'LANDKODER',
      },
      region: {
        kode: 'EOS',
        kodeverk: 'REGION',
      },
      årsak: null,
    },
    {
      periode: `${dayjs().subtract(15, 'day').format('YYYY-MM-DD')}/${dayjs().subtract(8, 'day').format('YYYY-MM-DD')}`,
      landkode: {
        kode: 'CHN',
        navn: 'CHN',
        kodeverk: 'LANDKODER',
      },
      region: {
        kode: 'ANNET',
        kodeverk: 'REGION',
      },
      årsak: { kode: 'INGEN', navn: 'Ingen, telles i 8 uker.', kodeverk: 'UTENLANDSOPPHOLD_ÅRSAK' },
    },
    {
      periode: `${dayjs().subtract(22, 'day').format('YYYY-MM-DD')}/${dayjs()
        .subtract(16, 'day')
        .format('YYYY-MM-DD')}`,
      landkode: {
        kode: 'MOZ',
        navn: 'MOZ',
        kodeverk: 'LANDKODER',
      },
      region: {
        kode: 'ANNET',
        kodeverk: 'REGION',
      },
      årsak: {
        kode: 'BARNET_INNLAGT_I_HELSEINSTITUSJON_DEKKET_ETTER_AVTALE_MED_ET_ANNET_LAND_OM_TRYGD',
        navn: 'Barnet er innlagt i helseinstitusjon dekket etter avtale med annet land om trygd (mottar pleiepenger som i Norge, telles ikke i 8 uker)',
        kodeverk: 'UTENLANDSOPPHOLD_ÅRSAK',
      },
    },
    {
      periode: `${dayjs().subtract(30, 'day').format('YYYY-MM-DD')}/${dayjs()
        .subtract(23, 'day')
        .format('YYYY-MM-DD')}`,
      landkode: {
        kode: 'FIN',
        navn: 'FIN',
        kodeverk: 'LANDKODER',
      },
      region: {
        kode: 'NORDEN',
        kodeverk: 'REGION',
      },
      årsak: null,
    },
    {
      periode: `${dayjs().subtract(38, 'day').format('YYYY-MM-DD')}/${dayjs()
        .subtract(31, 'day')
        .format('YYYY-MM-DD')}`,
      landkode: {
        kode: 'TUR',
        navn: 'TUR',
        kodeverk: 'LANDKODER',
      },
      region: {
        kode: 'ANNET',
        kodeverk: 'REGION',
      },
      årsak: {
        kode: 'BARNET_INNLAGT_I_HELSEINSTITUSJON_FOR_NORSK_OFFENTLIG_REGNING',
        navn: 'Barnet er innlagt i helseinstitusjon for norsk offentlig regning (mottar pleiepenger som i Norge, telles ikke i 8 uker)',
        kodeverk: 'UTENLANDSOPPHOLD_ÅRSAK',
      },
    },
  ],
};

export default utenlandsopphold;
