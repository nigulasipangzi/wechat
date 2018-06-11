const APP = getApp()

Page({
  data: {
    ages: [],
    applicant: { age: 25, gender: "M" },
    insurant: { age: 20, gender: "M" }
  },
  onLoad(options) {
    let ages = [];
    for (let i=0;i<70;i++)
      ages.push(i);
    this.setData({ ages: ages })

    wx.setNavigationBarTitle({ title: "建议书" });
    APP.proposal.create(this.data.applicant, this.data.insurant, (r) => {
      this.setData({ proposal: r }, this.onProposal)
    })
  },
  onProposal() {
    if (this.data.proposal.name)
      wx.setNavigationBarTitle({ title: this.data.proposal.name });
    if (this.data.proposal.detail.length > 0) {
      APP.proposal.viewPlan(this.data.proposal.detail[0], (r) => {
        this.setData({ plan: r, insurant: r.insurant })
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
    this.data.insurant.gender = e.detail.value ? "F" : "M"
    this.refreshInsurant();
  },
  onAgeChange(e) {
    this.data.insurant.age = e.detail.value;
    this.data.insurant.birthday = null;
    this.refreshInsurant();
  },
  refreshInsurant() {
    APP.proposal.refreshInsurant(this.data.plan.planId, this.data.insurant, (r) => {
      this.setData({ insurant: this.data.insurant, plan: r })
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
