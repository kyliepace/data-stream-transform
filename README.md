
### Requirements:
 📇 docker v20
 😸 node v12 or higher


### To run locally:
make ip address available to kafka [(see why)](https://github.com/wurstmeister/kafka-docker/wiki/Connectivity)
`export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)`

spin up kafka services through docker.
`docker-compose up`

in a new terminal window, install node packages
`npm install`

run typescript websocket
`npm run server:dev`

in another new terminal window,
run consumer app to confirm messages being published
`npm run consumer:dev`

The server will now be available at `http://localhost:8080`

### Testing

To test end-to-end, run all the services as described by the steps above.
Then, in a new terminal window, run `npm run test`
### Routes
`/websocket?session_id={string}`
create a websocket connection that takes the session_id value as a query parameter


### Solution
I've split the solution into two backend services. One is an express server and the other is consumes and transforms data. The two services communicate using Kafka. I used [kafkajs](https://kafka.js.org/) to write kafka services in node.js.

I chose to use a pubsub system with an eye towards future flexibility and scaling. By keeping these services separate, they can be deployed on independent resources and configurations.

There was some risk for me in choosing Kafka over the Google Cloud Platform Pub/Sub system I typically use because this was my first time ver using kafkajs, but I chose to do this instead of being locked in to a vendor. Plus, it's easier to run locally this way.

Speaking of running locally, I didn't completely divorce the two services as I would if they were really being deployed separately, and I did that so that I could keep this as a single package with a single `package.json` file, for ease of use as an MVP.

Once the consuming service receives data through the kafka topic, that data gets saved to a redis instance. A more typical solution with kafka would probably be to use Faust or a stream processing framework, however I found the options for node to be less developed. Initially I chose to use Redis because it's a fast and light in-memory database, but its limitations meant that the data could not be saved in the transformed schema as defined by the coding instructions.

Therefore, in order to save the data in its transformed state, I replaced Redis with MongoDB for its more powerful features when working with JSON.


### What I'd add
- a proper logging client so that logs are searchable by session_id and request_id header
- security & rate limiting
- CI/CD
- architecture: no need for this to be a monolithic application
- replace services from docker-compose with actual deployed instances
- validate event model
- create index on mongodb on session_id



[why ip address is required](https://github.com/wurstmeister/kafka-docker/wiki/Connectivity)
