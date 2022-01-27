import React from 'react';
import { useIntl } from 'react-intl';

import { Column, Row } from 'nav-frontend-grid';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { isAvslag, isInnvilget, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { redusertUtbetalingArsakType } from '@fpsak-frontend/prosess-vedtak/src/kodeverk/redusertUtbetalingArsak';
import { dokumentdatatype } from '@k9-sak-web/konstanter';
import { Aksjonspunkt, Kodeverk, KodeverkMedNavn, Vilkar } from '../../../../types';
import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';
import VedtakAvslagRevurderingPanel from './VedtakAvslagRevurderingPanel';
import VedtakOpphorRevurderingPanel from './VedtakOpphorRevurderingPanel';
import VedtakRedusertUtbetalingArsaker from './VedtakRedusertUtbetalingArsaker';

interface OwnProps {
  ytelseTypeKode: string;
  behandlingresultat: {
    type: {
      kode: string;
    };
  };
  antallBarn: number;
  revurderingsAarsakString: string;
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
  sprakkode: Kodeverk;
  readOnly: boolean;
  vedtakVarsel: any;
  medlemskapFom: string;
  harRedusertUtbetaling: boolean;
  redusertUtbetalingArsak: redusertUtbetalingArsakType;
  formProps: any;
  erSendtInnUtenArsaker: boolean;
  dokumentdata: any;
}

export default function RevurderingPaneler({
  ytelseTypeKode,
  behandlingresultat,
  antallBarn,
  revurderingsAarsakString,
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
  formProps,
  erSendtInnUtenArsaker,
  dokumentdata,
}: OwnProps): JSX.Element {
  const intl = useIntl();
  return (
    <Row>
      <Column xs={ytelseTypeKode === fagsakYtelseType.FRISINN ? '4' : '12'}>
        {isInnvilget(behandlingresultat.type.kode) && (
          <VedtakInnvilgetRevurderingPanel
            antallBarn={antallBarn}
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
            values={new Map(Object.values(redusertUtbetalingArsak).map(a => [a, !!formProps[a]]))}
            vedtakVarsel={vedtakVarsel}
            erSendtInnUtenArsaker={erSendtInnUtenArsaker}
            merkedeArsaker={dokumentdata?.[dokumentdatatype.REDUSERT_UTBETALING_AARSAK]}
          />
        </Column>
      )}
    </Row>
  );
}
