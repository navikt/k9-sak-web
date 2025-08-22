import { aksjonspunktCodes, type AksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { harÅpentAksjonspunkt, harAksjonspunkt, aksjonspunktErUtført } from '../../utils/aksjonspunktUtils.js';
import { type InstitusjonAksjonspunktPayload } from './1-institusjon/components/InstitusjonForm.js';
import FaktaInstitusjonIndex from './1-institusjon/FaktaInstitusjonIndex.js';
import SykdomUperiodisertIndex from './2-sykdom/SykdomUperiodisertIndex.js';
import { Alert, Tabs } from '@navikt/ds-react';
import { createContext, useContext, useState } from 'react';
import NødvendigOpplæringIndex from './3-nødvendig-opplæring/NødvendigOpplæringIndex.js';
import ReisetidIndex from './4-reisetid/ReisetidIndex.js';
import AksjonspunktIkon from '../../shared/aksjonspunkt-ikon/AksjonspunktIkon.js';
import type { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as Aksjonspunkt } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { useSearchParams } from 'react-router';
import tabCodes from './tabCodes';
import {
  useInstitusjonInfo,
  useVurdertReisetid,
  useVilkår,
  useVurdertOpplæring,
  useVurdertLangvarigSykdom,
} from './SykdomOgOpplæringQueries.js';
import {
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringResultat as OpplæringVurderingDtoResultat,
  k9_kodeverk_vilkår_VilkårType as VilkårMedPerioderDtoVilkarType,
  k9_kodeverk_vilkår_Utfall as VilkårPeriodeDtoVilkarStatus,
  type OpprettLangvarigSykdomsVurderingData,
  k9_kodeverk_vilkår_Avslagsårsak as OpplæringVurderingDtoAvslagsårsak,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonResultat as InstitusjonVurderingDtoResultat,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidResultat as ReisetidVurderingDtoResultat,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_sykdom_LangvarigSykdomResultat as LangvarigSykdomVurderingDtoResultat,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { CheckmarkIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { DelvisOppfyltIkon } from '../../shared/DelvisOppfyltIkon.js';

export type nødvendigOpplæringPayload = {
  perioder: {
    periode: {
      fom: string;
      tom: string;
    };
    begrunnelse: string | null;
    resultat: OpplæringVurderingDtoResultat;
    avslagsårsak?: OpplæringVurderingDtoAvslagsårsak;
  }[];
};

const finnTabMedAksjonspunkt = (aksjonspunkter: Aksjonspunkt[]) => {
  if (harÅpentAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_LANGVARIG_SYK)) {
    return tabCodes.SYKDOM;
  }
  if (harÅpentAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_OPPLÆRING)) {
    return tabCodes.OPPLÆRING;
  }
  if (harÅpentAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_REISETID)) {
    return tabCodes.REISETID;
  }
  if (harÅpentAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_INSTITUSJON)) {
    return tabCodes.INSTITUSJON;
  }

  return '';
};

type payloads =
  | InstitusjonAksjonspunktPayload
  | {
      langvarigsykdomsvurderingUuid?: string;
      begrunnelse?: string;
      vurderingData?: OpprettLangvarigSykdomsVurderingData['body'];
    }
  | { behandlingUuid?: string }
  | nødvendigOpplæringPayload
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
    vurderingData?: OpprettLangvarigSykdomsVurderingData['body'],
  ) => void;
  løsAksjonspunkt9302: (payload: nødvendigOpplæringPayload) => void;
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
    vurderingData?: OpprettLangvarigSykdomsVurderingData['body'],
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

  const løsAksjonspunkt9302 = (payload: nødvendigOpplæringPayload) => {
    submitCallback([
      {
        kode: aksjonspunktCodes.VURDER_OPPLÆRING,
        begrunnelse: payload.perioder[0]?.begrunnelse,
        perioder: [...payload.perioder],
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
  const harAksjonspunkt9300 = harAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_INSTITUSJON);
  const harAksjonspunkt9301 = harAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_LANGVARIG_SYK);
  const harAksjonspunkt9302 = harAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_OPPLÆRING);
  const harAksjonspunkt9303 = harAksjonspunkt(aksjonspunkter, aksjonspunktCodes.VURDER_REISETID);

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
            icon={<InstitusjonIcon aksjonspunktKode={aksjonspunktCodes.VURDER_INSTITUSJON} />}
          />
          <Tabs.Tab
            value={tabCodes.SYKDOM}
            label="Sykdom"
            icon={<SykdomIcon aksjonspunktKode={aksjonspunktCodes.VURDER_LANGVARIG_SYK} />}
          />
          <Tabs.Tab
            value={tabCodes.OPPLÆRING}
            label="Nødvendig opplæring"
            icon={<OpplæringIcon aksjonspunktKode={aksjonspunktCodes.VURDER_OPPLÆRING} />}
          />
          <Tabs.Tab
            value={tabCodes.REISETID}
            label="Reisetid"
            icon={<ReisetidIcon aksjonspunktKode={aksjonspunktCodes.VURDER_REISETID} />}
          />
        </Tabs.List>
        <Tabs.Panel value={tabCodes.INSTITUSJON} lazy={false}>
          <div className="mt-4">
            {harAksjonspunkt9300 || institusjonVilkårErVurdert ? (
              <FaktaInstitusjonIndex />
            ) : (
              <Alert variant="info" size="small">
                Ikke vurdert
              </Alert>
            )}
          </div>
        </Tabs.Panel>
        <Tabs.Panel value={tabCodes.SYKDOM} lazy={false}>
          <div className="mt-4">
            {harAksjonspunkt9301 ? (
              <SykdomUperiodisertIndex />
            ) : (
              <Alert variant="info" size="small">
                Ikke vurdert
              </Alert>
            )}
          </div>
        </Tabs.Panel>
        <Tabs.Panel value={tabCodes.OPPLÆRING} lazy={false}>
          <div className="mt-4">
            {harAksjonspunkt9302 ? (
              <NødvendigOpplæringIndex />
            ) : (
              <Alert variant="info" size="small">
                Ikke vurdert
              </Alert>
            )}
          </div>
        </Tabs.Panel>
        <Tabs.Panel value={tabCodes.REISETID} lazy={false}>
          <div className="mt-4">
            {harAksjonspunkt9303 ? (
              <ReisetidIndex />
            ) : (
              <Alert variant="info" size="small">
                Ikke vurdert
              </Alert>
            )}
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

const InstitusjonIcon = ({ aksjonspunktKode }: { aksjonspunktKode: AksjonspunktCodes }) => {
  const { behandlingUuid } = useContext(SykdomOgOpplæringContext);
  const { data: institusjonInfo } = useInstitusjonInfo(behandlingUuid);

  if (!institusjonInfo) {
    return null;
  }

  return (
    <Icon
      aksjonspunktKode={aksjonspunktKode}
      godkjent={institusjonInfo.vurderinger.map(
        v =>
          v.resultat === InstitusjonVurderingDtoResultat.GODKJENT_MANUELT ||
          v.resultat === InstitusjonVurderingDtoResultat.GODKJENT_AUTOMATISK,
      )}
    />
  );
};

const SykdomIcon = ({ aksjonspunktKode }: { aksjonspunktKode: AksjonspunktCodes }) => {
  const { behandlingUuid } = useContext(SykdomOgOpplæringContext);
  const { data: sykdomInfo } = useVurdertLangvarigSykdom(behandlingUuid);

  if (!sykdomInfo) {
    return null;
  }

  return (
    <Icon
      aksjonspunktKode={aksjonspunktKode}
      godkjent={[sykdomInfo.resultat === LangvarigSykdomVurderingDtoResultat.GODKJENT]}
    />
  );
};

const OpplæringIcon = ({ aksjonspunktKode }: { aksjonspunktKode: AksjonspunktCodes }) => {
  const { behandlingUuid } = useContext(SykdomOgOpplæringContext);
  const { data: opplæringInfo } = useVurdertOpplæring(behandlingUuid);

  if (!opplæringInfo) {
    return null;
  }

  return (
    <Icon
      aksjonspunktKode={aksjonspunktKode}
      godkjent={opplæringInfo.vurderinger.map(
        v =>
          v.resultat === OpplæringVurderingDtoResultat.GODKJENT ||
          v.resultat === OpplæringVurderingDtoResultat.VURDERES_SOM_REISETID,
      )}
    />
  );
};

const ReisetidIcon = ({ aksjonspunktKode }: { aksjonspunktKode: AksjonspunktCodes }) => {
  const { behandlingUuid, aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const { data: reisetidInfo } = useVurdertReisetid(behandlingUuid);

  const aksjonspunktForNødvendigOpplæringErÅpent = harÅpentAksjonspunkt(
    aksjonspunkter,
    aksjonspunktCodes.VURDER_OPPLÆRING,
  );

  if (!reisetidInfo || aksjonspunktForNødvendigOpplæringErÅpent) {
    return null;
  }

  return (
    <Icon
      aksjonspunktKode={aksjonspunktKode}
      godkjent={reisetidInfo.vurderinger.map(v => v.reisetid.resultat === ReisetidVurderingDtoResultat.GODKJENT)}
    />
  );
};

const Icon = ({ aksjonspunktKode, godkjent }: { aksjonspunktKode: AksjonspunktCodes; godkjent: boolean[] }) => {
  const { aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const aksjonspunktErÅpent = harÅpentAksjonspunkt(aksjonspunkter, aksjonspunktKode);
  const aksjonspunktUtført = aksjonspunktErUtført(aksjonspunkter, aksjonspunktKode);

  if (aksjonspunktErÅpent) {
    return <AksjonspunktIkon />;
  }

  if (aksjonspunktUtført && godkjent.length === 0) {
    return null;
  }

  if (aksjonspunktUtført && godkjent.every(g => g)) {
    return <CheckmarkIcon className="text-ax-brand-blue-500" />;
  }

  if (aksjonspunktUtført && godkjent.some(g => g) && godkjent.some(g => !g)) {
    return <DelvisOppfyltIkon />;
  }

  if (aksjonspunktUtført && godkjent.every(g => !g)) {
    return <XMarkOctagonFillIcon className="text-ax-danger-600" />;
  }

  return null;
};

export default FaktaSykdomOgOpplæringIndex;
