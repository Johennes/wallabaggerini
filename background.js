// Copyright 2019 Johannes Marbach
//
// This file is part of Wallabaggerini, hereafter referred to as the program.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

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
