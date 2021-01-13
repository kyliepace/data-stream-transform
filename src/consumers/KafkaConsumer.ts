import { Consumer, EachMessagePayload } from 'kafkajs';
import kafkaClient from '../KafkaClient';

type EventHandler = (payload: EachMessagePayload) => Promise<void>

export default class KafkaConsumer {
  topicName: string;
  groupId: string;
  private consumer: Consumer;

  constructor(topicName: string, groupId: string){
    this.topicName = topicName;
    this.groupId = groupId;
    this.consumer = kafkaClient.consumer({
      groupId
    });
  }

  async connect(): Promise<void>{
    await this.consumer.connect();
  }

  close(){
    this.consumer.disconnect();
  }

  async onEvent(callback: EventHandler): Promise<void> {
    return await this.consumer.run({
      eachMessage: callback
    });
  }

  async subscribe(){
    return await this.consumer.subscribe({
      topic: this.topicName,
      fromBeginning: true
    });
  }
}