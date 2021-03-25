import React, { FunctionComponent } from 'react';
import { createIntlCache, createIntl, RawIntlProvider } from 'react-intl';
import {
  Behandling,
  KodeverkMedNavn,
  ArbeidsgiverOpplysningerPerId,
  Aksjonspunkt,
  ArbeidsforholdV2,
} from '@k9-sak-web/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import messages from '../i18n/nb_NO.json';
import ÅrskvantumForbrukteDager from './dto/ÅrskvantumForbrukteDager';
import Uttaksplan from './components/Uttaksplan';
import AksjonspunktForm from './components/AksjonspunktForm';
import Aktivitet from './dto/Aktivitet';
import SaerligeSmittevernhensynMikrofrontend from './components/saerlige-smittevernhensyn/SaerligeSmittevernhensynMikrofrontend';

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
  arbeidsforhold: ArbeidsforholdV2[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

const ÅrskvantumIndex: FunctionComponent<ÅrsakvantumIndexProps> = ({
  fullUttaksplan,
  årskvantum,
  alleKodeverk,
  isAksjonspunktOpen,
  behandling,
  submitCallback,
  aksjonspunkterForSteg = [],
  arbeidsforhold = [],
  arbeidsgiverOpplysningerPerId,
}) => {
  const { sisteUttaksplan } = årskvantum;
  const aktivitetsstatuser = alleKodeverk[kodeverkTyper.AKTIVITET_STATUS];
  return (
    <RawIntlProvider value={årskvantumIntl}>
      {aksjonspunkterForSteg[0]?.definisjon.kode === aksjonspunktCodes.VURDER_ÅRSKVANTUM_DOK && (
        <SaerligeSmittevernhensynMikrofrontend
          {...{
            behandling,
            aksjonspunkterForSteg,
            isAksjonspunktOpen,
            submitCallback,
          }}
        />
      )}
      {aksjonspunkterForSteg.length > 0 &&
        aksjonspunkterForSteg[0]?.definisjon.kode !== aksjonspunktCodes.VURDER_ÅRSKVANTUM_DOK && (
          <AksjonspunktForm
            aktiviteter={sisteUttaksplan?.aktiviteter}
            behandlingId={behandling.id}
            behandlingVersjon={behandling.versjon}
            submitCallback={submitCallback}
            aksjonspunkterForSteg={aksjonspunkterForSteg}
            isAksjonspunktOpen={isAksjonspunktOpen}
          />
        )}
      <Uttaksplan
        aktiviteterBehandling={sisteUttaksplan?.aktiviteter}
        aktiviteterHittilIÅr={fullUttaksplan?.aktiviteter}
        aktivitetsstatuser={aktivitetsstatuser}
        aktiv={sisteUttaksplan?.aktiv}
        arbeidsforhold={arbeidsforhold}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />
    </RawIntlProvider>
  );
};

export default ÅrskvantumIndex;
