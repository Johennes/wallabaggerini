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

  // Try to explicitly show the page action on Android (doesn't seem to work with
  // the manifest matches definition alone)
  browser.runtime.getPlatformInfo().then(platformInfo => {
    if (platformInfo.os === 'android') {
      browser.tabs.onActivated.addListener(handleActivated)
    }
  })

  browser.theme.getCurrent().then(theme => updatePageActionIcon(theme));
  browser.theme.onUpdated.addListener(updateInfo => updatePageActionIcon(updateInfo.theme));

  async function handlePageAction(tab) {
    let settings = await loadSettings()
    if (!settings.installationUrl) {
      browser.runtime.openOptionsPage()
      return
    }
    browser.tabs.create({ url: `${settings.installationUrl}/bookmarklet?url=${encodeURIComponent(tab.url)}` })
  }

  async function loadSettings() {
    let result = await browser.storage.sync.get(['installationUrl'])
    return {
      installationUrl: result.hasOwnProperty('installationUrl') ? result.installationUrl : ''
    }
  }

  function handleActivated(activeInfo) {
    browser.pageAction.show(activeInfo.tabId)
  }

  function colorToRgb(color) {
    if (color.charAt(0) === "#") {
      return [parseInt(color.substring(1, 3), 16), parseInt(color.substring(3, 5), 16), parseInt(color.substring(5, 7), 16)];
    }

    if (color.indexOf("rgb") >= 0) {
      return color.replace(/^(rgb|rgba)\(/, '').replace(/\)$/, '').replace(/\s/g, '').split(',').map(c => parseInt(c));
    }

    if (color.indexOf("hsl") >= 0) {
      const hsl = color.replace(/^(hsl|hsla)\(/, '').replace(/\)$/, '').replace(/\s/g, '').split(',');
      const h = parseFloat(hsl[0]) / 360.0;
      const s = parseFloat(hsl[1].replace(/%$/, '')) / 100.0;
      const l = parseFloat(hsl[2].replace(/%$/, '')) / 100.0;

      // https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion

      let r, g, b;

      if (s == 0){
          r = g = b = l;
      } else {
          let hue2rgb = function hue2rgb(p, q, t) {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1/6) return p + (q - p) * 6 * t;
              if (t < 1/2) return q;
              if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
          }

          let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          let p = 2 * l - q;
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
      }

      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
  }

  function colorIsDark(rgb) {
    return rgb[0] + rgb[1] + rgb[2] < 3 * 127;
  }

  function updatePageActionIcon(theme) {
    const paths = getPageActionIconPaths(theme?.colors?.frame && colorIsDark(colorToRgb(theme.colors.frame)));
    browser.tabs.query({}).then(tabs => {
      for (const tab of tabs) {
        browser.pageAction.setIcon({ path: paths, tabId: tab.id });
      }
    });
  }

  function getPageActionIconPaths(forDarkTheme) {
    if (forDarkTheme) {
      return { "19": "icons/icon-light-19.png", "38": "icons/icon-light-38.png" };
    }
    return { "19": "icons/icon-19.png", "38": "icons/icon-38.png" };
  }
})()
