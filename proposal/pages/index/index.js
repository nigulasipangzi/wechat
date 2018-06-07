import { Proposal } from './proposal.js';  

const HOST = "https://api-test.iyb.tm"
const PROPOSAL = new Proposal(HOST)
const APP = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReady: function(user) {
    APP.user = user;
    console.log(APP.user);
  },
  onLoad: function () {
    if (APP.globalData.userInfo) {
      this.setData({
        userInfo: APP.globalData.userInfo,
        hasUserInfo: true
      })
      this.onReady(APP.globalData.userInfo)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      APP.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.onReady(APP.globalData.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          APP.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          this.onReady(APP.globalData.userInfo)
        }
      })
    }
  },
  getOpenIdTap: function () {
    var that = this;
    wx.login({
      success: function (res) {
        console.log(res)
        wx.request({
          //获取openid接口  
          url: host + '/util/wechat/user.json',
          data: { program: "proposal", jsCode: res.code },
          method: 'POST',
          success: function (res) {
            if (res.data.result == "success") {
              console.log(res.data.content)
            }
          }
        })
      }
    })
  },
  openList: function() { 
    PROPOSAL.query()
  }
})
