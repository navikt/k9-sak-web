import { BodyShort, Heading, Tag } from '@navikt/ds-react';
import {
  ContentWithTooltip,
  EditedBySaksbehandlerIcon,
  InfoIcon,
  InteractiveList,
  WarningIcon,
} from '@navikt/ft-plattform-komponenter';
import { Period, sortPeriodsByFomDate } from '@fpsak-frontend/utils';
import React, { useEffect } from 'react';
import ManuellVurdering from '../../../types/ManuellVurdering';
import Vurderingselement from '../../../types/Vurderingselement';
import usePrevious from '../../../util/hooks';
import AddButton from '../add-button/AddButton';
import VurderingsperiodeElement from '../vurderingsperiode/VurderingsperiodeElement';
import Vurderingsperioder from '../vurderingsperioder/Vurderingsperioder';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import styles from './vurderingsnavigasjon.css';

interface VurderingsnavigasjonProps {
  vurderingselementer: Vurderingselement[];
  onNyVurderingClick: (perioder?: Period[]) => void;
  onVurderingValgt: (vurdering: Vurderingselement) => void;
  resterendeVurderingsperioder?: Period[];
  visRadForNyVurdering?: boolean;
  visParterLabel?: boolean;
  visOpprettVurderingKnapp?: boolean;
  resterendeValgfrieVurderingsperioder?: Period[];
}

const Vurderingsnavigasjon = ({
  vurderingselementer,
  onNyVurderingClick,
  onVurderingValgt,
  resterendeVurderingsperioder,
  visRadForNyVurdering,
  visParterLabel,
  visOpprettVurderingKnapp,
  resterendeValgfrieVurderingsperioder,
}: VurderingsnavigasjonProps): JSX.Element => {
  const harPerioderSomSkalVurderes = resterendeVurderingsperioder?.length > 0;
  const [activeIndex, setActiveIndex] = React.useState(harPerioderSomSkalVurderes ? 0 : -1);
  const previousVisRadForNyVurdering = usePrevious(visRadForNyVurdering);
  const harValgfrieVurderingsperioder = resterendeValgfrieVurderingsperioder?.length > 0;

  useEffect(() => {
    if (visRadForNyVurdering === false && previousVisRadForNyVurdering === true) {
      setActiveIndex(-1);
    }
  }, [visRadForNyVurdering]);

  const sorterteVurderingselementer: Vurderingselement[] = React.useMemo(
    () => vurderingselementer.sort((p1, p2) => sortPeriodsByFomDate(p1.periode, p2.periode)).reverse(),
    [vurderingselementer],
  );

  const vurderingsperiodeElements = sorterteVurderingselementer.map(vurderingsperiode => {
    const visOverlappetikett =
      harPerioderSomSkalVurderes &&
      resterendeVurderingsperioder.some((søknadsperiode: Period) =>
        søknadsperiode.overlapsWith(vurderingsperiode.periode),
      );

    return (
      <VurderingsperiodeElement
        vurderingselement={vurderingsperiode}
        visParterLabel={visParterLabel}
        renderAfterElement={() => (
          <div className={styles.vurderingsperiode__postElementContainer}>
            {(vurderingsperiode as ManuellVurdering).endretIDenneBehandlingen && (
              <ContentWithTooltip tooltipText="Vurderingen er opprettet i denne behandlingen">
                <EditedBySaksbehandlerIcon />
              </ContentWithTooltip>
            )}

            {visOverlappetikett && (
              <Tag variant="info" size="small">
                Overlapp
              </Tag>
            )}
          </div>
        )}
      />
    );
  });

  const allElements = [...vurderingsperiodeElements];
  if (harPerioderSomSkalVurderes) {
    allElements.unshift(
      <Vurderingsperioder
        indicatorContentRenderer={() => (
          <ContentWithTooltip tooltipText="Perioden må vurderes">
            <WarningIcon />
          </ContentWithTooltip>
        )}
        visParterLabel={visParterLabel}
        perioder={resterendeVurderingsperioder || []}
      />,
    );
  } else if (harValgfrieVurderingsperioder) {
    allElements.unshift(
      <Vurderingsperioder
        indicatorContentRenderer={() => (
          <ContentWithTooltip tooltipText="Perioden kan vurderes">
            <InfoIcon />
          </ContentWithTooltip>
        )}
        visParterLabel={visParterLabel}
        perioder={resterendeValgfrieVurderingsperioder || []}
      />,
    );
  }

  if (visRadForNyVurdering) {
    allElements.unshift(
      <Tag variant="info" size="small">
        Ny vurdering
      </Tag>,
    );
  }

  return (
    <div className={styles.vurderingsnavigasjon}>
      <div className={styles.vurderingsnavigasjon__headingContainer}>
        <Heading size="small" level="2" className={styles.vurderingsnavigasjon__heading}>
          Alle perioder
        </Heading>
        {visOpprettVurderingKnapp && (
          <WriteAccessBoundContent
            contentRenderer={() => (
              <AddButton
                label="Ny vurdering"
                className={styles.vurderingsnavigasjon__opprettVurderingKnapp}
                onClick={() => {
                  setActiveIndex(0);
                  onNyVurderingClick();
                }}
                ariaLabel="Opprett vurdering"
              />
            )}
          />
        )}
      </div>
      {allElements.length === 0 && (
        <p className={styles.vurderingsnavigasjon__ingenVurderinger}>Ingen vurderinger å vise</p>
      )}
      {allElements.length > 0 && (
        <div className={styles.vurderingsvelgerContainer}>
          <div className={styles.vurderingsvelgerContainer__columnHeadings}>
            <div className={styles['vurderingsvelgerContainer__columnHeading--first']}>
              <BodyShort weight="semibold" size="small">
                Status
              </BodyShort>
            </div>
            <div className={styles['vurderingsvelgerContainer__columnHeading--second']}>
              <BodyShort weight="semibold" size="small">
                Periode
              </BodyShort>
            </div>
            {visParterLabel && (
              <div className={styles['vurderingsvelgerContainer__columnHeading--third']}>
                <BodyShort weight="semibold" size="small">
                  Part
                </BodyShort>
              </div>
            )}
          </div>
          <InteractiveList
            elements={allElements.map((element, currentIndex) => ({
              content: element,
              active: activeIndex === currentIndex,
              key: `${currentIndex}`,
              onClick: () => {
                setActiveIndex(currentIndex);

                const vurderingsperiodeIndex = vurderingsperiodeElements.indexOf(element);
                const erEnEksisterendeVurdering = vurderingsperiodeIndex > -1;
                if (erEnEksisterendeVurdering) {
                  onVurderingValgt(sorterteVurderingselementer[vurderingsperiodeIndex]);
                } else if (visRadForNyVurdering && currentIndex === 0) {
                  onNyVurderingClick();
                } else {
                  onNyVurderingClick(resterendeVurderingsperioder);
                }
              },
            }))}
          />
        </div>
      )}
    </div>
  );
};

export default Vurderingsnavigasjon;
