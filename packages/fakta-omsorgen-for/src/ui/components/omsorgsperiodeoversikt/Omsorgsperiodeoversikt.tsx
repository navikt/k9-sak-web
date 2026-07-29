import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { NavigationWithDetailView } from '@k9-sak-web/gui/shared/navigation-with-detail-view/NavigationWithDetailView.js';
import hash from 'object-hash';
import React, { type JSX, useEffect } from 'react';
import Omsorgsperiode from '../../../types/Omsorgsperiode';
import OmsorgsperiodeoversiktType from '../../../types/Omsorgsperiodeoversikt';
import { useOmsorgenForContext } from '../../context/ContainerContext';
import Fosterbarn from '../fosterbarn/Fosterbarn';
import OmsorgsperiodeVurderingsdetaljer from '../omsorgsperiode-vurderingsdetaljer/OmsorgsperiodeVurderingsdetaljer';
import OmsorgsperiodeoversiktMessages from '../omsorgsperiodeoversikt-messages/OmsorgsperiodeoversiktMessages';
import Periodenavigasjon from '../periodenavigasjon/Periodenavigasjon';
import VurderingAvOmsorgsperioderForm from '../vurdering-av-omsorgsperioder-form/VurderingAvOmsorgsperioderForm';

interface OmsorgsperiodeoversiktProps {
  omsorgsperiodeoversikt: OmsorgsperiodeoversiktType;
}

const Omsorgsperiodeoversikt = ({ omsorgsperiodeoversikt }: OmsorgsperiodeoversiktProps): JSX.Element => {
  const { readOnly, sakstype } = useOmsorgenForContext();
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
    const [førstePeriodeTilRedigering] = omsorgsperiodeoversikt.finnRedigerbarePerioder();
    if (førstePeriodeTilRedigering) {
      setValgtPeriode(førstePeriodeTilRedigering);
    }
  }, []);

  return (
    <>
      <OmsorgsperiodeoversiktMessages omsorgsperiodeoversikt={omsorgsperiodeoversikt} />
      {sakstype === fagsakYtelsesType.OMSORGSPENGER && !readOnly && <Fosterbarn setFosterbarn={setFosterbarn} />}
      <NavigationWithDetailView
        navigationSection={() => (
          <Periodenavigasjon
            perioderTilVurdering={perioderTilVurdering}
            vurdertePerioder={vurderteOmsorgsperioder}
            onPeriodeValgt={velgPeriode}
            valgtPeriode={valgtPeriode}
          />
        )}
        showDetailSection={!!valgtPeriode}
        detailSection={() => {
          if (valgtPeriode?.skalVisesIRedigeringsmodus() || erRedigeringsmodus) {
            return (
              <VurderingAvOmsorgsperioderForm
                key={hash(valgtPeriode)}
                omsorgsperiode={valgtPeriode}
                onAvbryt={erRedigeringsmodus ? () => setErRedigeringsmodus(false) : undefined}
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
