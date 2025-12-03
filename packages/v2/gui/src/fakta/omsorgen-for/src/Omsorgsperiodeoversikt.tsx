import type {
  k9_sak_kontrakt_omsorg_OmsorgenForDto as OmsorgenForDto,
  k9_sak_kontrakt_omsorg_OmsorgenForOversiktDto as OmsorgenForOversiktDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { NavigationWithDetailView } from '@k9-sak-web/gui/shared/navigation-with-detail-view/NavigationWithDetailView.js';
import hash from 'object-hash';
import { useState, type JSX } from 'react';
import Fosterbarn from './Fosterbarn';
import OmsorgsperiodeoversiktMessages from './OmsorgsperiodeoversiktMessages';
import OmsorgsperiodeVurderingsdetaljer from './OmsorgsperiodeVurderingsdetaljer';
import Periodenavigasjon from './Periodenavigasjon';
import type { VurderingSubmitValues } from './types/VurderingSubmitValues';
import { finnPerioderTilVurdering, finnVurdertePerioder, harPerioderTilVurdering } from './util/utils';
import VurderingAvOmsorgsperioderForm from './VurderingAvOmsorgsperioderForm';

interface OmsorgsperiodeoversiktProps {
  omsorgsperiodeoversikt: OmsorgenForOversiktDto;
  sakstype?: FagsakYtelsesType;
  readOnly: boolean;
  onFinished: (vurdering: VurderingSubmitValues[], fosterbarnForOmsorgspenger?: string[]) => Promise<void>;
}

const Omsorgsperiodeoversikt = ({
  omsorgsperiodeoversikt,
  sakstype,
  readOnly,
  onFinished,
}: OmsorgsperiodeoversiktProps): JSX.Element => {
  const perioderTilVurdering = finnPerioderTilVurdering(omsorgsperiodeoversikt.omsorgsperioder);

  const [valgtPeriode, setValgtPeriode] = useState<OmsorgenForDto | null>(() => {
    if (harPerioderTilVurdering(omsorgsperiodeoversikt.omsorgsperioder) && perioderTilVurdering[0]) {
      return perioderTilVurdering[0];
    }
    return null;
  });
  const [erRedigeringsmodus, setErRedigeringsmodus] = useState(false);
  const [fosterbarn, setFosterbarn] = useState<string[]>([]);

  const vurderteOmsorgsperioder = finnVurdertePerioder(omsorgsperiodeoversikt.omsorgsperioder);

  const velgPeriode = (periode: OmsorgenForDto) => {
    setValgtPeriode(periode);
    setErRedigeringsmodus(false);
  };

  return (
    <>
      <OmsorgsperiodeoversiktMessages omsorgsperiodeoversikt={omsorgsperiodeoversikt} />
      {sakstype === fagsakYtelsesType.OMSORGSPENGER && !readOnly && (
        <Fosterbarn setFosterbarn={setFosterbarn} readOnly={readOnly} />
      )}
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
          if (valgtPeriode) {
            if (perioderTilVurdering.includes(valgtPeriode) || erRedigeringsmodus) {
              return (
                <VurderingAvOmsorgsperioderForm
                  key={hash(valgtPeriode)}
                  omsorgsperiode={valgtPeriode}
                  onAvbryt={erRedigeringsmodus ? () => setErRedigeringsmodus(false) : undefined}
                  fosterbarn={fosterbarn}
                  onFinished={onFinished}
                  readOnly={readOnly}
                  sakstype={sakstype}
                />
              );
            }
            return (
              <OmsorgsperiodeVurderingsdetaljer
                omsorgsperiode={valgtPeriode}
                onEditClick={() => setErRedigeringsmodus(true)}
                registrertForeldrerelasjon={!!omsorgsperiodeoversikt.registrertForeldrerelasjon}
                readOnly={readOnly}
              />
            );
          }
          return <></>;
        }}
      />
    </>
  );
};

export default Omsorgsperiodeoversikt;
