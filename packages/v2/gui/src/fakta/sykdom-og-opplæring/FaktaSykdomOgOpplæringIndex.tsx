import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { type InstitusjonAksjonspunktPayload } from './1-institusjon/components/InstitusjonForm.js';
import FaktaInstitusjonIndex from './1-institusjon/FaktaInstitusjonIndex.js';
import SykdomUperiodisertIndex from './2-sykdom/SykdomUperiodisertIndex.js';
import { Alert, Tabs } from '@navikt/ds-react';
import { createContext, useContext, useState } from 'react';
import NødvendigOpplæringIndex from './3-nødvendig-opplæring/NødvendigOpplæringIndex.js';
import ReisetidIndex from './4-reisetid/ReisetidIndex.js';
import AksjonspunktIkon from '../../shared/aksjonspunkt-ikon/AksjonspunktIkon.js';
import type { Aksjonspunkt } from '@k9-sak-web/lib/kodeverk/types/Aksjonspunkt.js';
import { useSearchParams } from 'react-router';
import tabCodes from './tabCodes';
import { useVilkår } from './SykdomOgOpplæringQueries.js';
import {
  OpplæringVurderingDtoResultat,
  VilkårMedPerioderDtoVilkarType,
  VilkårPeriodeDtoVilkarStatus,
  type OpprettLangvarigSykdomsVurderingData,
} from '@k9-sak-web/backend/k9sak/generated';

const finnTabMedAksjonspunkt = (aksjonspunkter: Aksjonspunkt[]) => {
  if (
    aksjonspunkter.some(
      ap =>
        ap.definisjon.kode === aksjonspunktCodes.VURDER_LANGVARIG_SYK &&
        ap.status.kode === aksjonspunktStatus.OPPRETTET,
    )
  ) {
    return tabCodes.SYKDOM;
  }
  if (
    aksjonspunkter.some(
      ap =>
        ap.definisjon.kode === aksjonspunktCodes.VURDER_OPPLÆRING && ap.status.kode === aksjonspunktStatus.OPPRETTET,
    )
  ) {
    return tabCodes.OPPLÆRING;
  }
  if (
    aksjonspunkter.some(
      ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_REISETID && ap.status.kode === aksjonspunktStatus.OPPRETTET,
    )
  ) {
    return tabCodes.REISETID;
  }

  if (
    aksjonspunkter.some(
      ap =>
        ap.definisjon.kode === aksjonspunktCodes.VURDER_INSTITUSJON && ap.status.kode === aksjonspunktStatus.OPPRETTET,
    )
  ) {
    return tabCodes.INSTITUSJON;
  }

  return '';
};

type payloads =
  | InstitusjonAksjonspunktPayload
  | {
      langvarigsykdomsvurderingUuid?: string;
      begrunnelse?: string;
      vurderingData?: OpprettLangvarigSykdomsVurderingData['requestBody'];
    }
  | { behandlingUuid?: string }
  | {
      perioder: {
        periode: {
          fom: string;
          tom: string;
        };
        begrunnelse: string | null;
        nødvendigOpplæring: boolean;
        dokumentertOpplæring: boolean;
        avslagsårsak?: string;
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

type aksjonspunktPayload = { kode: string; begrunnelse?: string | null } & payloads;
type SykdomOgOpplæringProps = {
  readOnly: boolean;
  submitCallback: (payload: aksjonspunktPayload[]) => void;
  behandlingUuid: string;
  aksjonspunkter: Aksjonspunkt[];
};

type SykdomOgOpplæringContext = {
  readOnly: boolean;
  løsAksjonspunkt9300: (payload: InstitusjonAksjonspunktPayload) => void;
  løsAksjonspunkt9301: (
    langvarigsykdomsvurderingUuid?: string,
    vurderingData?: OpprettLangvarigSykdomsVurderingData['requestBody'],
  ) => void;
  løsAksjonspunkt9302: (payload: {
    perioder: {
      periode: {
        fom: string;
        tom: string;
      };
      begrunnelse: string | null;
      avslagsårsak?: string;
      vurdertOpplæringResultat: OpplæringVurderingDtoResultat;
    };
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

  const løsAksjonspunkt9301 = (
    langvarigsykdomsvurderingUuid?: string,
    vurderingData?: OpprettLangvarigSykdomsVurderingData['requestBody'],
  ) => {
    if (langvarigsykdomsvurderingUuid && vurderingData) {
      submitCallback([
        {
          kode: aksjonspunktCodes.VURDER_LANGVARIG_SYK,
          begrunnelse: vurderingData.begrunnelse,
          langvarigsykdomsvurderingUuid,
          vurderingData,
        },
      ]);
      return;
    }
    if (vurderingData) {
      submitCallback([
        {
          kode: aksjonspunktCodes.VURDER_LANGVARIG_SYK,
          begrunnelse: vurderingData.begrunnelse,
          vurderingData,
        },
      ]);
    }

    if (langvarigsykdomsvurderingUuid) {
      submitCallback([
        {
          kode: aksjonspunktCodes.VURDER_LANGVARIG_SYK,
          langvarigsykdomsvurderingUuid,
        },
      ]);
    }
  };

  const løsAksjonspunkt9302 = (payload: {
    periode: {
      fom: string;
      tom: string;
    };
    begrunnelse: string | null;
    nødvendigOpplæring: boolean;
    dokumentertOpplæring: boolean;
    avslagsårsak?: string;
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
            avslagsårsak: payload.avslagsårsak,
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
  const { aksjonspunkter, behandlingUuid } = useContext(SykdomOgOpplæringContext);
  const [searchParams] = useSearchParams();
  const initActiveTab = searchParams.get('tab') || finnTabMedAksjonspunkt(aksjonspunkter) || tabCodes.INSTITUSJON;
  const { data: vilkår } = useVilkår(behandlingUuid);
  const [activeTab, setActiveTab] = useState(initActiveTab);
  const aksjonspunktTab = finnTabMedAksjonspunkt(aksjonspunkter);
  const harAksjonspunkt9300 = !!aksjonspunkter.find(akspunkt => akspunkt.definisjon.kode === '9300');
  const harAksjonspunkt9301 = !!aksjonspunkter.find(akspunkt => akspunkt.definisjon.kode === '9301');
  const harAksjonspunkt9302 = !!aksjonspunkter.find(akspunkt => akspunkt.definisjon.kode === '9302');
  const harAksjonspunkt9303 = !!aksjonspunkter.find(akspunkt => akspunkt.definisjon.kode === '9303');

  // Trenger en ekstra sjekk på institusjon fordi vilkåret kan vurderes automatisk, og da får vi aldri aksjonspunkt
  const institusjonVilkår = vilkår?.find(
    v => v.vilkarType === VilkårMedPerioderDtoVilkarType.GODKJENT_OPPLÆRINGSINSTITUSJON,
  );
  const institusjonVilkårErVurdert = institusjonVilkår?.perioder?.some(
    p =>
      p.vilkarStatus === VilkårPeriodeDtoVilkarStatus.IKKE_OPPFYLT ||
      p.vilkarStatus === VilkårPeriodeDtoVilkarStatus.OPPFYLT,
  );
  return (
    <div className="max-w-[1300px]">
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab
            value={tabCodes.INSTITUSJON}
            label="Institusjon"
            icon={aksjonspunktTab === 'institusjon' && <AksjonspunktIkon />}
          />
          <Tabs.Tab
            value={tabCodes.SYKDOM}
            label="Sykdom"
            icon={aksjonspunktTab === 'sykdom' && <AksjonspunktIkon />}
          />
          <Tabs.Tab
            value={tabCodes.OPPLÆRING}
            label="Nødvendig opplæring"
            icon={aksjonspunktTab === 'opplæring' && <AksjonspunktIkon />}
          />
          <Tabs.Tab
            value={tabCodes.REISETID}
            label="Reisetid"
            icon={aksjonspunktTab === 'reisetid' && <AksjonspunktIkon />}
          />
        </Tabs.List>
        <Tabs.Panel value={tabCodes.INSTITUSJON} lazy={false}>
          <div className="mt-4">
            {harAksjonspunkt9300 || institusjonVilkårErVurdert ? (
              <FaktaInstitusjonIndex />
            ) : (
              <Alert variant="info">Ikke vurdert</Alert>
            )}
          </div>
        </Tabs.Panel>
        <Tabs.Panel value={tabCodes.SYKDOM} lazy={false}>
          <div className="mt-4">
            {harAksjonspunkt9301 ? <SykdomUperiodisertIndex /> : <Alert variant="info">Ikke vurdert</Alert>}
          </div>
        </Tabs.Panel>
        <Tabs.Panel value={tabCodes.OPPLÆRING} lazy={false}>
          <div className="mt-4">
            {harAksjonspunkt9302 ? <NødvendigOpplæringIndex /> : <Alert variant="info">Ikke vurdert</Alert>}
          </div>
        </Tabs.Panel>
        <Tabs.Panel value={tabCodes.REISETID} lazy={false}>
          <div className="mt-4">
            {harAksjonspunkt9303 ? <ReisetidIndex /> : <Alert variant="info">Ikke vurdert</Alert>}
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default FaktaSykdomOgOpplæringIndex;
