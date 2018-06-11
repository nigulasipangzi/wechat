class Proposal {
  constructor(host) {
    this.host = host;
  }
  query(onSucc) {
    this.host.req('/proposal/list.json', null, (r) => {
      onSucc(r);
    })
  }
  queryProduct(tag, vendor, text, onSucc) {
    this.host.req('/proposal/query_clause.json', { tag: tag, company: vendor, text: text == "" ? null : text }, (r) => {
      onSucc(r);
    })
  }
  create(applicant, insurant, onSucc) {
    this.host.req('/proposal/create.json', { applicant: applicant, insurant: insurant }, (r) => {
      onSucc(r);
    })
  }
  createPlan(proposalId, insurant, onSucc) {
    this.host.req('/proposal/create_plan.json', { proposalId: proposalId, insurant: insurant }, (r) => {
      onSucc(r);
    })
  }
  load(proposalId, onSucc) {
    this.host.req('/proposal/load.json', { proposalId: proposalId }, (r) => {
      onSucc(r);
    })
  }
  view(proposalId, onSucc) {
    this.host.req('/proposal/view.json', { proposalId: proposalId }, (r) => {
      onSucc(r);
    })
  }
  viewPlan(planId, onSucc) {
    this.host.req('/proposal/plan/edit.json', { planId: planId }, (r) => {
      onSucc(r);
    })
  }
  refreshInsurant(planId, ins, onSucc) {
    this.host.req('/proposal/plan/customer.json', { planId: planId, insurant: ins }, (r) => {
      onSucc(r);
    })
  }
  addProduct(planId, prdId, onSucc) {
    this.host.req('/proposal/plan/clause.json', { planId: planId, productId: prdId }, (r) => {
      onSucc(r);
    })
  }
  editProduct(planId, index, onSucc) {
    this.host.req('/proposal/plan/view_clause.json', { planId: planId, index: index }, (r) => {
      onSucc(r);
    })
  }
  deleteProduct(planId, index, onSucc) {
    this.host.req('/proposal/plan/remove_clause.json', { planId: planId, index: index }, (r) => {
      onSucc(r);
    })
  }
  listRiders(planId, onSucc) {
    this.host.req('/proposal/plan/list_riders.json', { planId: planId }, (r) => {
      onSucc(r);
    })
  }
  format(planId, style, onSucc) {
    this.host.req('/proposal/plan/format.json', { planId: planId, style: style }, (r) => {
      onSucc(r);
    })
  }
}

export { Proposal }
