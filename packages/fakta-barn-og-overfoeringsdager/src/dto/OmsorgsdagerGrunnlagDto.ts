import {
  MidlertidigAleneOmOmsorgen,
  DagerMottatt,
  DagerGitt,
  UidentifisertRammevedtak,
  UtvidetRettDto,
  AleneOmOmsorgen,
} from './RammevedtakDto';
import BarnDto from './BarnDto';

interface OmsorgsdagerGrunnlagDto {
  barn: BarnDto[];
  midlertidigAleneOmOmsorgen?: MidlertidigAleneOmOmsorgen;
  aleneOmOmsorgen: AleneOmOmsorgen[];
  utvidetRett: UtvidetRettDto[];
  overføringFår: DagerMottatt[];
  overføringGir: DagerGitt[];
  fordelingFår: DagerMottatt[];
  fordelingGir: DagerGitt[];
  koronaoverføringFår: DagerMottatt[];
  koronaoverføringGir: DagerGitt[];
  uidentifiserteRammevedtak: UidentifisertRammevedtak[];
  begrunnelse?: string;
}

export default OmsorgsdagerGrunnlagDto;
