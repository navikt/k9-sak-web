import React, { Component } from 'react';
import moment from 'moment';
import DayPicker, { Modifier } from 'react-day-picker';

import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';

import getPackageIntl from '../../i18n/getPackageIntl';

const getRelatedTarget = (e: React.FocusEvent) => Promise.resolve(e.relatedTarget);

interface OwnProps {
  onDayChange: (selectedDay: Date, modifiers: any) => void;
  className: string;
  dayPickerClassName: string;
  elementIsCalendarButton: (target: EventTarget) => boolean;
  value?: string;
  disabled?: boolean;
  onClose?: () => void;
  initialMonth?: Date;
  numberOfMonths: number;
  disabledDays?: Modifier | Modifier[];
}

class CalendarOverlay extends Component<OwnProps> {
  calendarRootRef: HTMLDivElement;

  static defaultProps = {
    value: '',
    disabled: false,
    onClose: () => undefined,
    initialMonth: null,
  };

  constructor(props: OwnProps) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.setCalendarRootRef = this.setCalendarRootRef.bind(this);
    this.parseDateValue = this.parseDateValue.bind(this);
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

  onKeyDown({ keyCode }: React.KeyboardEvent): void {
    if (keyCode === 27) {
      const { onClose } = this.props;
      onClose();
    }
  }

  setCalendarRootRef(calendarRootRef: HTMLDivElement): void {
    if (calendarRootRef) {
      this.calendarRootRef = calendarRootRef;
      calendarRootRef.focus();
    }
  }

  parseDateValue(): Date {
    const { value } = this.props;
    const parsedValue = moment(value, DDMMYYYY_DATE_FORMAT, true);
    if (parsedValue.isValid()) {
      return parsedValue.toDate();
    }
    return null;
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
    const { disabled } = this.props;
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

    const { onDayChange, className, dayPickerClassName, initialMonth, numberOfMonths, disabledDays } = this.props;
    const selectedDay = this.parseDateValue();
    return (
      <div
        className={className}
        ref={this.setCalendarRootRef}
        onBlur={this.onBlur}
        tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
        onKeyDown={this.onKeyDown}
        role="link"
      >
        <DayPicker
          {...dayPickerLocalization}
          className={dayPickerClassName}
          month={selectedDay}
          selectedDays={selectedDay}
          onDayClick={onDayChange}
          onKeyDown={this.onKeyDown}
          initialMonth={initialMonth}
          disabledDays={disabledDays}
          numberOfMonths={numberOfMonths}
        />
      </div>
    );
  }
}

export default CalendarOverlay;
