import TypeEnum from "../../server/types/TypeEnum";
import IEvent from "../interfaces/IEvent";

export default class EventModel implements IEvent {
  timestamp: number
  type: TypeEnum
  name?: string
  session_id?: string

  constructor(data: any){
    this.timestamp = data.timestamp;
    this.type = data.type as TypeEnum;
    if (data.name){
      this.name = data.name;
    }
    if (data.session_id){
      this.session_id = data.session_id;
    }
  }
}