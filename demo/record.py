#!/usr/bin/env python3
"""
DevContext demo video recorder.
Creates ~2 min walkthrough with HTML mockups + narration.
Usage: python3 demo/record.py
"""
import asyncio, subprocess, time, os, json
from pathlib import Path

PROJECT = Path("/home/astraedus/projects/devcontext")
DEMO = Path("/tmp/devcontext-demo")
VDIR = DEMO / "frames"
ADIR = DEMO / "audio"
MDIR = DEMO / "mockups"
OUT = DEMO / "devcontext-demo.mp4"

for d in [VDIR, ADIR, MDIR]:
    d.mkdir(parents=True, exist_ok=True)

NARRATION = [
    ("00_intro",
     "AI agents are getting access to more of our tools every day. "
     "GitHub, Slack, Calendar. But how do you give an AI access to your APIs "
     "without giving away the keys to the kingdom?"),
    ("01_problem",
     "Most apps use static API tokens. The AI gets your full permissions. "
     "Tokens never expire. No audit trail. No way to revoke access without "
     "breaking everything."),
    ("02_solution",
     "DevContext solves this with Auth0 Token Vault. "
     "Instead of static tokens, the AI requests scoped, time-limited tokens on demand "
     "via RFC 8693 token exchange. Every token is automatically scoped to exactly "
     "the permissions the user granted."),
    ("03_login",
     "Users sign in through Auth0. One click connects GitHub, Google Calendar, "
     "and Slack. Token Vault securely stores and manages all OAuth tokens. "
     "The AI never sees or stores a single credential."),
    ("04_chat",
     "Ask DevContext to brief you for standup, and it calls tools across all "
     "three services. Each tool call appears as a live status indicator. "
     "GitHub in white, Calendar in blue, Slack in purple. "
     "Full transparency into what the AI is doing with your data."),
    ("05_permissions",
     "Here's what makes DevContext different. The Permission Control Center. "
     "Users can revoke AI access to any connected service instantly, "
     "without disconnecting. Green means connected. Amber means revoked. "
     "The AI immediately respects the change."),
    ("06_audit",
     "Every token exchange and permission check is logged in the audit trail. "
     "Which services were accessed. What API endpoints were called. "
     "Whether access was granted or denied. "
     "If you revoke Slack, you can see the denied entries proving the AI respected it."),
    ("07_close",
     "DevContext. Secure AI developer briefings powered by Auth0 Token Vault. "
     "Scoped access. Auditable. Instantly revocable. Fully transparent. "
     "The secure path made easy. "
     "Built for the Auth0 Authorized to Act hackathon."),
]

# HTML mockup pages
MOCKUP_LANDING = """<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
.container { max-width: 1280px; margin: 0 auto; padding: 0 48px; }
nav { display: flex; justify-content: space-between; align-items: center; padding: 24px 48px; border-bottom: 1px solid rgba(255,255,255,0.1); }
nav .logo { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
nav .logo span { color: rgba(255,255,255,0.5); font-weight: 400; }
nav .btn { background: #fff; color: #000; padding: 8px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; text-decoration: none; }
.hero { text-align: center; padding: 120px 48px 80px; }
.hero h1 { font-size: 56px; font-weight: 700; letter-spacing: -2px; line-height: 1.1; margin-bottom: 20px; }
.hero h1 .gradient { background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero p { font-size: 18px; color: rgba(255,255,255,0.5); max-width: 500px; margin: 0 auto 40px; line-height: 1.6; }
.hero .cta { background: #fff; color: #000; padding: 14px 32px; border-radius: 14px; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-block; }
.features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 0 48px 80px; }
.feature { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; }
.feature .icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 20px; }
.feature .icon.blue { background: rgba(96,165,250,0.1); }
.feature .icon.purple { background: rgba(167,139,250,0.1); }
.feature .icon.green { background: rgba(52,211,153,0.1); }
.feature h3 { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
.feature p { font-size: 14px; color: rgba(255,255,255,0.4); line-height: 1.5; }
</style></head><body>
<nav>
  <div class="logo">DevContext <span>by Auth0 Token Vault</span></div>
  <a href="#" class="btn">Sign in with Auth0</a>
</nav>
<div class="hero">
  <h1>Your dev tools.<br/><span class="gradient">One AI briefing.</span></h1>
  <p>Pull requests, meetings, and messages. Secured by Auth0 Token Vault. Scoped tokens, full audit trail, instant revocation.</p>
  <a href="#" class="cta">Get Started</a>
</div>
<div class="features">
  <div class="feature">
    <div class="icon blue">&#x1f512;</div>
    <h3>Token Vault Security</h3>
    <p>No static API keys. Every token is scoped, time-limited, and exchanged via RFC 8693.</p>
  </div>
  <div class="feature">
    <div class="icon purple">&#x1f6e1;</div>
    <h3>Permission Control</h3>
    <p>Revoke AI access to any service instantly. Without disconnecting your account.</p>
  </div>
  <div class="feature">
    <div class="icon green">&#x1f4cb;</div>
    <h3>Full Audit Trail</h3>
    <p>Every token exchange logged. See exactly what the AI accessed and when.</p>
  </div>
</div>
</body></html>"""

MOCKUP_CHAT = """<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; height: 720px; overflow: hidden; }
.layout { display: flex; height: 100%; }
.sidebar { width: 220px; border-right: 1px solid rgba(255,255,255,0.1); padding: 20px 16px; display: flex; flex-direction: column; gap: 4px; }
.sidebar .logo { font-size: 18px; font-weight: 700; margin-bottom: 24px; padding: 0 8px; }
.sidebar a { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 14px; }
.sidebar a.active { background: rgba(255,255,255,0.08); color: #fff; }
.sidebar a .dot { width: 8px; height: 8px; border-radius: 50%; }
.main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.messages { flex: 1; overflow-y: auto; padding: 24px 24px; }
.messages .inner { max-width: 640px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
.msg { display: flex; }
.msg.user { justify-content: flex-end; }
.msg.ai { justify-content: flex-start; }
.msg .bubble { max-width: 80%; border-radius: 14px; padding: 14px 18px; font-size: 14px; line-height: 1.6; }
.msg.user .bubble { background: #fff; color: #000; font-weight: 500; }
.msg.ai .bubble { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
.tools { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.tool { display: inline-flex; align-items: center; gap: 6px; border-radius: 8px; border: 1px solid; padding: 4px 10px; font-size: 12px; font-weight: 500; }
.tool.github { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }
.tool.calendar { border-color: rgba(96,165,250,0.2); background: rgba(96,165,250,0.05); color: #60a5fa; }
.tool.slack { border-color: rgba(167,139,250,0.2); background: rgba(167,139,250,0.05); color: #a78bfa; }
.tool .check { color: #34d399; }
.input-bar { border-top: 1px solid rgba(255,255,255,0.1); padding: 16px 24px; }
.input-bar form { display: flex; gap: 8px; max-width: 640px; margin: 0 auto; }
.input-bar input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px 16px; color: #fff; font-size: 14px; outline: none; }
.input-bar button { width: 40px; height: 40px; border-radius: 12px; background: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.suggestions { display: flex; flex-wrap: wrap; gap: 8px; max-width: 640px; margin: 12px auto 0; }
.suggestions .chip { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 8px 14px; font-size: 12px; color: rgba(255,255,255,0.5); }
ul { margin: 8px 0; padding-left: 20px; }
li { margin: 4px 0; }
strong { font-weight: 600; }
.ai .bubble h3 { font-size: 14px; margin: 12px 0 4px; font-weight: 600; }
.ai .bubble h3:first-child { margin-top: 0; }
</style></head><body>
<div class="layout">
  <div class="sidebar">
    <div class="logo">DevContext</div>
    <a href="#" class="active"><span class="dot" style="background:#fff"></span> Chat</a>
    <a href="#"><span class="dot" style="background:#a78bfa"></span> Permissions</a>
    <a href="#"><span class="dot" style="background:#60a5fa"></span> Audit Log</a>
  </div>
  <div class="main">
    <div class="messages">
      <div class="inner">
        <div class="msg ai">
          <div class="bubble">Hi! I'm DevContext. Ask me anything about your work -- open PRs, today's meetings, unread Slack messages. Connect your services in <strong>Permissions</strong> to get started.</div>
        </div>
        <div class="msg user">
          <div class="bubble">Brief me for standup</div>
        </div>
        <div class="msg ai">
          <div>
            <div class="bubble">
              <h3>Pull Requests</h3>
              <ul>
                <li><strong>#247</strong> fix: token refresh race condition -- <em>ready for review</em></li>
                <li><strong>#245</strong> feat: add webhook retry logic -- <em>2 approvals, merge ready</em></li>
                <li><strong>#242</strong> chore: upgrade auth0 SDK to v4 -- <em>CI passing</em></li>
              </ul>
              <h3>Today's Schedule</h3>
              <ul>
                <li><strong>9:30 AM</strong> -- Sprint Planning (30 min)</li>
                <li><strong>2:00 PM</strong> -- Design Review: Token Vault UX (45 min)</li>
              </ul>
              <h3>Unread Messages</h3>
              <ul>
                <li><strong>#engineering</strong> -- Sarah mentioned you re: deployment pipeline fix</li>
                <li><strong>#product</strong> -- New feature request from enterprise customer</li>
              </ul>
            </div>
            <div class="tools">
              <span class="tool github"><span class="check">&#10003;</span> Fetching Pull Requests</span>
              <span class="tool github"><span class="check">&#10003;</span> Fetching Recent Commits</span>
              <span class="tool calendar"><span class="check">&#10003;</span> Loading Today's Schedule</span>
              <span class="tool slack"><span class="check">&#10003;</span> Checking Slack Messages</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="input-bar">
      <form>
        <input placeholder="Ask about your PRs, meetings, or Slack messages..." />
        <button type="button">&#x27A4;</button>
      </form>
    </div>
  </div>
</div>
</body></html>"""

MOCKUP_PERMISSIONS = """<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; height: 720px; overflow: hidden; }
.layout { display: flex; height: 100%; }
.sidebar { width: 220px; border-right: 1px solid rgba(255,255,255,0.1); padding: 20px 16px; display: flex; flex-direction: column; gap: 4px; }
.sidebar .logo { font-size: 18px; font-weight: 700; margin-bottom: 24px; padding: 0 8px; }
.sidebar a { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 14px; }
.sidebar a.active { background: rgba(255,255,255,0.08); color: #fff; }
.sidebar a .dot { width: 8px; height: 8px; border-radius: 50%; }
.main { flex: 1; padding: 40px 48px; overflow-y: auto; }
.main h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
.main .subtitle { color: rgba(255,255,255,0.4); font-size: 14px; margin-bottom: 32px; }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 900px; }
.card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 28px; }
.card .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.card .name { font-size: 18px; font-weight: 600; }
.badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.badge.connected { background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.2); }
.badge.revoked { background: rgba(251,191,36,0.1); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2); }
.card .desc { color: rgba(255,255,255,0.4); font-size: 13px; margin-bottom: 16px; line-height: 1.5; }
.scopes { margin-bottom: 20px; }
.scopes .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.3); margin-bottom: 8px; }
.scope { display: inline-block; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 3px 8px; font-size: 11px; color: rgba(255,255,255,0.5); margin: 2px 4px 2px 0; }
.scope.struck { text-decoration: line-through; opacity: 0.4; }
.btn { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid; font-size: 13px; font-weight: 600; cursor: pointer; text-align: center; }
.btn.revoke { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #ef4444; }
.btn.grant { background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.3); color: #34d399; }
</style></head><body>
<div class="layout">
  <div class="sidebar">
    <div class="logo">DevContext</div>
    <a href="#"><span class="dot" style="background:#fff"></span> Chat</a>
    <a href="#" class="active"><span class="dot" style="background:#a78bfa"></span> Permissions</a>
    <a href="#"><span class="dot" style="background:#60a5fa"></span> Audit Log</a>
  </div>
  <div class="main">
    <h1>Permission Control Center</h1>
    <p class="subtitle">Manage which services the AI assistant can access on your behalf</p>
    <div class="cards">
      <div class="card">
        <div class="header">
          <span class="name">GitHub</span>
          <span class="badge connected">Connected</span>
        </div>
        <p class="desc">Pull requests, commits, and notifications from your repositories</p>
        <div class="scopes">
          <div class="label">Scopes</div>
          <span class="scope">repo:read</span>
          <span class="scope">notifications</span>
          <span class="scope">pull_request</span>
        </div>
        <div class="btn revoke">Revoke Access</div>
      </div>
      <div class="card">
        <div class="header">
          <span class="name">Google Calendar</span>
          <span class="badge connected">Connected</span>
        </div>
        <p class="desc">Upcoming meetings, schedule conflicts, and event details</p>
        <div class="scopes">
          <div class="label">Scopes</div>
          <span class="scope">calendar.readonly</span>
          <span class="scope">events.readonly</span>
        </div>
        <div class="btn revoke">Revoke Access</div>
      </div>
      <div class="card">
        <div class="header">
          <span class="name">Slack</span>
          <span class="badge revoked">Revoked</span>
        </div>
        <p class="desc">Unread messages, channel summaries, and mentions</p>
        <div class="scopes">
          <div class="label">Scopes</div>
          <span class="scope struck">channels:read</span>
          <span class="scope struck">chat:read</span>
          <span class="scope struck">users:read</span>
        </div>
        <div class="btn grant">Re-enable Access</div>
      </div>
    </div>
  </div>
</div>
</body></html>"""

MOCKUP_AUDIT = """<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; height: 720px; overflow: hidden; }
.layout { display: flex; height: 100%; }
.sidebar { width: 220px; border-right: 1px solid rgba(255,255,255,0.1); padding: 20px 16px; display: flex; flex-direction: column; gap: 4px; }
.sidebar .logo { font-size: 18px; font-weight: 700; margin-bottom: 24px; padding: 0 8px; }
.sidebar a { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 14px; }
.sidebar a.active { background: rgba(255,255,255,0.08); color: #fff; }
.sidebar a .dot { width: 8px; height: 8px; border-radius: 50%; }
.main { flex: 1; padding: 40px 48px; overflow-y: auto; }
.main h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
.main .subtitle { color: rgba(255,255,255,0.4); font-size: 14px; margin-bottom: 32px; }
table { width: 100%; max-width: 900px; border-collapse: collapse; }
th { text-align: left; padding: 12px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.3); border-bottom: 1px solid rgba(255,255,255,0.1); }
td { padding: 14px 16px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.05); }
.provider-badge { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; }
.provider-badge.github { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }
.provider-badge.calendar { background: rgba(96,165,250,0.05); color: #60a5fa; }
.provider-badge.slack { background: rgba(167,139,250,0.05); color: #a78bfa; }
.status { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.status.success { background: rgba(52,211,153,0.1); color: #34d399; }
.status.denied { background: rgba(239,68,68,0.1); color: #ef4444; }
.time { color: rgba(255,255,255,0.3); }
</style></head><body>
<div class="layout">
  <div class="sidebar">
    <div class="logo">DevContext</div>
    <a href="#"><span class="dot" style="background:#fff"></span> Chat</a>
    <a href="#"><span class="dot" style="background:#a78bfa"></span> Permissions</a>
    <a href="#" class="active"><span class="dot" style="background:#60a5fa"></span> Audit Log</a>
  </div>
  <div class="main">
    <h1>Audit Log</h1>
    <p class="subtitle">Complete timeline of AI access to your connected services</p>
    <table>
      <thead>
        <tr><th>Time</th><th>Provider</th><th>Action</th><th>Endpoint</th><th>Status</th></tr>
      </thead>
      <tbody>
        <tr>
          <td class="time">9:32:15 AM</td>
          <td><span class="provider-badge slack">Slack</span></td>
          <td>Permission Check</td>
          <td>Access revoked by user</td>
          <td><span class="status denied">Denied</span></td>
        </tr>
        <tr>
          <td class="time">9:32:14 AM</td>
          <td><span class="provider-badge calendar">Calendar</span></td>
          <td>Token Exchange</td>
          <td>googleapis.com/calendar/v3/events</td>
          <td><span class="status success">Success</span></td>
        </tr>
        <tr>
          <td class="time">9:32:12 AM</td>
          <td><span class="provider-badge github">GitHub</span></td>
          <td>Token Exchange</td>
          <td>api.github.com/notifications</td>
          <td><span class="status success">Success</span></td>
        </tr>
        <tr>
          <td class="time">9:32:11 AM</td>
          <td><span class="provider-badge github">GitHub</span></td>
          <td>Token Exchange</td>
          <td>api.github.com/issues</td>
          <td><span class="status success">Success</span></td>
        </tr>
        <tr>
          <td class="time">9:31:45 AM</td>
          <td><span class="provider-badge slack">Slack</span></td>
          <td>Permission Change</td>
          <td>Access revoked</td>
          <td><span class="status denied">Denied</span></td>
        </tr>
        <tr>
          <td class="time">9:30:02 AM</td>
          <td><span class="provider-badge slack">Slack</span></td>
          <td>Token Exchange</td>
          <td>slack.com/api/conversations.list</td>
          <td><span class="status success">Success</span></td>
        </tr>
        <tr>
          <td class="time">9:30:01 AM</td>
          <td><span class="provider-badge calendar">Calendar</span></td>
          <td>Token Exchange</td>
          <td>googleapis.com/calendar/v3/events</td>
          <td><span class="status success">Success</span></td>
        </tr>
        <tr>
          <td class="time">9:30:00 AM</td>
          <td><span class="provider-badge github">GitHub</span></td>
          <td>Token Exchange</td>
          <td>api.github.com/issues</td>
          <td><span class="status success">Success</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</body></html>"""

MOCKUP_ARCH = """<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; height: 720px; display: flex; align-items: center; justify-content: center; }
.container { max-width: 900px; text-align: center; }
h1 { font-size: 36px; font-weight: 700; margin-bottom: 48px; letter-spacing: -1px; }
.flow { display: flex; flex-direction: column; gap: 20px; align-items: center; }
.row { display: flex; align-items: center; gap: 16px; }
.box { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 16px 24px; font-size: 14px; font-weight: 500; min-width: 160px; }
.box.highlight { border-color: rgba(96,165,250,0.4); background: rgba(96,165,250,0.08); color: #60a5fa; }
.box.green { border-color: rgba(52,211,153,0.4); background: rgba(52,211,153,0.08); color: #34d399; }
.box.purple { border-color: rgba(167,139,250,0.4); background: rgba(167,139,250,0.08); color: #a78bfa; }
.box.amber { border-color: rgba(251,191,36,0.4); background: rgba(251,191,36,0.08); color: #fbbf24; }
.arrow { color: rgba(255,255,255,0.3); font-size: 24px; }
.arrow-down { color: rgba(255,255,255,0.3); font-size: 24px; }
.services { display: flex; gap: 12px; }
.label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.3); margin-bottom: 8px; }
</style></head><body>
<div class="container">
  <h1>Architecture</h1>
  <div class="flow">
    <div class="row">
      <div class="box">User</div>
      <span class="arrow">&rarr;</span>
      <div class="box highlight">Auth0 Login</div>
      <span class="arrow">&rarr;</span>
      <div class="box green">Token Vault</div>
    </div>
    <span class="arrow-down">&darr;</span>
    <div class="row">
      <div class="box">Next.js App</div>
      <span class="arrow">&rarr;</span>
      <div class="box highlight">AI SDK + Claude</div>
      <span class="arrow">&rarr;</span>
      <div class="box amber">Permission Check</div>
    </div>
    <span class="arrow-down">&darr;</span>
    <div class="row">
      <div class="box green">Token Exchange</div>
      <span class="arrow">&rarr;</span>
      <div class="services">
        <div class="box">GitHub API</div>
        <div class="box highlight">Google Calendar</div>
        <div class="box purple">Slack API</div>
      </div>
    </div>
    <span class="arrow-down">&darr;</span>
    <div class="row">
      <div class="box purple">Streaming Response</div>
      <span class="arrow">&rarr;</span>
      <div class="box">Chat UI</div>
      <span class="arrow">+</span>
      <div class="box amber">Audit Log</div>
    </div>
  </div>
</div>
</body></html>"""

# Map narration segments to mockup pages
SEGMENT_MOCKUPS = {
    "00_intro": ("landing", MOCKUP_LANDING),
    "01_problem": ("landing", MOCKUP_LANDING),
    "02_solution": ("arch", MOCKUP_ARCH),
    "03_login": ("landing", MOCKUP_LANDING),
    "04_chat": ("chat", MOCKUP_CHAT),
    "05_permissions": ("permissions", MOCKUP_PERMISSIONS),
    "06_audit": ("audit", MOCKUP_AUDIT),
    "07_close": ("landing", MOCKUP_LANDING),
}


async def gen_audio():
    import edge_tts
    voice = "en-US-JennyNeural"
    for name, text in NARRATION:
        path = ADIR / f"{name}.mp3"
        if path.exists():
            print(f"  skip {name}")
            continue
        await edge_tts.Communicate(text, voice).save(str(path))
        print(f"  ok   {name}")


def duration(path):
    r = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(path)],
        capture_output=True, text=True)
    return float(r.stdout.strip())


async def screenshot_mockups():
    from playwright.async_api import async_playwright

    # Write HTML files
    written = {}
    for seg_name, (mockup_name, html) in SEGMENT_MOCKUPS.items():
        if mockup_name not in written:
            path = MDIR / f"{mockup_name}.html"
            path.write_text(html)
            written[mockup_name] = path

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 720})
        page = await ctx.new_page()

        for seg_name, (mockup_name, _) in SEGMENT_MOCKUPS.items():
            html_path = written[mockup_name]
            img_path = VDIR / f"{seg_name}.png"
            if img_path.exists():
                print(f"  skip {seg_name}")
                continue
            await page.goto(f"file://{html_path}", wait_until="domcontentloaded")
            await asyncio.sleep(0.5)
            await page.screenshot(path=str(img_path))
            print(f"  ok   {seg_name}")

        await ctx.close()
        await browser.close()


def combine():
    """Combine screenshots + audio into video using ffmpeg."""
    segments = sorted(ADIR.glob("*.mp3"))
    if not segments:
        print("ERROR: No audio segments found")
        return

    # Build ffmpeg complex filter
    inputs = []
    filter_parts = []
    concat_parts = []

    for i, audio_path in enumerate(segments):
        seg_name = audio_path.stem
        img_path = VDIR / f"{seg_name}.png"
        if not img_path.exists():
            print(f"  WARN: missing frame {img_path}")
            continue

        dur = duration(audio_path)
        # Add 0.5s padding after each segment
        total_dur = dur + 0.5

        inputs.extend(["-loop", "1", "-t", f"{total_dur:.2f}", "-i", str(img_path)])
        inputs.extend(["-i", str(audio_path)])

        vid_idx = i * 2
        aud_idx = i * 2 + 1

        # Scale and pad to ensure exact 1280x720, add fade in/out
        filter_parts.append(
            f"[{vid_idx}:v]scale=1280:720,setsar=1,format=yuv420p,"
            f"fade=in:st=0:d=0.3,fade=out:st={total_dur-0.3:.2f}:d=0.3[v{i}]"
        )
        # Add silence padding after audio
        filter_parts.append(
            f"[{aud_idx}:a]apad=pad_dur=0.5[a{i}]"
        )
        concat_parts.append(f"[v{i}][a{i}]")

    n = len(concat_parts)
    filter_str = ";".join(filter_parts)
    filter_str += f";{''.join(concat_parts)}concat=n={n}:v=1:a=1[outv][outa]"

    cmd = [
        "ffmpeg", "-y",
        *inputs,
        "-filter_complex", filter_str,
        "-map", "[outv]", "-map", "[outa]",
        "-c:v", "libx264", "-crf", "20", "-preset", "fast",
        "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart",
        str(OUT)
    ]

    print(f"  running ffmpeg with {n} segments...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  FFMPEG ERROR: {result.stderr[-500:]}")
        return None

    mb = OUT.stat().st_size / 1024 / 1024
    dur_total = duration(OUT)
    print(f"\n  {OUT}  ({mb:.1f} MB, {dur_total:.0f}s)")
    return OUT


async def main():
    print("=== DevContext Demo Recorder ===\n")

    print("[1/3] Generating narration audio...")
    await gen_audio()

    print("\n[2/3] Screenshotting mockup pages...")
    await screenshot_mockups()

    print("\n[3/3] Combining into video...")
    result = combine()

    if result:
        print(f"\nDone! Video at: {result}")
        # Copy to project
        import shutil
        dest = PROJECT / "demo" / "devcontext-demo.mp4"
        shutil.copy2(result, dest)
        print(f"Copied to: {dest}")


asyncio.run(main())
