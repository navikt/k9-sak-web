import { EventType } from '@k9-sak-web/gui/app/errorhandling/legacycompat/eventType.js';

export type NotificationEmitter = (eventType: keyof typeof EventType, data?: any, isPolling?: boolean) => void;
