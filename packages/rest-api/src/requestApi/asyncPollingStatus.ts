/**
 * asyncPollingStatus
 *
 * Statuser for long-polling request-prosess. Er mappet en-til-en mot java-klasse med samme navn.
 */
enum AsyncPollingStatus {
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
  DELAYED = 'DELAYED',
  CANCELLED = 'CANCELLED',
  HALTED = 'HALTED',
}

export default AsyncPollingStatus;
