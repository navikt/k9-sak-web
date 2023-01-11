import React from 'react';
import { useIntl } from 'react-intl';

import { Column, Row } from 'nav-frontend-grid';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { isAvslag, isInnvilget, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { redusertUtbetalingArsakType } from '@fpsak-frontend/prosess-vedtak/src/kodeverk/redusertUtbetalingArsak';
import BehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { Aksjonspunkt, KodeverkMedNavn, Vilkar, BehandlingÅrsak } from '@k9-sak-web/types';
import Behandlingsresultat from '@k9-sak-web/types/src/behandlingsresultatTsType';
import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';
import VedtakAvslagRevurderingPanel from './VedtakAvslagRevurderingPanel';
import VedtakOpphorRevurderingPanel from './VedtakOpphorRevurderingPanel';
import VedtakRedusertUtbetalingArsaker from './VedtakRedusertUtbetalingArsaker';

const createAarsakString = (revurderingAarsaker: string[], getKodeverknavn) => {
  if (revurderingAarsaker === undefined || revurderingAarsaker.length < 1) {
    return '';
  }
  const aarsakTekstList = [];
  const endringFraBrukerAarsak = revurderingAarsaker.find(
    aarsak => aarsak === BehandlingArsakType.RE_ENDRING_FRA_BRUKER,
  );
  const alleAndreAarsakerNavn = revurderingAarsaker
    .filter(aarsak => aarsak !== BehandlingArsakType.RE_ENDRING_FRA_BRUKER)
    .map(aarsak => getKodeverknavn(aarsak));
  // Dersom en av årsakene er "RE_ENDRING_FRA_BRUKER" skal alltid denne vises først
  if (endringFraBrukerAarsak) {
    aarsakTekstList.push(getKodeverknavn(endringFraBrukerAarsak));
  }
  aarsakTekstList.push(...alleAndreAarsakerNavn);
  return aarsakTekstList.join(', ');
};
interface OwnProps {
  ytelseTypeKode: string;
  behandlingresultat: Behandlingsresultat;
  resultatstruktur: string;
  tilbakekrevingvalg: {
    videreBehandling: {
      kode: string;
    };
  };
  simuleringResultat: any;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
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
  redusertUtbetalingArsak: redusertUtbetalingArsakType;
  formikValues: any;
  erSendtInnUtenArsaker: boolean;
  behandlingArsaker: BehandlingÅrsak[];
}

const RevurderingPaneler = ({
  ytelseTypeKode,
  behandlingresultat,
  resultatstruktur,
  tilbakekrevingvalg,
  simuleringResultat,
  alleKodeverk,
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

  const behandlingArsakstyper =
    behandlingArsaker && behandlingArsaker.map(({ behandlingArsakType }) => behandlingArsakType);
  const revurderingsAarsakString = createAarsakString(behandlingArsakstyper, getKodeverknavnFn(alleKodeverk));
  return (
    <Row>
      <Column xs={ytelseTypeKode === fagsakYtelseType.FRISINN ? '4' : '12'}>
        {isInnvilget(behandlingresultat.type.kode) && (
          <VedtakInnvilgetRevurderingPanel
            ytelseTypeKode={ytelseTypeKode}
            revurderingsAarsakString={revurderingsAarsakString}
            behandlingsresultat={behandlingresultat}
            beregningResultat={resultatstruktur}
            tilbakekrevingvalg={tilbakekrevingvalg}
            simuleringResultat={simuleringResultat}
            alleKodeverk={alleKodeverk}
            originaltBeregningResultat={resultatstrukturOriginalBehandling}
            bgPeriodeMedAvslagsårsak={bgPeriodeMedAvslagsårsak}
          />
        )}
        {isAvslag(behandlingresultat.type.kode) && (
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
            alleKodeverk={alleKodeverk}
            vedtakVarsel={vedtakVarsel}
            ytelseTypeKode={ytelseTypeKode}
          />
        )}
        {isOpphor(behandlingresultat.type.kode) && (
          <VedtakOpphorRevurderingPanel
            revurderingsAarsakString={revurderingsAarsakString}
            ytelseTypeKode={ytelseTypeKode}
            behandlingsresultat={behandlingresultat}
            resultatstruktur={resultatstruktur}
            medlemskapFom={medlemskapFom}
            vedtakVarsel={vedtakVarsel}
          />
        )}
      </Column>
      {harRedusertUtbetaling && (
        <Column xs="8">
          <VedtakRedusertUtbetalingArsaker
            intl={intl}
            readOnly={readOnly}
            values={new Map(Object.values(redusertUtbetalingArsak).map(key => [key, formikValues[key]]))}
            erSendtInnUtenArsaker={erSendtInnUtenArsaker}
          />
        </Column>
      )}
    </Row>
  );
};

export default RevurderingPaneler;
