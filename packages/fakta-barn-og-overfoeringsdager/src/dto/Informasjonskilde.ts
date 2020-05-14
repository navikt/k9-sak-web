import stringEnum from '@k9-sak-web/types/src/tsUtils';

export const InformasjonskildeEnum = stringEnum({
  HENTET_AUTOMATISK: 'hentetAutomatisk',
  LAGT_TIL_MANUELT: 'lagtTilManuelt',
});

type Informasjonskilde = typeof InformasjonskildeEnum[keyof typeof InformasjonskildeEnum];

export default Informasjonskilde;
