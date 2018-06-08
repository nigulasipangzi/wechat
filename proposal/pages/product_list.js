const APP = getApp()

const Tools = require("../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let r = APP.proposal.query((r) => {
      r.list.map(v => { v.updateTime = Tools.formatTime(new Date(v.updateTime)) })
      wx.setNavigationBarTitle({ title: "我的建议书(" + r.total + ")" });
      this.setData({
        total: r.total,
        list: r.list
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  edit: function(e) {
    wx.navigateTo({ url: './editor?proposalId=' + e.target.dataset.v.id })
  }
})