const APP = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: { 
    search: "",
    sort: "hot",
    vendor: null,
    focus: false,
    sorts: { hot:"热门", medical:"医疗", thunder:"重疾", life:"人寿", child:"少儿", money:"理财" },
    vendors: { zhongan:"众安保险", fosun:"复兴联合健康", aeonlife:"百年人寿", pingan:"中国平安", tplife:"太平人寿" }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: "选择产品" })
    this.query(options.planId)
  },

  onQuerySort(e) {
    this.setData({ sort: e.currentTarget.dataset.i }, () => { this.query() })
  },

  onQueryVendor(e) {
    this.setData({ vendor: e.currentTarget.dataset.i }, () => { this.query() })
  },

  onQueryText(e) {
    this.setData({ search: e.currentTarget.value }, () => { this.query() })
  },

  clear() {
    this.setData({ sort:"hot", vendor:null, search:"" }, () => { this.query() })
  },

  query(planId) {
    let r = APP.proposal.queryProduct(planId, this.data.sort, this.data.vendor, this.data.search, r => {
      let list = r.map(v => {
        v.tag = v.tag == null || v.tag.length == 0 ? null : v.tag[0]
        return v
      })
      this.setData({ list: list })
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
    this.setData({ focus: true });
  },

  hideCondition: function() {
    this.setData({ focus: false });
  },

  addToPlan: function (e) {
    let i = e.currentTarget.dataset.i;
    let prd = this.data.list[i];
    if (prd.rule) {
      wx.showModal({
        title: '提示',
        content: '当前客户信息（年龄、性别等）下，该产品并不适用，仍要添加吗？',
        success: res => {
          if (res.confirm) {
            APP.navigateBack({ productId: prd.code })
          }
        }
      })
    } else {
      APP.navigateBack({ productId: prd.code })
    }
  }
})