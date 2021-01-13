
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
note any new windows will need the HOST_IP set as an env var

Created with [kafkajs](https://kafka.js.org/)



[why ip address is required](https://github.com/wurstmeister/kafka-docker/wiki/Connectivity)
