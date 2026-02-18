import { Tooltip } from '@navikt/ds-react';
import { KeyboardEvent, MouseEvent, useCallback, useState } from 'react';

interface OwnProps {
  className?: string;
  src?: string;
  srcHover?: string;
  onMouseDown?: (event: MouseEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onClick?: (event: MouseEvent) => void;
  alt?: string;
  tabIndex?: number;
  tooltip?: string;
  alignTooltipLeft?: boolean;
}

/**
 * Image
 *
 * Presentasjonskomponent. Komponent som har ansvar for visning av bilder.
 */
const Image = ({
  onClick = () => undefined,
  onMouseDown,
  tabIndex = -1,
  className = '',
  src,
  srcHover,
  alt,
  onKeyDown,
  tooltip,
  alignTooltipLeft = false,
}: OwnProps) => {
  const [isHovering, setHoovering] = useState(false);

  const onFocus = useCallback(() => {
    setHoovering(true);
  }, []);
  const onBlur = useCallback(() => {
    setHoovering(false);
  }, []);

  const onKeyDownFn = useCallback(e => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (onKeyDown) {
        onKeyDown(e);
      }
      e.preventDefault();
    }
  }, []);

  const imgSource = srcHover && isHovering ? srcHover : src;
  const image = (
    <img // eslint-disable-line jsx-a11y/no-noninteractive-element-interactions
      className={className}
      src={imgSource}
      alt={alt}
      tabIndex={tabIndex}
      onMouseOver={onFocus}
      onMouseOut={onBlur}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDownFn}
      onMouseDown={onMouseDown}
      onClick={onClick}
    />
  );

  if (tooltip === undefined) {
    return image;
  }

  return (
    <Tooltip content={tooltip} placement={alignTooltipLeft ? 'left' : 'right'}>
      {image}
    </Tooltip>
  );
};

export default Image;
