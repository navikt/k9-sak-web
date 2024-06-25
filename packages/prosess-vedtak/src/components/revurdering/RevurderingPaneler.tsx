import React from 'react';
import { useIntl } from 'react-intl';

import BehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import { isAvslag, isInnvilget, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Aksjonspunkt, Behandling, Vilkar } from '@k9-sak-web/types';
import { HGrid } from '@navikt/ds-react';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import VedtakAvslagRevurderingPanel from './VedtakAvslagRevurderingPanel';
import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';
import VedtakOpphorRevurderingPanel from './VedtakOpphorRevurderingPanel';
import VedtakRedusertUtbetalingArsaker from './VedtakRedusertUtbetalingArsaker';

interface OwnProps {
  ytelseTypeKode: string;
  behandlingresultat: { type: string };
  resultatstruktur: string;
  tilbakekrevingvalg: {
    videreBehandling: string;
  };
  simuleringResultat: any;
  resultatstrukturOriginalBehandling: any;
  bgPeriodeMedAvslagsårsak: any;
  behandlingStatusKode: string;
  vilkar: Vilkar[];
  aksjonspunkter: Aksjonspunkt[];
  sprakkode: string;
  readOnly: boolean;
  vedtakVarsel: any;
  medlemskapFom: string;
  harRedusertUtbetaling: boolean;
  redusertUtbetalingArsak: string[];
  formikValues: any;
  erSendtInnUtenArsaker: boolean;
  behandlingArsaker: Behandling['behandlingÅrsaker'];
}

const RevurderingPaneler = ({
  ytelseTypeKode,
  behandlingresultat,
  resultatstruktur,
  tilbakekrevingvalg,
  simuleringResultat,
  resultatstrukturOriginalBehandling,
  bgPeriodeMedAvslagsårsak,
  behandlingStatusKode,
  vilkar,
  aksjonspunkter,
  sprakkode,
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
            beregningResultat={resultatstruktur}
            tilbakekrevingvalg={tilbakekrevingvalg}
            simuleringResultat={simuleringResultat}
            originaltBeregningResultat={resultatstrukturOriginalBehandling}
            bgPeriodeMedAvslagsårsak={bgPeriodeMedAvslagsårsak}
            kodeverkNavnFraKode={kodeverkNavnFraKode}
          />
        )}
        {isAvslag(behandlingresultat.type) && (
          <VedtakAvslagRevurderingPanel
            behandlingStatusKode={behandlingStatusKode}
            beregningResultat={resultatstruktur}
            vilkar={vilkar}
            aksjonspunkter={aksjonspunkter}
            behandlingsresultat={behandlingresultat}
            sprakkode={sprakkode}
            readOnly={readOnly}
            originaltBeregningResultat={resultatstrukturOriginalBehandling}
            tilbakekrevingvalg={tilbakekrevingvalg}
            simuleringResultat={simuleringResultat}
            vedtakVarsel={vedtakVarsel}
            ytelseTypeKode={ytelseTypeKode}
            kodeverkNavnFraKode={kodeverkNavnFraKode}
          />
        )}
        {isOpphor(behandlingresultat.type) && (
          <VedtakOpphorRevurderingPanel
            revurderingsAarsakString={revurderingsAarsakString}
            ytelseTypeKode={ytelseTypeKode}
            behandlingsresultat={behandlingresultat}
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
