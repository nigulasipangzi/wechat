import { Proposal } from './utils/proposal.js'

App({
  host: {
    address: "https://api-test.iyb.tm/wx",
    // address: "http://www.lerrain.com:7666/wx",
    program: "proposal",
  },

  onLaunch: function () {
    this.host.req = (uri, param, onSucc, onFail) => {
      wx.showNavigationBarLoading()
      if (param == null)
        param = {}
      param.userKey = this.host.userKey
      param.program = this.host.program
      wx.request({
        url: this.host.address + uri,
        data: param,
        method: 'POST',
        success: function (res) {
          wx.hideNavigationBarLoading()
          console.log(uri, param, res.data)
          if (res.data.result == "success") {
            onSucc(res.data.content)
          } else if (onFail) {
            onFail(res.data.reason)
          }
        }
      })
    }

    this.navigateBack = (param) => {
      this._passport = param;
      wx.navigateBack()
    }

    this.passport = () => {
      let r = this._passport;
      this._passport = null;
      return r;
    }

    this.tools = require("./utils/util.js")
    this.proposal = new Proposal(this.host)

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.user = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }
})