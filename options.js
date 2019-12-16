(() => {
  document.addEventListener("DOMContentLoaded", () => {
    restoreInstallationUrl()
  })

  document.querySelector("input[name=installation-url]").addEventListener("change", storeInstallationUrl)

  function storeInstallationUrl() {
    browser.storage.sync.set({
      installationUrl: document.querySelector(`input[name=installation-url]`).value
    })
  }

  function restoreInstallationUrl() {
    browser.storage.sync.get("installationUrl").then((result) => {
      let installationUrl = result.hasOwnProperty("installationUrl") ? result.installationUrl : ""
      document.querySelector(`input[name=installation-url]`).value = installationUrl
    })
  }
})()