import Vurderingsnavigasjon, {
  type Vurderingselement,
} from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { Alert, Button } from '@navikt/ds-react';
import { createContext, useContext, useState } from 'react';
import { PlusIcon } from '@navikt/aksel-icons';
import { useLangvarigSykVurderingerFagsak, useVurdertLangvarigSykdom } from '../SykdomOgOpplæringQueries';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import SykdomUperiodisertFormContainer from './SykdomUperiodisertFormContainer';
import { NavigationWithDetailView } from '../../../shared/navigation-with-detail-view/NavigationWithDetailView';
import { Period } from '@navikt/ft-utils';
import NavigasjonsmenyRad from './NavigasjonsmenyRad';
import { utledResultat } from './utils';
import { utledGodkjent } from './utils';
import type {
  LangvarigSykdomVurderingDto,
  ValgtLangvarigSykdomVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { CenteredLoader } from '../CenteredLoader';

export const SykdomUperiodisertContext = createContext<{
  setNyVurdering: (nyVurdering: boolean) => void;
}>({
  setNyVurdering: () => {},
});

const SykdomUperiodisertIndex = () => {
  const { behandlingUuid, readOnly, løsAksjonspunkt9301, aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const harAksjonspunkt9301 = !!aksjonspunkter.find(akspunkt => akspunkt.definisjon.kode === '9301');

  const { data: langvarigSykVurderinger, isLoading: isLoadingLangvarigSykVurderinger } =
    useLangvarigSykVurderingerFagsak(behandlingUuid);
  const { data: vurderingBruktIAksjonspunkt, isLoading: isLoadingVurderingBruktIAksjonspunkt } =
    useVurdertLangvarigSykdom(behandlingUuid);
  useVurdertLangvarigSykdom(behandlingUuid);
  const mappedVurderinger = langvarigSykVurderinger?.map(element => ({
    ...element,
    godkjent: utledGodkjent(element) as 'ja' | 'nei' | 'mangler_dokumentasjon',
  }));
  const vurderingsliste = langvarigSykVurderinger?.map(element => ({
    ...element,
    perioder: element.vurdertTidspunkt ? [new Period(element.vurdertTidspunkt, element.vurdertTidspunkt)] : [],
    id: element.uuid,
    resultat: utledResultat(element),
  }));

  const [valgtPeriode, setValgtPeriode] = useState<Vurderingselement | null>(null);
  const [nyVurdering, setNyVurdering] = useState<boolean>(false);

  const velgPeriode = (periode: Vurderingselement) => {
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
        <Warning vurderinger={langvarigSykVurderinger} vurderingBruktIAksjonspunkt={vurderingBruktIAksjonspunkt} />
        <NavigationWithDetailView
          navigationSection={() => (
            <Vurderingsnavigasjon
              perioderTilVurdering={vurderingsliste || []}
              vurdertePerioder={[]}
              onPeriodeClick={velgPeriode}
              customPeriodeRad={(periode, onPeriodeClick) => (
                <NavigasjonsmenyRad
                  periode={periode}
                  active={periode.id === valgtPeriode?.id}
                  valgt={periode.id === vurderingBruktIAksjonspunkt?.vurderingUuid}
                  datoOnClick={() => onPeriodeClick(periode)}
                  benyttOnClick={() =>
                    løsAksjonspunkt9301({
                      langvarigsykdomsvurderingUuid: periode.uuid,
                      begrunnelse: periode.begrunnelse,
                    })
                  }
                />
              )}
            />
          )}
          showDetailSection
          belowNavigationContent={
            !readOnly &&
            harAksjonspunkt9301 && (
              <Button variant="tertiary" icon={<PlusIcon />} onClick={handleNyVurdering}>
                Legg til ny sykdomsvurdering
              </Button>
            )
          }
          detailSection={() => {
            if (nyVurdering) {
              return (
                <SykdomUperiodisertFormContainer
                  vurdering={{
                    diagnosekoder: [],
                    begrunnelse: '',
                    godkjent: '',
                  }}
                />
              );
            }
            if (valgtVurdering) {
              return <SykdomUperiodisertFormContainer vurdering={valgtVurdering} />;
            }
            return null;
          }}
        />
      </SykdomUperiodisertContext.Provider>
    </>
  );
};

const Warning = ({
  vurderinger = [],
  vurderingBruktIAksjonspunkt,
}: {
  vurderinger: LangvarigSykdomVurderingDto[] | undefined;
  vurderingBruktIAksjonspunkt: ValgtLangvarigSykdomVurderingDto | undefined;
}) => {
  const { readOnly, behandlingUuid, aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const harAksjonspunkt9301 = !!aksjonspunkter.find(akspunkt => akspunkt.definisjon.kode === '9301');

  const harVurderingFraTidligereBehandling = vurderinger.some(v => v.behandlingUuid !== behandlingUuid);
  if (vurderingBruktIAksjonspunkt?.resultat !== 'MÅ_VURDERES' || readOnly || !harAksjonspunkt9301) {
    return null;
  }

  if (harVurderingFraTidligereBehandling) {
    return (
      <Alert className="my-5" variant="warning">
        Det er tidligere vurdert om barnet har en funksjonshemning eller en langvarig sykdom. Bekreft om tidligere
        sykdomsvurdering gjelder for ny periode eller legg til en ny sykdomsvurdering.
      </Alert>
    );
  }

  return (
    <Alert className="my-5" variant="warning">
      Vurder om barnet har en funksjonshemning eller en langvarig sykdom.
    </Alert>
  );
};

export default SykdomUperiodisertIndex;
