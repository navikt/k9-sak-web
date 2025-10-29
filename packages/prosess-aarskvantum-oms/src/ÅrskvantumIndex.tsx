import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  Aksjonspunkt,
  ArbeidsforholdV2,
  ArbeidsgiverOpplysningerPerId,
  Behandling,
  KodeverkMedNavn,
} from '@k9-sak-web/types';
import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import messages from '../i18n/nb_NO.json';
import AksjonspunktForm9014 from './components/AksjonspunktForm9014';
import Uttaksplan from './components/Uttaksplan';
import SaerligeSmittevernhensynMikrofrontend from './components/saerlige-smittevernhensyn/SaerligeSmittevernhensynMikrofrontend';
import Aktivitet from './dto/Aktivitet';
import { fosterbarnDto } from './dto/FosterbarnDto';
import ÅrskvantumForbrukteDager from './dto/ÅrskvantumForbrukteDager';

export interface ÅrsakvantumIndexProps {
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

  const årskvantumDok = aksjonspunkt => aksjonspunkt.definisjon.kode === aksjonspunktCodes.VURDER_ÅRSKVANTUM_DOK;

  const apForVurderÅrskvantum: Aksjonspunkt = aksjonspunkterForSteg.find(ap => årskvantumDok(ap));
  const aksjonspunkter: Aksjonspunkt[] = aksjonspunkterForSteg.filter(ap => !årskvantumDok(ap));
  const åpenAksjonspunkt = aksjonspunkter.find(ap => ap.status.kode !== aksjonspunktStatus.UTFORT) !== undefined;

  const visAPVurderÅrskvantumDokIOmsorgsdagerFrontend =
    apForVurderÅrskvantum !== undefined &&
    (!åpenAksjonspunkt || apForVurderÅrskvantum.status.kode === aksjonspunktStatus.UTFORT);

  const propsTilMikrofrontend = {
    submitCallback,
    behandling,
    saerligSmittevernAp: apForVurderÅrskvantum,
    aktiviteter: sisteUttaksplan?.aktiviteter,
  };

  return (
          {aksjonspunkter.length > 0 && (
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
      />  );
};

export default ÅrskvantumIndex;
