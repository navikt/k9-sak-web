import moment from 'moment';
import React, { Component } from 'react';
import DayPicker, { AfterModifier, BeforeModifier, Modifier } from 'react-day-picker';

import getPackageIntl from '../../i18n/getPackageIntl';

const getRelatedTarget = (e: React.FocusEvent) => Promise.resolve(e.relatedTarget);

interface OwnProps {
  onDayChange: (dato: Date) => void;
  className: string;
  dayPickerClassName: string;
  elementIsCalendarButton: (target: EventTarget) => boolean;
  startDate?: Date;
  endDate?: Date;
  disabled?: boolean;
  onClose?: () => void;
  disabledDays?: Modifier | Modifier[];
}

class PeriodCalendarOverlay extends Component<OwnProps> {
  calendarRootRef: HTMLDivElement;

  static defaultProps = {
    startDate: null,
    endDate: null,
    disabled: false,
    onClose: () => undefined,
  };

  constructor(props: OwnProps) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.setCalendarRootRef = this.setCalendarRootRef.bind(this);
    this.onDayClick = this.onDayClick.bind(this);
    this.targetIsCalendarOrCalendarButton = this.targetIsCalendarOrCalendarButton.bind(this);
  }

  onBlur(e: React.FocusEvent): void {
    const {
      targetIsCalendarOrCalendarButton,
      props: { onClose },
    } = this;
    getRelatedTarget(e).then((relatedTarget: HTMLDivElement) => {
      if (targetIsCalendarOrCalendarButton(relatedTarget)) {
        return;
      }
      onClose();
    });
  }

  onKeyDown(event: React.KeyboardEvent): void {
    if (event.key === 'Escape') {
      const { onClose } = this.props;
      onClose();
    }
  }

  onDayClick(selectedDate: Date): void {
    let isSelectable = true;
    const { disabledDays, onDayChange } = this.props;
    if (disabledDays) {
      const { before: intervalStart } = disabledDays as BeforeModifier;
      if (intervalStart) {
        isSelectable = moment(selectedDate).isSameOrAfter(moment(intervalStart).startOf('day'));
      }
      const { after: intervalEnd } = disabledDays as AfterModifier;
      if (isSelectable && intervalEnd) {
        isSelectable = moment(selectedDate).isSameOrBefore(moment(intervalEnd).endOf('day'));
      }
    }
    if (isSelectable) {
      onDayChange(selectedDate);
    }
  }

  setCalendarRootRef(calendarRootRef: HTMLDivElement): void {
    if (calendarRootRef) {
      this.calendarRootRef = calendarRootRef;
      calendarRootRef.focus();
    }
  }

  targetIsCalendarOrCalendarButton(target: HTMLDivElement): boolean {
    const {
      calendarRootRef,
      props: { elementIsCalendarButton },
    } = this;

    const targetIsInsideCalendar = calendarRootRef && calendarRootRef.contains(target);
    const targetIsCalendarButton = elementIsCalendarButton(target);

    return targetIsInsideCalendar || targetIsCalendarButton;
  }

  render() {
    const { disabled, className, dayPickerClassName, disabledDays, startDate, endDate } = this.props;
    if (disabled) {
      return null;
    }

    const { formatMessage, locale } = getPackageIntl();
    const dayPickerLocalization = {
      locale,
      months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(monthNum =>
        formatMessage({ id: `Calendar.Month.${monthNum}` }),
      ),
      weekdaysLong: [0, 1, 2, 3, 4, 5, 6].map(dayNum => formatMessage({ id: `Calendar.Day.${dayNum}` })),
      weekdaysShort: [0, 1, 2, 3, 4, 5, 6].map(dayName => formatMessage({ id: `Calendar.Day.Short.${dayName}` })),
      firstDayOfWeek: 1,
    };

    return (
      <div
        className={className}
        ref={this.setCalendarRootRef}
        onBlur={this.onBlur}
        tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
        onKeyDown={this.onKeyDown}
        role="link"
      >
        {/*
          // @ts-ignore https://github.com/gpbl/react-day-picker/issues/1009 */}
        <DayPicker
          {...dayPickerLocalization}
          className={dayPickerClassName}
          numberOfMonths={2}
          selectedDays={[{ from: startDate, to: endDate }]}
          onDayClick={this.onDayClick}
          onKeyDown={this.onKeyDown}
          disabledDays={disabledDays}
          initialMonth={endDate || moment().toDate()}
        />
      </div>
    );
  }
}

export default PeriodCalendarOverlay;
