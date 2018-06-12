// pages/benefit_chart.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    axis: {
      ml: 20,
      mr: 40,
      mt: 20,
      mb: 20,
      tt: 40,
      tb: 80,
      tl: 60,
      w: 750,
      h: 500 
    },
    chart: {
      name: ["累计保费", "现金价值"],
      vals: [
        [], []
      ]
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    sim() {
      for (let i=0;i<80;i++) {
        this.data.chart.vals[0].push(Math.sin(i * Math.PI / 180) * 350000)
        this.data.chart.vals[1].push(Math.sin(i * Math.PI / 180) * 230000)
      }
    },
    draw() {
      this.sim()

      let ax = this.translate(this.data.axis)
      let ctx = wx.createCanvasContext("chart071", this)
      ctx.clearRect(0, 0, ax.w, ax.h)

      ax.max = this.measure(this.data.chart.vals);

      ctx.beginPath()
      ctx.setLineWidth(1)
      ctx.moveTo(ax.ml + ax.tl, ax.mt + ax.tt)
      ctx.lineTo(ax.ml + ax.tl, ax.h - ax.mb - ax.tb)
      ctx.lineTo(ax.w - ax.mr, ax.h - ax.mb - ax.tb)
      ctx.setStrokeStyle("gray")
      ctx.stroke()

      let x0 = ax.ml + ax.tl
      let y0 = ax.h - ax.mb - ax.tb
      let w = ax.w - ax.mr - ax.ml - ax.tl
      let h = ax.h - ax.mb - ax.mt - ax.tt - ax.tb

      ctx.setLineWidth(3)
      this.data.chart.vals.map(v1 => {
        ctx.beginPath()
        for (let x=0;x<v1.length;x++) {
          if (x == 0) {
            ctx.moveTo(x0 + x * w / v1.length, y0 - v1[x] * h / ax.max)
          } else {
            ctx.lineTo(x0 + x * w / v1.length, y0 - v1[x] * h / ax.max)
          }
        }
        ctx.setStrokeStyle("DarkCyan")
        ctx.stroke()
      })

      ctx.setLineWidth(1)
      this.data.chart.vals.map(v1 => {
        for (let x = 5; x < v1.length; x += 5) {
          ctx.beginPath()
          ctx.arc(x0 + x * w / v1.length, y0 - v1[x] * h / ax.max, 2, 0, Math.PI * 2)
          ctx.setFillStyle("white")
          ctx.fill()
          ctx.setStrokeStyle("DarkCyan")
          ctx.stroke()
        }
      })

      ctx.draw()
    },
    measure(vals) {
      let max = 0;
      vals.map(v1 => {
        v1.map(v2 => {
          if (max < v2)
            max = v2;
        })
      })
      return max;
    },
    translate(ox) {
      let ww = wx.getSystemInfoSync().windowWidth
      let s = ww / ox.w
      let r = {}
      for (let i in ox)
        r[i] = ox[i] * s
      return r
    }
  }
})
