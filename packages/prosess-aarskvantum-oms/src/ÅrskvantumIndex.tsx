import kodeverkTyper from '@k9-sak-web/kodeverk/src/kodeverkTyper';
import { useFeatureToggles } from '@k9-sak-web/shared-components';
import {
  Aksjonspunkt,
  ArbeidsforholdV2,
  ArbeidsgiverOpplysningerPerId,
  Behandling,
  KodeverkMedNavn,
} from '@k9-sak-web/types';
import React from 'react';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import messages from '../i18n/nb_NO.json';
import AksjonspunktForm from './components/AksjonspunktForm';
import AksjonspunktForm9014 from './components/AksjonspunktForm9014';
import Uttaksplan from './components/Uttaksplan';
import SaerligeSmittevernhensynMikrofrontend from './components/saerlige-smittevernhensyn/SaerligeSmittevernhensynMikrofrontend';
import Aktivitet from './dto/Aktivitet';
import { fosterbarnDto } from './dto/FosterbarnDto';
import ÅrskvantumForbrukteDager from './dto/ÅrskvantumForbrukteDager';

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
  fosterbarn?: fosterbarnDto[];
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
  fosterbarn,
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
  const [featureToggles] = useFeatureToggles();

  const propsTilMikrofrontend = {
    submitCallback,
    behandling,
    saerligSmittevernAp: apForVurderÅrskvantumDok,
    aktiviteter: sisteUttaksplan?.aktiviteter,
    featureToggles,
  };

  return (
    <RawIntlProvider value={årskvantumIntl}>
      {aksjonspunkter.length > 0 && featureToggles.AKSJONSPUNKT_9014 && (
        <AksjonspunktForm9014
          aktiviteter={sisteUttaksplan?.aktiviteter}
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          submitCallback={submitCallback}
          aksjonspunkterForSteg={aksjonspunkter}
          isAksjonspunktOpen={isAksjonspunktOpen && !visAPVurderÅrskvantumDokIOmsorgsdagerFrontend}
          fosterbarn={fosterbarn}
        />
      )}
      {aksjonspunkter.length > 0 && !featureToggles.AKSJONSPUNKT_9014 && (
        <AksjonspunktForm
          aktiviteter={sisteUttaksplan?.aktiviteter}
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          submitCallback={submitCallback}
          aksjonspunkterForSteg={aksjonspunkter}
          isAksjonspunktOpen={isAksjonspunktOpen && !visAPVurderÅrskvantumDokIOmsorgsdagerFrontend}
          fosterbarn={fosterbarn}
        />
      )}

      {visAPVurderÅrskvantumDokIOmsorgsdagerFrontend && (
        <SaerligeSmittevernhensynMikrofrontend {...propsTilMikrofrontend} />
      )}

      <Uttaksplan
        behandlingUuid={behandling.uuid}
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
