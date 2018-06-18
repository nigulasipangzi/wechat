const APP = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.listMore()
  },

  listMore() {
    let r = APP.proposal.query(this.data.current, 10, r => {
      r.list.map(v => { v.updateTime = APP.tools.formatTime(new Date(v.updateTime)) })
      wx.setNavigationBarTitle({ title: "我的建议书(" + r.total + ")" });
      this.data.list = this.data.list.concat(r.list)
      this.setData({
        current: this.data.current + r.list.length,
        total: r.total,
        list: this.data.list
      })
      wx.stopPullDownRefresh()
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
    this.data.current = 0
    this.data.list = []
    this.listMore()
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

  del() {
    wx.showModal({
      title: '警告',
      content: '确认删除吗',
      success(res) {
        if (res.confirm)
          APP.proposal.delete(e.currentTarget.dataset.v.id)
      }
    })
  },

  favourite(e) {
    let p = e.currentTarget.dataset;
    this.data.list[p.i].favourite = !this.data.list[p.i].favourite
    APP.proposal.favourite(p.v.id, this.data.list[p.i].favourite, r => {
      this.setData({ list:this.data.list })
    })
  },

  edit(e) {
    APP.navigateBack({ proposalId: e.currentTarget.dataset.v.id })
  }
})