import React from 'react';
import { createIntlCache, createIntl, RawIntlProvider } from 'react-intl';
import {
  Behandling,
  KodeverkMedNavn,
  ArbeidsgiverOpplysningerPerId,
  Aksjonspunkt,
  ArbeidsforholdV2, FeatureToggles,
} from '@k9-sak-web/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
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
  featureToggles: FeatureToggles;
}

const ÅrskvantumIndex = ({
  fullUttaksplan,
  årskvantum,
  alleKodeverk,
  isAksjonspunktOpen,
  behandling,
  submitCallback,
  aksjonspunkterForSteg = [],
  arbeidsforhold = [],
  arbeidsgiverOpplysningerPerId,
  featureToggles
}: ÅrsakvantumIndexProps) => {
  const { sisteUttaksplan } = årskvantum;
  const aktivitetsstatuser = alleKodeverk[kodeverkTyper.AKTIVITET_STATUS];

  const apForVurderÅrskvantumDok: Aksjonspunkt = aksjonspunkterForSteg.find(
    ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_ÅRSKVANTUM_DOK,
  );
  const aksjonspunkter: Aksjonspunkt[] = aksjonspunkterForSteg.filter(
    ap => ap.definisjon.kode !== aksjonspunktCodes.VURDER_ÅRSKVANTUM_DOK,
  );
  const åpenAksjonspunkt = aksjonspunkter.find(ap => ap.status.kode !== aksjonspunktStatus.UTFORT) !== undefined;

  const visAPVurderÅrskvantumDokIOmsorgsdagerFrontend =
    apForVurderÅrskvantumDok !== undefined &&
    (!åpenAksjonspunkt || apForVurderÅrskvantumDok.status.kode === aksjonspunktStatus.UTFORT);

  const propsTilMikrofrontend = {
    submitCallback,
    behandling,
    saerligSmittevernAp: apForVurderÅrskvantumDok,
    aktiviteter: sisteUttaksplan?.aktiviteter
  };

  return (
    <RawIntlProvider value={årskvantumIntl}>
      {aksjonspunkter.length > 0 && (
        <AksjonspunktForm
          aktiviteter={sisteUttaksplan?.aktiviteter}
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          submitCallback={submitCallback}
          aksjonspunkterForSteg={aksjonspunkter}
          isAksjonspunktOpen={isAksjonspunktOpen && !visAPVurderÅrskvantumDokIOmsorgsdagerFrontend}
        />
      )}

      {visAPVurderÅrskvantumDokIOmsorgsdagerFrontend && (
        <SaerligeSmittevernhensynMikrofrontend
          {...propsTilMikrofrontend}
        />
      )}

      <Uttaksplan
        behandlingUuid={behandling.uuid}
        aktiviteterBehandling={sisteUttaksplan?.aktiviteter}
        aktiviteterHittilIÅr={fullUttaksplan?.aktiviteter}
        aktivitetsstatuser={aktivitetsstatuser}
        aktiv={sisteUttaksplan?.aktiv}
        arbeidsforhold={arbeidsforhold}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={featureToggles}
      />
    </RawIntlProvider>
  );
};

export default ÅrskvantumIndex;
