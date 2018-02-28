# Messenger Chat Extension Playground

Minimal set up to test a Messenger a Chat Extension.
You provide a HTTPS URL and a Page token, and it does the rest:
  - automatically sets up the Messenger profile for your Facebook page
  - responds to messages sent to the page with a button to open the Chat Extension

Note: Chat Extension not included, please bring your own.

## Setup

  1. Clone this repo, run `npm install`

  2. Add the following `.env` file:

  ```
  # URL of your chat extension. Must be HTTPS and non-local.
  CHAT_EXTENSION_HOME_URL=https://my-host.com/chat-ext
  # Page access token of your Facebook test page
  PAGE_ACCESS_TOKEN=xxxx
  ```

  3. Start this app. By default it runs on `PORT=5000`

  ```
  $ npm start
  ```

  The app will set up the Messenger profile of your page on startup; watch the logs for details.

  4. Expose this app on a non-local HTTPS URL.

  Consider using [`ngrok`](https://ngrok.com/) to expose your local HTTP server.

  ```
  $ ngrok http 5000
  ```

  5. Register the public url of this app on as the Messenger Webhook in your Facebook app settings.

  ```
  Your Webhook URL:
  https://xxxx.ngrok.io/webhooks/messenger
  ```

  > The default value of the verification token for registering the webhook is `hello`

  6. Subscribe your bot to your test Facebook page, then send a message to it.
