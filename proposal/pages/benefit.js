const APP = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode: 0,
    tabs: ["保障项目", "利益图表", "责任条款"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    APP.proposal.format(options.planId, "coverage", r => {
      this.setData({ coverage: r.coverage })
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

  onModeSwitch(e) {
    this.setData({ mode: e.currentTarget.dataset.i }, this.onRepaint)
  },

  onRepaint() {
    if (this.data.mode == 1) {
      let win = this.selectComponent("#benefitChart")
      win.draw()
    }
  }
})