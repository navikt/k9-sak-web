import { type JSX } from 'react';
import { useIntl } from 'react-intl';

import { isAvslag, isInnvilget, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { fagsakYtelsesType, FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { HGrid } from '@navikt/ds-react';
import {
  AvslagsårsakPrPeriodeDto,
  TilbakekrevingValgDto,
  VilkårMedPerioderDto,
} from '@navikt/k9-sak-typescript-client';
import { FormikState } from 'formik';
import { BeregningResultat } from '../../types/BeregningResultat';
import VedtakSimuleringResultat from '../../types/VedtakSimuleringResultat';
import { VedtakVarsel } from '../../types/VedtakVarsel';
import VedtakAvslagRevurderingPanel from './VedtakAvslagRevurderingPanel';
import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';
import VedtakOpphorRevurderingPanel from './VedtakOpphorRevurderingPanel';
import VedtakRedusertUtbetalingArsaker from './VedtakRedusertUtbetalingArsaker';

interface OwnProps {
  ytelseTypeKode: FagsakYtelsesType;
  behandlingresultat: BeregningResultat;
  tilbakekrevingvalg: TilbakekrevingValgDto;
  simuleringResultat: VedtakSimuleringResultat;
  bgPeriodeMedAvslagsårsak?: AvslagsårsakPrPeriodeDto;
  vilkar: VilkårMedPerioderDto[];
  readOnly: boolean;
  vedtakVarsel: VedtakVarsel;
  medlemskapFom: string;
  harRedusertUtbetaling: boolean;
  redusertUtbetalingArsak: string[];
  formikValues: FormikState<any>['values'];
  erSendtInnUtenArsaker: boolean;
}

const RevurderingPaneler = ({
  ytelseTypeKode,
  behandlingresultat,
  tilbakekrevingvalg,
  simuleringResultat,
  bgPeriodeMedAvslagsårsak,
  vilkar,
  readOnly,
  vedtakVarsel,
  medlemskapFom,
  harRedusertUtbetaling,
  redusertUtbetalingArsak,
  formikValues,
  erSendtInnUtenArsaker,
}: OwnProps): JSX.Element => {
  const intl = useIntl();
  const { kodeverkNavnFraKode, behandlingType } = useKodeverkContext();

  return (
    <HGrid gap="space-4" columns={{ xs: ytelseTypeKode === fagsakYtelsesType.FRISINN ? '4fr 8fr' : '12fr' }}>
      <div>
        {isInnvilget(behandlingresultat.type) && (
          <VedtakInnvilgetRevurderingPanel
            ytelseTypeKode={ytelseTypeKode}
            behandlingsresultat={behandlingresultat}
            tilbakekrevingvalg={tilbakekrevingvalg}
            simuleringResultat={simuleringResultat}
            bgPeriodeMedAvslagsårsak={bgPeriodeMedAvslagsårsak}
            kodeverkNavnFraKode={kodeverkNavnFraKode}
            behandlingType={behandlingType}
          />
        )}
        {isAvslag(behandlingresultat.type) && (
          <VedtakAvslagRevurderingPanel
            vilkar={vilkar}
            tilbakekrevingvalg={tilbakekrevingvalg}
            simuleringResultat={simuleringResultat}
            ytelseTypeKode={ytelseTypeKode}
            kodeverkNavnFraKode={kodeverkNavnFraKode}
            behandlingType={behandlingType}
          />
        )}
        {isOpphor(behandlingresultat.type) && (
          <VedtakOpphorRevurderingPanel
            ytelseTypeKode={ytelseTypeKode}
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
