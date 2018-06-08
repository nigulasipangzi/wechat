import { User } from './user.js';  
import { Proposal } from './proposal.js';  

const HOST = "http://www.lerrain.com:7666/wx"
const PROPOSAL = new Proposal(HOST)
const USER = new User(HOST)
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
  onAllReady: function(user) {
    APP.user = user;
    console.log(APP.user);
    wx.login({
      success: function (res) {
        console.log(res)
        wx.request({
          //获取openid接口  
          url: HOST + '/x/login.json',
          data: { program: "proposal", jsCode: res.code },
          method: 'POST',
          success: function (res) {
            console.log(res.data);
            if (res.data.result == "success") {
              USER.login("", (r) => {
                PROPOSAL.create(r);
              });
            }
          }
        })
      }
    })
  },
  onLoad: function () {
    if (APP.globalData.userInfo) {
      this.setData({
        userInfo: APP.globalData.userInfo,
        hasUserInfo: true
      })
      this.onAllReady(APP.globalData.userInfo)
    } else if (this.data.canIUse) {
      APP.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.onAllReady(res.userInfo)
      }
    } else {
      wx.getUserInfo({
        success: res => {
          APP.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          this.onAllReady(APP.globalData.userInfo)
        }
      })
    }
  },
  openList: function() { 
    PROPOSAL.query()
  }
})
