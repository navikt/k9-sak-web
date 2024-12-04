import { useIntl } from 'react-intl';

import BehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import { isAvslag, isInnvilget, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { HGrid } from '@navikt/ds-react';
import {
  AksjonspunktDto,
  AvslagsårsakPrPeriodeDto,
  TilbakekrevingValgDto,
  VilkårMedPerioderDto,
} from '@navikt/k9-sak-typescript-client';
import { BeregningResultat } from '../../types/BeregningResultat';
import { VedtakVarsel } from '../../types/VedtakVarsel';
import VedtakAvslagRevurderingPanel from './VedtakAvslagRevurderingPanel';
import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';
import VedtakOpphorRevurderingPanel from './VedtakOpphorRevurderingPanel';
import VedtakRedusertUtbetalingArsaker from './VedtakRedusertUtbetalingArsaker';

interface OwnProps {
  ytelseTypeKode: string;
  behandlingresultat: BeregningResultat;
  resultatstruktur: BeregningResultat;
  tilbakekrevingvalg: TilbakekrevingValgDto;
  simuleringResultat: any;
  resultatstrukturOriginalBehandling: any;
  bgPeriodeMedAvslagsårsak?: AvslagsårsakPrPeriodeDto;
  behandlingStatusKode: string;
  vilkar: VilkårMedPerioderDto[];
  aksjonspunkter: AksjonspunktDto[];
  sprakkode: string;
  readOnly: boolean;
  vedtakVarsel: VedtakVarsel;
  medlemskapFom: string;
  harRedusertUtbetaling: boolean;
  redusertUtbetalingArsak: string[];
  formikValues: any;
  erSendtInnUtenArsaker: boolean;
  behandlingArsaker: any;
}

const RevurderingPaneler = ({
  ytelseTypeKode,
  behandlingresultat,
  resultatstruktur,
  tilbakekrevingvalg,
  simuleringResultat,

  resultatstrukturOriginalBehandling,
  bgPeriodeMedAvslagsårsak,
  vilkar,
  readOnly,
  vedtakVarsel,
  medlemskapFom,
  harRedusertUtbetaling,
  redusertUtbetalingArsak,
  formikValues,
  erSendtInnUtenArsaker,
  behandlingArsaker,
}: OwnProps): JSX.Element => {
  const intl = useIntl();
  const { kodeverkNavnFraKode } = useKodeverkContext();

  const createAarsakString = (revurderingAarsaker: string[]) => {
    if (revurderingAarsaker === undefined || revurderingAarsaker.length < 1) {
      return '';
    }
    const aarsakTekstList = [];
    const endringFraBrukerAarsak = revurderingAarsaker.find(
      aarsak => aarsak === BehandlingArsakType.RE_ENDRING_FRA_BRUKER,
    );
    const alleAndreAarsakerNavn = revurderingAarsaker
      .filter(aarsak => aarsak !== BehandlingArsakType.RE_ENDRING_FRA_BRUKER)
      .map(aarsak => kodeverkNavnFraKode(aarsak, KodeverkType.BEHANDLING_AARSAK));
    // Dersom en av årsakene er "RE_ENDRING_FRA_BRUKER" skal alltid denne vises først
    if (endringFraBrukerAarsak) {
      aarsakTekstList.push(kodeverkNavnFraKode(endringFraBrukerAarsak, KodeverkType.BEHANDLING_AARSAK));
    }
    aarsakTekstList.push(...alleAndreAarsakerNavn);
    return aarsakTekstList.join(', ');
  };

  const behandlingArsakstyper =
    behandlingArsaker && behandlingArsaker.map(({ behandlingArsakType }) => behandlingArsakType);

  const revurderingsAarsakString = createAarsakString(behandlingArsakstyper);

  return (
    <HGrid gap="1" columns={{ xs: ytelseTypeKode === fagsakYtelseType.FRISINN ? '4fr 8fr' : '12fr' }}>
      <div>
        {isInnvilget(behandlingresultat.type) && (
          <VedtakInnvilgetRevurderingPanel
            ytelseTypeKode={ytelseTypeKode}
            revurderingsAarsakString={revurderingsAarsakString}
            behandlingsresultat={behandlingresultat}
            tilbakekrevingvalg={tilbakekrevingvalg}
            simuleringResultat={simuleringResultat}
            originaltBeregningResultat={resultatstrukturOriginalBehandling}
            bgPeriodeMedAvslagsårsak={bgPeriodeMedAvslagsårsak}
            kodeverkNavnFraKode={kodeverkNavnFraKode}
          />
        )}
        {isAvslag(behandlingresultat.type) && (
          <VedtakAvslagRevurderingPanel
            beregningResultat={resultatstruktur}
            vilkar={vilkar}
            originaltBeregningResultat={resultatstrukturOriginalBehandling}
            tilbakekrevingvalg={tilbakekrevingvalg}
            simuleringResultat={simuleringResultat}
            ytelseTypeKode={ytelseTypeKode}
            kodeverkNavnFraKode={kodeverkNavnFraKode}
          />
        )}
        {isOpphor(behandlingresultat.type) && (
          <VedtakOpphorRevurderingPanel
            ytelseTypeKode={ytelseTypeKode}
            resultatstruktur={resultatstruktur}
            medlemskapFom={medlemskapFom}
            vedtakVarsel={vedtakVarsel}
          />
        )}
      </div>
      {harRedusertUtbetaling && (
        <div>
          <VedtakRedusertUtbetalingArsaker
            intl={intl}
            readOnly={readOnly}
            values={new Map(Object.values(redusertUtbetalingArsak).map(key => [key, formikValues[key]]))}
            erSendtInnUtenArsaker={erSendtInnUtenArsaker}
          />
        </div>
      )}
    </HGrid>
  );
};

export default RevurderingPaneler;
