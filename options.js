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
  document.addEventListener("DOMContentLoaded", () => {
    restoreInstallationUrl()
  })

  document.querySelector("input[name=installation-url]").addEventListener("change", storeInstallationUrl)

  function storeInstallationUrl() {
    browser.storage.sync.set({
      installationUrl: document.querySelector(`input[name=installation-url]`).value?.replace(/\/+$/, '')
    })
  }

  function restoreInstallationUrl() {
    browser.storage.sync.get("installationUrl").then((result) => {
      let installationUrl = result.hasOwnProperty("installationUrl") ? result.installationUrl : ""
      document.querySelector(`input[name=installation-url]`).value = installationUrl
    })
  }
})()