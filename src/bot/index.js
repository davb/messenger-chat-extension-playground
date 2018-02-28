const express = require('express')
const bodyParser = require('body-parser')
const Botly = require('botly')


// A very basic Messenger bot that responds with a button to open the
// Chat Extension


module.exports = (config = {}) => {
  const {accessToken, verifyToken, chatExtensionHomeUrl} = config

  const botly = new Botly({
    accessToken,
    verifyToken,
  })

  // send a button to open the Chat Extension
  const sendButtons = (userId) => {
    const heightRatio = "tall"
    const shareDisabled = true
    const supportExtensions = true
    botly.sendButtons({
      id: userId,
      text: "Open your Chat Extension here:",
      buttons: [
        botly.createWebURLButton(
          "Open",
          chatExtensionHomeUrl,
          heightRatio,
          supportExtensions,
          (supportExtensions ? chatExtensionHomeUrl + '?fallback=true' : undefined),
          (supportExtensions ? shareDisabled : undefined)
        )
      ]
    }, (err) => {
      if (err) {
        console.log(`[Bot] ERROR sending buttons to userId=${userId}`, err)
      } else {
        console.log(`[Bot] Sent buttons to userId=${userId} chatExtensionHomeUrl="${chatExtensionHomeUrl}"`)
      }
    })
  }

  botly.on('message', (userId, message, {text}) => {
    console.log(`[Bot] Received message from userId=${userId} text="${text}"`)
    sendButtons(userId)
  })

  botly.on('postback', (userId, postback) => {
    console.log(`[Bot] Received postback from userId=${userId} postback="${postback}"`)
    sendButtons(userId)
  })

  const router = () => {
    return express()
      .use(bodyParser.json())
      .use(botly.router())
  }

  // export the bot
  return {router}
}
