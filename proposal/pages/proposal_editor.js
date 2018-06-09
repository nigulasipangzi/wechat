const APP = getApp()

Page({
  data: {
  },
  onLoad(options) {
    wx.setNavigationBarTitle({ title: "建议书" });
    let applicant = {};
    APP.proposal.create(applicant, (r) => {
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
  openProposalList() { 
    wx.navigateTo({ url: './proposal_list' })
  },
  addProduct() {
    wx.navigateTo({ url: './product_list' })
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
