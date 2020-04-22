import { MidlertidigAleneOmOmsorgen, OverføringFår, OverføringGir, UtvidetRettDto } from './RammevedtakDto';
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
}

export default OmsorgsdagerGrunnlagDto;
