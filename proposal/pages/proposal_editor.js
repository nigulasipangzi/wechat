const APP = getApp()

Page({
  data: {
  },
  onLoad(options) {
    wx.setNavigationBarTitle({ title: "建议书" });
    let applicant = {age: 25, gender: "M"};
    let insurant = { age: 20, gender: "M" };
    APP.proposal.create(applicant, insurant, (r) => {
      this.setData({ proposal: r }, this.onProposal)
    })
  },
  onProposal() {
    if (this.data.proposal.name)
      wx.setNavigationBarTitle({ title: this.data.proposal.name });
    if (this.data.proposal.detail.length > 0) {
      APP.proposal.viewPlan(this.data.proposal.detail[0], (r) => {
        this.setData({ plan: r })
      });
    }
  },
  onShow() {
    let opt = APP.passport();
    if (opt) {
      if (opt.productId) {
        APP.proposal.addProduct(this.data.plan.planId, opt.productId, (r) => {
          this.setData({ plan: r })
        });
      }
      if (opt.proposalId) {
        APP.proposal.load(opt.proposalId, (r) => {
          this.setData({ proposal: r }, this.onProposal)
        })
      }
    }
  },
  onGenderChange(e) {
    let ins = this.data.plan.insurant
    ins.gender = e.detail.value ? "F" : "M"
    APP.proposal.refreshInsurant(this.data.plan.planId, ins, (r) => {
      this.setData({ plan: r })
    })
  },
  openProposalList() { 
    wx.navigateTo({ url: './proposal_list' })
  },
  addProduct() {
    wx.navigateTo({ url: './product_list' })
  },
  editProduct(e) {
    if (e.currentTarget.dataset.tag != "delete") {
      APP.proposal.editProduct(this.data.plan.planId, e.currentTarget.dataset.i, (r) => {
        let win = this.selectComponent("#editor")
        win.open(r);
      })
    }
  },
  deleteProduct(e) {
    APP.proposal.deleteProduct(this.data.plan.planId, e.currentTarget.dataset.i, (r) => {
      this.setData({ plan: r })
    })
  },
  showRiders() {
    if (this.data.riders) {
      this.setData({ riders: null })
    } else {
      APP.proposal.listRiders(this.data.plan.planId, (r) => {
        this.setData({ riders: r })
      })
    }
  }
})