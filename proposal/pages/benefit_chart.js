// pages/benefit_chart.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    chart: {
      type: Object,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    raw: {
      ml: 80,
      mr: 40,
      mt: 80,
      mb: 130,
      w: 750,
      h: 550,
      m: 5, //坐标尺刻度长短
      bar: 20, //bar宽度
      barm: 50, //bar空白
      font: 24,
      text: 24
    },
    pos: 0,
    chart: {
      age: 0,
      data: []
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    prepare() {
      let chart = this.properties.chart
      console.log(chart);
      this.data.axis = this.translate(this.data.raw)
      this.data.ctx = wx.createCanvasContext("chart071", this)
      this.data.ctx.setLineCap('round')
      this.data.ctx.setLineJoin('round')

      if (chart) {
        chart.content.data.map(v => {
          for (let j = 0; j < v.data.length; j++)
            v.data[j] = Math.round(v.data[j])
        });
        this.data.chart = chart.content;
        this.setData({ productName: chart.productName, chart: this.data.chart })
      } else {
        this.data.chart = { age: 0, data: [] }
        this.setData({ productName: "", chart: this.data.chart })
      }
    },
    draw(cx) {
      let ax = this.data.axis;
      let ctx = this.data.ctx;
      ctx.clearRect(0, 0, ax.w, ax.h)

      let xy = this.measure(this.data.chart.data);
      let x0 = ax.ml
      let y0 = ax.h - ax.mb
      let w = ax.w - ax.mr - ax.ml
      let h = ax.h - ax.mb - ax.mt

      //画坐标系标尺
      ctx.setLineDash(null);
      ctx.beginPath()
      ctx.setLineWidth(1)
      ctx.moveTo(x0, y0 - h)
      ctx.lineTo(x0, y0)
      ctx.lineTo(x0 + w, y0)
      ctx.setFontSize(ax.font)
      ctx.setTextAlign('right')
      ctx.setTextBaseline('middle')
      ctx.fillText("万", x0, y0 - h * 1.1)
      for (let i = 0; i <= 10; i++) {
        ctx.moveTo(x0, y0 - h * i / 10)
        ctx.lineTo(x0 - ax.m, y0 - h * i / 10)

        let v = xy.y * i / 10 / 10000;
        if (v < 10) {
          v = v.toFixed(1)
        } else {
          v = Math.round(v)
        }
        ctx.fillText(v, x0 - ax.m - 1, y0 - h * i / 10)
      }
      ctx.setTextAlign('center')
      ctx.setTextBaseline('top')
      for (let i = 0; i < xy.x; i += Math.ceil(xy.x / 10)) {
        ctx.moveTo(x0 + w * i / (xy.x - 1), y0)
        ctx.lineTo(x0 + w * i / (xy.x - 1), y0 + ax.m)
        ctx.fillText(this.data.chart.age + i, x0 + w * i / xy.x, y0 + ax.m)
      }
      ctx.setStrokeStyle("Black")
      ctx.stroke()

      //画线
      ctx.setLineWidth(3)
      this.data.chart.data.map(v1 => {
        if (v1.type == "text")
          return
        ctx.beginPath()
        for (let i = 0; i < xy.x; i++) {
          let x = x0 + i * w / (xy.x - 1);
          if (i == 0) {
            ctx.moveTo(x, y0 - v1.data[i] * h / xy.y)
          } else {
            ctx.lineTo(x, y0 - v1.data[i] * h / xy.y)
          }
        }
        ctx.setStrokeStyle("#" + v1.color)
        ctx.stroke()
      })

      //画顶部的介绍
      ctx.setTextAlign('right')
      ctx.setTextBaseline('middle')
      let x = ax.w - ax.mr
      this.data.chart.data.map(v1 => {
        if (v1.type == "text")
          return
        ctx.setFillStyle("#" + v1.color)
        ctx.fillText(v1.name, x, y0 - h * 1.1)
        x -= ctx.measureText(v1.name).width + ax.m + ax.bar
        ctx.fillRect(x, y0 - h * 1.1 - ax.bar / 2, ax.bar, ax.bar)
        x -= ax.m 
      })

      //计算点击的位置
      let pos = -1;
      if (cx) {
        for (let i = 0; i < xy.x; i++) {
          let x = x0 + i * w / (xy.x - 1);
          if (Math.abs(cx - x) < w / xy.x / 2) {
            pos = i;
            break;
          }
        }
        if (cx > x0 + w)
          pos = xy.x - 1
        else if (cx < x0)
          pos = 0
      }

      //画节点圈
      ctx.setLineWidth(1)
      this.data.chart.data.map(v1 => {
        if (v1.type == "text")
          return
        for (let i = 5; i < xy.x; i += 5) {
          ctx.beginPath()
          ctx.arc(x0 + i * w / (xy.x - 1), y0 - v1.data[i] * h / xy.y, 2, 0, Math.PI * 2)
          ctx.setFillStyle("White")
          ctx.fill()
          ctx.setStrokeStyle("#" + v1.color)
          ctx.stroke()
        }
      })

      //画下部的年龄条
      ctx.setFillStyle("LightGray")
      ctx.fillRect(x0, ax.h - ax.barm - ax.bar, w, ax.bar)
      ctx.setTextAlign('center')
      ctx.setTextBaseline('middle')
      ctx.setFillStyle("Black")
      ctx.setFontSize(ax.text)
      ctx.fillText("年龄", x0 / 2, ax.h - ax.barm - ax.bar / 2)

      //画选择线和年龄条的进度
      if (pos >= 0) {
        let posx = x0 + pos * w / (xy.x - 1)
        ctx.beginPath()
        ctx.setLineDash([4, 4]);
        ctx.lineDashOffset = ax.m;
        ctx.moveTo(posx, 0)
        ctx.lineTo(posx, ax.h - ax.barm - ax.bar)
        this.data.chart.data.map(v1 => {
          if (v1.type == "text")
            return
          let y = y0 - v1.data[pos] * h / xy.y;
          ctx.moveTo(posx, y)
          ctx.lineTo(x0, y)
        })
        ctx.setStrokeStyle("Gray")
        ctx.stroke()

        ctx.setFillStyle("ForestGreen")
        ctx.fillRect(x0, ax.h - ax.barm - ax.bar, posx - x0, ax.bar)

        ctx.setTextAlign('center')
        ctx.setTextBaseline('top')
        ctx.setFillStyle("Black")
        ctx.fillText((this.data.chart.age + pos) + "岁", posx, ax.h - ax.barm)
      }

      ctx.draw()
      
      if (pos >= 0)
        this.setData({ pos: pos })
    },
    measure(vals) {
      let y = 10;
      let x = 2;
      vals.map(v1 => {
        if (v1.type == "text")
          return
        v1.data.map(v2 => {
          if (y < v2)
            y = v2;
        })
        if (x < v1.data.length)
          x = v1.data.length
      })
      return { x: x, y: y };
    },
    translate(ox) {
      let ww = wx.getSystemInfoSync().windowWidth
      let s = ww / ox.w
      let r = {}
      for (let i in ox)
        r[i] = ox[i] * s
      return r
    },
    onTouch(e) {
      //let x = e.detail.x * this.data.raw.w / this.data.axis.w
      //let y = e.detail.y * this.data.raw.h / this.data.axis.h
      this.draw(e.changedTouches[0].x)
    }
  }
})
