const APP = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    form: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    APP.proposal.viewPlan(options.planId, plan => {
      APP.proposal.editProduct(options.planId, options.index, r1 => {
        wx.setNavigationBarTitle({ title: r1.name })
        this.data.form.push({
          name: r1.name,
          form: this.formOf(r1.factors)
        })
        this.setData({ planId: options.planId, index: options.index, form: this.data.form })

        APP.proposal.listRiders(options.planId, options.index, r2 => {
          r2.map((v, j) => {
            this.data.form.push({ name: v.name, productId: v.code })
            plan.product.map((r3, i) => {
              if (r3.productId == v.code && r3.parent == options.index) {
                APP.proposal.editProduct(options.planId, i, r4 => {
                  this.data.form[j+1].form = this.formOf(r4.factors)
                  this.setData({ form: this.data.form })
                })
              }
            })
          })
          this.setData({ form: this.data.form })
        })
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

  back() {
    APP.navigateBack({ refresh: true })
  },

  onChange(e) {
    let opt = e.currentTarget.dataset.v;
    let index = e.currentTarget.dataset.i
    let vals = {};
    vals[opt.name] = opt.vals[Number(e.detail.value)]
    APP.proposal.saveProduct(this.data.planId, index, vals, r => {
      this.data.form[index].form[e.currentTarget.dataset.j].index = e.detail.value
      this.setData({ form: this.data.form })
    })
  },

  formOf(factors) {
    return !factors ? null : factors.map(v => {
      let index = 0
      let options = !v.detail ? null : v.detail.map((o, i) => {
        if (o[0] == v.value) { index = i }
        return o[1]
      })
      let vals = !v.detail ? null : v.detail.map(o => o[0])
      return {
        widget: v.widget,
        name: v.name,
        text: v.label,
        index: index,
        vals: vals,
        options: options
      }
    })
  },

  addRider(e) {
    let productId = e.currentTarget.dataset.v.productId
    let riderForm = this.data.form[e.currentTarget.dataset.i]
    if (riderForm.form == null) {
      APP.proposal.addProduct(this.data.planId, this.data.index, productId, r => {
        r.product.map((r2, i) => {
          if (r2.productId == productId && r2.parent == this.data.index) APP.proposal.editProduct(this.data.planId, i, r1 => {
            riderForm.form = this.formOf(r1.factors)
            this.setData({ form: this.data.form })
          })
        })
      })
    } else {
      APP.proposal.deleteProduct(this.data.planId, this.data.index, productId, r => {
        riderForm.form = null
        this.setData({ form: this.data.form })
      })
    }
  }
})