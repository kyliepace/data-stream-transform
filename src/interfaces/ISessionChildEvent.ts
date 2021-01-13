import IEvent from "./IEvent";

export default interface ISessionChildEvent extends IEvent {
  session_id: string
}