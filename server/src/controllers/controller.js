// import octonode from 'octonode'
const octonode = require('octonode')
export function parseUpdate (data) {
  return {
    action: data.action,
    issue: data.issue.title,
    url: data.issue.html_url,
    auhtor: data.sender.login,
    body: data.issue.body,
    changes: data.changes
  }
}

export function getAllIssues () {
  var client = octonode.client(process.env.secret)
  const repo = client.repo('1dv523/cb223ai-examination-3')
  repo.issues(function (callback, body, header) {
    console.log(body)
  })
}
