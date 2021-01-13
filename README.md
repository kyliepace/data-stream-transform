
### Requirements:
 📇 docker
 😸 node v12 or higher


### To run locally:
export ip value for kafka to connect to
`npm run setHost`

spin up kafka services through docker
`docker-compose up`

install node packages
`npm install`

run typescript websocket
`npm run server:dev`

run consumer app to confirm messages being published
`npm run consumer:dev`

The server will now be available at `http://localhost:8080`


### Routes
`/websocket?session_id={string}`
create a websocket connection that takes the session_id value as a query parameter


### Solution
I've split the solution into two backend services. One is an express server and the other is consumes and transforms data. The two services communicate using Kafka. I used [kafkajs](https://kafka.js.org/) to write kafka services in node.js.

I chose to use a pubsub system with an eye towards future flexibility and scaling. By keeping these services separate, they can be deployed on independent resources and configurations.

There was some risk for me in choosing Kafka over the Google Cloud Platform Pub/Sub system I typically use because this was my first time ver using kafkajs, but I chose to do this instead of being locked in to a vendor. Plus, it's easier to run locally this way.

Speaking of running locally, I didn't completely divorce the two services as I would if they were really being deployed separately, and I did that so that I could keep this as a single package with a single `package.json` file, for ease of use as an MVP.

Once the consuming service receives data through the kafka topic, that data gets saved to a redis instance. A more typical solution with kafka would probably be to use Faust or a stream processing framework, however I found the options for node to be less developed, didn't want to introduce a second language to my code sample, and think that Redis is doing essentially what I'd be doing if I were using a framework to transform data from streams into tables.

### What I'd add
- a proper logging client
- security & rate limiting
- CICD
- architecture: no need for this to be a monolithic application
- redis instance not localhost
- validate event model





[why ip address is required](https://github.com/wurstmeister/kafka-docker/wiki/Connectivity)
