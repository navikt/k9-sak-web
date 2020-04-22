import {
  MidlertidigAleneOmOmsorgen,
  DagerMottatt,
  DagerGitt,
  UidentifisertRammevedtak,
  UtvidetRettDto,
} from './RammevedtakDto';
import { BarnAutomatiskHentetDto, BarnLagtTilAvSaksbehandlerDto } from './BarnDto';

interface OmsorgsdagerGrunnlagDto {
  barn: BarnAutomatiskHentetDto[];
  barnLagtTilAvSakbehandler: BarnLagtTilAvSaksbehandlerDto[];
  midlertidigAleneOmOmsorgen?: MidlertidigAleneOmOmsorgen;
  utvidetRett: UtvidetRettDto[];
  overføringFår: DagerMottatt[];
  overføringGir: DagerGitt[];
  fordelingFår: DagerMottatt[];
  fordelingGir: DagerGitt[];
  koronaoverføringFår: DagerMottatt[];
  koronaoverføringGir: DagerGitt[];
  uidentifiserteRammevedtak: UidentifisertRammevedtak[];
}

export default OmsorgsdagerGrunnlagDto;
