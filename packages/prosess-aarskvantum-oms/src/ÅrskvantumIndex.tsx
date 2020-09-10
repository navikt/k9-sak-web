import React, { FunctionComponent } from 'react';
import { createIntlCache, createIntl, RawIntlProvider } from 'react-intl';
import { Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import Aksjonspunkt from '@k9-sak-web/types/src/aksjonspunktTsType';
import InntektArbeidYtelse from '@k9-sak-web/types/src/inntektArbeidYtelseTsType';
import messages from '../i18n/nb_NO.json';
import ÅrskvantumForbrukteDager from './dto/ÅrskvantumForbrukteDager';
import Uttaksplan from './components/Uttaksplan';
import AksjonspunktForm from './components/AksjonspunktForm';
import Aktivitet from './dto/Aktivitet';

const cache = createIntlCache();

export const årskvantumIntl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface ÅrsakvantumIndexProps {
  fullUttaksplan: {
    aktiviteter?: Aktivitet[];
  };
  årskvantum: ÅrskvantumForbrukteDager;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  isAksjonspunktOpen: boolean;
  behandling: Behandling;
  submitCallback: (values: any[]) => void;
  aksjonspunkterForSteg?: Aksjonspunkt[];
  inntektArbeidYtelse: InntektArbeidYtelse;
}

const ÅrskvantumIndex: FunctionComponent<ÅrsakvantumIndexProps> = ({
  fullUttaksplan,
  årskvantum,
  alleKodeverk,
  isAksjonspunktOpen,
  behandling,
  submitCallback,
  aksjonspunkterForSteg = [],
  inntektArbeidYtelse,
}) => {
  const { sisteUttaksplan } = årskvantum;
  const aktivitetsstatuser = alleKodeverk[kodeverkTyper.AKTIVITET_STATUS];

  return (
    <RawIntlProvider value={årskvantumIntl}>
      {aksjonspunkterForSteg.length > 0 && (
        <AksjonspunktForm
          aktiviteter={sisteUttaksplan?.aktiviteter}
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          submitCallback={submitCallback}
          aksjonspunkterForSteg={aksjonspunkterForSteg}
          isAksjonspunxktOpen={isAksjonspunktOpen}
        />
      )}
      <Uttaksplan
        aktiviteterBehandling={sisteUttaksplan?.aktiviteter}
        aktiviteterHittilIÅr={fullUttaksplan?.aktiviteter}
        aktivitetsstatuser={aktivitetsstatuser}
        aktiv={sisteUttaksplan?.aktiv}
        // @ts-ignore
        arbeidsforhold={inntektArbeidYtelse.arbeidsforhold}
      />
    </RawIntlProvider>
  );
};

export default ÅrskvantumIndex;
