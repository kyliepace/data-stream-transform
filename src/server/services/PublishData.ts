import KafkaProducer from "./KafkaProducer";

export default class PublishData {
  pubsubService: KafkaProducer
  constructor(pubsubService: KafkaProducer){
    this.pubsubService = pubsubService;
  }

  /**
   * publish the data to the topic defined by the producer model
   */
  async publish(stringifiedData: string) {
    const message = {
      value: stringifiedData
    };
    return await this.pubsubService.sendMessages([message])
  }
}