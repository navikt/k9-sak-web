import classNames from 'classnames';
import React, { CSSProperties, RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PositionedPeriod } from '@k9-sak-web/types/src/tidslinje';
import { ContentWithTooltip } from '@navikt/k9-react-components';
import styles from './TimelinePeriod.less';
import Tooltip from './Tooltip';

interface NonClickablePeriodProps {
  period: PositionedPeriod;
  divRef: RefObject<HTMLDivElement>;
  className?: string;
}

interface ClickablePeriodProps {
  period: PositionedPeriod;
  buttonRef: RefObject<HTMLButtonElement>;
  onSelectPeriod: (period: PositionedPeriod) => void;
  className?: string;
}

interface TimelinePeriodProps {
  period: PositionedPeriod;
  active?: boolean;
  onSelectPeriod?: (period: PositionedPeriod) => void;
}

const ariaLabel = (period: PositionedPeriod): string => {
  const start = period.start.format('DD.MM.YYYY');
  const end = period.endInclusive.format('DD.MM.YYYY');
  return `${period.status} fra ${start} til og med ${end}`;
};

const periodTooltip = (period: PositionedPeriod): string => {
  const fom = period.start.format('DD. MMMM YYYY');
  const tom = period.endInclusive.format('DD. MMMM YYYY');
  return `Periode: ${fom} - ${tom}`;
};

const style = (period: PositionedPeriod): CSSProperties => ({
  [period.direction]: `${period.horizontalPosition}%`,
  width: `${period.width}%`,
});

const ClickablePeriod = ({ buttonRef, period, className, onSelectPeriod }: ClickablePeriodProps) => {
  const [showHoverLabel, setShowHoverLabel] = useState(false);

  const onClick = () => {
    if (!period.disabled) {
      onSelectPeriod?.(period);
    }
  };

  const enableHoverLabel = () => period.hoverLabel && setShowHoverLabel(true);
  const disableHoverLabel = () => period.hoverLabel && setShowHoverLabel(false);
  return (
    <button
      ref={buttonRef}
      className={className}
      onClick={onClick}
      onMouseEnter={enableHoverLabel}
      onMouseLeave={disableHoverLabel}
      aria-label={ariaLabel(period)}
      style={style(period)}
      type="button"
    >
      {period.hoverLabel && showHoverLabel && <Tooltip>{period.hoverLabel}</Tooltip>}
      {period.infoPin && <div className={styles.infoPin} />}
    </button>
  );
};

const tooltipShouldBeLeftAligned = tooltipXAxisPosition => {
  const bodyWidth = document.body.getBoundingClientRect().width;
  return bodyWidth - tooltipXAxisPosition < 300;
};

const NonClickablePeriod = ({ divRef, period, className }: NonClickablePeriodProps) => {
  const [xPosition, setXPosition] = useState(0);

  useLayoutEffect(() => {
    setXPosition(divRef?.current?.getBoundingClientRect().x);
  }, [divRef.current]);

  return (
    <div
      ref={divRef}
      className={`${styles.nonClickablePeriod} ${
        tooltipShouldBeLeftAligned(xPosition) ? styles.tooltipLeft : ''
      } ${className}`}
      aria-label={ariaLabel(period)}
      style={style(period)}
    >
      <ContentWithTooltip tooltipText={periodTooltip(period)}>
        {period.infoPin && <div className={styles.infoPin} />}
      </ContentWithTooltip>
    </div>
  );
};

const TimelinePeriod = ({ period, onSelectPeriod, active }: TimelinePeriodProps) => {
  const ref = useRef<HTMLButtonElement | HTMLDivElement>(null);
  const [isMini, setIsMini] = useState(false);

  const className = classNames(
    'periode',
    styles.periode,
    period.cropped === 'both' && `${styles.sammenhengendeFraBegge} sammenhengendeFraBegge`,
    period.cropped === 'right' &&
      (period.direction === 'left'
        ? `${styles.sammenhengendeFraHøyre} sammenhengendeFraHøyre`
        : `${styles.sammenhengendeFraVenstre} sammenhengendeFraVenstre`),
    period.cropped === 'left' &&
      (period.direction === 'left'
        ? `${styles.sammenhengendeFraVenstre} sammenhengendeFraVenstre`
        : `${styles.sammenhengendeFraHøyre} sammenhengendeFraHøyre`),
    !period.cropped && 'frittstående',
    active && styles.active,
    isMini && styles.mini,
    styles[period.status],
    period.className,
  );

  useLayoutEffect(() => {
    const currentWidth = ref.current?.offsetWidth;
    if (currentWidth && currentWidth < 30) {
      setIsMini(true);
    }
  }, [ref.current]);

  useEffect(() => {
    if (active) ref.current?.focus();
  }, [active]);
  return onSelectPeriod ? (
    <ClickablePeriod
      buttonRef={ref as RefObject<HTMLButtonElement>}
      period={period}
      onSelectPeriod={onSelectPeriod}
      className={className}
    />
  ) : (
    <NonClickablePeriod divRef={ref as RefObject<HTMLDivElement>} period={period} className={className} />
  );
};

export default TimelinePeriod;
