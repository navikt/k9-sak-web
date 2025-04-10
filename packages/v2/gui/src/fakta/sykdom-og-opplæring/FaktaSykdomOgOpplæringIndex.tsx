import {aksjonspunktCodes} from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import {aksjonspunktStatus} from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import {type InstitusjonAksjonspunktPayload} from './1-institusjon/components/InstitusjonForm.js';
import FaktaInstitusjonIndex from './1-institusjon/FaktaInstitusjonIndex.js';
import SykdomUperiodisertIndex from './2-sykdom/SykdomUperiodisertIndex.js';
import {Tabs} from '@navikt/ds-react';
import {createContext, useContext, useState} from 'react';
import NødvendigOpplæringIndex from './3-nødvendig-opplæring/NødvendigOpplæringIndex.js';
import ReisetidIndex from './4-reisetid/ReisetidIndex.js';
import AksjonspunktIkon from '../../shared/aksjonspunkt-ikon/AksjonspunktIkon.js';
import type {Aksjonspunkt} from '@k9-sak-web/lib/kodeverk/types/Aksjonspunkt.js';
import {useSearchParams} from "react-router";
import tabCodes from "@k9-sak-web/konstanter/src/tabCodes.ts";

const finnTabMedAksjonspunkt = (aksjonspunkter: Aksjonspunkt[]) => {
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

  if (
    aksjonspunkter.some(
      ap =>
        ap.definisjon.kode === aksjonspunktCodes.VURDER_INSTITUSJON && ap.status.kode === aksjonspunktStatus.OPPRETTET,
    )
  ) {
    return 'institusjon';
  }

  return '';
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
    }
  | {
      reisetid: {
        periode: {
          fom: string;
          tom: string;
        };
        begrunnelse: string;
        godkjent: boolean;
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
  løsAksjonspunkt9303: (payload: {
    periode: {
      fom: string;
      tom: string;
    };
    begrunnelse: string;
    godkjent: boolean;
  }) => void;
  behandlingUuid: string;
  aksjonspunkter: Aksjonspunkt[];
};

export const SykdomOgOpplæringContext = createContext<SykdomOgOpplæringContext>({
  readOnly: true,
  løsAksjonspunkt9300: () => {},
  løsAksjonspunkt9301: () => {},
  løsAksjonspunkt9302: () => {},
  løsAksjonspunkt9303: () => {},
  behandlingUuid: '',
  aksjonspunkter: [],
});

const FaktaSykdomOgOpplæringIndex = ({
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

  const løsAksjonspunkt9303 = (payload: {
    periode: {
      fom: string;
      tom: string;
    };
    begrunnelse: string;
    godkjent: boolean;
  }) => {
    submitCallback([
      {
        begrunnelse: payload.begrunnelse,
        kode: aksjonspunktCodes.VURDER_REISETID,
        reisetid: [
          {
            begrunnelse: payload.begrunnelse,
            godkjent: payload.godkjent,
            periode: payload.periode,
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
        løsAksjonspunkt9303,
        behandlingUuid,
        aksjonspunkter,
      }}
    >
      <SykdomOgOpplæring />
    </SykdomOgOpplæringContext.Provider>
  );
};

const SykdomOgOpplæring = () => {
  const { aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const [searchParams] = useSearchParams()
  const initActiveTab = searchParams.get('tab') || finnTabMedAksjonspunkt(aksjonspunkter) || tabCodes.INSTITUSJON
  const [activeTab, setActiveTab] = useState(initActiveTab);
  const aksjonspunktTab = finnTabMedAksjonspunkt(aksjonspunkter);
  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab
          value={tabCodes.INSTITUSJON}
          label="Institusjon"
          icon={aksjonspunktTab === 'institusjon' && <AksjonspunktIkon />}
        />
        <Tabs.Tab value={tabCodes.SYKDOM} label="Sykdom" icon={aksjonspunktTab === 'sykdom' && <AksjonspunktIkon/>}/>
        <Tabs.Tab
          value={tabCodes.OPPLÆRING}
          label="Nødvendig opplæring"
          icon={aksjonspunktTab === 'opplæring' && <AksjonspunktIkon />}
        />
        <Tabs.Tab value={tabCodes.RESISETID} label="Reisetid"
                  icon={aksjonspunktTab === 'reisetid' && <AksjonspunktIkon/>}/>
      </Tabs.List>
      <Tabs.Panel value={tabCodes.INSTITUSJON}>
        <div className="mt-4">
          <FaktaInstitusjonIndex />
        </div>
      </Tabs.Panel>
      <Tabs.Panel value={tabCodes.SYKDOM}>
        <div className="mt-4">
          <SykdomUperiodisertIndex />
        </div>
      </Tabs.Panel>
      <Tabs.Panel value={tabCodes.OPPLÆRING}>
        <div className="mt-4">
          <NødvendigOpplæringIndex />
        </div>
      </Tabs.Panel>
      <Tabs.Panel value={tabCodes.RESISETID}>
        <div className="mt-4">
          <ReisetidIndex />
        </div>
      </Tabs.Panel>
    </Tabs>
  );
};

export default FaktaSykdomOgOpplæringIndex;
