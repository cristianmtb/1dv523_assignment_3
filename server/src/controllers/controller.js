// import octonode from 'octonode'
const octonode = require('octonode')
export function parseUpdate (data) {
  return {
    action: data.action,
    title: data.issue.title,
    url: data.issue.html_url,
    auhtor: data.sender.login,
    body: data.issue.body,
    changes: data.changes,
    id: data.issue.number
  }
}

export function getAllIssues () {
  const issues = []
  const client = octonode.client(process.env.secret)
  const repo = client.repo('1dv523/cb223ai-examination-3')
  repo.issues(function (callback, body, header) {
    body.map((issue) => {
      issues.push({
        id: issue.number,
        title: issue.title,
        url: issue.html_url,
        auhtor: issue.user.login,
        body: issue.body
      })
    })
  })
  return issues
}
