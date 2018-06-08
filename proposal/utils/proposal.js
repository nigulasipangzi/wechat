class Proposal {
  constructor(host) {
    this.host = host;
  }
  query(onSucc) {
    this.host.req('/proposal/list.json', null, (r) => {
      onSucc(r);
    })
  }
  create(applicant, onSucc) {
    this.host.req('/proposal/create.json', { applicant: applicant }, (r) => {
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
    this.host.req('/proposal/plan/view.json', { planId: planId }, (r) => {
      onSucc(r);
    })
  }
}

export { Proposal }
