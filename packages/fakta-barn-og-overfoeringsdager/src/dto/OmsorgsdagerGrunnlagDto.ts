import {
  MidlertidigAleneOmOmsorgen,
  DagerMottatt,
  DagerGitt,
  UidentifisertRammevedtak,
  UtvidetRettDto,
  AleneOmOmsorgen,
} from './RammevedtakDto';
import { BarnAutomatiskHentetDto, BarnLagtTilAvSaksbehandlerDto } from './BarnDto';

interface OmsorgsdagerGrunnlagDto {
  barn: BarnAutomatiskHentetDto[];
  barnLagtTilAvSakbehandler: BarnLagtTilAvSaksbehandlerDto[];
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
