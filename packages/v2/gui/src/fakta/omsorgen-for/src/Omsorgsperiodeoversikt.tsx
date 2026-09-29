import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { NorskIdentDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/NorskIdentDto.js';
import type { OmsorgenForDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/OmsorgenForDto.js';
import type { OmsorgenForOversiktDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/OmsorgenForOversiktDto.js';
import { NavigationWithDetailView } from '@k9-sak-web/gui/shared/navigation-with-detail-view/NavigationWithDetailView.js';
import hash from 'object-hash';
import { useRef, useState, type JSX } from 'react';
import Fosterbarn, { type FosterbarnHandle } from './Fosterbarn';
import OmsorgsperiodeoversiktMessages from './OmsorgsperiodeoversiktMessages';
import OmsorgsperiodeVurderingsdetaljer from './OmsorgsperiodeVurderingsdetaljer';
import Periodenavigasjon from './Periodenavigasjon';
import type { VurderingSubmitValues } from './types/VurderingSubmitValues';
import {
  finnPerioderTilVurdering,
  finnRedigerbarePerioder,
  finnVurdertePerioder,
  skalVisesIRedigeringsmodus,
} from './util/utils';
import VurderingAvOmsorgsperioderForm from './VurderingAvOmsorgsperioderForm';

interface OmsorgsperiodeoversiktProps {
  omsorgsperiodeoversikt: OmsorgenForOversiktDto;
  sakstype?: FagsakYtelsesType;
  readOnly: boolean;
  onFinished: (vurdering: VurderingSubmitValues[], fosterbarnForOmsorgspenger?: NorskIdentDto[]) => Promise<void>;
}

const Omsorgsperiodeoversikt = ({
  omsorgsperiodeoversikt,
  sakstype,
  readOnly,
  onFinished,
}: OmsorgsperiodeoversiktProps): JSX.Element => {
  const perioderTilVurdering = finnPerioderTilVurdering(omsorgsperiodeoversikt.omsorgsperioder);

  const [valgtPeriode, setValgtPeriode] = useState<OmsorgenForDto | null>(
    () => finnRedigerbarePerioder(omsorgsperiodeoversikt.omsorgsperioder)[0] ?? null,
  );
  const [erRedigeringsmodus, setErRedigeringsmodus] = useState(false);
  const fosterbarnRef = useRef<FosterbarnHandle>(null);

  const vurderteOmsorgsperioder = finnVurdertePerioder(omsorgsperiodeoversikt.omsorgsperioder);

  const velgPeriode = (periode: OmsorgenForDto) => {
    setValgtPeriode(periode);
    setErRedigeringsmodus(false);
  };

  return (
    <>
      <OmsorgsperiodeoversiktMessages
        omsorgsperiodeoversikt={omsorgsperiodeoversikt}
        readOnly={readOnly}
        sakstype={sakstype}
      />
      {sakstype === fagsakYtelsesType.OMSORGSPENGER && !readOnly && (
        <Fosterbarn ref={fosterbarnRef} readOnly={readOnly} />
      )}
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
          if (valgtPeriode) {
            if (skalVisesIRedigeringsmodus(valgtPeriode) || erRedigeringsmodus) {
              return (
                <VurderingAvOmsorgsperioderForm
                  key={hash(valgtPeriode)}
                  omsorgsperiode={valgtPeriode}
                  onAvbryt={erRedigeringsmodus ? () => setErRedigeringsmodus(false) : undefined}
                  hentValiderteFosterbarn={() =>
                    fosterbarnRef.current?.hentValiderteFosterbarn() ?? Promise.resolve([])
                  }
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
                sakstype={sakstype}
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
