import Vurderingsnavigasjon, {
  Resultat,
  type Vurderingselement,
} from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';
import { Alert, BodyLong, BodyShort, Button } from '@navikt/ds-react';
import { createContext, useContext, useState } from 'react';
import { CheckmarkIcon, PlusIcon } from '@navikt/aksel-icons';
import { useLangvarigSykVurderingerFagsak, useVurdertLangvarigSykdom } from '../SykdomOgOpplæringQueries';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import {
  LangvarigSykdomVurderingDtoAvslagsårsak,
  type LangvarigSykdomVurderingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import SykdomUperiodisertFormContainer from './SykdomUperiodisertFormContainer';
import { NavigationWithDetailView } from '../../../shared/navigation-with-detail-view/NavigationWithDetailView';
import { Period } from '@navikt/ft-utils';
import { RadStatus } from '../../../shared/vurderingsperiode-navigasjon/PeriodeRad';
import styles from '../../../shared/vurderingsperiode-navigasjon/periodeRad.module.css';
const utledResultat = (element: LangvarigSykdomVurderingDto) => {
  if (element.godkjent) {
    return Resultat.OPPFYLT;
  }
  if (element.godkjent === false) {
    return Resultat.IKKE_OPPFYLT;
  }
  return Resultat.IKKE_VURDERT;
};

const utledGodkjent = (element: LangvarigSykdomVurderingDto) => {
  if (element.godkjent) {
    return 'ja';
  }
  if (element.avslagsårsak === LangvarigSykdomVurderingDtoAvslagsårsak.MANGLENDE_DOKUMENTASJON) {
    return 'mangler_dokumentasjon';
  }
  return 'nei';
};

export const SykdomUperiodisertContext = createContext<{
  setNyVurdering: (nyVurdering: boolean) => void;
}>({
  setNyVurdering: () => {},
});
const VurderSykdomUperiodisert = () => {
  const { behandlingUuid, readOnly, løsAksjonspunkt9301 } = useContext(SykdomOgOpplæringContext);
  const { data: langvarigSykVurderingerFagsak } = useLangvarigSykVurderingerFagsak(behandlingUuid);
  const { data: vurdertLangvarigSykdom } = useVurdertLangvarigSykdom(behandlingUuid);
  const mappedVurderinger = langvarigSykVurderingerFagsak?.map(element => ({
    ...element,
    godkjent: utledGodkjent(element) as 'ja' | 'nei' | 'mangler_dokumentasjon',
  }));
  const vurderingsliste = langvarigSykVurderingerFagsak?.map(element => ({
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

  return (
    <>
      <SykdomUperiodisertContext.Provider value={{ setNyVurdering }}>
        <NavigationWithDetailView
          navigationSection={() => (
            <Vurderingsnavigasjon
              perioderTilVurdering={vurderingsliste || []}
              vurdertePerioder={[]}
              onPeriodeClick={velgPeriode}
              customPeriodeRad={(periode, onPeriodeClick) => (
                <SykdomUperiodisertPeriodeRad
                  periode={periode}
                  active={periode.id === valgtPeriode?.id}
                  valgt={periode.id === vurdertLangvarigSykdom?.vurderingUuid}
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
            !readOnly && (
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

const SykdomUperiodisertPeriodeRad = ({
  periode,
  active,
  valgt,
  datoOnClick,
  benyttOnClick,
}: {
  periode: Vurderingselement;
  active: boolean;
  valgt: boolean;
  benyttOnClick: () => void;
  datoOnClick: () => void;
}) => {
  return (
    <div
      className={`flex p-4 text-left w-full ${styles.interactiveListElement} ${active ? styles.interactiveListElementActive : styles.interactiveListElementInactive}`}
    >
      <div className="flex justify-between w-full">
        <div className="flex items-center">
          <RadStatus resultat={periode.resultat} />

          <div className="flex ml-3 items-center">
            <Button
              className={`${active ? 'text-text-default pointer-events-none' : 'text-blue-500 underline'}`}
              onClick={datoOnClick}
              size="small"
              variant="tertiary"
            >
              {periode.perioder[0]?.prettifyPeriod().split(' - ')[0]}
            </Button>
          </div>
        </div>
        {valgt ? (
          <div className="flex gap-1 ml-[-4px]">
            <CheckmarkIcon fontSize={24} className="text-green-500" />
            <BodyShort className="mt-[2px]">Valgt</BodyShort>
          </div>
        ) : (
          <div className="flex items-center">
            <Button onClick={benyttOnClick} size="small">
              Benytt
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const BekreftAlert = ({ vurderinger }: { vurderinger: LangvarigSykdomVurderingDto[] }) => {
  return (
    <Alert variant="info">
      <BodyLong>
        <strong>Bekreft</strong> at du har vurdert alle sykdomsvurderingene.
      </BodyLong>
    </Alert>
  );
};

export default VurderSykdomUperiodisert;
