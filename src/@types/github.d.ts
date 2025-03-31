interface GitHubIssue {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: GitHubUser;
  labels: GitHubLabel[];
  state: string;
  locked: boolean;
  assignee: GitHubUser | null;
  assignees: GitHubUser[];
  milestone: GitHubMilestone | null;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  author_association: string;
  type: string | null;
  sub_issues_summary: GitHubSubIssuesSummary;
  active_lock_reason: string | null;
  body: string;
  reactions: GitHubReactions;
  timeline_url: string;
  performed_via_github_app: string | null;
  state_reason: string | null;
  score: number;
}

interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

interface GitHubMilestone {
  url: string;
  html_url: string;
  labels_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  description: string;
  creator: GitHubUser;
  open_issues: number;
  closed_issues: number;
  state: string;
  created_at: string;
  updated_at: string;
  due_on: string | null;
  closed_at: string | null;
}

interface GitHubSubIssuesSummary {
  total: number;
  completed: number;
  percent_completed: number;
}

interface GitHubReactions {
  url: string;
  total_count: number;
  '+1': number;
  '-1': number;
  laugh: number;
  hooray: number;
  confused: number;
  heart: number;
  rocket: number;
  eyes: number;
}
