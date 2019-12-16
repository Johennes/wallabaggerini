(() => {    
  browser.pageAction.onClicked.addListener(handlePageAction)

  async function handlePageAction(tab) {
    let settings = await loadSettings()
    if (!settings.installationUrl) {
      browser.runtime.openOptionsPage()
      return
    }
    browser.tabs.create({ url: `${settings.installationUrl}/bookmarklet?url=${encodeURIComponent(tab.url)}` })
  }

  async function loadSettings() {
    let result = await browser.storage.sync.get(["installationUrl"])
    return {
      installationUrl: result.hasOwnProperty("installationUrl") ? result.installationUrl : ""
    }
  }
})()
