const APP = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onUserReady: function(user) {
    APP.user = user;
  },
  onLoad: function (options) {
    if (APP.user) {
      this.onUserReady(APP.user)
    } else if (this.data.canIUse) {
      APP.userInfoReadyCallback = res => { this.onUserReady(res.userInfo) }
    } else {
      wx.getUserInfo({ success: res => { this.onUserReady(res.userInfo) }})
    }

    if (options.proposalId) {
      APP.proposal.load(options.proposalId, (r) => {
        this.setData({ proposal: r }, this.onProposal)
      })
    } else {
      let applicant = {};
      APP.proposal.create(applicant, (r) => {
        this.setData({ proposal: r }, this.onProposal)
      })
    }

    wx.setNavigationBarTitle({ title: "建议书" });
  },
  onProposal: function() {
    if (this.data.proposal.name)
      wx.setNavigationBarTitle({ title: this.data.proposal.name });
    if (this.data.proposal.detail.length > 0) {
      APP.proposal.viewPlan(this.data.proposal.detail[0], (r) => {
        this.setData({ plan: r })
      });
    }
  },
  openList: function() { 
    wx.navigateTo({ url: './product_list' })
  }
})
