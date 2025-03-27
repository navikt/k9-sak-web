import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { type InstitusjonAksjonspunktPayload } from '@k9-sak-web/gui/fakta/sykdom-og-opplæring/institusjon/components/InstitusjonForm.js';
import FaktaInstitusjonIndex from '@k9-sak-web/gui/fakta/sykdom-og-opplæring/institusjon/FaktaInstitusjonIndex.js';
import VurderSykdomUperiodisert from '@k9-sak-web/gui/fakta/sykdom-og-opplæring/sykdom/VurderSykdomUperiodisert.js';
import type { Aksjonspunkt } from '@k9-sak-web/types/src/aksjonspunktTsType';
import { Tabs } from '@navikt/ds-react';
import { createContext, useState } from 'react';
import NødvendigOpplæring from './nødvendig-opplæring/NødvendigOpplæring';

const initActiveTab = (aksjonspunkter: Aksjonspunkt[]) => {
  if (
    aksjonspunkter.some(
      ap =>
        ap.definisjon.kode === aksjonspunktCodes.VURDER_LANGVARIG_SYK &&
        ap.status.kode === aksjonspunktStatus.OPPRETTET,
    )
  ) {
    return 'sykdom';
  }
  if (
    aksjonspunkter.some(
      ap =>
        ap.definisjon.kode === aksjonspunktCodes.VURDER_OPPLÆRING && ap.status.kode === aksjonspunktStatus.OPPRETTET,
    )
  ) {
    return 'opplæring';
  }
  if (
    aksjonspunkter.some(
      ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_REISETID && ap.status.kode === aksjonspunktStatus.OPPRETTET,
    )
  ) {
    return 'reisetid';
  }
  return 'institusjon';
};

type payloads =
  | InstitusjonAksjonspunktPayload
  | { langvarigsykdomsvurderingUuid: string }
  | {
      perioder: {
        periode: {
          fom: string;
          tom: string;
        };
        begrunnelse: string;
        nødvendigOpplæring: boolean;
        dokumentertOpplæring: boolean;
      }[];
    };
type aksjonspunktPayload = { kode: string; begrunnelse: string } & payloads;
type SykdomOgOpplæringProps = {
  readOnly: boolean;
  submitCallback: (payload: aksjonspunktPayload[]) => void;
  behandlingUuid: string;
  aksjonspunkter: Aksjonspunkt[];
};

type SykdomOgOpplæringContext = {
  readOnly: boolean;
  løsAksjonspunkt9300: (payload: InstitusjonAksjonspunktPayload) => void;
  løsAksjonspunkt9301: (payload: { langvarigsykdomsvurderingUuid: string; begrunnelse: string }) => void;
  løsAksjonspunkt9302: (payload: {
    periode: {
      fom: string;
      tom: string;
    };
    begrunnelse: string;
    nødvendigOpplæring: boolean;
    dokumentertOpplæring: boolean;
  }) => void;
  behandlingUuid: string;
};

export const SykdomOgOpplæringContext = createContext<SykdomOgOpplæringContext>({
  readOnly: true,
  løsAksjonspunkt9300: () => {},
  løsAksjonspunkt9301: () => {},
  løsAksjonspunkt9302: () => {},
  behandlingUuid: '',
});

const SykdomOgOpplæringIndex = ({
  readOnly,
  submitCallback,
  behandlingUuid,
  aksjonspunkter,
}: SykdomOgOpplæringProps) => {
  const løsAksjonspunkt9300 = (payload: InstitusjonAksjonspunktPayload) => {
    submitCallback([
      {
        kode: aksjonspunktCodes.VURDER_INSTITUSJON,
        ...payload,
      },
    ]);
  };

  const løsAksjonspunkt9301 = (payload: { langvarigsykdomsvurderingUuid: string; begrunnelse: string }) => {
    submitCallback([
      {
        kode: aksjonspunktCodes.VURDER_LANGVARIG_SYK,
        begrunnelse: payload.begrunnelse,
        langvarigsykdomsvurderingUuid: payload.langvarigsykdomsvurderingUuid,
      },
    ]);
  };

  const løsAksjonspunkt9302 = (payload: {
    periode: {
      fom: string;
      tom: string;
    };
    begrunnelse: string;
    nødvendigOpplæring: boolean;
    dokumentertOpplæring: boolean;
  }) => {
    submitCallback([
      {
        kode: aksjonspunktCodes.VURDER_OPPLÆRING,
        begrunnelse: payload.begrunnelse,
        perioder: [
          {
            periode: payload.periode,
            begrunnelse: payload.begrunnelse,
            nødvendigOpplæring: payload.nødvendigOpplæring,
            dokumentertOpplæring: payload.dokumentertOpplæring,
          },
        ],
      },
    ]);
  };

  return (
    <SykdomOgOpplæringContext.Provider
      value={{
        readOnly,
        løsAksjonspunkt9300,
        løsAksjonspunkt9301,
        løsAksjonspunkt9302,
        behandlingUuid,
      }}
    >
      <SykdomOgOpplæring aksjonspunkter={aksjonspunkter} />
    </SykdomOgOpplæringContext.Provider>
  );
};

const SykdomOgOpplæring = ({ aksjonspunkter }: { aksjonspunkter: Aksjonspunkt[] }) => {
  const [activeTab, setActiveTab] = useState(initActiveTab(aksjonspunkter));
  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="institusjon" label="Institusjon" />
        <Tabs.Tab value="sykdom" label="Sykdom" />
        <Tabs.Tab value="opplæring" label="Nødvendig opplæring" />
        <Tabs.Tab value="reisetid" label="Reisetid" />
      </Tabs.List>
      <Tabs.Panel value="institusjon">
        <div className="mt-4">
          <FaktaInstitusjonIndex />
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="sykdom">
        <div className="mt-4">
          <VurderSykdomUperiodisert />
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="opplæring">
        <div className="mt-4">
          <NødvendigOpplæring />
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="reisetid">
        <div className="mt-4">reisetid</div>
      </Tabs.Panel>
    </Tabs>
  );
};

export default SykdomOgOpplæringIndex;
