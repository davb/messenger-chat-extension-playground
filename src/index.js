const express = require('express')
const bot = require('./bot')
const updatePageProfile = require('./tasks/update_page_profile')


module.exports = {bot, tasks: {updatePageProfile}}


if (require.main === module) {
  require('dotenv').config({silent: process.env.NODE_ENV === 'production'})
  const accessToken = process.env.PAGE_ACCESS_TOKEN
  const verifyToken = (process.env.VERIFICATION_TOKEN || 'hello')
  const chatExtensionHomeUrl = process.env.CHAT_EXTENSION_HOME_URL
  const port = parseInt(process.env.PORT || 5000)
  // start Messenger Bot
  const botRouter = bot({
    accessToken,
    verifyToken,
    chatExtensionHomeUrl,
  }).router()
  express()
    .use('/webhooks/messenger', botRouter)
    .listen(port, () => {console.log('Chat Extension Playground running on port', port)})
  // update Messenger profile
  updatePageProfile(accessToken, chatExtensionHomeUrl)
}
