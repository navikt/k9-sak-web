import {
  MidlertidigAleneOmOmsorgen,
  OverføringFår,
  OverføringGir,
  UidentifisertRammevedtak,
  UtvidetRettDto,
} from './RammevedtakDto';
import { BarnAutomatiskHentetDto, BarnLagtTilAvSaksbehandlerDto } from './BarnDto';

interface OmsorgsdagerGrunnlagDto {
  barn: BarnAutomatiskHentetDto[];
  barnLagtTilAvSakbehandler: BarnLagtTilAvSaksbehandlerDto[];
  midlertidigAleneOmOmsorgen?: MidlertidigAleneOmOmsorgen;
  utvidetRett: UtvidetRettDto[];
  overføringFår: OverføringFår[];
  overføringGir: OverføringGir[];
  koronaoverføringFår: OverføringFår[];
  koronaoverføringGir: OverføringGir[];
  uidentifiserteRammevedtak: UidentifisertRammevedtak[];
}

export default OmsorgsdagerGrunnlagDto;
