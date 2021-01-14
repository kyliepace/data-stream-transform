import { RecordMetadata } from "kafkajs";
import KafkaProducer from "./KafkaProducer";

export default class PublishDataService {
  pubsubService: KafkaProducer
  constructor(pubsubService: KafkaProducer){
    this.pubsubService = pubsubService;
  }

  /**
   * publish the data to the topic defined by the producer model
   */
  async publish(msg: string, sessionId: string): Promise<RecordMetadata[]>{
    console.log(sessionId)
    const message = {
      value: msg,
      key: sessionId.toString()
    };
    return await this.pubsubService.sendMessages([message])
  }
}