import type { k9_sak_kontrakt_omsorg_OmsorgenForDto as OmsorgenForDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { Box, Heading } from '@navikt/ds-react';
import { InteractiveList } from '@navikt/ft-plattform-komponenter';
import React, { useEffect, type JSX } from 'react';
import styles from './periodenavigasjon.module.css';
import PeriodeSomSkalVurderes from './PeriodeSomSkalVurderes';
import { usePrevious } from './util/hooks';
import { sortPeriodsByFomDate } from './util/periodUtils';
import { hentResultatFraPeriode } from './util/utils';
import VurderingsperiodeElement from './VurderingsperiodeElement';
interface PeriodenavigasjonProps {
  perioderTilVurdering: OmsorgenForDto[];
  vurdertePerioder: OmsorgenForDto[];
  onPeriodeValgt: (periode: OmsorgenForDto) => void;
  harValgtPeriode: boolean;
}

const Periodenavigasjon = ({
  perioderTilVurdering,
  vurdertePerioder,
  onPeriodeValgt,
  harValgtPeriode,
}: PeriodenavigasjonProps): JSX.Element => {
  const harPerioderSomSkalVurderes = perioderTilVurdering?.length > 0;
  const [activeIndex, setActiveIndex] = React.useState(harPerioderSomSkalVurderes ? 0 : -1);
  const previousHarValgtPeriode = usePrevious(harValgtPeriode);

  useEffect(() => {
    if (harValgtPeriode === false && previousHarValgtPeriode === true) {
      setActiveIndex(-1);
    }
  }, [harValgtPeriode, previousHarValgtPeriode]);

  const vurdertePerioderElements = vurdertePerioder
    .sort((op1, op2) => {
      const omsorgsperiode1 = op1.periode;
      const omsorgsperiode2 = op2.periode;
      return omsorgsperiode1 && omsorgsperiode2 ? sortPeriodsByFomDate(omsorgsperiode1, omsorgsperiode2) : 0;
    })
    .map(omsorgsperiode => {
      const { periode } = omsorgsperiode;
      if (!periode) {
        return <></>;
      }
      return <VurderingsperiodeElement periode={periode} resultat={hentResultatFraPeriode(omsorgsperiode)} />;
    });

  const periodeTilVurderingElements = perioderTilVurdering.map(({ periode }) => {
    if (!periode) {
      return <></>;
    }
    return <PeriodeSomSkalVurderes periode={periode} />;
  });

  const perioder = [...perioderTilVurdering, ...vurdertePerioder];
  const elements = [...periodeTilVurderingElements, ...vurdertePerioderElements];
  const antallPerioder = elements.length;

  return (
    <div className={styles.vurderingsnavigasjon}>
      <Box.New marginBlock="0 6">
        <Heading size="small" level="2" className={styles.vurderingsnavigasjonHeading}>
          Alle perioder
        </Heading>
      </Box.New>
      {antallPerioder === 0 && <p>Ingen vurderinger å vise</p>}
      {antallPerioder > 0 && (
        <div className={styles.vurderingsvelgerContainer}>
          <InteractiveList
            elements={elements.map((element, currentIndex) => ({
              content: element,
              active: activeIndex === currentIndex,
              key: `${currentIndex}`,
              onClick: () => {
                setActiveIndex(currentIndex);
                const periodeIndex = elements.indexOf(element);
                if (perioder[periodeIndex]) {
                  onPeriodeValgt(perioder[periodeIndex]);
                }
              },
            }))}
          />
        </div>
      )}
    </div>
  );
};

export default Periodenavigasjon;
