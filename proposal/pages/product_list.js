const APP = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: { condition: false },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let r = APP.proposal.queryProduct("type:hot", (r) => {
      wx.setNavigationBarTitle({ title: "选择产品" });
      this.setData({
        list: r
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

  showCondition: function() {
    this.setData({ condition: true });
  },

  hideCondition: function() {
    this.setData({ condition: false });
  },

  addToPlan: function (e) {
    APP.navigateBack({ productId: e.target.dataset.v.code })
  }
})