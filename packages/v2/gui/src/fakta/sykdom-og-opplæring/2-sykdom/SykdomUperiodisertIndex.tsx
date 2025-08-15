import Vurderingsnavigasjon, {
  type Vurderingselement,
} from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { Button } from '@navikt/ds-react';
import { createContext, useContext, useEffect, useState } from 'react';
import { PlusIcon } from '@navikt/aksel-icons';
import { useLangvarigSykVurderingerFagsak, useVurdertLangvarigSykdom } from '../SykdomOgOpplæringQueries';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import SykdomUperiodisertContainer from './SykdomUperiodisertContainer';
import { NavigationWithDetailView } from '../../../shared/navigation-with-detail-view/NavigationWithDetailView';
import { Period } from '@navikt/ft-utils';
import NavigasjonsmenyRad from './NavigasjonsmenyRad';
import { utledResultat } from './utils';
import { utledGodkjent } from './utils';
import {
  type k9_kodeverk_vilkår_Avslagsårsak as Avslagsårsak,
  type k9_sak_kontrakt_behandling_SaksnummerDto as SaksnummerDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { CenteredLoader } from '../CenteredLoader';
import type { UperiodisertSykdom } from './SykdomUperiodisertForm';
import SykdomUperiodisertAlert from './SykdomUperiodisertAlert';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';

export const SykdomUperiodisertContext = createContext<{
  setNyVurdering: (nyVurdering: boolean) => void;
}>({
  setNyVurdering: () => {},
});

interface SykdomVurderingselement extends Vurderingselement {
  id: string;
  uuid: string;
  begrunnelse: string;
  behandlingUuid: string;
  godkjent: boolean;
  saksnummer: SaksnummerDto;
  vurdertAv: string;
  vurdertTidspunkt: string;
  avslagsårsak?: Avslagsårsak;
}

const defaultVurdering = {
  diagnosekoder: [],
  begrunnelse: '',
  godkjent: '',
} as UperiodisertSykdom;

const SykdomUperiodisertIndex = () => {
  const { behandlingUuid, readOnly, aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const aksjonspunkt9301 = aksjonspunkter.find(
    akspunkt => akspunkt.definisjon === aksjonspunktCodes.VURDER_LANGVARIG_SYK,
  );

  const { data: langvarigSykVurderinger, isLoading: isLoadingLangvarigSykVurderinger } =
    useLangvarigSykVurderingerFagsak(behandlingUuid);
  const { data: vurderingBruktIAksjonspunkt, isLoading: isLoadingVurderingBruktIAksjonspunkt } =
    useVurdertLangvarigSykdom(behandlingUuid);

  const [valgtPeriode, setValgtPeriode] = useState<SykdomVurderingselement | null>(null);
  const [nyVurdering, setNyVurdering] = useState<boolean>(false);

  useEffect(() => {
    if (langvarigSykVurderinger?.length === 0) {
      setNyVurdering(true);
    }
  }, [langvarigSykVurderinger]);

  const mappedVurderinger = langvarigSykVurderinger?.map(element => ({
    ...element,
    godkjent: utledGodkjent(element),
  }));
  const vurderingsliste = langvarigSykVurderinger?.map(element => ({
    ...element,
    perioder: element.vurdertTidspunkt ? [new Period(element.vurdertTidspunkt, element.vurdertTidspunkt)] : [],
    id: element.uuid,
    resultat: utledResultat(element),
  }));

  const velgPeriode = (periode: SykdomVurderingselement | null) => {
    setValgtPeriode(periode);
    setNyVurdering(false);
  };

  const handleNyVurdering = () => {
    setNyVurdering(true);
    setValgtPeriode(null);
  };

  const valgtVurdering = mappedVurderinger?.find(vurdering => vurdering.uuid === valgtPeriode?.id);

  if (isLoadingLangvarigSykVurderinger || isLoadingVurderingBruktIAksjonspunkt) {
    return <CenteredLoader />;
  }
  return (
    <>
      <SykdomUperiodisertContext.Provider value={{ setNyVurdering }}>
        <SykdomUperiodisertAlert
          vurderinger={langvarigSykVurderinger}
          vurderingBruktIAksjonspunkt={vurderingBruktIAksjonspunkt}
        />
        <NavigationWithDetailView
          navigationSection={() => (
            <Vurderingsnavigasjon<SykdomVurderingselement>
              title="Alle vurderinger"
              valgtPeriode={valgtPeriode}
              perioder={vurderingsliste || []}
              onPeriodeClick={velgPeriode}
              customPeriodeLabel="Vurdert"
              customPeriodeRad={(periode, onPeriodeClick) => (
                <NavigasjonsmenyRad
                  periode={periode}
                  active={periode.id === valgtPeriode?.id}
                  erBruktIAksjonspunkt={periode.id === vurderingBruktIAksjonspunkt?.vurderingUuid}
                  erFraTidligereBehandling={periode.behandlingUuid !== behandlingUuid}
                  onClick={() => onPeriodeClick(periode)}
                />
              )}
            />
          )}
          showDetailSection
          belowNavigationContent={
            !readOnly &&
            !!aksjonspunkt9301 && (
              <Button variant="tertiary" icon={<PlusIcon />} onClick={handleNyVurdering}>
                Legg til ny sykdomsvurdering
              </Button>
            )
          }
          detailSection={() => {
            if (nyVurdering) {
              return <SykdomUperiodisertContainer vurdering={defaultVurdering} />;
            }
            if (valgtVurdering) {
              return <SykdomUperiodisertContainer vurdering={valgtVurdering} />;
            }
            return null;
          }}
        />
      </SykdomUperiodisertContext.Provider>
    </>
  );
};

export default SykdomUperiodisertIndex;
