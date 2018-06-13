const APP = getApp()

Component({
  data: {
    visible: false,
    form: [],
    y: 0
  },
  methods: {
    close() {
      this.data.onClose()
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
    // open(prd, riders) {
    //   let comps = prd.factors.map(v => {
    //     let index = 0
    //     let options = !v.detail ? null : v.detail.map((o, i) => {
    //       if (o[0] == v.value) { index = i }
    //       return o[1]
    //     })
    //     return {
    //       widget: v.widget,
    //       name: v.name,
    //       text: v.label,
    //       index: index,
    //       options: options
    //     }
    //   })

    //   let y = wx.getSystemInfoSync().windowHeight;
    //   this.setData({
    //     comps: comps,
    //     product: prd,
    //     riders: riders,
    //     visible: true,
    //     y: y
    //   }, () => { setTimeout(() => {
    //     let ani = wx.createAnimation({
    //       duration: 300,
    //       timingFunction: 'ease-in'
    //     })
    //     ani.translateY(-y).step()
    //     this.setData({ ani: ani.export() })
    //   }, 100)})
    // },
    onChange(e) {
      let opt = e.currentTarget.dataset.v;
      let index = e.currentTarget.dataset.i
      let vals = {};
      vals[opt.name] = opt.vals[Number(e.detail.value)]
      APP.proposal.saveProduct(this.data.planId, index, vals, r => {
        this.data.form[index].form[e.currentTarget.dataset.j].index = e.detail.value
        this.setData({ form: this.data.form })
      })
    },
    formOf(factors) {
      return !factors ? null : factors.map(v => {
        let index = 0
        let options = !v.detail ? null : v.detail.map((o, i) => {
          if (o[0] == v.value) { index = i }
          return o[1]
        })
        let vals = !v.detail ? null : v.detail.map(o => o[0])
        return {
          widget: v.widget,
          name: v.name,
          text: v.label,
          index: index,
          vals: vals,
          options: options
        }
      })      
    },
    addRider(e) {
      let productId = e.currentTarget.dataset.v.productId
      let riderForm = this.data.form[e.currentTarget.dataset.i]
      if (riderForm.form == null) {
        APP.proposal.addProduct(this.data.planId, this.data.index, productId, r => {
          r.product.map((r2, i) => {
            if (r2.productId == productId && r2.parent == this.data.index) APP.proposal.editProduct(this.data.planId, i, r1 => {
              riderForm.form = this.formOf(r1.factors)
              this.setData({ form: this.data.form })
            })
          })
        })
      } else {
        APP.proposal.deleteProduct(this.data.planId, this.data.index, productId, r => {
          riderForm.form = null
          this.setData({ form: this.data.form })
        })
      }
    },
    pop(plan, index, onClose) {
      this.data.form = []
      APP.proposal.editProduct(plan.planId, index, r1 => {
        this.data.form.push({
          name: r1.name,
          form: this.formOf(r1.factors)
        })

        let ani = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease-in'
        })
        ani.translateY(-y).step()
        this.setData({ planId: plan.planId, index: index, onClose: onClose, form: this.data.form, ani: ani.export() })

        APP.proposal.listRiders(plan.planId, index, r2 => {
          r2.map(v => {
            let prdForm = {
              name: v.name,
              productId: v.code,
              form: null
            }
            plan.product.map((r3, i) => {
              if (r3.productId == v.code && r3.parent == index) {
                APP.proposal.editProduct(plan.planId, i, r4 => {
                  prdForm.form = this.formOf(r4.factors)
                  this.setData({ form: this.data.form })
                })
              }
            })
            this.data.form.push(prdForm)
          })
          this.setData({ form: this.data.form })
        })
      })

      let y = wx.getSystemInfoSync().windowHeight;
      this.setData({
        visible: true,
        y: y
      })
    }
  },
})