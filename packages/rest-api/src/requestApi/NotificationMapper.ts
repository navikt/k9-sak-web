import EventType from './eventType';

type EventCallback = (data?: any, type?: string, isAsync?: boolean) => void;

// TODO (TOR) Refaktorer denne (evt fjern. Trur kanskje ikkje ein treng denne lenger)

/**
 * NotificationMapper
 *
 * Denne klassen brukes for å koble interne rest-api hendelser til eksterne hendelser.
 * For eksempel kan en koble REQUEST_STARTED mot en Redux actionCreator.
 */
class NotificationMapper {
  eventTypes = {
    [EventType.POLLING_HALTED_OR_DELAYED]: [],
    [EventType.POLLING_TIMEOUT]: [],
    [EventType.REQUEST_ERROR]: [],
    [EventType.REQUEST_FINISHED]: [],
    [EventType.REQUEST_FORBIDDEN]: [],
    [EventType.REQUEST_STARTED]: [],
    [EventType.REQUEST_UNAUTHORIZED]: [],
    [EventType.STATUS_REQUEST_FINISHED]: [],
    [EventType.STATUS_REQUEST_STARTED]: [],
    [EventType.UPDATE_POLLING_MESSAGE]: [],
    [EventType.REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND]: [],
  };

  private addEventHandler = (eventType: string, callback: EventCallback): void => {
    this.eventTypes = {
      ...this.eventTypes,
      [eventType]: [callback],
    };
  };

  public addRequestStartedEventHandler = (callback: EventCallback): void =>
    this.addEventHandler(EventType.REQUEST_STARTED, callback);

  public addRequestFinishedEventHandler = (callback: EventCallback): void =>
    this.addEventHandler(EventType.REQUEST_FINISHED, callback);

  public addRequestErrorEventHandlers = (callback: EventCallback): void => {
    this.addEventHandler(EventType.REQUEST_ERROR, callback);
    this.addEventHandler(EventType.REQUEST_FORBIDDEN, callback);
    this.addEventHandler(EventType.REQUEST_UNAUTHORIZED, callback);
    this.addEventHandler(EventType.REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND, callback);
    this.addEventHandler(EventType.POLLING_TIMEOUT, callback);
    this.addEventHandler(EventType.POLLING_HALTED_OR_DELAYED, callback);
  };

  public addStatusRequestStartedEventHandler = (callback: EventCallback): void =>
    this.addEventHandler(EventType.STATUS_REQUEST_STARTED, callback);

  public addStatusRequestFinishedEventHandler = (callback: EventCallback): void =>
    this.addEventHandler(EventType.STATUS_REQUEST_FINISHED, callback);

  public addUpdatePollingMessageEventHandler = (callback: EventCallback): void =>
    this.addEventHandler(EventType.UPDATE_POLLING_MESSAGE, callback);

  public getNotificationEmitter =
    () =>
    (eventType: keyof typeof EventType, data?: any, isAsync?: boolean): void => {
      const eventHandlers = this.eventTypes[eventType];
      eventHandlers.forEach(handler => handler(data, eventType, isAsync));
    };
}

export default NotificationMapper;
