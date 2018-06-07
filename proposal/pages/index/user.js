class User {
  constructor(host) {
    this.host = host;
  }
  login(key, onSucc) {
    wx.request({
      url: this.host + '/user/login.json',
      data: { loginName: "lex", password: "123456" },
      method: 'POST',
      success: function (res) {
        if (res.data.result == "success") {
          onSucc(res.data.content);
        }
      }
    })
  }
}

export { User }
