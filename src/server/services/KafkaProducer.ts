import { Admin, CompressionTypes, Producer, RecordMetadata, Message } from 'kafkajs';
import kafkaClient from '../../clients/KafkaClient';

interface ITopicConfig {
  topic: string,
  numPartitions: number,
  replicationFactor: number
}

export default class KafkaProducer {
  topicName: string;
  numPartitions: number;
  numReplicas: number;
  private producer: Producer;
  private admin: Admin;
  private existingTopics = new Set();

  constructor(topicName: string, numPartitions: number = 1, numReplicas: number = 1) {
    this.topicName = topicName;
    this.numPartitions = numPartitions;
    this.numReplicas = numReplicas;

    this.producer = kafkaClient.producer();
    this.admin = kafkaClient.admin();
    this.createTopicIfNew();
  }

  async connect(): Promise<void>{
    await this.admin.connect();
    await this.producer.connect();
  }

  close(): void{
    this.producer.disconnect();
  }

  /**
   * If topic doesn't already exist, create it
   */
  async createTopicIfNew(){
    if (this.existingTopics.has(this.topicName)){
      return;
    }
    await this.createTopic({
      topic: this.topicName,
      numPartitions: this.numPartitions,
      replicationFactor: this.numReplicas
    });
  }

  /**
   * create topic if it doesn't already exist
   */
  async createTopic(topicConfig: ITopicConfig): Promise<void> {
    if (await this.topicExists(topicConfig.topic)){
      return;
    }
    await this.admin.createTopics({
      topics: [ topicConfig ]
    });
    console.log(`topic ${topicConfig.topic} created`);
  }

  /**
   * publish messages to topic
   */
  async sendMessages(messages: Message[]): Promise<RecordMetadata[]> {
    return await this.producer.send({
      topic: this.topicName,
      compression: CompressionTypes.GZIP,
      messages
    });
  }

  /**
   * check if topic exists in kafka
   */
  async topicExists(topicName: string): Promise<boolean> {
    const topics = await this.admin.listTopics();
    return topics.includes(topicName);
  }
}