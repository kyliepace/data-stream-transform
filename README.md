
### Requirements:
 📇 docker
 😸 node v12 or higher


### To run locally:
export localhost ip value
`export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)`

spin up kafka services through docker
`docker-compose up`

install node packages
`npm install`

run typescript websocket
`export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)` // code needs the HOST_IP value too
`npm run server:dev`

run consumer app to confirm messages being published
`npm run consumer:dev`
note any new windows will need the HOST_IP set as an env var

Created with [kafkajs](https://kafka.js.org/)

[why HOST_IP is required](https://github.com/wurstmeister/kafka-docker/wiki/Connectivity)
