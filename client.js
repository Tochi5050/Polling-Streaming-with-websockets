const helpers = require('./randomId')
const messagesApi = require('./index')
const readLine = require('readline')

const displayMessages = {}

const terminal = readLine.createInterface({
    input: process.stdin
})

terminal.on('line', text => {
    const username = process.env.NAME
    const id = helpers.getRandomInt(100000)

    displayMessages[id] = true

    const message = {id, text, username}

    messagesApi.sendMessage(message)



})

const displayMessage = (message) => {
  console.log(`${message.username}: ${message.text}`)

  displayMessages[message.id] = true
}

const getDisplayedMessage = async() => {
    const messages = await messagesApi.getMessages()

    for(const message of messages){
        const oldMessage = message.id in displayMessages
        if(!oldMessage){
            displayMessage(message)
        }
    }
}

const pollMessage = () => {
    setInterval(getDisplayedMessage, 3000)
}

const streamMessages = () => {
    const messageSockets = messagesApi.createMessagingSocket()

    messageSockets.on('message', data => {
        const message = JSON.parse(data)
        const oldMessage = message.id in displayMessages
        if(!oldMessage){
            displayMessage(message)
        }

    })
}

if(process.env.MODE === 'poll'){
    getDisplayedMessage()
    pollMessage()
}else if(process.env.MODE === 'stream'){
    getDisplayedMessage()
    streamMessages() 
}