// ==UserScript==
// @name         更改网页字体
// @namespace    https://github.com/l619534951/TamperMonkeyScripts
// @version      1.0
// @description  更该页面字体为微软雅黑优先或者鸿蒙字体优先，为了防止影响字体图标，不使用!important
// @author       南极大野猪
// @match        */*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// ==/UserScript==

(function () {
    'use strict';
    const YaHeiFontFamily = '"Microsoft YaHei", "微软雅黑"'
    const HarmonyFontFamily = '"HarmonyOS Sans SC"'
    const yaheiFirst = `*{font-family: "Arial", ${YaHeiFontFamily}, sans-serif}`
    const harmonyFirst = `*{font-family: "Arial", ${HarmonyFontFamily}, "Microsoft YaHei", "微软雅黑", sans-serif}`

    const isYaheiFist = () => {
        return GM_getValue("fontFamily", "yh") === "yh"
    }

    const setStyle = () => {
        const styleEl = document.createElement('style');
        styleEl.id = "user-font-family-settings"
        if (isYaheiFist()) {
            styleEl.innerHTML = yaheiFirst
        } else {
            styleEl.innerHTML = harmonyFirst
        }

        let headEl = document.querySelector('head')
        let settedEl = headEl.querySelector(`#${styleEl.id}`)
        if (settedEl) {
            settedEl.remove()
        }
        headEl.appendChild(styleEl)
    }

    const setYaHeiPriority = () => {
        if (document.fonts.check(`12px ${YaHeiFontFamily}`)) {
            GM_setValue("fontFamily", "yh")
            setStyle();
        } else {
            alert('你的设备没有安装微软雅黑字体，设置微软雅黑字体优先失败。')
        }
    }

    const setHarmonyPriority = () => {
        if (document.fonts.check(`12px ${HarmonyFontFamily}`)) {
            GM_setValue("fontFamily", "hm")
            setStyle()
        } else {
            alert('你的设备没有安装鸿蒙字体，设置鸿蒙字体优先失败。')
        }
    }

    const getHarmonyFont = () => {
        GM_openInTab('https://developer.harmonyos.com/cn/docs/design/font-0000001157868583', {active: true})
    }

    const registerMenu = () => {
        GM_registerMenuCommand("微软雅黑优先", setYaHeiPriority, '')
        GM_registerMenuCommand("鸿蒙字体优先", setHarmonyPriority, '')
        GM_registerMenuCommand("下载鸿蒙字体", getHarmonyFont, '')
    }

    setStyle();
    registerMenu();
})();