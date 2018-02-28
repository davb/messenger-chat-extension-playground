const _ = require('lodash')
const URL = require('url')
const {Facebook} = require('fb')


// Updates the Messenger profile of a Facebook page
// to set the home_url and whitelisted_domains fields
// which are used by chat extensions.
//
// Any existing whitelist_domains are preserved,
// but any existing home_url is overwritten.
//
// By default the Chat Extension opens in "tall" size, without sharing
// button (as per Messenger recommendation), and in test mode so will only
// be visible to users with assigned roles on the page or the bot's app.


const updatePageProfile = async (accessToken, chatExtensionHomeUrl) => {
  const fb = new Facebook({accessToken})
  const host = URL.parse(chatExtensionHomeUrl).host
  const json = JSON.stringify
  // get current page name and id
  const resGetPage = await fb.api('me', 'get')
  if (resGetPage.error) throw new Error(resGetPage.error)
  const {name, id} = resGetPage
  // get current profile
  const resGet = await fb.api('me/messenger_profile', 'get', {
    fields: 'home_url,whitelisted_domains'
  })
  if (resGet.error) throw new Error(resGet.error)
  const profile = resGet.data[0]
  console.log(`[Profile] Updating page name=${json(name)} id=${id}...`)
  // update whitelisted_domains; does not erase any existing domains
  const newDomains = _.uniq(_.flatten([`https://${host}/`, profile.whitelisted_domains]))
  if (_.isEqual(profile.whitelisted_domains, newDomains)) {
    console.log(`[Profile] Unchanged whitelisted_domains=${json(profile.whitelisted_domains)}`)
  } else {
    // add whitelisted domain
    const resWhitelist = await fb.api('me/messenger_profile', 'post', {
      whitelisted_domains: newDomains
    })
    if (resWhitelist.error) throw new Error(resWhitelist.error)
    console.log(`[Profile] Set whitelisted_domains=${json(newDomains)}`)
  }
  // update home_url
  const newHomeUrl = {
    url: chatExtensionHomeUrl,
    webview_height_ratio: "tall",
    webview_share_button: "hide",
    in_test: true,
  }
  if (_.isEqual(profile.home_url, newHomeUrl)) {
    console.log(`[Profile] Unchanged home_url=${json(profile.home_url)}`)
  } else {
    // set new home URL
    const resHomeUrl = await fb.api('me/messenger_profile', 'post', {
      home_url: newHomeUrl
    })
    if (resHomeUrl.error) throw new Error(resHomeUrl.error)
    console.log(`[Profile] Set home_url=${json(newHomeUrl)}`)
  }
}


module.exports = updatePageProfile


if (require.main === module) {
  (async () => {
    const accessToken = process.env.PAGE_ACCESS_TOKEN
    const chatExtensionHomeUrl = process.env.CHAT_EXTENSION_HOME_URL
    await updatePageProfile(accessToken, chatExtensionHomeUrl)
  })()
}
