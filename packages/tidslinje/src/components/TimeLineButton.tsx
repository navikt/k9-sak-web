import React from 'react';
import arrowRightImageUrl from '@fpsak-frontend/assets/images/arrow_right.svg';
import arrowRightFilledImageUrl from '@fpsak-frontend/assets/images/arrow_right_filled.svg';
import { Image } from '@fpsak-frontend/shared-components';
import arrowLeftImageUrl from '@fpsak-frontend/assets/images/arrow_left.svg';
import arrowLeftFilledImageUrl from '@fpsak-frontend/assets/images/arrow_left_filled.svg';
import zoomInImageUrl from '@fpsak-frontend/assets/images/zoom_in.svg';
import zoomInImageFilledUrl from '@fpsak-frontend/assets/images/zoom_in_filled.svg';
import zoomOutImageUrl from '@fpsak-frontend/assets/images/zoom_out.svg';
import zoomOutImageFilledUrl from '@fpsak-frontend/assets/images/zoom_out_filled.svg';
import arrowDownImageUrl from '@fpsak-frontend/assets/images/arrow_down.svg';
import arrowDownFilledImageUrl from '@fpsak-frontend/assets/images/arrow_down_filled.svg';
import questionNormalUrl from '@fpsak-frontend/assets/images/question_normal.svg';
import questionHoverUrl from '@fpsak-frontend/assets/images/question_hover.svg';
import EventCallback from '@k9-sak-web/types/src/EventCallback';
import styles from './timeLineButton.less';

interface ButtonType<T extends Element> {
  src: T;
  srcHover: T;
}

type ButtonTypes = {
  prev: ButtonType<SVGElement>;
  next: ButtonType<SVGElement>;
  zoomIn: ButtonType<SVGElement>;
  zoomOut: ButtonType<SVGElement>;
  openData: ButtonType<SVGElement>;
  question: ButtonType<SVGElement>;
};

export const buttonTypes: ButtonTypes = {
  prev: {
    src: arrowLeftImageUrl,
    srcHover: arrowLeftFilledImageUrl,
  },
  next: {
    src: arrowRightImageUrl,
    srcHover: arrowRightFilledImageUrl,
  },
  zoomIn: {
    src: zoomInImageUrl,
    srcHover: zoomInImageFilledUrl,
  },
  zoomOut: {
    src: zoomOutImageUrl,
    srcHover: zoomOutImageFilledUrl,
  },
  openData: {
    src: arrowDownImageUrl,
    srcHover: arrowDownFilledImageUrl,
  },
  question: {
    src: questionNormalUrl,
    srcHover: questionHoverUrl,
  },
};

interface TimeLineButtonProps {
  callback?: EventCallback;
  inverted?: boolean;
  text: string;
  type: keyof ButtonTypes;
}

const TimeLineButton: React.FunctionComponent<TimeLineButtonProps> = ({ callback, inverted, text, type }) => (
  <Image
    {...buttonTypes[type]}
    tabIndex="0"
    className={inverted ? styles.timeLineButtonInverted : styles.timeLineButton}
    alt={text}
    title={text}
    onMouseDown={callback}
    onKeyDown={callback}
  />
);

TimeLineButton.defaultProps = {
  inverted: false,
};

export default TimeLineButton;
