import { Consumer, EachMessagePayload } from 'kafkajs';
import kafkaClient from '../clients/KafkaClient';

export default class KafkaConsumer {
  topicName: string;
  groupId: string;
  private consumer: Consumer;
  private messageHandler: (payload: EachMessagePayload) => Promise<void>;

  constructor(topicName: string, groupId: string, messageHandler: (payload: EachMessagePayload) => Promise<void>){
    this.topicName = topicName;
    this.groupId = groupId;
    this.consumer = kafkaClient.consumer({
      groupId
    });
    this.messageHandler = messageHandler;
  }

  async connect(): Promise<void>{
    await this.consumer.connect();
    console.log('consumer connected')
  }

  close(): void {
    this.consumer.disconnect();
  }

  async onEvent(): Promise<void> {
    return await this.consumer.run({
      eachMessage: this.messageHandler
    });
  }

  async subscribe(): Promise<void> {
    return await this.consumer.subscribe({
      topic: this.topicName,
      fromBeginning: true
    });
  }
}