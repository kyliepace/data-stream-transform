
### Requirements:
 📇 docker
 😸 node v12 or higher


### To run locally:
spin up kafka services through docker
`docker-compose up`

install node packages
`npm install`

export localhost ip value
`export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)`

run typescript
`npm run dev`

Created with [kafkajs](https://kafka.js.org/)