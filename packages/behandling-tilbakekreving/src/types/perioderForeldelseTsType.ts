import { Kodeverk } from '@k9-sak-web/types';

type PerioderForeldelse = Readonly<{
  perioder: {
    fom: string;
    tom: string;
    belop: number;
    foreldelseVurderingType: Kodeverk;
  };
}>;

export default PerioderForeldelse;
