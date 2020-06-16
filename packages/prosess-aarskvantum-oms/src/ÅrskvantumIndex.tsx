import React, { FunctionComponent } from 'react';
import { createIntlCache, createIntl, RawIntlProvider } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import Aksjonspunkt from '@k9-sak-web/types/src/aksjonspunktTsType';
import messages from '../i18n/nb_NO.json';
import ÅrskvantumForbrukteDager from './dto/ÅrskvantumForbrukteDager';
import Årskvantum from './components/Årskvantum';
import Uttaksplan from './components/Uttaksplan';
import AksjonspunktForm from './components/AksjonspunktForm';
import Aktivitet from './dto/Aktivitet';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface ÅrsakvantumIndexProps {
  årskvantum: ÅrskvantumForbrukteDager;
  aktiviteterHittilIÅr: Aktivitet[];
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  isAksjonspunktOpen: boolean;
  behandling: Behandling;
  submitCallback: (values: any[]) => void;
  aksjonspunkterForSteg?: Aksjonspunkt[];
}

const ÅrskvantumIndex: FunctionComponent<ÅrsakvantumIndexProps> = ({
  årskvantum,
  aktiviteterHittilIÅr,
  alleKodeverk,
  isAksjonspunktOpen,
  behandling,
  submitCallback,
  aksjonspunkterForSteg = [],
}) => {
  const {
    totaltAntallDager,
    antallKoronadager,
    restdager,
    restTid,
    forbrukteDager,
    forbruktTid,
    antallDagerArbeidsgiverDekker,
    antallDagerInfotrygd = 0,
    sisteUttaksplan,
  } = årskvantum;
  const aktivitetsstatuser = alleKodeverk[kodeverkTyper.AKTIVITET_STATUS];

  return (
    <RawIntlProvider value={intl}>
      {aksjonspunkterForSteg.length > 0 && (
        <AksjonspunktForm
          aktiviteter={sisteUttaksplan.aktiviteter}
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          submitCallback={submitCallback}
          aksjonspunkterForSteg={aksjonspunkterForSteg}
          isAksjonspunktOpen={isAksjonspunktOpen}
        />
      )}
      <Årskvantum
        totaltAntallDager={totaltAntallDager}
        antallKoronadager={antallKoronadager}
        restdager={restdager}
        restTid={restTid}
        forbrukteDager={forbrukteDager}
        forbruktTid={forbruktTid}
        antallDagerArbeidsgiverDekker={antallDagerArbeidsgiverDekker}
        antallDagerInfotrygd={antallDagerInfotrygd}
        benyttetRammemelding={sisteUttaksplan.benyttetRammemelding}
        uttaksperioder={sisteUttaksplan.aktiviteter.flatMap(({ uttaksperioder }) => uttaksperioder)}
      />
      <VerticalSpacer sixteenPx />
      <Uttaksplan
        aktiviteterBehandling={sisteUttaksplan.aktiviteter}
        aktiviteterHittilIÅr={aktiviteterHittilIÅr}
        aktivitetsstatuser={aktivitetsstatuser}
        aktiv={sisteUttaksplan.aktiv}
      />
    </RawIntlProvider>
  );
};

export default ÅrskvantumIndex;
