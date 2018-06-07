class Proposal {
  constructor(host) {
    this.host = host;
  }
  query() {
    wx.request({
      url: this.host + '/proposal/list.json',
      data: { owner: 1 },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        if (res.data.result == "success") {
        }
      }
    })
  }
  create(owner) {
    console.log(owner);
    wx.request({
      url: this.host + '/proposal/create.json',
      data: { owner: owner },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        if (res.data.result == "success") {
        }
      }
    })
  }
}

export { Proposal }
