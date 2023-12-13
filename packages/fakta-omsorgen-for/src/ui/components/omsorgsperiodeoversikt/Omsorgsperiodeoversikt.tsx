import React, { useContext, useEffect } from 'react';
import { NavigationWithDetailView } from '@navikt/ft-plattform-komponenter';
import hash from 'object-hash';
import OmsorgsperiodeoversiktType from '../../../types/Omsorgsperiodeoversikt';
import Omsorgsperiode from '../../../types/Omsorgsperiode';
import OmsorgsperiodeoversiktMessages from '../omsorgsperiodeoversikt-messages/OmsorgsperiodeoversiktMessages';
import Periodenavigasjon from '../periodenavigasjon/Periodenavigasjon';
import OmsorgsperiodeVurderingsdetaljer from '../omsorgsperiode-vurderingsdetaljer/OmsorgsperiodeVurderingsdetaljer';
import VurderingAvOmsorgsperioderForm from '../vurdering-av-omsorgsperioder-form/VurderingAvOmsorgsperioderForm';
import Fosterbarn from '../fosterbarn/Fosterbarn';
import ContainerContext from '../../context/ContainerContext';
import Ytelsestype from '../../../types/Ytelsestype';

interface OmsorgsperiodeoversiktProps {
  omsorgsperiodeoversikt: OmsorgsperiodeoversiktType;
}

const Omsorgsperiodeoversikt = ({ omsorgsperiodeoversikt }: OmsorgsperiodeoversiktProps): JSX.Element => {
  const { readOnly, sakstype } = useContext(ContainerContext);
  const [valgtPeriode, setValgtPeriode] = React.useState<Omsorgsperiode>(null);
  const [erRedigeringsmodus, setErRedigeringsmodus] = React.useState(false);
  const [fosterbarn, setFosterbarn] = React.useState<string[]>([]);

  const perioderTilVurdering = omsorgsperiodeoversikt.finnPerioderTilVurdering();
  const vurderteOmsorgsperioder = omsorgsperiodeoversikt.finnVurdertePerioder();

  const velgPeriode = (periode: Omsorgsperiode) => {
    setValgtPeriode(periode);
    setErRedigeringsmodus(false);
  };

  useEffect(() => {
    if (omsorgsperiodeoversikt.harPerioderTilVurdering()) {
      setValgtPeriode(perioderTilVurdering[0]);
    }
  }, []);

  return (
    <>
      <OmsorgsperiodeoversiktMessages omsorgsperiodeoversikt={omsorgsperiodeoversikt} />
      {sakstype === Ytelsestype.OMP && !readOnly && <Fosterbarn setFosterbarn={setFosterbarn} />}
      <NavigationWithDetailView
        navigationSection={() => (
          <Periodenavigasjon
            perioderTilVurdering={perioderTilVurdering}
            vurdertePerioder={vurderteOmsorgsperioder}
            onPeriodeValgt={velgPeriode}
            harValgtPeriode={valgtPeriode !== null}
          />
        )}
        showDetailSection={!!valgtPeriode}
        detailSection={() => {
          if (perioderTilVurdering.includes(valgtPeriode) || erRedigeringsmodus) {
            return (
              <VurderingAvOmsorgsperioderForm
                key={hash(valgtPeriode)}
                omsorgsperiode={valgtPeriode}
                onAvbryt={() => velgPeriode(null)}
                fosterbarn={fosterbarn}
              />
            );
          }
          return (
            <OmsorgsperiodeVurderingsdetaljer
              omsorgsperiode={valgtPeriode}
              onEditClick={() => setErRedigeringsmodus(true)}
              registrertForeldrerelasjon={omsorgsperiodeoversikt.registrertForeldrerelasjon}
            />
          );
        }}
      />
    </>
  );
};

export default Omsorgsperiodeoversikt;
