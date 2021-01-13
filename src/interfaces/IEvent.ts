import TypeEnum from "../types/TypeEnum";

export default interface IEvent {
  // epoch time
  timestamp: number

  // SESSION_START, SESSION_END, EVENT
  type: TypeEnum

  // description of event
  name?: string

  // id of session
  session_id: string
}