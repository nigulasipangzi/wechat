const APP = getApp()

Page({
  data: {
    ages: [],
    applicant: { age: 25, gender: "M" },
    insurant: { age: 20, gender: "M" },
    index: 0,
    now: APP.tools.formatDate(new Date())
  },
  onLoad(options) {
    let ages = []
    for (let i=0;i<70;i++)
      ages.push(i)
    this.setData({ ages: ages })

    wx.setNavigationBarTitle({ title: "建议书" })
    APP.proposal.create(this.data.applicant, this.data.insurant, r => {
      this.setData({ proposal: r, index: 0 }, this.onProposal)
    })
  },
  onProposal() {
    if (this.data.proposal.name)
      wx.setNavigationBarTitle({ title: this.data.proposal.name });
    if (this.data.proposal.detail.length > this.data.index) {
      APP.proposal.viewPlan(this.data.proposal.detail[this.data.index], r => {
        this.setData({ plan: r, insurant: r.insurant })
      })
    }
  },
  onShow() {
    let opt = APP.passport();
    if (opt) {
      if (opt.refresh) {
        this.onProposal()
      } else if (opt.productId) {
        APP.proposal.addProduct(this.data.plan.planId, null, opt.productId, r => {
          this.setData({ plan: r })
        })
      } else if (opt.proposalId) {
        APP.proposal.load(opt.proposalId, r => {
          this.setData({ proposal: r, index: 0 }, this.onProposal)
        })
      }
    }
  },
  onGenderChange(e) {
    this.data.insurant.gender = e.detail.value ? "F" : "M"
    this.refreshInsurant()
  },
  onAgeChange(e) {
    this.data.insurant.age = e.detail.value
    this.data.insurant.birthday = null
    this.refreshInsurant()
  },
  onBirthdayChange(e) {
    this.data.insurant.birthday = e.detail.value
    this.refreshInsurant()
  },
  onPlanSwitch(e) {
    this.setData({ index: e.currentTarget.dataset.i }, this.onProposal)
  },
  refreshInsurant() {
    APP.proposal.refreshInsurant(this.data.plan.planId, this.data.insurant, r => {
      this.setData({ insurant: r.insurant, plan: r })
    })
  },
  createPlan() {
    let insurant = { gender: "M", age: "20" }
    APP.proposal.createPlan(this.data.proposal.proposalId, insurant, r => {
      this.setData({ proposal: r, index: r.detail.length - 1 }, this.onProposal)
    })
  },
  deletePlan(e) {
    if (this.data.proposal.detail.length <= 1) {
      wx.showModal({
        title: '警告',
        content: '至少需有一个计划，将它清空吗？',
        success: res => {
          if (res.confirm) {
            APP.proposal.clearPlan(this.data.proposal.detail[this.data.index], r => {
              this.onProposal()
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '警告',
        content: '确认删除该计划及其所有产品吗？',
        success: res => {
          if (res.confirm) {
            APP.proposal.deletePlan(this.data.proposal.proposalId, this.data.proposal.detail[this.data.index], r => {
              this.setData({ proposal: r, index: 0 }, this.onProposal)
            })
          }
        }
      })
    }
  },
  addProduct() {
    wx.navigateTo({ url: './product_list?planId=' + this.data.plan.planId })
  },
  editProduct(e) {
    wx.navigateTo({ url: './product_editor?planId=' + this.data.plan.planId + "&index=" + e.currentTarget.dataset.i })
  },
  deleteProduct(e) {
    APP.proposal.deleteProduct(this.data.plan.planId, e.currentTarget.dataset.i, null, r => {
      this.setData({ plan: r })
    })
  },
  openProposalList() {
    wx.navigateTo({ url: './proposal_list' })
  },
  next() {
    APP.proposal.save(this.data.proposal.proposalId, r => {
      wx.navigateTo({ url: './proposal_supply?proposalId=' + this.data.proposal.proposalId })
    }, r => {
      wx.showToast({ icon: 'none', title: r })
    })
  },
  showBenefit() {
    if (this.data.plan.product == null || this.data.plan.product.length == 0)
      wx.showToast({ icon: 'none', title: '计划为空' })
    else
      wx.navigateTo({ url: './benefit?planId=' + this.data.plan.planId })
  }
})
