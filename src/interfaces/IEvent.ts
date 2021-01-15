import TypeEnum from "../types/TypeEnum";

/**
 * event published to events kafka topic
 */
export default interface IEvent {
  // epoch time
  timestamp: number

  // SESSION_START, SESSION_END, EVENT
  type: TypeEnum

  // description of event
  name?: string

}