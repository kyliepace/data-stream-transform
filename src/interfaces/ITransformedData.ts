import IEvent from "./IEvent";

export default interface ITransformedData {
  session_id: string

  // epoch time, seconds
  start?: number

  // epoch time, seconds
  end?: number

  // "SESSION"
  type: string

  // events ordered by timestamp value
  children: IEvent[]
}