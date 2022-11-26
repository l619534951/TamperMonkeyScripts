// ==UserScript==
// @name         百度搜索结果替换为直链
// @namespace    https://github.com/l619534951/TamperMonkeyScripts
// @version      1.0
// @description  百度搜索结果页面，搜索链接替换为直链
// @author       妖精你好厉害
// @match        *.baidu.com/s?*
// @connect      e.e
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  'use strict';

  const replaceWithRealUrl = function () {
    const linkTags = getAllLinkTag()
    linkTags.forEach(linkTag => replaceRealUrlFor(linkTag))
  }

  const replaceRealUrlFor = function (linkTag) {
    const originUrl = linkTag.href.replace(/^http:/, "https:")
    GM_xmlhttpRequest({
      url: originUrl,
      headers: { "Accept": "*/*", "Referer": originUrl},
      method: "GET",
      timeout: 10000,
      onerror: (rsp) => {
        const errText = rsp.error;
        if (errText.includes("Refused to connect to")) {
          const newUrl = errText.match(/Refused to connect to \"(.*?)\"/)[1]
          if (newUrl) {
            linkTag.href = newUrl
          }
        }
      },
      onload: function (rsp) {
        if (rsp.status === 200) {
          linkTag.href = rsp.finalUrl
        }
      }
    })
  }

  const getAllLinkTag = function () {
    let linkTags = [...document.querySelectorAll("a")]
    linkTags = linkTags.filter(item => {
      const href = item.href
      if (href === null) {
        return false
      }
      const reg1 = 'http://www.baidu.com/link?'
      const reg2 = 'https://www.baidu.com/link?'
      return href.startsWith(reg1) || href.startsWith(reg2)
    })
    return linkTags
  }

  replaceWithRealUrl()
})();