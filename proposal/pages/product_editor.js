Component({
  data: {
    visible: false,
    y: 0
  },
  methods: {
    close() {
      let ani = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-in'
      })
      ani.translateY(wx.getSystemInfoSync().windowHeight).step()
      this.setData({ ani: ani.export() })
      setTimeout(() => {
        this.setData({ visible: false })
      }, 300)
    },
    open(prd) {
      let comps = prd.factors.map(v => {
        let index = 0
        let options = !v.detail ? null : v.detail.map((o, i) => {
          if (o[0] == v.value) { index = i }
          return o[1]
        })
        return {
          widget: v.widget,
          name: v.name,
          text: v.label,
          index: index,
          options: options
        }
      })

      let y = wx.getSystemInfoSync().windowHeight;
      this.setData({
        comps: comps,
        product: prd,
        visible: true,
        y: y
      }, () => { setTimeout(() => {
        let ani = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease-in'
        })
        ani.translateY(-y).step()
        this.setData({ ani: ani.export() })
      }, 100)})
    },
    onChange(e) {
      let comps = this.data.comps;
      comps[e.currentTarget.dataset.i].index = e.detail.value
      this.setData({ comps: comps })
    }
  },
})