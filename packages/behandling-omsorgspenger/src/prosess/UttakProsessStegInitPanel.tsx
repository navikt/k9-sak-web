import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import ÅrskvantumIndex from '@k9-sak-web/prosess-aarskvantum-oms';
import type ÅrskvantumForbrukteDager from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';
import type { fosterbarnDto } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/FosterbarnDto';
import type {
  Aksjonspunkt,
  ArbeidsforholdV2,
  ArbeidsgiverOpplysningerPerId,
  Behandling,
  KodeverkMedNavn,
} from '@k9-sak-web/types';
import { K9SakProsessApi } from '@k9-sak-web/gui/behandling/prosess/api/K9SakProsessApi.js';
import {
  aksjonspunkterQueryOptions,
  arbeidsgiverOpplysningerQueryOptions,
  forbrukteDagerQueryOptions,
} from '@k9-sak-web/gui/behandling/prosess/api/k9SakQueryOptions.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { ProsessStegIkkeBehandlet } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeBehandlet.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useContext } from 'react';
import RestApiState from '../../../rest-api-hooks/src/RestApiState';
import { OmsorgspengerBehandlingApiKeys, restApiOmsorgHooks } from '../data/omsorgspengerBehandlingApi';

const PANEL_ID = prosessStegCodes.UTTAK;

const uttakAksjonspunktKoder = [
  AksjonspunktDefinisjon.VURDER_ÅRSKVANTUM_KVOTE,
  AksjonspunktDefinisjon.ÅRSKVANTUM_FOSTERBARN,
  AksjonspunktDefinisjon.VURDER_ÅRSKVANTUM_DOK,
];

type LegacyAksjonspunktInput = AksjonspunktDto & {
  definisjon: NonNullable<AksjonspunktDto['definisjon']>;
  status: NonNullable<AksjonspunktDto['status']>;
  kanLoses: boolean;
  erAktivt: boolean;
};

const harLegacyAksjonspunktfelter = (aksjonspunkt: AksjonspunktDto): aksjonspunkt is LegacyAksjonspunktInput =>
  !!aksjonspunkt.definisjon &&
  !!aksjonspunkt.status &&
  typeof aksjonspunkt.kanLoses === 'boolean' &&
  typeof aksjonspunkt.erAktivt === 'boolean';

interface Props {
  api: K9SakProsessApi;
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  fosterbarn?: fosterbarnDto[];
  submitCallback: (aksjonspunktModels: any[], aksjonspunkter?: AksjonspunktDto[]) => Promise<any>;
}

export function UttakProsessStegInitPanel(props: Props) {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  const erTilBehandlingEllerBehandlet = !!prosessPanelContext?.erTilBehandlingEllerBehandlet(PANEL_ID);

  const [{ data: forbrukteDager }, { data: aksjonspunkter = [] }, { data: arbeidsgiverOpplysningerPerId }] =
    useSuspenseQueries({
      queries: [
        forbrukteDagerQueryOptions(props.api, props.behandling),
        aksjonspunkterQueryOptions(props.api, props.behandling, uttakAksjonspunktKoder),
        arbeidsgiverOpplysningerQueryOptions(props.api, props.behandling),
      ],
    });

  const restApiData = restApiOmsorgHooks.useMultipleRestApi<{
    fullUttaksplan: { aktiviteter?: any[] };
    arbeidsforhold: ArbeidsforholdV2[];
  }>(
    [{ key: OmsorgspengerBehandlingApiKeys.FULL_UTTAKSPLAN }, { key: OmsorgspengerBehandlingApiKeys.ARBEIDSFORHOLD }],
    { keepData: true, suspendRequest: !erTilBehandlingEllerBehandlet, updateTriggers: [props.behandling.versjon] },
  );

  if (!erValgt) {
    return null;
  }

  if (!erTilBehandlingEllerBehandlet) {
    return <ProsessStegIkkeBehandlet />;
  }

  if (
    restApiData.state === RestApiState.NOT_STARTED ||
    restApiData.state === RestApiState.LOADING ||
    !restApiData.data?.fullUttaksplan ||
    !restApiData.data.arbeidsforhold ||
    !forbrukteDager
  ) {
    return null;
  }

  const aksjonspunkterForSteg = aksjonspunkter
    .filter(harLegacyAksjonspunktfelter)
    .map((aksjonspunkt): Aksjonspunkt => ({
      definisjon: { kode: aksjonspunkt.definisjon, kodeverk: 'AKSJONSPUNKT_DEF' },
      status: { kode: aksjonspunkt.status, kodeverk: 'AKSJONSPUNKT_STATUS' },
      begrunnelse: aksjonspunkt.begrunnelse,
      kanLoses: aksjonspunkt.kanLoses,
      erAktivt: aksjonspunkt.erAktivt,
    }));

  const handleSubmit = (aksjonspunktModels: any[]) => props.submitCallback(aksjonspunktModels, aksjonspunkter);
  const indexProps = {
    fullUttaksplan: restApiData.data.fullUttaksplan,
    // V2-spørringen leverer uttaksdataene som legacy-komponenten forventer.
    årskvantum: forbrukteDager as ÅrskvantumForbrukteDager,
    alleKodeverk: props.alleKodeverk,
    isAksjonspunktOpen: aksjonspunkter.some(aksjonspunkt => isAksjonspunktOpen(aksjonspunkt.status)),
    behandling: props.behandling,
    submitCallback: handleSubmit,
    aksjonspunkterForSteg,
    arbeidsforhold: restApiData.data.arbeidsforhold,
    // V2-DTO-en mangler det legacy-feltet erPrivatPerson; panelet bruker arbeidsgivernavnene.
    arbeidsgiverOpplysningerPerId: (arbeidsgiverOpplysningerPerId.arbeidsgivere ||
      {}) as unknown as ArbeidsgiverOpplysningerPerId,
    fosterbarn: props.fosterbarn,
  };

  return <ÅrskvantumIndex {...indexProps} />;
}
