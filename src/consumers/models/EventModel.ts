import TypeEnum from "../../types/TypeEnum";
import IEvent from "../../interfaces/IEvent";

export default class EventModel implements ISessionChildEvent {
  timestamp: number
  type: TypeEnum
  name?: string
  session_id: string

  constructor(sessionId: string, data: IEvent){
    this.session_id = sessionId;
    this.timestamp = data.timestamp;
    this.type = data.type as TypeEnum;
    if (data.name){
      this.name = data.name;
    }
  }
}