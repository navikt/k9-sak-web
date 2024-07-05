import dayjs from 'dayjs';

const utenlandsopphold = {
  perioder: [
    {
      periode: `${dayjs().subtract(7, 'day').format('YYYY-MM-DD')}/${dayjs().format('YYYY-MM-DD')}`,
      landkode: 'LUX',
      region: 'EOS',
      årsak: null,
    },
    {
      periode: `${dayjs().subtract(15, 'day').format('YYYY-MM-DD')}/${dayjs().subtract(8, 'day').format('YYYY-MM-DD')}`,
      landkode: 'CHN',
      region: 'ANNET',
      årsak: 'INGEN',
    },
    {
      periode: `${dayjs().subtract(22, 'day').format('YYYY-MM-DD')}/${dayjs()
        .subtract(16, 'day')
        .format('YYYY-MM-DD')}`,
      landkode: 'MOZ',
      region: 'ANNET',
      årsak: 'BARNET_INNLAGT_I_HELSEINSTITUSJON_DEKKET_ETTER_AVTALE_MED_ET_ANNET_LAND_OM_TRYGD',
    },
    {
      periode: `${dayjs().subtract(30, 'day').format('YYYY-MM-DD')}/${dayjs()
        .subtract(23, 'day')
        .format('YYYY-MM-DD')}`,
      landkode: 'FIN',
      region: 'NORDEN',
      årsak: null,
    },
    {
      periode: `${dayjs().subtract(38, 'day').format('YYYY-MM-DD')}/${dayjs()
        .subtract(31, 'day')
        .format('YYYY-MM-DD')}`,
      landkode: 'TUR',
      region: 'ANNET',
      årsak: 'BARNET_INNLAGT_I_HELSEINSTITUSJON_FOR_NORSK_OFFENTLIG_REGNING',
    },
    {
      periode: `${dayjs().subtract(45, 'day').format('YYYY-MM-DD')}/${dayjs()
        .subtract(31, 'day')
        .format('YYYY-MM-DD')}`,
      landkode: 'CHE',
      region: 'ANNET',
      årsak: 'INGEN',
    },
  ],
};

export default utenlandsopphold;
