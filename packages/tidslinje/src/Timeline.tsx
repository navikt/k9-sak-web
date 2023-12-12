import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { DataSet } from 'vis-data';
import type {
  DateType,
  IdType,
  TimelineAnimationOptions,
  TimelineEvents,
  TimelineGroup,
  TimelineItem,
  TimelineOptions,
  Timeline as VisTimeline,
} from 'vis-timeline';
import { Timeline as VisTimelineCtor } from 'vis-timeline';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

export type TimelineEventsWithMissing = TimelineEvents | 'dragover' | 'markerchange' | 'markerchanged';
export type TimelineEventHandler =
  | 'currentTimeTickHandler'
  | 'clickHandler'
  | 'contextmenuHandler'
  | 'doubleClickHandler'
  | 'dragoverHandler'
  | 'dropHandler'
  | 'mouseOverHandler'
  | 'mouseDownHandler'
  | 'mouseUpHandler'
  | 'mouseMoveHandler'
  | 'groupDraggedHandler'
  | 'changedHandler'
  | 'rangechangeHandler'
  | 'rangechangedHandler'
  | 'selectHandler'
  | 'itemoverHandler'
  | 'itemoutHandler'
  | 'timechangeHandler'
  | 'timechangedHandler'
  | 'markerchangeHandler'
  | 'markerchangedHandler';

export type TimelineEventsHandlers = Partial<Record<TimelineEventHandler, (args: any) => void>>;

export type CustomTimes = {
  [id: string]: DateType;
};

export type SelectionOptions = {
  focus?: boolean;
  animation?: TimelineAnimationOptions;
};

const events: TimelineEventsWithMissing[] = [
  'currentTimeTick',
  'click',
  'contextmenu',
  'doubleClick',
  'dragover',
  'drop',
  'mouseOver',
  'mouseDown',
  'mouseUp',
  'mouseMove',
  'groupDragged',
  'changed',
  'rangechange',
  'rangechanged',
  'select',
  'itemover',
  'itemout',
  'timechange',
  'timechanged',
  'markerchange',
  'markerchanged',
];

const eventDefaultProps: TimelineEventsHandlers = {};

events.forEach(event => {
  eventDefaultProps[`${event}Handler`] = null;
});

/*
 * Forsøk for å omgå typescript-feil
 */
interface K9TimelineItem extends Omit<TimelineItem, 'content'> {
  content: string;
}
interface Props {
  initialItems?: K9TimelineItem[];
  initialGroups?: TimelineGroup[];
  options?: TimelineOptions;
  selection?: IdType[];
  customTimes?: CustomTimes;
  selectionOptions?: SelectionOptions;
  animate?: boolean | Record<string, unknown>;
  currentTime?: DateType;
}

const Timeline = (
  {
    initialItems,
    initialGroups,
    options,
    selection,
    selectionOptions,
    customTimes,
    currentTime,
    ...rest
  }: Props & TimelineEventsHandlers,
  ref: ForwardedRef<Partial<VisTimeline>>,
) => {
  const el = useRef();
  const timeline = useRef<VisTimeline>();
  const items: DataSet<K9TimelineItem> = useMemo(() => new DataSet<K9TimelineItem>(), []);
  const groups: DataSet<TimelineGroup> = useMemo(() => new DataSet<TimelineGroup>(), []);

  useEffect(() => {
    timeline.current = new VisTimelineCtor(el.current, items, groups, options);

    timeline.current.setOptions(options);

    events.forEach(event => {
      const handler = rest[`${event}Handler`];
      if (typeof handler === 'function') {
        timeline.current.on(event, handler);
      }
    });

    if (initialGroups?.length > 0) {
      groups.add(initialGroups);
    }

    if (initialItems?.length > 0) {
      items.add(initialItems);
    }

    if (customTimes) {
      Object.keys(customTimes).forEach(id => {
        timeline.current.addCustomTime(customTimes[id], id);
      });
    }

    return () => {
      timeline.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (currentTime) {
      timeline.current.setCurrentTime(currentTime);
    }
  }, [currentTime]);

  useEffect(() => {
    if (selection) {
      timeline.current.setSelection(selection, selectionOptions as Required<SelectionOptions>);
    }
  }, [selection]);

  /**
   * Her er en oversikt over alle metoder som er tilgjengelige på timeline.
   * https://visjs.github.io/vis-timeline/docs/timeline/#Methods
   */
  useImperativeHandle(
    ref,
    () => ({
      getWindow: () => timeline.current.getWindow(),
      setWindow: (start, end, opts?, cb?) => {
        timeline.current.setWindow(start, end, opts, cb);
      },
      zoomIn: (value, opts?, cb?) => {
        timeline.current.zoomIn(value, opts, cb);
      },
      zoomOut: (value, opts?, cb?) => {
        timeline.current.zoomOut(value, opts, cb);
      },
    }),
    [],
  );

  return <div ref={el} />;
};

export default forwardRef(Timeline);
