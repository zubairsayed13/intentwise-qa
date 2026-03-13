import React, { useState, useEffect, useCallback, useRef } from "react";

import {
  Activity, AlertTriangle, Bell, CheckCircle, ChevronDown, ChevronRight,
  Clock, Database, Filter, RefreshCw, Search, Settings, Shield, Slack,
  TrendingUp, TrendingDown, Zap, XCircle, Eye, BarChart3, Circle,
  Mail, Cpu, GitBranch, Layers, ArrowUpRight, ArrowDownRight, Minus,
  Play, Pause, MessageSquare, Sparkles, Bot, Wrench, X, Check,
  MoreVertical, ExternalLink, Info, ChevronUp, AlertCircle,
  Plus, Trash2, ToggleLeft, ToggleRight, Copy, Send, Lock, Users,
  Hash, Type, Calendar, BarChart2, List, FlaskConical, Wand2,
  CheckSquare, Tag, GitMerge, Radio, AtSign, Webhook,
  MoveVertical, GripVertical, ArrowDown, Repeat, Split,
  Flag, StopCircle, Timer, FileCode, AlarmClock,
  ChevronLeft, Save, Rocket, BookOpen, Edit2, Edit3,
  Sun, Moon, LayoutDashboard, History, TestTube2, BrainCircuit, Link2,
  TableProperties, BarChart, Workflow, GitPullRequest, ArrowRight, Maximize2, AlertOctagon
} from "lucide-react";

// ─── Palette & Theme ───────────────────────────────────────────────────────────
const DARK_THEME = {
  bg:      "#0A0C10", surface:"#0F1117", card:"#13161E",
  border:  "#1E2330", border2:"#252A3A",
  text:    "#E2E8F0", muted:"#64748B",   dim:"#334155",
  accent:  "#6366F1", accentL:"#818CF8",
  green:   "#10B981", yellow:"#F59E0B",  red:"#EF4444",
  orange:  "#F97316", cyan:"#06B6D4",    purple:"#8B5CF6",
  isDark: true,
};
const LIGHT_THEME = {
  bg:      "#F8FAFC", surface:"#FFFFFF", card:"#FFFFFF",
  border:  "#E2E8F0", border2:"#CBD5E1",
  text:    "#0F172A", muted:"#64748B",   dim:"#94A3B8",
  accent:  "#4F46E5", accentL:"#6366F1",
  green:   "#059669", yellow:"#D97706",  red:"#DC2626",
  orange:  "#EA580C", cyan:"#0891B2",    purple:"#7C3AED",
  isDark: false,
};
// C is set at runtime via ThemeContext — this default is used by non-hook components
let C = DARK_THEME;

// ─── Demo Data ─────────────────────────────────────────────────────────────────

const DATASOURCES = [
  {
    id:"rs-staging",
    name:"redshift-staging",
    type:"Redshift",
    status:"healthy",
    latency: null,
    tables: 6,
    host:"intentwise-backend-production.up.railway.app",
    port:"443",
    database:"intentwise",
    schema:"mws",
    user:"readonly",
    sslMode:"require",
    syncSchedule:"*/15 * * * *",
    description:"Redshift staging — mws schema. Tables: orders, inventory, inventory_restock, sales_and_traffic_by_asin, sales_and_traffic_by_date, sales_and_traffic_by_sku.",
    apiBase:"https://intentwise-backend-production.up.railway.app"
  },
];


const SEVERITY = { critical: C.red, high: C.orange, medium: C.yellow, low: C.cyan, info: C.muted };

const ALERTS_RAW = [
  { id:"A001", ts:"09:14 AM", severity:"critical", source:"redshift-staging",  table:"tbl_amzn_campaign_report",  rule:"RPT-002", title:"Download succeeded but replication failed", status:"open",    aiSuggestion:"Redshift copy job stalled. Re-trigger GDS copy pipeline for campaign_summary. ETA ~8 min.", canAutoFix:true },
  { id:"A002", ts:"09:08 AM", severity:"critical", source:"redshift-staging",  table:"report",                    rule:"RPT-001", title:"23 missing downloads detected for today",   status:"triaged", aiSuggestion:"Start new Step Function execution with original payload. 23 profiles missing for report_date=today.", canAutoFix:true },
  { id:"A003", ts:"08:55 AM", severity:"high",     source:"redshift-staging",  table:"tbl_amzn_keyword_report",   rule:"RPT-004", title:"Duplicate rows: 1,842 dupes in keyword report",status:"open",   aiSuggestion:"Run DISTINCT dedup query and refresh keyword summary table. Pattern seen 3x this week — recommend adding unique constraint.", canAutoFix:false },
  { id:"A004", ts:"08:44 AM", severity:"high",     source:"redshift-staging",  table:"account_performance",       rule:"AUT-007", title:"Row count dropped 34% vs 7-day avg",          status:"open",   aiSuggestion:"Anomaly detected. Compare against upstream Step Function execution — possible partial download. Check CloudWatch logs.", canAutoFix:false },
  { id:"A005", ts:"08:31 AM", severity:"medium",   source:"redshift-staging",  table:"advertised_product_summary",rule:"RPT-005", title:"3 downloads failed with no retry attempted",  status:"open",   aiSuggestion:"Redrive from failed Step Function state. All 3 are requester-step failures — safe to auto-redrive.", canAutoFix:true },
  { id:"A006", ts:"07:59 AM", severity:"medium",   source:"redshift-staging",  table:"report",                   rule:"RPT-003", title:"12 reports stuck in pending >4.5 hours",      status:"open",   aiSuggestion:"Force-transition stuck rows to failed state, then re-queue for processing. Common pattern on Monday mornings.", canAutoFix:true },
  { id:"A007", ts:"07:22 AM", severity:"low",      source:"redshift-staging",   table:"budget_tracker",            rule:"AUT-011", title:"Stale data: sheet not updated in 26 hours",   status:"open",   aiSuggestion:"Send Slack nudge to @finance-team. Sheet typically updates at 6 AM — may be blocked on upstream data.", canAutoFix:false },
  { id:"A008", ts:"06:48 AM", severity:"info",     source:"redshift-staging",  table:"keyword_summary",           rule:"AUT-003", title:"Schema drift: 2 new columns detected",        status:"resolved",aiSuggestion:"New columns: 'bid_adjustment_pct', 'impression_share'. Auto-added to validation schema. No action needed.", canAutoFix:false },
];

const AGENT_LOGS = {
  ag1: [
    { ts:"09:15:04 AM", level:"info",  msg:"Started scheduled run #3" },
    { ts:"09:15:06 AM", level:"info",  msg:"Checking 23 profiles in prod-postgres.report" },
    { ts:"09:15:08 AM", level:"warn",  msg:"5 profiles missing downloads (profile_ids: 48102, 48291…)" },
    { ts:"09:15:10 AM", level:"info",  msg:"Triggering Step Function for 3 auto-fixable profiles" },
    { ts:"09:15:12 AM", level:"ok",    msg:"3 executions started. 2 require manual review → Alert A002 raised" },
    { ts:"09:00:01 AM", level:"info",  msg:"Run #2 complete — 0 missing downloads detected" },
    { ts:"08:00:00 AM", level:"info",  msg:"Run #1 complete — 0 missing downloads detected" },
  ],
  ag2: [
    { ts:"09:10:02 AM", level:"info",  msg:"Scanning report table for stuck/pending rows" },
    { ts:"09:10:05 AM", level:"warn",  msg:"12 rows stuck in 'pending' for >6h" },
    { ts:"09:10:07 AM", level:"info",  msg:"Checking Step Function execution status for each…" },
    { ts:"09:10:09 AM", level:"ok",    msg:"8 rows redriven successfully via Step Function redrive" },
    { ts:"09:10:11 AM", level:"warn",  msg:"4 rows need manual review — execution history unavailable" },
    { ts:"09:10:12 AM", level:"ok",    msg:"Alert A006 raised for manual review cases" },
  ],
  ag3: [
    { ts:"06:48:01 AM", level:"info",  msg:"Schema scan started on snowflake-dw.keyword_summary" },
    { ts:"06:48:14 AM", level:"warn",  msg:"2 new columns detected: bid_adjustment_pct, impression_share" },
    { ts:"06:48:15 AM", level:"ok",    msg:"Auto-generated 2 new validation rules (NOT NULL + range check)" },
    { ts:"06:48:16 AM", level:"info",  msg:"Scan complete. Next run: 12:00 PM" },
  ],
  ag4: [
    { ts:"08:44:00 AM", level:"info",  msg:"Row count check on account_performance" },
    { ts:"08:44:03 AM", level:"warn",  msg:"Count: 14,203 — 34% below 7-day avg (21,580)" },
    { ts:"08:44:04 AM", level:"ok",    msg:"Alert A004 raised (high severity)" },
    { ts:"08:00:00 AM", level:"info",  msg:"Row count normal: 21,840 rows" },
    { ts:"07:00:00 AM", level:"info",  msg:"Row count normal: 22,012 rows" },
  ],
  ag5: [
    { ts:"08:55:00 AM", level:"info",  msg:"Duplicate scan on tbl_amzn_keyword_report" },
    { ts:"08:55:04 AM", level:"warn",  msg:"1,842 duplicate rows found on (report_date, profile_id, keyword_id)" },
    { ts:"08:55:05 AM", level:"ok",    msg:"Alert A005 raised. Agent paused pending manual dedup." },
  ],
  ag6: [
    { ts:"09:14:00 AM", level:"info",  msg:"Replication check: 6 GDS copy jobs" },
    { ts:"09:14:02 AM", level:"warn",  msg:"analytics-rs latency: 340ms (threshold: 200ms)" },
    { ts:"09:14:03 AM", level:"ok",    msg:"All 6 copy jobs completed — data replicated" },
    { ts:"09:14:04 AM", level:"info",  msg:"Replication lag noted. Alert A001 cross-referenced." },
  ],
};

const AGENT_CONFIG_DEFAULTS = {
  ag1: { schedule:"0 * * * *",   targets:["prod-postgres.report"], threshold:"0 missing", alertOn:"any_missing", autoFix:true  },
  ag2: { schedule:"*/30 * * * *", targets:["prod-postgres.report"], threshold:"0 stuck >6h", alertOn:"stuck_rows", autoFix:true  },
  ag3: { schedule:"0 6 * * *",    targets:["snowflake-dw.*"],        threshold:"any new column", alertOn:"schema_change", autoFix:true  },
  ag4: { schedule:"0 * * * *",    targets:["snowflake-dw.account_performance"], threshold:"<80% of 7d avg", alertOn:"row_anomaly", autoFix:false },
  ag5: { schedule:"0 9 * * *",    targets:["analytics-rs.tbl_amzn_keyword_report"], threshold:">0 dupes", alertOn:"duplicates", autoFix:false },
  ag6: { schedule:"*/15 * * * *", targets:["analytics-rs (all tables)"], threshold:"latency >200ms", alertOn:"replication_lag", autoFix:false },
};

const AGENTS = [
  { id:"ag1", name:"Ads Download Monitor",   icon:"📥", status:"running", lastRun:"09:15 AM", nextRun:"10:00 AM", runsToday:3,  issuesFound:5, fixed:3, successRate:87, avgDuration:"4.1s" },
  { id:"ag2", name:"Report Status Watcher",  icon:"📊", status:"running", lastRun:"09:10 AM", nextRun:"09:40 AM", runsToday:8,  issuesFound:2, fixed:2, successRate:94, avgDuration:"2.8s" },
  { id:"ag3", name:"Schema Drift Detector",  icon:"🔍", status:"idle",    lastRun:"06:48 AM", nextRun:"12:00 PM", runsToday:1,  issuesFound:1, fixed:0, successRate:100, avgDuration:"5.6s" },
  { id:"ag4", name:"Row Count Anomaly",      icon:"📉", status:"running", lastRun:"08:44 AM", nextRun:"09:44 AM", runsToday:5,  issuesFound:1, fixed:0, successRate:80, avgDuration:"2.1s" },
  { id:"ag5", name:"Duplicate Row Scanner",  icon:"🔎", status:"paused",  lastRun:"08:55 AM", nextRun:"—",        runsToday:2,  issuesFound:1, fixed:0, successRate:50, avgDuration:"3.4s" },
  { id:"ag6", name:"Replication Checker",    icon:"🔄", status:"running", lastRun:"09:14 AM", nextRun:"09:29 AM", runsToday:12, issuesFound:1, fixed:1, successRate:92, avgDuration:"1.8s" },
];

const SPARKLINE = [42,38,55,61,48,70,65,82,74,88,91,76,68,84,79,93,87,72,96,88];

// ─── Eval Framework Data ──────────────────────────────────────────────────────
const EVAL_CASES = {
  ag1: [
    {
      id:"ev-ag1-001", category:"agent_output", label:"Missing download detection",
      input:"23 profiles checked. report table queried for report_date = today.",
      expected:"Correctly identify all profiles with status != 'processed' and report missing downloads",
      actual:"5 profiles missing downloads identified (profile_ids: 48102, 48291, 48293, 48304, 48512). Step Functions triggered for 3.",
      verdict:null, score:null, judgeRationale:null, ts:"09:15 AM"
    },
    {
      id:"ev-ag1-002", category:"rule_quality", label:"Alert severity classification",
      input:"5 missing downloads found for report_date = today.",
      expected:"Raise alert with severity=critical when >3 profiles missing",
      actual:"Alert A002 raised with severity=high (not critical). 5 profiles affected.",
      verdict:null, score:null, judgeRationale:null, ts:"09:15 AM"
    },
    {
      id:"ev-ag1-003", category:"claude_response", label:"AI auto-fix suggestion quality",
      input:"Prompt: '5 profiles missing downloads. Suggest fix.' → Claude response: 'Trigger Step Function executions for missing profiles. Check IAM role permissions.'",
      expected:"Response should name specific Step Function ARN, specify which profiles, and give retry strategy",
      actual:"Claude response was generic — did not name specific profiles or Step Function ARN. Mentioned IAM permissions correctly.",
      verdict:null, score:null, judgeRationale:null, ts:"09:15 AM"
    },
  ],
  ag2: [
    {
      id:"ev-ag2-001", category:"agent_output", label:"Stuck row identification",
      input:"report table scanned. Rows with status=pending and download_date < NOW()-6h.",
      expected:"Find all rows stuck >6h and attempt Step Function redrive",
      actual:"12 stuck rows found. 8 redriven via Step Function. 4 flagged for manual review (execution history missing).",
      verdict:null, score:null, judgeRationale:null, ts:"09:10 AM"
    },
    {
      id:"ev-ag2-002", category:"claude_response", label:"Triage recommendation quality",
      input:"Prompt: '4 rows could not be redriven — execution history unavailable. What should ops do?'",
      expected:"Recommend checking CloudWatch logs, suggest manual status update, provide SQL snippet",
      actual:"Claude recommended checking CloudWatch logs and provided a SQL UPDATE snippet. Did not mention Step Function console.",
      verdict:null, score:null, judgeRationale:null, ts:"09:10 AM"
    },
  ],
  ag3: [
    {
      id:"ev-ag3-001", category:"rule_quality", label:"Schema drift rule auto-generation",
      input:"2 new columns detected: bid_adjustment_pct (FLOAT), impression_share (FLOAT) on keyword_summary.",
      expected:"Generate NOT NULL rule + range check (0.0–1.0) for both new columns automatically",
      actual:"Generated NOT NULL rule for both columns. Range check only generated for impression_share, not bid_adjustment_pct.",
      verdict:null, score:null, judgeRationale:null, ts:"06:48 AM"
    },
  ],
  ag4: [
    {
      id:"ev-ag4-001", category:"agent_output", label:"Row count anomaly threshold",
      input:"Today: 14,203 rows. 7-day avg: 21,580. Threshold: <80% of avg.",
      expected:"Flag as anomaly since 14,203 / 21,580 = 65.8% (below 80% threshold)",
      actual:"Anomaly correctly flagged at 65.8% of average. Alert A004 raised as high severity.",
      verdict:null, score:null, judgeRationale:null, ts:"08:44 AM"
    },
  ],
  ag5: [
    {
      id:"ev-ag5-001", category:"rule_quality", label:"Duplicate detection precision",
      input:"tbl_amzn_keyword_report scanned for duplicates on composite key (report_date, profile_id, keyword_id).",
      expected:"Return exact duplicate groups with row counts, not just a total count",
      actual:"1,842 duplicate rows found. Returned total count only — did not return per-group breakdown in alert.",
      verdict:null, score:null, judgeRationale:null, ts:"08:55 AM"
    },
  ],
  ag6: [
    {
      id:"ev-ag6-001", category:"agent_output", label:"Replication lag detection",
      input:"analytics-rs latency: 340ms. Threshold: 200ms. All 6 GDS copy jobs completed.",
      expected:"Flag latency breach AND verify data freshness in downstream tables",
      actual:"Latency breach correctly flagged. Copy job completion verified. Downstream freshness check was skipped.",
      verdict:null, score:null, judgeRationale:null, ts:"09:14 AM"
    },
  ],
};

const CATEGORY_META = {
  agent_output:   { label:"Agent Output",    color:"#6366F1", icon:"🤖", desc:"Did the agent correctly detect and act on the issue?" },
  rule_quality:   { label:"Rule Quality",    color:"#8B5CF6", icon:"✓",  desc:"Are validation rules catching real failures accurately?" },
  claude_response:{ label:"Claude Response", color:"#06B6D4", icon:"✨", desc:"Are Claude API suggestions specific, actionable, and correct?" },
};


// ─── QA Process Health Data ────────────────────────────────────────────────────
const QA_STAGES = [
  {
    id:"detect", label:"Detect", icon:"🔍",
    desc:"Identify data quality failures across all pipelines",
    autonomyPct: 92,
    aiActions: 847, humanActions: 74,
    trend: +8,
    color: "#6366F1",
    status: "high",
    details: "Agents continuously monitor 6 data sources, 84 tables, 212 rules. Alert latency < 5 min."
  },
  {
    id:"triage", label:"Triage", icon:"⚖️",
    desc:"Classify severity, correlate root cause, route to right handler",
    autonomyPct: 74,
    aiActions: 612, humanActions: 218,
    trend: +14,
    color: "#8B5CF6",
    status: "medium",
    details: "AI classifies 74% of alerts autonomously. 26% escalated for human judgment (novel patterns, ambiguous severity)."
  },
  {
    id:"fix", label:"Fix",    icon:"🔧",
    desc:"Execute remediation — retry jobs, redrive pipelines, patch data",
    autonomyPct: 58,
    aiActions: 423, humanActions: 312,
    trend: +22,
    color: "#06B6D4",
    status: "medium",
    details: "Step Function redrive, Mage pipeline retrigger fully automated. Manual SQL patches and schema changes still require approval."
  },
  {
    id:"verify", label:"Verify", icon:"✅",
    desc:"Confirm fix resolved the issue and downstream is healthy",
    autonomyPct: 81,
    aiActions: 701, humanActions: 164,
    trend: +5,
    color: "#10B981",
    status: "high",
    details: "Post-fix validation runs automatically against the original failing rule + downstream dependencies."
  },
];

const RULE_COVERAGE = [
  { source:"redshift-staging",   tables:84,  covered:78, critical:12, failing:2  },
  { source:"redshift-staging",    tables:212, covered:156,critical:31, failing:8  },
  { source:"redshift-staging",    tables:56,  covered:56, critical:8,  failing:0  },
  { source:"redshift-staging",    tables:130, covered:94, critical:18, failing:1  },
  { source:"redshift-staging", tables:28,  covered:10, critical:4,  failing:4  },
  { source:"redshift-staging",     tables:14,  covered:14, critical:0,  failing:0  },
];

const ROADMAP_MILESTONES = [
  { id:"m1", phase:"Phase 1", label:"Automated Detection",         target:"Q1 2025", status:"done",     pct:100, desc:"All pipelines monitored. Alert latency < 5 min. Zero manual polling." },
  { id:"m2", phase:"Phase 2", label:"AI-Assisted Triage",          target:"Q2 2025", status:"done",     pct:100, desc:"Claude-powered root cause analysis. Correlated alert groups. Severity auto-classification." },
  { id:"m3", phase:"Phase 3", label:"Semi-Autonomous Remediation", target:"Q3 2025", status:"active",   pct:62,  desc:"Step Function redrive, Mage retrigger automated. Approval gates for high-risk fixes." },
  { id:"m4", phase:"Phase 4", label:"Self-Evolving Rule Corpus",   target:"Q4 2025", status:"active",   pct:35,  desc:"Schema drift auto-generates rules. Eval framework scores rule quality. Rules retire when stale." },
  { id:"m5", phase:"Phase 5", label:"Fully Agentic QE Loop",       target:"Q1 2026", status:"planned",  pct:0,   desc:"End-to-end detect→triage→fix→verify without human touch for known failure patterns." },
  { id:"m6", phase:"Phase 6", label:"Predictive Quality Control",  target:"Q3 2026", status:"planned",  pct:0,   desc:"Anomaly prediction before failures occur. Proactive pipeline gating based on upstream signals." },
];


// ─── Notification Center Data ──────────────────────────────────────────────────
const NOTIF_CHANNELS = [
  { id:"slack-ops",   type:"slack",  name:"#ops-alerts",        webhook:"https://hooks.slack.com/...", enabled:true,  severities:["critical","high"],    events:["detect","fix_failed"] },
  { id:"slack-qa",    type:"slack",  name:"#qa-monitoring",     webhook:"https://hooks.slack.com/...", enabled:true,  severities:["critical","high","medium"], events:["detect","verify","eval"] },
  { id:"email-eng",   type:"email",  name:"eng-oncall@intentwise.com", enabled:true,  severities:["critical"], events:["detect","escalate"] },
  { id:"email-mgr",   type:"email",  name:"team-leads@intentwise.com", enabled:false, severities:["critical"], events:["escalate"] },
];

const NOTIF_TEMPLATES = {
  detect: {
    subject:"[{{severity}}] Quality Issue Detected — {{source}}.{{table}}",
    body:`🔴 *Quality Issue Detected*
• Rule: {{rule}}
• Table: {{source}}.{{table}}
• Severity: {{severity}}
• Time: {{ts}} IST
• AI Suggestion: {{ai_suggestion}}
<{{drill_url}}|View in Agentic QA Platform>`
  },
  fix_failed: {
    subject:"[ACTION REQUIRED] Auto-Fix Failed — {{source}}.{{table}}",
    body:`⚠️ *Auto-Remediation Failed*
• Issue: {{title}}
• Attempted fix: {{fix_action}}
• Reason: {{failure_reason}}
• Manual action required
<{{drill_url}}|Open Triage Panel>`
  },
  verify: {
    subject:"[RESOLVED] Quality Issue Verified Fixed — {{rule}}",
    body:`✅ *Issue Resolved*
• Rule: {{rule}}
• Table: {{source}}.{{table}}
• Fixed by: AI auto-remediation
• Verified at: {{ts}} IST`
  },
  escalate: {
    subject:"[ESCALATION] Unresolved Quality Issue — {{source}}",
    body:`🚨 *Escalation Required*
• Issue unresolved for {{duration}}
• {{open_count}} related alerts open
• Assigned to: {{assignee}}
• Dashboard: <{{drill_url}}|View>`
  },
};

const NOTIF_HISTORY = [
  { id:"nh1", ts:"09:15 AM", channel:"#ops-alerts",  event:"detect",   title:"Missing downloads — 5 profiles", status:"delivered" },
  { id:"nh2", ts:"09:10 AM", channel:"#qa-monitoring",event:"detect",   title:"Stuck pending rows — 12 rows",   status:"delivered" },
  { id:"nh3", ts:"08:55 AM", channel:"#ops-alerts",  event:"detect",   title:"Duplicate rows — keyword report",  status:"delivered" },
  { id:"nh4", ts:"08:44 AM", channel:"eng-oncall@intentwise.com", event:"escalate", title:"Row count anomaly — 48h unresolved", status:"delivered" },
  { id:"nh5", ts:"06:48 AM", channel:"#qa-monitoring",event:"verify",   title:"Schema drift resolved — keyword_summary", status:"delivered" },
];

// ─── Run History Data ─────────────────────────────────────────────────────────
const RUN_HISTORY = [
  { id:"RH-001", type:"rule",     name:"Campaign report row count > 1000", source:"redshift-staging",  table:"tbl_amzn_campaign_report",   ts:"09:10 AM", duration:"1.2s",  result:"pass",   detail:"2,847 rows found. Threshold: 1000. ✓" },
  { id:"RH-002", type:"rule",     name:"Report table freshness < 6h",      source:"redshift-staging", table:"report",                     ts:"09:00 AM", duration:"0.8s",  result:"fail",   detail:"Last update: 8h 22m ago. Threshold: 6h. ✗ Triggered alert A-003." },
  { id:"RH-003", type:"agent",    name:"Ads Download Monitor",              source:"—",             table:"—",                          ts:"09:15 AM", duration:"4.1s",  result:"pass",   detail:"23 profiles checked. 0 missing. All Step Functions healthy." },
  { id:"RH-004", type:"gate",     name:"Data Available Confirmation",       source:"—",             table:"—",                          ts:"09:08 AM", duration:"—",     result:"pending",detail:"Waiting for approval from @Abhishek. Escalates in 18 min." },
  { id:"RH-005", type:"rule",     name:"Keyword report unique rows",        source:"redshift-staging",  table:"tbl_amzn_keyword_report",    ts:"08:55 AM", duration:"3.4s",  result:"fail",   detail:"1,842 duplicate rows found on (report_date, profile_id, keyword_id). Triggered alert A-003." },
  { id:"RH-006", type:"workflow", name:"Report Status Auto-Triage",         source:"—",             table:"—",                          ts:"08:40 AM", duration:"12.3s", result:"pass",   detail:"8 reports triaged. 5 redriven. 3 new executions started." },
  { id:"RH-007", type:"rule",     name:"Account perf row count anomaly",    source:"redshift-staging",  table:"account_performance",        ts:"08:44 AM", duration:"2.1s",  result:"fail",   detail:"Row count: 14,203 (vs 7-day avg 21,580). Drop: 34.2%. Triggered alert A-004." },
  { id:"RH-008", type:"agent",    name:"Replication Checker",               source:"redshift-staging",  table:"—",                          ts:"09:14 AM", duration:"1.8s",  result:"pass",   detail:"All 6 GDS copy jobs verified. Redshift latency: 340ms (degraded)." },
  { id:"RH-009", type:"gate",     name:"Mage Pause Approval",               source:"—",             table:"—",                          ts:"Yesterday 4:22 PM", duration:"8m 14s", result:"pass", detail:"Approved by @Zubair at 4:30 PM. Bluewheel + Maryruth paused successfully." },
  { id:"RH-010", type:"workflow", name:"Ads Download Failure SOP",          source:"—",             table:"—",                          ts:"Yesterday 4:20 PM", duration:"2h 14m", result:"pass", detail:"Full SOP completed. 5 gates passed. All refreshes done. Completion notice sent." },
  { id:"RH-011", type:"rule",     name:"Profile ID valid format",           source:"redshift-staging", table:"report",                     ts:"06:00 AM", duration:"1.1s",  result:"pass",   detail:"All 48,291 profile_id values match expected format. ✓" },
  { id:"RH-012", type:"agent",    name:"Schema Drift Detector",             source:"redshift-staging",  table:"keyword_summary",            ts:"06:48 AM", duration:"5.6s",  result:"pass",   detail:"2 new columns detected: bid_adjustment_pct, impression_share. Rules auto-generated." },
];

// ─── Rule Test Data ────────────────────────────────────────────────────────────
const RULE_TEST_SAMPLES = {
  not_null:  { cols:["profile_id","campaign_id","report_date"], rows:[{profile_id:"48291",campaign_id:"C-001",report_date:"2026-03-10"},{profile_id:null,campaign_id:"C-002",report_date:"2026-03-10"},{profile_id:"48293",campaign_id:"C-003",report_date:"2026-03-10"}] },
  row_count: { meta:{ today:2847, yesterday:2901, avg7d:2855, threshold:1000 } },
  freshness: { meta:{ lastUpdate:"2026-03-10 01:03 AM", ageHours:8.3, thresholdHours:6 } },
  unique:    { cols:["report_date","profile_id","keyword_id"], dupes:[{report_date:"2026-03-09",profile_id:"48291",keyword_id:"KW-991",count:3},{report_date:"2026-03-09",profile_id:"48102",keyword_id:"KW-114",count:2}] },
};

// ─── Root Cause Data ──────────────────────────────────────────────────────────
const CORRELATED_GROUPS = [
  {
    id:"CG-001", ts:"09:14 AM", confidence:96,
    title:"Redshift replication lag cascade",
    rootCause:"analytics-rs Redshift latency spiked to 340ms at ~8:40 AM, causing downstream copy jobs to stall. This single event triggered 3 separate alerts.",
    alerts:["A001","A003","A004"],
    affectedSystems:["redshift-staging","tbl_amzn_campaign_report","tbl_amzn_keyword_report","account_performance"],
    suggestedFix:"Check Redshift cluster WLM queues. Re-trigger stalled GDS copy jobs. Monitor latency — if >300ms for >10 min, scale cluster.",
    pattern:"Seen 2x in last 30 days. Usually resolves within 45 min without intervention.",
  },
  {
    id:"CG-002", ts:"09:08 AM", confidence:88,
    title:"Missing downloads → stuck pending chain",
    rootCause:"Step Function execution for 23 profiles failed at requester step around 3:30 AM. This caused both the missing download alert and the stuck-pending alert as rows aged in the report table.",
    alerts:["A002","A006"],
    affectedSystems:["redshift-staging","report","AWS Step Functions"],
    suggestedFix:"Start new executions for 23 missing profiles. Force-clear 12 stuck-pending rows. Check IAM permissions on Step Function role — failed 3x this week.",
    pattern:"Missing + stuck-pending co-occur 80% of the time. Consider a combined remediation workflow.",
  },
];

// ─── Rules & Gates Data ────────────────────────────────────────────────────────

const RULE_TYPES = [
  { id:"not_null",      label:"Not Null",         icon:"∅",  desc:"Column must have no NULLs" },
  { id:"row_count",     label:"Row Count",         icon:"#",  desc:"Row count within threshold" },
  { id:"freshness",     label:"Freshness",         icon:"⏱",  desc:"Data updated within window" },
  { id:"unique",        label:"Uniqueness",        icon:"◈",  desc:"Column values are unique" },
  { id:"range",         label:"Value Range",       icon:"↔",  desc:"Values within min/max bounds" },
  { id:"regex",         label:"Regex Pattern",     icon:".*", desc:"Values match pattern" },
  { id:"ref_integrity", label:"Ref Integrity",     icon:"⇥",  desc:"FK exists in reference table" },
  { id:"custom_sql",    label:"Custom SQL",        icon:"{}", desc:"Custom SQL assertion" },
];

const INIT_RULES = [
  { id:"MWS-001", name:"orders: no duplicate amazon_order_id",         type:"unique",     source:"redshift-staging", table:"mws.orders",                       column:"amazon_order_id",             severity:"critical", status:"active",  lastRun:"—", lastResult:"pending", aiGen:false, schedule:"0 * * * *",   sql:"SELECT amazon_order_id, COUNT(*) c FROM mws.orders GROUP BY 1 HAVING c > 1" },
  { id:"MWS-002", name:"orders: no NULL asin on shipped orders",        type:"not_null",   source:"redshift-staging", table:"mws.orders",                       column:"asin",                        severity:"critical", status:"active",  lastRun:"—", lastResult:"pending", aiGen:false, schedule:"*/30 * * * *", sql:"SELECT COUNT(*) FROM mws.orders WHERE order_status='Shipped' AND asin IS NULL" },
  { id:"MWS-003", name:"inventory: available qty >= 0",                 type:"range",      source:"redshift-staging", table:"mws.inventory",                    column:"available",                   severity:"high",     status:"active",  lastRun:"—", lastResult:"pending", aiGen:false, schedule:"0 * * * *",   sql:"SELECT COUNT(*) FROM mws.inventory WHERE available < 0" },
  { id:"MWS-004", name:"sales_by_date: no missing days (last 30d)",     type:"freshness",  source:"redshift-staging", table:"mws.sales_and_traffic_by_date",    column:"sale_date",                   severity:"high",     status:"active",  lastRun:"—", lastResult:"pending", aiGen:false, schedule:"0 6 * * *",   sql:"SELECT COUNT(DISTINCT sale_date) FROM mws.sales_and_traffic_by_date WHERE sale_date >= CURRENT_DATE - 30" },
  { id:"MWS-005", name:"sales_by_asin: buy_box_pct between 0 and 1",   type:"range",      source:"redshift-staging", table:"mws.sales_and_traffic_by_asin",    column:"traffic_by_asin_buy_box_prcntg", severity:"medium",   status:"active",  lastRun:"—", lastResult:"pending", aiGen:false, schedule:"0 */2 * * *", sql:"SELECT COUNT(*) FROM mws.sales_and_traffic_by_asin WHERE traffic_by_asin_buy_box_prcntg NOT BETWEEN 0 AND 1" },
  { id:"MWS-006", name:"inventory_restock: qty > 0 on open restocks",  type:"range",      source:"redshift-staging", table:"mws.inventory_restock",            column:"quantity",                    severity:"medium",   status:"active",  lastRun:"—", lastResult:"pending", aiGen:false, schedule:"0 */4 * * *", sql:"SELECT COUNT(*) FROM mws.inventory_restock WHERE quantity <= 0" },
];


const AI_SUGGESTED_RULES = [
  { table:"tbl_amzn_campaign_report",   type:"not_null",      column:"campaign_id",    reason:"campaign_id is NULL in 0.02% of rows — low but persistent",   confidence:94 },
  { table:"tbl_amzn_keyword_report",    type:"range",         column:"clicks",         reason:"clicks has outliers >50k, likely data error",                  confidence:88 },
  { table:"account_performance",        type:"ref_integrity", column:"profile_id",     reason:"profile_id doesn't always match profiles table",               confidence:91 },
  { table:"report",                     type:"row_count",     column:"*",              reason:"Mondays consistently have 30% fewer rows — anomaly baseline",   confidence:79 },
];

const INIT_GATES = [
  { id:"GT-001", name:"Mage Pause Approval",        type:"approval", triggers:["VR-003","VR-005"], channels:["slack","email"], slackChannel:"#dev-python-support",                        emailTo:"ops@intentwise.com",       status:"active", approvers:["@Zubair","@Raghavendra"], lastTriggered:"Yesterday 4:20 PM", autoEscalate:30, pendingCount:0 },
  { id:"GT-002", name:"Data Available Confirmation", type:"approval", triggers:["VR-001","VR-004"], channels:["slack"],         slackChannel:"#dev-python-support",                        emailTo:"",                         status:"active", approvers:["@Abhishek","@Abhiraj"],   lastTriggered:"Today 9:08 AM",     autoEscalate:30, pendingCount:1 },
  { id:"GT-003", name:"Critical Alert Broadcast",    type:"notify",   triggers:["VR-004","VR-005"], channels:["slack","email"], slackChannel:"#notifications-data-availability-issues",   emailTo:"data-team@intentwise.com", status:"active", approvers:[],                         lastTriggered:"Today 8:55 AM",     autoEscalate:0,  pendingCount:0 },
  { id:"GT-004", name:"Schema Drift Review",         type:"approval", triggers:["VR-007"],          channels:["email"],         slackChannel:"",                                           emailTo:"platform@intentwise.com",  status:"active", approvers:["@Zubair"],               lastTriggered:"Today 6:48 AM",     autoEscalate:60, pendingCount:0 },
  { id:"GT-005", name:"Auto-fix Gatekeeper",         type:"gate",     triggers:["VR-003","VR-006"], channels:["slack"],         slackChannel:"#dev-python-support",                        emailTo:"",                         status:"paused", approvers:["@Raghavendra"],           lastTriggered:"—",                 autoEscalate:15, pendingCount:0 },
];

const PENDING_APPROVALS = [
  { id:"PA-001", gate:"GT-002", title:"Data Available Confirmation", alert:"A002", desc:"23 missing downloads detected — Ads Team confirm data availability before refreshes proceed.", requestedAt:"09:08 AM", requestedBy:"Report Status Agent", severity:"critical" },
];

// ─── Tiny Sparkline ────────────────────────────────────────────────────────────
const DataBadge = ({ live }) => {
  const T = React.useContext(ThemeCtx);
  return live
    ? <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.5px", padding:"2px 6px", borderRadius:4, background:`${T.green}20`, color:T.green, border:`1px solid ${T.green}40`, marginLeft:4 }}>LIVE</span>
    : <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.5px", padding:"2px 6px", borderRadius:4, background:"#94A3B815", color:"#94A3B8", border:"1px solid #94A3B830", marginLeft:4 }}>DEMO</span>;
};

function Spark({ data, color = C.accent, h = 32, w = 80 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Status Dot ───────────────────────────────────────────────────────────────
function Dot({ status }) {
  const map = { healthy:"#10B981", degraded:"#F59E0B", offline:"#EF4444", running:"#6366F1", idle:"#64748B", paused:"#F97316", open:"#EF4444", triaged:"#F59E0B", resolved:"#10B981", critical:"#EF4444", high:"#F97316", medium:"#F59E0B", low:"#06B6D4", info:"#64748B" };
  const col = map[status] || "#64748B";
  const pulse = ["running","open","critical","degraded"].includes(status);
  return (
    <span style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center", width:10, height:10 }}>
      {pulse && <span style={{ position:"absolute", width:10, height:10, borderRadius:"50%", background:col, opacity:0.3, animation:"ping 1.5s infinite" }} />}
      <span style={{ width:8, height:8, borderRadius:"50%", background:col, display:"block" }} />
    </span>
  );
}

// ─── Severity Badge ───────────────────────────────────────────────────────────
function SevBadge({ sev }) {
  const bg = { critical:"#450A0A", high:"#431407", medium:"#422006", low:"#083344", info:"#1E293B" };
  const col = SEVERITY[sev] || C.muted;
  return (
    <span style={{ background: bg[sev]||"#1E293B", color: col, border:`1px solid ${col}33`, borderRadius:4, padding:"1px 7px", fontSize:10, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase" }}>
      {sev}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, style, className, ...rest }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, ...style }} className={className} {...rest}>
      {children}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:8, background:`${C.accent}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon size={16} color={C.accentL} />
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:C.text, letterSpacing:"0.01em" }}>{title}</div>
          {subtitle && <div style={{ fontSize:11, color:C.muted, marginTop:1 }}>{subtitle}</div>}
        </div>
      </div>
      {action}
    </div>
  );
}


// ─── Workflow Builder Data ─────────────────────────────────────────────────────

const NODE_PALETTE = [
  { type:"trigger",   label:"Trigger",         color:"#6366F1", icon:"⚡", desc:"Start the workflow" },
  { type:"monitor",   label:"Monitor",         color:"#06B6D4", icon:"👁", desc:"Watch a data source or metric" },
  { type:"validate",  label:"Validate",        color:"#8B5CF6", icon:"✓",  desc:"Run a validation rule" },
  { type:"condition", label:"Condition",       color:"#F59E0B", icon:"◇",  desc:"Branch on a condition" },
  { type:"action",    label:"Action",          color:"#10B981", icon:"⚙",  desc:"Execute a remediation" },
  { type:"notify",    label:"Notify",          color:"#E01E5A", icon:"📣", desc:"Send Slack/email alert" },
  { type:"approve",   label:"Approval Gate",   color:"#F97316", icon:"🔒", desc:"Pause for human approval" },
  { type:"wait",      label:"Wait",            color:"#64748B", icon:"⏳", desc:"Wait for a duration or event" },
  { type:"loop",      label:"Loop / Retry",    color:"#EC4899", icon:"↺",  desc:"Retry up to N times" },
  { type:"end",       label:"End",             color:"#334155", icon:"■",  desc:"Terminate the workflow" },
];

const TRIGGER_OPTIONS = [
  "Scheduled (cron)", "Slack alert received", "Validation rule failed",
  "Row count anomaly", "Step Function failure", "Manual / API call",
];

const ACTION_OPTIONS = [
  "Pause Mage package", "Resume Mage package", "Redrive Step Function",
  "Start new Step Function", "Run dbt model", "Trigger GDS copy job",
  "Query Redshift", "Query BigQuery", "Run custom SQL",
];

const makeNode = (type, yOffset) => {
  const palette = NODE_PALETTE.find(p => p.type === type);
  return {
    id: `node_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    type,
    label: palette?.label || type,
    color: palette?.color || "#64748B",
    icon:  palette?.icon  || "?",
    config: {},
    yOffset,
  };
};

const INIT_WORKFLOWS = [
  {
    id: "WF-001", name: "Ads Download Failure SOP", status: "active",
    description: "Detects missing Ads downloads, pauses Mage packages, validates Redshift, runs refreshes, sends completion notice.",
    lastRun: "Today 9:15 AM", runs: 42, successRate: 94,
    nodes: [
      { id:"n1", type:"trigger",   label:"Scheduled Trigger",         color:"#6366F1", icon:"⚡", config:{ schedule:"0 16 * * 1-5", desc:"Runs at 4 PM IST on weekdays" }, yOffset:0 },
      { id:"n2", type:"monitor",   label:"Check Ads Data Availability",color:"#06B6D4", icon:"👁", config:{ source:"redshift-staging", table:"report", metric:"missing downloads" }, yOffset:1 },
      { id:"n3", type:"condition", label:"Downloads missing?",         color:"#F59E0B", icon:"◇", config:{ expr:"missing_count > 0", yes:"Escalate", no:"End" }, yOffset:2 },
      { id:"n4", type:"notify",    label:"Notify Ads Team on Slack",   color:"#E01E5A", icon:"📣", config:{ channel:"#dev-python-support", mention:"@Abhishek @Abhiraj" }, yOffset:3 },
      { id:"n5", type:"approve",   label:"Approve: Pause Mage Jobs",   color:"#F97316", icon:"🔒", config:{ approvers:"@Zubair @Raghavendra", escalateAfter:30 }, yOffset:4 },
      { id:"n6", type:"action",    label:"Pause Bluewheel Packages",   color:"#10B981", icon:"⚙", config:{ action:"Pause Mage package", target:"bluewheel" }, yOffset:5 },
      { id:"n7", type:"wait",      label:"Wait for Data Confirmation", color:"#64748B", icon:"⏳", config:{ waitFor:"Slack confirmation", timeout:120 }, yOffset:6 },
      { id:"n8", type:"validate",  label:"Validate Redshift Tables",   color:"#8B5CF6", icon:"✓", config:{ rules:["VR-001","VR-002","VR-003"] }, yOffset:7 },
      { id:"n9", type:"action",    label:"Run Sequential Refreshes",   color:"#10B981", icon:"⚙", config:{ action:"Run dbt model", target:"campaign,keyword,account" }, yOffset:8 },
      { id:"n10",type:"approve",   label:"Approve: Resume & Copy",     color:"#F97316", icon:"🔒", config:{ approvers:"@Zubair", escalateAfter:15 }, yOffset:9 },
      { id:"n11",type:"action",    label:"Resume Packages + GDS Copy", color:"#10B981", icon:"⚙", config:{ action:"Resume Mage package", target:"all" }, yOffset:10 },
      { id:"n12",type:"notify",    label:"Send Completion Notice",     color:"#E01E5A", icon:"📣", config:{ channel:"#dev-python-support", msg:"✅ Ads Data Issue Resolved" }, yOffset:11 },
      { id:"n13",type:"end",       label:"End",                        color:"#334155", icon:"■", config:{}, yOffset:12 },
    ],
  },
  {
    id: "WF-002", name: "Report Status Auto-Triage", status: "active",
    description: "Monitors report table every 30 min, classifies failures, auto-redrives or escalates.",
    lastRun: "Today 9:10 AM", runs: 187, successRate: 98,
    nodes: [
      { id:"n1", type:"trigger",   label:"Every 30 min",               color:"#6366F1", icon:"⚡", config:{ schedule:"*/30 * * * *" }, yOffset:0 },
      { id:"n2", type:"monitor",   label:"Scan report_status table",   color:"#06B6D4", icon:"👁", config:{ source:"redshift-staging", table:"report" }, yOffset:1 },
      { id:"n3", type:"condition", label:"Any failures?",              color:"#F59E0B", icon:"◇", config:{ expr:"failed_count > 0" }, yOffset:2 },
      { id:"n4", type:"action",    label:"Classify Step Function",     color:"#10B981", icon:"⚙", config:{ action:"Query Redshift", target:"step_functions" }, yOffset:3 },
      { id:"n5", type:"condition", label:"Requester failure?",         color:"#F59E0B", icon:"◇", config:{ expr:"failure_step == 'requester'" }, yOffset:4 },
      { id:"n6", type:"action",    label:"New Step Function Execution",color:"#10B981", icon:"⚙", config:{ action:"Start new Step Function" }, yOffset:5 },
      { id:"n7", type:"action",    label:"Redrive from failed state",  color:"#10B981", icon:"⚙", config:{ action:"Redrive Step Function" }, yOffset:6 },
      { id:"n8", type:"loop",      label:"Retry up to 3 times",        color:"#EC4899", icon:"↺", config:{ maxRetries:3, interval:10 }, yOffset:7 },
      { id:"n9", type:"notify",    label:"Alert if still failing",     color:"#E01E5A", icon:"📣", config:{ channel:"#dev-python-support", severity:"high" }, yOffset:8 },
      { id:"n10",type:"end",       label:"End",                        color:"#334155", icon:"■", config:{}, yOffset:9 },
    ],
  },
  {
    id: "WF-003", name: "Schema Drift Detection", status: "paused",
    description: "Daily schema scan across all datasources; auto-creates validation rules for new columns.",
    lastRun: "Today 6:48 AM", runs: 14, successRate: 100,
    nodes: [
      { id:"n1", type:"trigger",  label:"Daily at 6 AM IST",            color:"#6366F1", icon:"⚡", config:{ schedule:"0 6 * * *" }, yOffset:0 },
      { id:"n2", type:"action",   label:"Scan all schemas",             color:"#10B981", icon:"⚙", config:{ action:"Query BigQuery", target:"all_sources" }, yOffset:1 },
      { id:"n3", type:"validate", label:"Detect new / removed columns", color:"#8B5CF6", icon:"✓", config:{ rules:["VR-007"] }, yOffset:2 },
      { id:"n4", type:"condition","label":"Drift detected?",            color:"#F59E0B", icon:"◇", config:{ expr:"drift_count > 0" }, yOffset:3 },
      { id:"n5", type:"action",   label:"Auto-generate rules via AI",   color:"#10B981", icon:"⚙", config:{ action:"Run custom SQL", target:"rule_generator" }, yOffset:4 },
      { id:"n6", type:"notify",   label:"Notify platform team",         color:"#E01E5A", icon:"📣", config:{ channel:"#dev-python-support", emailTo:"platform@intentwise.com" }, yOffset:5 },
      { id:"n7", type:"end",      label:"End",                          color:"#334155", icon:"■", config:{}, yOffset:6 },
    ],
  },
];





// ─── Staging Environment Data ─────────────────────────────────────────────────
const STAGING_TABLES = [
  { name:"report",             rows:142800, prodRows:143200, status:"synced",   lastSync:"Today 08:00" },
  { name:"campaign_report",    rows:89200,  prodRows:89200,  status:"synced",   lastSync:"Today 08:00" },
  { name:"keyword_summary",    rows:54100,  prodRows:55300,  status:"stale",    lastSync:"Yesterday"   },
  { name:"account_performance",rows:12400,  prodRows:12400,  status:"synced",   lastSync:"Today 08:00" },
  { name:"profile_metadata",   rows:0,      prodRows:880,    status:"missing",  lastSync:"Never"       },
  { name:"ad_group_stats",     rows:31200,  prodRows:31200,  status:"synced",   lastSync:"Today 08:00" },
];

const STAGING_VALIDATION_RULES = INIT_RULES.slice(0, 6).map(r => ({ ...r }));

// ─── Staging Environment Panel ────────────────────────────────────────────────
function StagingPanel() {
  const T = useTheme();
  const [view, setView] = useState("config"); // config | tables | validate
  const [saved, setSaved] = useState(false);

  // Connection form state
  const [host,     setHost]     = useState("staging-cluster.abc123.us-east-1.redshift.amazonaws.com");
  const [port,     setPort]     = useState("5439");
  const [database, setDatabase] = useState("staging_db");
  const [schema,   setSchema]   = useState("public");
  const [user,     setUser]     = useState("staging_user");
  const [password, setPassword] = useState("");
  const [sslMode,  setSslMode]  = useState("require");
  const [showPass, setShowPass] = useState(false);
  const [testing,  setTesting]  = useState(false);
  const [testResult, setTestResult] = useState(null); // null | {ok, msg}

  // Validation state
  const [selectedRules, setSelectedRules] = useState(
    STAGING_VALIDATION_RULES.map(r => r.id)
  );
  const [targetTable, setTargetTable] = useState("report");
  const [running,  setRunning]  = useState(false);
  const [results,  setResults]  = useState(null);

  const testConnection = async () => {
    setTesting(true); setTestResult(null);
    await new Promise(r => setTimeout(r, 1800));
    if (!host || !database || !user) {
      setTestResult({ ok:false, msg:"Host, database and user are required." });
    } else {
      setTestResult({ ok:true, msg:`Connected to ${database} on ${host}:${port} — ${STAGING_TABLES.length} tables discovered.` });
      setSaved(true);
    }
    setTesting(false);
  };

  const runValidation = async () => {
    setRunning(true); setResults(null);
    await new Promise(r => setTimeout(r, 2200));
    const rules = STAGING_VALIDATION_RULES.filter(r => selectedRules.includes(r.id));
    setResults(rules.map(r => ({
      ...r,
      stagingResult: Math.random() > 0.25 ? "pass" : "fail",
      rowsChecked: Math.floor(Math.random() * 50000) + 5000,
      duration: (Math.random() * 1.8 + 0.2).toFixed(2) + "s",
      detail: Math.random() > 0.25
        ? "All checks passed on staging."
        : "Found " + (Math.floor(Math.random() * 12) + 1) + " rows violating constraint — do not promote.",
    })));
    setRunning(false);
  };

  const toggleRule = (id) =>
    setSelectedRules(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const inp = (val, set, placeholder, type="text", mono=false) => (
    <input
      type={type} value={val}
      onChange={e => { set(e.target.value); setSaved(false); setTestResult(null); }}
      placeholder={placeholder}
      style={{ width:"100%", background:T.isDark?"#0A0C10":T.bg, border:`1px solid ${T.border2}`, borderRadius:7, padding:"8px 11px", color:T.text, fontSize:12, outline:"none", fontFamily:mono?"Consolas,monospace":"inherit" }}
    />
  );

  const field = (label, child, hint) => (
    <div style={{ marginBottom:13 }}>
      <div style={{ fontSize:10, color:T.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:5 }}>{label}</div>
      {child}
      {hint && <div style={{ fontSize:10, color:T.dim, marginTop:3 }}>{hint}</div>}
    </div>
  );

  const TABS = [["config","Connection"], ["tables","Tables"], ["validate","Run Validation"]];
  const passCount = results ? results.filter(r => r.stagingResult === "pass").length : 0;
  const failCount = results ? results.filter(r => r.stagingResult === "fail").length : 0;

  return (
    <div style={{ background:T.card, border:`2px solid ${T.accent}30`, borderRadius:12, overflow:"hidden", marginTop:18 }}>

      {/* Header */}
      <div style={{ padding:"14px 20px", background:T.isDark?`${T.accent}10`:`${T.accent}06`, borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:9, background:`${T.accent}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🗄️</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:800, color:T.text, display:"flex", alignItems:"center", gap:8 }}>
            Staging Environment
            <span style={{ fontSize:9, color:saved?T.green:T.orange, background:saved?`${T.green}15`:`${T.orange}15`, border:`1px solid ${saved?T.green:T.orange}40`, borderRadius:10, padding:"2px 8px", fontWeight:700, textTransform:"uppercase" }}>
              {saved ? "Connected" : "Not configured"}
            </span>
          </div>
          <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Separate Redshift cluster · validate rules before promoting to production</div>
        </div>
        {/* Sub-tab switcher */}
        <div style={{ display:"flex", gap:4 }}>
          {TABS.map(([id, label]) => (
            <button key={id} onClick={() => setView(id)} style={{ padding:"6px 14px", borderRadius:7, border:`1px solid ${view===id?T.accent+"50":"transparent"}`, background:view===id?`${T.accent}15`:"transparent", color:view===id?T.accentL:T.muted, fontSize:11, fontWeight:view===id?700:400, cursor:"pointer" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"20px" }}>

        {/* ── Connection Config ── */}
        {view === "config" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
                <Database size={13} color={T.cyan}/> Redshift Cluster
              </div>
              {field("Host", inp(host, setHost, "cluster.abc.us-east-1.redshift.amazonaws.com", "text", true))}
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:10 }}>
                {field("Database", inp(database, setDatabase, "staging_db"))}
                {field("Port",     inp(port,     setPort,     "5439", "text", true))}
              </div>
              {field("Schema", inp(schema, setSchema, "public"))}
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
                <Lock size={13} color={T.orange}/> Credentials
              </div>
              {field("Username", inp(user, setUser, "staging_user"))}
              {field("Password", (
                <div style={{ position:"relative" }}>
                  <input
                    type={showPass?"text":"password"} value={password}
                    onChange={e=>{ setPassword(e.target.value); setSaved(false); setTestResult(null); }}
                    placeholder="••••••••••••"
                    style={{ width:"100%", background:T.isDark?"#0A0C10":T.bg, border:`1px solid ${T.border2}`, borderRadius:7, padding:"8px 36px 8px 11px", color:T.text, fontSize:12, outline:"none", fontFamily:"Consolas,monospace" }}
                  />
                  <button onClick={()=>setShowPass(p=>!p)} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:T.muted }}>
                    <Eye size={13}/>
                  </button>
                </div>
              ), "Stored in memory only — not persisted")}
              {field("SSL Mode", (
                <select value={sslMode} onChange={e=>setSslMode(e.target.value)} style={{ width:"100%", background:T.isDark?"#0A0C10":T.bg, border:`1px solid ${T.border2}`, borderRadius:7, padding:"8px 11px", color:T.text, fontSize:12, outline:"none" }}>
                  {["require","verify-ca","verify-full","disable"].map(m=><option key={m}>{m}</option>)}
                </select>
              ))}
            </div>

            {/* Test + save row — full width */}
            <div style={{ gridColumn:"1/-1", display:"flex", gap:10, alignItems:"center" }}>
              <button onClick={testConnection} disabled={testing} style={{ background:T.accent, border:"none", borderRadius:8, padding:"9px 22px", cursor:"pointer", color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:7, opacity:testing?0.7:1 }}>
                {testing ? <><RefreshCw size={13} style={{animation:"spin 1s linear infinite"}}/> Testing…</> : <><Zap size={13}/> Test Connection</>}
              </button>
              {testResult && (
                <div style={{ flex:1, padding:"8px 14px", background:testResult.ok?`${T.green}12`:`${T.red}12`, border:`1px solid ${testResult.ok?T.green:T.red}30`, borderRadius:8, fontSize:12, color:testResult.ok?T.green:T.red }}>
                  {testResult.ok ? "✅ " : "✗ "}{testResult.msg}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tables ── */}
        {view === "tables" && (
          <div>
            {!saved && (
              <div style={{ padding:"14px 16px", background:`${T.yellow}10`, border:`1px solid ${T.yellow}30`, borderRadius:8, marginBottom:16, fontSize:12, color:T.yellow }}>
                ⚠️ Configure and test your staging connection first to see live table data.
              </div>
            )}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:6, padding:"8px 10px", fontSize:10, color:T.dim, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.04em", borderBottom:`1px solid ${T.border}`, marginBottom:4 }}>
              {["Table","Staging Rows","Prod Rows","Drift","Status","Last Sync"].map(h=><span key={h}>{h}</span>)}
            </div>
            {STAGING_TABLES.map(t => {
              const drift = t.prodRows - t.rows;
              const sc = {synced:T.green, stale:T.yellow, missing:T.red}[t.status];
              return (
                <div key={t.name} className="row-hover" style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:6, padding:"10px 10px", borderBottom:`1px solid ${T.border}`, alignItems:"center", borderRadius:6 }}>
                  <code style={{ fontSize:11, color:T.text, fontFamily:"Consolas,monospace" }}>{t.name}</code>
                  <span style={{ fontSize:11, color:T.text }}>{t.rows.toLocaleString()}</span>
                  <span style={{ fontSize:11, color:T.text }}>{t.prodRows.toLocaleString()}</span>
                  <span style={{ fontSize:11, color:drift>0?T.orange:T.green, fontFamily:"Consolas,monospace" }}>{drift>0?`-${drift.toLocaleString()}`:drift===0?"—":`+${Math.abs(drift)}`}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:sc, background:`${sc}12`, borderRadius:10, padding:"2px 9px", textTransform:"uppercase", width:"fit-content" }}>{t.status}</span>
                  <span style={{ fontSize:10, color:T.dim }}>{t.lastSync}</span>
                </div>
              );
            })}
            <div style={{ marginTop:12, fontSize:11, color:T.muted, display:"flex", gap:16 }}>
              <span>✅ {STAGING_TABLES.filter(t=>t.status==="synced").length} synced</span>
              <span style={{color:T.yellow}}>⚠️ {STAGING_TABLES.filter(t=>t.status==="stale").length} stale</span>
              <span style={{color:T.red}}>✗ {STAGING_TABLES.filter(t=>t.status==="missing").length} missing</span>
            </div>
          </div>
        )}

        {/* ── Run Validation ── */}
        {view === "validate" && (
          <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:20 }}>

            {/* Left: rule selector */}
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
                <Shield size={13} color={T.purple}/> Select Rules
              </div>
              <div style={{ fontSize:10, color:T.muted, marginBottom:10 }}>Choose which quality rules to run against staging before promoting.</div>
              {STAGING_VALIDATION_RULES.map(r => (
                <div key={r.id} onClick={()=>toggleRule(r.id)} className="row-hover" style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:7, cursor:"pointer", marginBottom:4, background:selectedRules.includes(r.id)?`${T.accent}10`:"transparent", border:`1px solid ${selectedRules.includes(r.id)?T.accent+"40":"transparent"}` }}>
                  <div style={{ width:14, height:14, borderRadius:3, border:`2px solid ${selectedRules.includes(r.id)?T.accent:T.border2}`, background:selectedRules.includes(r.id)?T.accent:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {selectedRules.includes(r.id) && <Check size={9} color="white"/>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:T.text }}>{r.name}<DataBadge live={r.source==="mws"} /></div>
                    <code style={{ fontSize:9, color:T.dim, fontFamily:"Consolas,monospace" }}>{r.id}</code>
                  </div>
                </div>
              ))}

              <div style={{ marginTop:12 }}>
                <div style={{ fontSize:10, color:T.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:6 }}>Target Table</div>
                <select value={targetTable} onChange={e=>setTargetTable(e.target.value)} style={{ width:"100%", background:T.isDark?"#0A0C10":T.bg, border:`1px solid ${T.border2}`, borderRadius:7, padding:"8px 11px", color:T.text, fontSize:12, outline:"none" }}>
                  {STAGING_TABLES.map(t=><option key={t.name} value={t.name}>{t.name}</option>)}
                </select>
              </div>

              <button onClick={runValidation} disabled={running||selectedRules.length===0||!saved} style={{ marginTop:14, width:"100%", background:saved?T.purple:"#334155", border:"none", borderRadius:8, padding:"10px", cursor:saved&&selectedRules.length>0?"pointer":"not-allowed", color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:7, opacity:running?0.7:1 }}>
                {running ? <><RefreshCw size={13} style={{animation:"spin 1s linear infinite"}}/> Running…</> : <><Play size={13}/> Run {selectedRules.length} Rule{selectedRules.length!==1?"s":""} on Staging</>}
              </button>
              {!saved && <div style={{ fontSize:10, color:T.orange, marginTop:6 }}>Connect to staging first</div>}
            </div>

            {/* Right: results */}
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:10, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ display:"flex", alignItems:"center", gap:6 }}><TestTube2 size={13} color={T.cyan}/> Validation Results</span>
                {results && (
                  <span style={{ fontSize:11, color:T.muted }}>
                    <span style={{color:T.green, fontWeight:700}}>{passCount} passed</span>
                    {" · "}
                    <span style={{color:failCount>0?T.red:T.muted, fontWeight:failCount>0?700:400}}>{failCount} failed</span>
                  </span>
                )}
              </div>

              {!results && !running && (
                <div style={{ padding:"40px 20px", textAlign:"center", color:T.muted, fontSize:12, border:`2px dashed ${T.border}`, borderRadius:10 }}>
                  Select rules and click Run to validate staging data before promoting to production.
                </div>
              )}

              {running && (
                <div style={{ padding:"32px 20px", textAlign:"center" }}>
                  <RefreshCw size={24} color={T.accent} style={{animation:"spin 1s linear infinite", marginBottom:12}}/>
                  <div style={{ fontSize:13, color:T.muted }}>Running {selectedRules.length} rules against <code style={{color:T.cyan,fontFamily:"Consolas,monospace"}}>{targetTable}</code> on staging…</div>
                </div>
              )}

              {results && !running && (
                <div>
                  {/* Summary banner */}
                  <div style={{ padding:"12px 16px", background:failCount===0?`${T.green}12`:`${T.red}10`, border:`1px solid ${failCount===0?T.green:T.red}30`, borderRadius:9, marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:22 }}>{failCount===0?"✅":"⚠️"}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:failCount===0?T.green:T.red }}>
                        {failCount===0 ? "All checks passed — safe to promote" : `${failCount} check${failCount>1?"s":""} failed — review before promoting`}
                      </div>
                      <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>
                        Validated against <code style={{fontFamily:"Consolas,monospace",color:T.cyan}}>{targetTable}</code> on staging · {new Date().toLocaleTimeString("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit"})} IST
                      </div>
                    </div>
                  </div>

                  {results.map(r => {
                    const pass = r.stagingResult === "pass";
                    return (
                      <div key={r.id} style={{ display:"flex", gap:12, padding:"11px 14px", borderRadius:8, marginBottom:8, background:pass?`${T.green}08`:`${T.red}08`, border:`1px solid ${pass?T.green:T.red}25` }}>
                        <div style={{ fontSize:18, flexShrink:0 }}>{pass?"✅":"❌"}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:2 }}>{r.name}</div>
                          <div style={{ fontSize:10, color:T.muted, marginBottom:4 }}>{r.detail}</div>
                          <div style={{ display:"flex", gap:12, fontSize:10, color:T.dim }}>
                            <span>Rows checked: <span style={{color:T.text,fontWeight:600}}>{r.rowsChecked?.toLocaleString()}</span></span>
                            <span>Duration: <span style={{color:T.text,fontWeight:600,fontFamily:"Consolas,monospace"}}>{r.duration}</span></span>
                            <code style={{ color:T.dim, fontFamily:"Consolas,monospace" }}>{r.id}</code>
                          </div>
                        </div>
                        <span style={{ fontSize:10, fontWeight:700, color:pass?T.green:T.red, textTransform:"uppercase", alignSelf:"center" }}>{r.stagingResult}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

// ─── Workflow Detail Drawer ───────────────────────────────────────────────────
function WorkflowDetailDrawer({ workflow: wf, onClose, onEdit }) {
  const T = useTheme();
  if (!wf) return null;

  const NODE_TYPE_META = {
    trigger:   { label:"Trigger",    color:"#6366F1", bg:"#6366F115" },
    monitor:   { label:"Monitor",    color:"#06B6D4", bg:"#06B6D415" },
    condition: { label:"Condition",  color:"#F59E0B", bg:"#F59E0B15" },
    notify:    { label:"Notify",     color:"#E01E5A", bg:"#E01E5A15" },
    approve:   { label:"Approval",   color:"#F97316", bg:"#F9731615" },
    action:    { label:"Action",     color:"#10B981", bg:"#10B98115" },
    wait:      { label:"Wait",       color:"#64748B", bg:"#64748B15" },
    validate:  { label:"Validate",   color:"#8B5CF6", bg:"#8B5CF615" },
    loop:      { label:"Loop",       color:"#EC4899", bg:"#EC489915" },
    end:       { label:"End",        color:"#334155", bg:"#33415515" },
  };

  // Fake run history per workflow
  const RUN_LOG = [
    { ts:"Today 09:15", status:"success", duration:"4m 12s", trigger:"scheduled" },
    { ts:"Today 06:48", status:"success", duration:"3m 55s", trigger:"scheduled" },
    { ts:"Yesterday 09:15", status:"failed",  duration:"1m 02s", trigger:"scheduled", failAt:"Validate Redshift Tables" },
    { ts:"Yesterday 06:50", status:"success", duration:"4m 30s", trigger:"manual" },
    { ts:"2 days ago 09:15", status:"success", duration:"4m 08s", trigger:"scheduled" },
  ].slice(0, wf.runs > 0 ? 5 : 0);

  const overlay = {
    position:"fixed", inset:0, zIndex:900,
    background:"rgba(0,0,0,0.45)", display:"flex", justifyContent:"flex-end"
  };
  const panel = {
    width:520, height:"100vh", background:T.surface,
    borderLeft:`1px solid ${T.border2}`, display:"flex", flexDirection:"column",
    animation:"slidein 0.22s ease", boxShadow:"-8px 0 40px rgba(0,0,0,0.35)"
  };

  return (
    <div style={overlay} onClick={onClose}>
      <style>{`@keyframes slidein{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
      <div style={panel} onClick={e=>e.stopPropagation()}>

        {/* ── Header ── */}
        <div style={{ padding:"20px 22px 16px", borderBottom:`1px solid ${T.border}`, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <div style={{ width:34, height:34, borderRadius:9, background:`${T.accent}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <GitBranch size={15} color={T.accentL}/>
                </div>
                <div>
                  <div style={{ fontSize:15, fontWeight:800, color:T.text }}>{wf.name}</div>
                  <code style={{ fontSize:10, color:T.dim }}>{wf.id}</code>
                </div>
              </div>
              <div style={{ fontSize:11, color:T.muted, lineHeight:1.7, marginTop:6 }}>{wf.description}</div>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted, flexShrink:0 }}><X size={16}/></button>
          </div>

          {/* Status + stats row */}
          <div style={{ display:"flex", gap:10, marginTop:14, flexWrap:"wrap" }}>
            <span style={{ fontSize:10, color:wf.status==="active"?T.green:T.orange, background:wf.status==="active"?`${T.green}15`:`${T.orange}15`, border:`1px solid ${wf.status==="active"?T.green:T.orange}40`, borderRadius:12, padding:"3px 10px", fontWeight:700, textTransform:"uppercase" }}>{wf.status}</span>
            {[["Steps", wf.nodes.length], ["Total Runs", wf.runs], ["Success", wf.successRate+"%"], ["Last Run", wf.lastRun]].map(([l,v])=>(
              <span key={l} style={{ fontSize:10, color:T.muted }}><span style={{ fontWeight:700, color:T.text }}>{v}</span> {l}</span>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display:"flex", gap:8, marginTop:14 }}>
            <button onClick={onEdit} style={{ flex:1, background:T.accent, border:"none", borderRadius:8, padding:"8px", cursor:"pointer", color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <Edit2 size={13}/> Open in Editor
            </button>
            <button style={{ background:`${T.green}15`, border:`1px solid ${T.green}40`, borderRadius:8, padding:"8px 16px", cursor:"pointer", color:T.green, fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
              <Play size={12}/> Run Now
            </button>
            <button style={{ background:wf.status==="active"?`${T.orange}15`:`${T.green}15`, border:`1px solid ${wf.status==="active"?T.orange:T.green}40`, borderRadius:8, padding:"8px 14px", cursor:"pointer", color:wf.status==="active"?T.orange:T.green, fontSize:12, fontWeight:700 }}>
              {wf.status==="active"?"Pause":"Resume"}
            </button>
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto" }}>

          {/* ── Step-by-step breakdown ── */}
          <div style={{ padding:"18px 22px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              <Layers size={13} color={T.accentL}/> Workflow Steps
              <span style={{ fontSize:10, color:T.muted, fontWeight:400 }}>({wf.nodes.length} nodes)</span>
            </div>

            <div style={{ position:"relative", paddingLeft:20 }}>
              {/* Spine */}
              <div style={{ position:"absolute", left:8, top:8, bottom:8, width:2, background:T.border, borderRadius:1 }}/>

              {wf.nodes.map((node, i) => {
                const meta = NODE_TYPE_META[node.type] || NODE_TYPE_META.action;
                const isEnd = node.type==="end";
                const isApprove = node.type==="approve";
                const isNotify  = node.type==="notify";
                return (
                  <div key={node.id} style={{ display:"flex", gap:12, marginBottom:10, position:"relative" }}>
                    {/* Node on spine */}
                    <div style={{ position:"absolute", left:-12, top:10, width:18, height:18, borderRadius:"50%", background:meta.color, display:"flex", alignItems:"center", justifyContent:"center", zIndex:1, flexShrink:0 }}>
                      <span style={{ fontSize:9 }}>{node.icon}</span>
                    </div>

                    {/* Content card */}
                    <div style={{ flex:1, background:meta.bg, border:`1px solid ${meta.color}30`, borderRadius:8, padding:"10px 12px", marginLeft:10 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:node.config&&Object.keys(node.config).length>0?6:0 }}>
                        <span style={{ fontSize:9, color:meta.color, background:`${meta.color}20`, borderRadius:10, padding:"1px 7px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.04em" }}>{meta.label}</span>
                        <span style={{ fontSize:12, fontWeight:700, color:T.text }}>{node.label}</span>
                        {isApprove && <span style={{ fontSize:9, color:T.orange, background:`${T.orange}15`, borderRadius:10, padding:"1px 7px", fontWeight:600 }}>⏸ Human gate</span>}
                        {isNotify  && <span style={{ fontSize:9, color:T.cyan,   background:`${T.cyan}15`,   borderRadius:10, padding:"1px 7px", fontWeight:600 }}>📡 Alert</span>}
                      </div>

                      {/* Config details */}
                      {Object.entries(node.config||{}).filter(([k,v])=>v).map(([k,v])=>(
                        <div key={k} style={{ fontSize:10, color:T.muted, display:"flex", gap:6, marginTop:3 }}>
                          <span style={{ color:T.dim, minWidth:70, fontWeight:600, textTransform:"capitalize" }}>{k.replace(/_/g," ")}:</span>
                          <span style={{ color:T.text, fontFamily:typeof v==="string"&&v.includes("*")?"Consolas,monospace":"inherit" }}>{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Run History ── */}
          {RUN_LOG.length > 0 && (
            <div style={{ padding:"0 22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
                <History size={13} color={T.accentL}/> Recent Runs
              </div>
              {RUN_LOG.map((r,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:7, borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:r.status==="success"?T.green:T.red, flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, color:T.text }}>{r.ts}</div>
                    {r.failAt && <div style={{ fontSize:10, color:T.red, marginTop:2 }}>Failed at: {r.failAt}</div>}
                  </div>
                  <span style={{ fontSize:10, color:T.muted }}>{r.duration}</span>
                  <span style={{ fontSize:9, color:r.trigger==="manual"?T.cyan:T.dim, fontWeight:600, textTransform:"uppercase" }}>{r.trigger}</span>
                  <span style={{ fontSize:9, fontWeight:700, color:r.status==="success"?T.green:T.red, textTransform:"uppercase" }}>{r.status}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Workflow Builder Tab ─────────────────────────────────────────────────────
function WorkflowBuilderTab() {
  const [workflows, setWorkflows]   = useState(INIT_WORKFLOWS);
  const [selected, setSelected]     = useState(null);   // workflow id or "new"
  const [drawerWf, setDrawerWf]     = useState(null);   // workflow shown in detail drawer
  const [editNode, setEditNode]     = useState(null);   // node being configured
  const [dragOver, setDragOver]     = useState(null);   // index drop target
  const [dragging, setDragging]     = useState(null);   // palette type or node id
  const [aiLoading, setAiLoading]   = useState(false);
  const [aiPrompt, setAiPrompt]     = useState("");
  const [saveFlash, setSaveFlash]   = useState(false);
  const [runSim, setRunSim]         = useState(null);   // null | index of running node

  const wf = selected && selected !== "new"
    ? workflows.find(w => w.id === selected)
    : null;

  const [nodes, setNodes] = useState([]);
  const [wfName, setWfName] = useState("");
  const [wfDesc, setWfDesc] = useState("");
  const [wfStatus, setWfStatus] = useState("active");

  // Load workflow into editor
  useEffect(() => {
    if (wf) {
      setNodes(wf.nodes.map(n => ({ ...n })));
      setWfName(wf.name);
      setWfDesc(wf.description);
      setWfStatus(wf.status);
    } else if (selected === "new") {
      setNodes([makeNode("trigger", 0), makeNode("end", 1)]);
      setWfName("New Workflow");
      setWfDesc("");
      setWfStatus("active");
    }
  }, [selected]);

  // Save
  const save = () => {
    if (!wfName.trim()) return;
    const numbered = nodes.map((n, i) => ({ ...n, yOffset: i }));
    if (selected === "new") {
      const newWf = {
        id: `WF-${String(workflows.length + 1).padStart(3, "0")}`,
        name: wfName, description: wfDesc, status: wfStatus,
        lastRun: "—", runs: 0, successRate: 100,
        nodes: numbered,
      };
      setWorkflows(p => [...p, newWf]);
      setSelected(newWf.id);
    } else {
      setWorkflows(p => p.map(w => w.id === selected
        ? { ...w, name: wfName, description: wfDesc, status: wfStatus, nodes: numbered }
        : w));
    }
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1800);
  };

  // Delete node
  const deleteNode = (id) => setNodes(p => p.filter(n => n.id !== id));

  // Add node at position (from palette drop)
  const addNodeAt = (type, idx) => {
    const n = makeNode(type, idx);
    setNodes(p => {
      const arr = [...p];
      arr.splice(idx, 0, n);
      return arr.map((x, i) => ({ ...x, yOffset: i }));
    });
  };

  // Reorder
  const moveNode = (fromIdx, toIdx) => {
    setNodes(p => {
      const arr = [...p];
      const [item] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, item);
      return arr.map((x, i) => ({ ...x, yOffset: i }));
    });
  };

  // Save node config
  const saveNodeConfig = (id, patch) => {
    setNodes(p => p.map(n => n.id === id ? { ...n, ...patch } : n));
    setEditNode(null);
  };

  // Simulate run
  const simulate = async () => {
    setRunSim(0);
    for (let i = 0; i < nodes.length; i++) {
      setRunSim(i);
      await new Promise(r => setTimeout(r, 600));
    }
    setRunSim(null);
  };

  // AI generate workflow
  const generateWithAI = async () => {
    if (!aiPrompt.trim() || aiLoading) return;
    setAiLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 1000,
          system: `You are a data ops workflow designer for Intentwise. Convert the user's SOP description into a workflow node array. 
Available node types: trigger, monitor, validate, condition, action, notify, approve, wait, loop, end.
Available colors: trigger=#6366F1, monitor=#06B6D4, validate=#8B5CF6, condition=#F59E0B, action=#10B981, notify=#E01E5A, approve=#F97316, wait=#64748B, loop=#EC4899, end=#334155.
Icons: trigger=⚡, monitor=👁, validate=✓, condition=◇, action=⚙, notify=📣, approve=🔒, wait=⏳, loop=↺, end=■.
Respond ONLY with a JSON object (no markdown): {"name":"string","description":"string","nodes":[{"id":"n1","type":"string","label":"string","color":"string","icon":"string","config":{},"yOffset":0},...]}
Always start with trigger, always end with end. Use 5–12 nodes. Make them specific to the user's use case.`,
          messages: [{ role: "user", content: aiPrompt }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type === "text")?.text || "{}";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setNodes(parsed.nodes || []);
      if (parsed.name) setWfName(parsed.name);
      if (parsed.description) setWfDesc(parsed.description);
      setSelected("new");
    } catch (e) {
      console.error(e);
    }
    setAiLoading(false);
    setAiPrompt("");
  };

  const typeColor = Object.fromEntries(NODE_PALETTE.map(p => [p.type, p.color]));

  // ── Node Config Modal ──────────────────────────────────────────────────────
  const NodeConfigModal = ({ node, onSave, onClose }) => {
    const [label, setLabel] = useState(node.label);
    const [cfg, setCfg] = useState({ ...node.config });
    const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));
    const palette = NODE_PALETTE.find(p => p.type === node.type);

    const fields = {
      trigger:   [["Schedule (cron)", "schedule", "text"], ["Description", "desc", "text"]],
      monitor:   [["Data Source", "source", "ds-select"], ["Table / Metric", "table", "text"], ["What to watch", "metric", "text"]],
      validate:  [["Validation Rules (IDs)", "rules", "text"], ["Fail threshold", "threshold", "text"]],
      condition: [["Expression", "expr", "text"], ["True branch label", "yes", "text"], ["False branch label", "no", "text"]],
      action:    [["Action", "action", "action-select"], ["Target", "target", "text"], ["Parameters", "params", "text"]],
      notify:    [["Slack Channel", "channel", "text"], ["Mention", "mention", "text"], ["Email To", "emailTo", "text"], ["Message", "msg", "text"]],
      approve:   [["Approvers", "approvers", "text"], ["Escalate after (min)", "escalateAfter", "number"]],
      wait:      [["Wait for", "waitFor", "text"], ["Timeout (min)", "timeout", "number"]],
      loop:      [["Max retries", "maxRetries", "number"], ["Interval (min)", "interval", "number"]],
      end:       [],
    };

    return (
      <div style={{ position: "fixed", inset: 0, background: "#000000CC", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: C.card, border: `1px solid ${node.color}40`, borderRadius: 14, padding: "26px", width: 480, maxHeight: "80vh", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${node.color}25`, border: `1px solid ${node.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              {node.icon}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Configure Node</div>
              <div style={{ fontSize: 10, color: node.color, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>{palette?.label}</div>
            </div>
            <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: C.muted }}><X size={15} /></button>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 5, textTransform: "uppercase", fontWeight: 700 }}>Node Label</div>
            <input value={label} onChange={e => setLabel(e.target.value)} style={{ width: "100%", background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 7, padding: "8px 12px", color: C.text, fontSize: 12, outline: "none" }} />
          </div>

          {(fields[node.type] || []).map(([lbl, key, inputType]) => (
            <div key={key} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 5, textTransform: "uppercase", fontWeight: 700 }}>{lbl}</div>
              {inputType === "ds-select" ? (
                <select value={cfg[key] || ""} onChange={e => set(key, e.target.value)} style={{ width: "100%", background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 7, padding: "8px 12px", color: C.text, fontSize: 12, outline: "none" }}>
                  <option value="">— select source —</option>
                  {DATASOURCES.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              ) : inputType === "action-select" ? (
                <select value={cfg[key] || ""} onChange={e => set(key, e.target.value)} style={{ width: "100%", background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 7, padding: "8px 12px", color: C.text, fontSize: 12, outline: "none" }}>
                  <option value="">— select action —</option>
                  {ACTION_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              ) : (
                <input type={inputType === "number" ? "number" : "text"} value={cfg[key] || ""} onChange={e => set(key, e.target.value)} style={{ width: "100%", background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 7, padding: "8px 12px", color: C.text, fontSize: 12, outline: "none", fontFamily: key === "schedule" ? "monospace" : "inherit" }} />
              )}
            </div>
          ))}

          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button onClick={() => onSave(node.id, { label, config: cfg })} style={{ flex: 1, background: node.color, border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", color: "white", fontSize: 12, fontWeight: 700 }}>
              Save
            </button>
            <button onClick={onClose} style={{ background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 8, padding: "10px 18px", cursor: "pointer", color: C.muted, fontSize: 12 }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Canvas Node ────────────────────────────────────────────────────────────
  const CanvasNode = ({ node, idx, isRunning, isDragOver }) => {
    const isEnd     = node.type === "end";
    const isTrigger = node.type === "trigger";
    const isGate    = node.type === "approve" || node.type === "condition";

    return (
      <div
        draggable
        onDragStart={() => setDragging(`node:${idx}`)}
        onDragOver={e => { e.preventDefault(); setDragOver(idx); }}
        onDrop={e => {
          e.preventDefault();
          if (dragging && dragging.startsWith("node:")) {
            const fromIdx = parseInt(dragging.split(":")[1]);
            if (fromIdx !== idx) moveNode(fromIdx, idx);
          } else if (dragging && !dragging.startsWith("node:")) {
            addNodeAt(dragging, idx);
          }
          setDragging(null); setDragOver(null);
        }}
        onDragEnd={() => { setDragging(null); setDragOver(null); }}
        style={{ position: "relative", marginBottom: 0 }}
      >
        {/* Drop indicator */}
        {isDragOver && (
          <div style={{ height: 3, background: C.accentL, borderRadius: 2, margin: "2px 24px", opacity: 0.8 }} />
        )}

        {/* Connector line from above (not for trigger) */}
        {!isTrigger && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 0 }}>
            <div style={{ width: 2, height: 20, background: `${node.color}60` }} />
          </div>
        )}

        <div style={{
          display: "flex", alignItems: "center", gap: 0,
          padding: "0 20px",
        }}>
          {/* Grip */}
          <div style={{ cursor: "grab", color: C.dim, paddingRight: 8, flexShrink: 0 }}>
            <GripVertical size={14} />
          </div>

          {/* Node card */}
          <div style={{
            flex: 1,
            background: isRunning ? `${node.color}25` : `${node.color}10`,
            border: `1.5px solid ${isRunning ? node.color : node.color + "40"}`,
            borderRadius: isEnd || isTrigger ? 24 : isGate ? 12 : 10,
            padding: "12px 16px",
            transition: "all 0.2s",
            boxShadow: isRunning ? `0 0 16px ${node.color}50` : "none",
            cursor: "pointer",
          }}
            onClick={() => setEditNode(node)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{node.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: isRunning ? node.color : C.text }}>{node.label}</div>
                {node.config?.schedule && <div style={{ fontSize: 10, color: C.muted, fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace", marginTop: 2 }}>{node.config.schedule}</div>}
                {node.config?.source  && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{node.config.source}{node.config.table ? ` → ${node.config.table}` : ""}</div>}
                {node.config?.channel && <div style={{ fontSize: 10, color: "#E01E5A", marginTop: 2 }}>{node.config.channel}{node.config.mention ? ` ${node.config.mention}` : ""}</div>}
                {node.config?.approvers && <div style={{ fontSize: 10, color: C.yellow, marginTop: 2 }}>Approvers: {node.config.approvers}</div>}
                {node.config?.action  && <div style={{ fontSize: 10, color: C.cyan, marginTop: 2 }}>{node.config.action}{node.config.target ? ` → ${node.config.target}` : ""}</div>}
                {node.config?.expr    && <div style={{ fontSize: 10, color: C.yellow, fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace", marginTop: 2 }}>if {node.config.expr}</div>}
                {node.config?.waitFor && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Wait for: {node.config.waitFor}{node.config.timeout ? ` (${node.config.timeout}m timeout)` : ""}</div>}
                {node.config?.maxRetries && <div style={{ fontSize: 10, color: "#EC4899", marginTop: 2 }}>Max {node.config.maxRetries} retries · {node.config.interval}m apart</div>}
              </div>
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                {isRunning && <span style={{ fontSize: 10, color: node.color, animation: "pulse 1s infinite" }}>▶</span>}
                <span style={{ fontSize: 9, color: node.color, background: `${node.color}15`, border: `1px solid ${node.color}30`, borderRadius: 4, padding: "1px 6px", fontWeight: 700, textTransform: "uppercase" }}>
                  {NODE_PALETTE.find(p => p.type === node.type)?.label || node.type}
                </span>
              </div>
            </div>
          </div>

          {/* Delete */}
          {!isEnd && !isTrigger && (
            <button
              onClick={e => { e.stopPropagation(); deleteNode(node.id); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: C.dim, paddingLeft: 8, flexShrink: 0 }}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

        {/* Connector arrow to next */}
        {!isEnd && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 2, height: 10, background: `${node.color}40` }} />
              <ArrowDown size={12} color={`${node.color}60`} />
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── List view ──────────────────────────────────────────────────────────────
  if (!selected) {
    return (
      <div>
        {drawerWf && (
          <WorkflowDetailDrawer
            workflow={drawerWf}
            onClose={()=>setDrawerWf(null)}
            onEdit={()=>{ setSelected(drawerWf.id); setDrawerWf(null); }}
          />
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <SectionHeader icon={GitBranch} title="Remediation Workflows" subtitle={`${workflows.length} workflows · ${workflows.filter(w => w.status === "active").length} active`} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setSelected("new")} style={{ background: `${C.accent}20`, border: `1px solid ${C.accent}50`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 11, color: C.accentL, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <Plus size={13} /> New Workflow
            </button>
          </div>
        </div>

        {/* AI generate strip */}
        <Card style={{ padding: "16px 20px", marginBottom: 18, background: `linear-gradient(135deg, ${C.card} 0%, #160F2E 100%)`, border: `1px solid ${C.purple}30` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Wand2 size={14} color={C.purple} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Generate Workflow with AI</span>
            <span style={{ fontSize: 10, color: C.muted }}>Describe your SOP in plain English</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              onKeyDown={e => e.key === "Enter" && generateWithAI()}
              placeholder='e.g. "Every hour check if Redshift keyword report has duplicate rows, if yes pause Mage, alert Slack, wait for approval then run dedup fix"'
              style={{ flex: 1, background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 8, padding: "9px 14px", color: C.text, fontSize: 12, outline: "none" }}
            />
            <button onClick={generateWithAI} disabled={aiLoading} style={{ background: C.purple, border: "none", borderRadius: 8, padding: "9px 20px", cursor: "pointer", color: "white", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
              {aiLoading ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Building…</> : <><Sparkles size={13} /> Generate</>}
            </button>
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {workflows.map(w => (
            <Card key={w.id} style={{ padding: "18px 20px", cursor: "pointer", transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.accent + "60"}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
              onClick={() => setDrawerWf(w)}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${C.accent}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <GitBranch size={14} color={C.accentL} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{w.name}</div>
                    <div style={{ fontSize: 10, color: C.muted, fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace" }}>{w.id}</div>
                  </div>
                </div>
                <span style={{ fontSize: 9, color: w.status === "active" ? C.green : C.orange, background: w.status === "active" ? `${C.green}15` : `${C.orange}15`, border: `1px solid ${w.status === "active" ? C.green : C.orange}40`, borderRadius: 4, padding: "2px 7px", fontWeight: 700, textTransform: "uppercase" }}>
                  {w.status}
                </span>
              </div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, marginBottom: 12, minHeight: 36 }}>{w.description}</div>

              {/* Node type chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                {[...new Set(w.nodes.map(n => n.type))].map(t => {
                  const p = NODE_PALETTE.find(x => x.type === t);
                  return p ? (
                    <span key={t} style={{ fontSize: 9, color: p.color, background: `${p.color}15`, border: `1px solid ${p.color}30`, borderRadius: 4, padding: "1px 6px" }}>{p.icon} {p.label}</span>
                  ) : null;
                })}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                {[["Steps", w.nodes.length, C.accentL], ["Runs", w.runs, C.cyan], ["Success", `${w.successRate}%`, w.successRate > 95 ? C.green : C.yellow]].map(([l, v, c]) => (
                  <div key={l} style={{ textAlign: "center", background: `${C.border}50`, borderRadius: 6, padding: "5px" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: c }}>{v}</div>
                    <div style={{ fontSize: 9, color: C.muted }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, fontSize: 10, color: C.dim }}>Last run: {w.lastRun}</div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // ── Editor view ────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", gap: 0, height: "calc(100vh - 160px)", minHeight: 600 }}>
      {editNode && (
        <NodeConfigModal node={editNode} onSave={saveNodeConfig} onClose={() => setEditNode(null)} />
      )}

      {/* Left: Palette */}
      <div style={{ width: 200, flexShrink: 0, background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px 0 0 10px", padding: "16px 12px", overflowY: "auto" }}>
        <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Node Palette</div>
        <div style={{ fontSize: 10, color: C.dim, marginBottom: 10 }}>Drag onto canvas ↓</div>
        {NODE_PALETTE.map(p => (
          <div
            key={p.type}
            draggable
            onDragStart={() => setDragging(p.type)}
            onDragEnd={() => setDragging(null)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, marginBottom: 4, background: `${p.color}10`, border: `1px solid ${p.color}30`, cursor: "grab", transition: "all 0.15s" }}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{p.icon}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: p.color }}>{p.label}</div>
              <div style={{ fontSize: 9, color: C.muted, lineHeight: 1.4 }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Center: Canvas */}
      <div style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderLeft: "none", borderRight: "none", display: "flex", flexDirection: "column" }}>
        {/* Canvas toolbar */}
        <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10, background: C.surface }}>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
            <ChevronLeft size={13} /> Back
          </button>
          <div style={{ width: 1, height: 16, background: C.border }} />
          <input
            value={wfName}
            onChange={e => setWfName(e.target.value)}
            style={{ background: "none", border: "none", color: C.text, fontSize: 13, fontWeight: 700, outline: "none", flex: 1 }}
          />
          <select value={wfStatus} onChange={e => setWfStatus(e.target.value)} style={{ background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 6, padding: "4px 8px", color: C.text, fontSize: 11, outline: "none" }}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
          </select>
          <button onClick={simulate} disabled={runSim !== null} style={{ background: `${C.green}18`, border: `1px solid ${C.green}40`, borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 11, color: C.green, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            <Play size={12} /> Simulate
          </button>
          <button onClick={save} style={{ background: saveFlash ? C.green : C.accent, border: "none", borderRadius: 7, padding: "6px 16px", cursor: "pointer", fontSize: 11, color: "white", fontWeight: 700, display: "flex", alignItems: "center", gap: 6, transition: "background 0.3s" }}>
            {saveFlash ? <><Check size={12} /> Saved!</> : <><Save size={12} /> Save</>}
          </button>
        </div>

        {/* Canvas body */}
        <div
          style={{ flex: 1, overflowY: "auto", padding: "20px 0 40px" }}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            if (dragging && !dragging.startsWith("node:")) {
              addNodeAt(dragging, nodes.length - 1);
              setDragging(null); setDragOver(null);
            }
          }}
        >
          {nodes.map((node, idx) => (
            <CanvasNode
              key={node.id}
              node={node}
              idx={idx}
              isRunning={runSim === idx}
              isDragOver={dragOver === idx}
            />
          ))}

          {/* Drop zone at bottom */}
          <div
            style={{ margin: "8px 20px 0", height: 40, border: `2px dashed ${dragging && !dragging.startsWith("node:") ? C.accentL : C.border}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: C.dim, transition: "all 0.15s" }}
            onDragOver={e => { e.preventDefault(); setDragOver(nodes.length); }}
            onDrop={e => {
              e.preventDefault();
              if (dragging && !dragging.startsWith("node:")) {
                addNodeAt(dragging, nodes.length - 1);
                setDragging(null); setDragOver(null);
              }
            }}
          >
            + Drop node here
          </div>
        </div>
      </div>

      {/* Right: Inspector */}
      <div style={{ width: 240, flexShrink: 0, background: C.surface, border: `1px solid ${C.border}`, borderLeft: "none", borderRadius: "0 10px 10px 0", padding: "16px 14px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Workflow meta */}
        <div>
          <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Workflow Info</div>
          <textarea
            value={wfDesc}
            onChange={e => setWfDesc(e.target.value)}
            placeholder="Description…"
            rows={3}
            style={{ width: "100%", background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 7, padding: "8px 10px", color: C.text, fontSize: 11, outline: "none", resize: "none", lineHeight: 1.6 }}
          />
        </div>

        {/* Step summary */}
        <div>
          <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Step Summary</div>
          {nodes.map((n, i) => (
            <div key={n.id} onClick={() => setEditNode(n)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 7, marginBottom: 3, cursor: "pointer", background: runSim === i ? `${n.color}15` : "transparent", border: `1px solid ${runSim === i ? n.color + "40" : "transparent"}`, transition: "all 0.2s" }}>
              <span style={{ fontSize: 11 }}>{n.icon}</span>
              <span style={{ fontSize: 10, color: runSim === i ? n.color : C.muted, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.label}</span>
              <span style={{ fontSize: 9, color: C.dim }}>{i + 1}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        {wf && (
          <div>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Run History</div>
            {[["Total Runs", wf.runs], ["Success Rate", `${wf.successRate}%`], ["Last Run", wf.lastRun]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 10, color: C.muted }}>{l}</span>
                <span style={{ fontSize: 10, color: C.text, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* Generated YAML preview */}
        <div>
          <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>YAML Export</div>
          <div style={{ background: C.bg, borderRadius: 7, padding: "10px", fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace", fontSize: 9, color: C.cyan, lineHeight: 1.7, maxHeight: 180, overflowY: "auto" }}>
            {`workflow:\n  name: ${wfName}\n  status: ${wfStatus}\n  steps:\n`}
            {nodes.map((n, i) => `  - id: step_${i + 1}\n    type: ${n.type}\n    label: "${n.label}"\n`).join("")}
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Validation Rules Tab ─────────────────────────────────────────────────────
function SchedModal({ rule, T, CRON_PRESETS, setRules, onClose }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:T.card,border:`1px solid ${T.border2}`,borderRadius:14,padding:"24px",width:400}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:4}}>Schedule: {rule.name}</div>
        <div style={{fontSize:11,color:T.muted,marginBottom:16}}>Auto-run against redshift-staging · mws schema</div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,color:T.muted,fontWeight:700,marginBottom:6}}>PRESETS</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {CRON_PRESETS.map(p=>(
              <button key={p.value} onClick={()=>setRules(rs=>rs.map(r=>r.id===rule.id?{...r,schedule:p.value}:r))}
                style={{fontSize:10,padding:"4px 10px",borderRadius:6,border:`1px solid ${rule.schedule===p.value?T.accent:T.border2}`,background:rule.schedule===p.value?`${T.accent}15`:T.bg,color:rule.schedule===p.value?T.accent:T.muted,cursor:"pointer",fontWeight:rule.schedule===p.value?700:400}}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,color:T.muted,fontWeight:700,marginBottom:6}}>CUSTOM CRON</div>
          <input value={rule.schedule||""} onChange={e=>setRules(rs=>rs.map(r=>r.id===rule.id?{...r,schedule:e.target.value}:r))}
            style={{width:"100%",background:T.bg,border:`1px solid ${T.border2}`,borderRadius:7,padding:"7px 10px",color:T.text,fontSize:12,fontFamily:"Consolas,monospace",outline:"none",boxSizing:"border-box"}}
            placeholder="0 * * * *" />
          <div style={{fontSize:10,color:T.muted,marginTop:4}}>Current: <code style={{color:T.accentL}}>{rule.schedule||"not set"}</code></div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
          <button onClick={onClose} style={{fontSize:11,padding:"6px 14px",borderRadius:7,border:`1px solid ${T.border2}`,background:"none",color:T.muted,cursor:"pointer"}}>Cancel</button>
          <button onClick={onClose} style={{fontSize:11,padding:"6px 14px",borderRadius:7,border:"none",background:T.accent,color:"white",cursor:"pointer",fontWeight:700}}>Save</button>
        </div>
      </div>
    </div>
  );
}

function ValidationRulesTab({ liveRules, rulesLoading, addAuditEvent }) {
  const [rules, setRules]           = useState(INIT_RULES);
  const [view,  setView]            = useState("list"); // list | builder | nlp | scan
  useEffect(() => {
    if (liveRules && liveRules.length > 0) setRules(liveRules);
  }, [liveRules]);

  // ─── Shared rule-generation function ────────────────────────────────────────
  const generateRules = async (forceFresh = false) => {
    const CACHE_KEY = "iw_qa_rules_cache";
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

    // 1. Fetch real mws tables
    const tablesRes  = await fetch(`${API_BASE}/api/tables`);
    const tablesData = await tablesRes.json();
    const mwsTables  = (tablesData || []).filter(t => (t.schema || t.table_schema) === "mws").map(t => t.name);
    if (!mwsTables.length) return;

    const tableHash = mwsTables.slice().sort().join(",");

    // 2. Check cache (skip on forceFresh)
    if (!forceFresh) {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
        if (
          cached &&
          cached.tableHash === tableHash &&
          cached.generatedAt &&
          Date.now() - cached.generatedAt < CACHE_TTL &&
          Array.isArray(cached.rules) && cached.rules.length > 0
        ) {
          // Merge cached AI rules — skip any whose table+column+type already exists
          setRules(prev => {
            const existing = new Set(prev.map(r => `${r.table}|${r.column}|${r.type}`));
            const novel = cached.rules.filter(r => !existing.has(`${r.table}|${r.column}|${r.type}`));
            return novel.length ? [...prev, ...novel] : prev;
          });
          const ageMin = Math.round((Date.now() - cached.generatedAt) / 60000);
          const ageStr = ageMin < 60 ? `${ageMin}m ago` : `${Math.round(ageMin/60)}h ago`;
          setCacheStatus({ generatedAt: cached.generatedAt, fromCache: true, ageStr });
          return;
        }
      } catch(_) {}
    }

    // 3. Call AI to generate fresh rules
    setCacheStatus(null);
    const res = await fetch(`${API_BASE}/api/ai/chat`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        max_tokens: 2000,
        system: `You are a data quality AI for Intentwise. Redshift schema: mws. Tables: ${mwsTables.join(", ")}. Key columns — orders: amazon_order_id, asin, order_status, item_price, quantity, purchase_date, account_id. inventory: asin, available, total_units, days_of_supply, alert, account_id. sales_and_traffic_by_date: sale_date, ordered_product_sales_amt, units_ordered, buy_box_percentage, refund_rate, account_id. sales_and_traffic_by_asin: child_asin, units_ordered, traffic_by_asin_buy_box_prcntg, account_id. inventory_restock: asin, quantity, account_id. sales_and_traffic_by_sku: sku, units_ordered, ordered_product_sales_amt, account_id. Generate 8-10 high-value data quality rules. Respond ONLY with a valid JSON array, no markdown, no explanation: [{"id":"MWS-A01","name":"short rule name","type":"unique|not_null|range|freshness|row_count","source":"redshift-staging","table":"mws.TABLE","column":"col","severity":"critical|high|medium|low","status":"active","lastRun":"—","lastResult":"pending","aiGen":true,"schedule":"0 * * * *","sql":"exact runnable SQL that returns failing rows if check fails"}]`,
        messages:[{ role:"user", content:"Generate data quality rules for all mws tables." }]
      })
    });
    const d       = await res.json();
    const raw     = d.content?.find(b => b.type === "text")?.text || "[]";
    const clean   = raw.replace(/```json|```/g, "").trim();
    const generated = JSON.parse(clean);
    if (!Array.isArray(generated) || !generated.length) return;

    const stamped = generated
      .filter(r => r.sql)
      .map((r, i) => ({ ...r, id:`MWS-A${String(i+1).padStart(2,"0")}`, lastRun:"—", lastResult:"pending", aiGen:true }));

    // 4. Merge into rules state
    setRules(prev => {
      const existing = new Set(prev.map(r => `${r.table}|${r.column}|${r.type}`));
      const novel = stamped.filter(r => !existing.has(`${r.table}|${r.column}|${r.type}`));
      return novel.length ? [...prev, ...novel] : prev;
    });

    // 5. Write to localStorage cache
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        rules: stamped,
        tableHash,
        generatedAt: Date.now(),
      }));
    } catch(_) {}

    setCacheStatus({ generatedAt: Date.now(), fromCache: false, ageStr: "just now" });
  };

  // Auto-generate rules on mount — uses cache if valid
  useEffect(() => {
    generateRules(false).catch(() => {});
  }, []);

  // builder | nlp | scan
  const [nlpInput, setNlpInput]     = useState("");
  const [nlpLoading, setNlpLoading] = useState(false);
  const [nlpResult, setNlpResult]   = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [selectedDs, setSelectedDs] = useState("redshift-staging");
  const [filterStatus, setFilterStatus] = useState("all");

  // Builder state
  const [builder, setBuilder] = useState({ name:"", type:"not_null", source:"redshift-staging", table:"", column:"", severity:"high", schedule:"0 * * * *", params:{} });
  const [collapsedTables, setCollapsedTables] = useState({});

  const visibleRules = rules.filter(r => filterStatus === "all" || r.status === filterStatus);

  const toggleRule = (id) => setRules(p => p.map(r => r.id===id ? {...r, status: r.status==="active"?"paused":"active"} : r));

  const runNlpParse = async () => {
    if (!nlpInput.trim() || nlpLoading) return;
    setNlpLoading(true); setNlpResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ max_tokens:1000,
          system:`You are a data quality rule generator for the Intentwise QA platform. The ONLY datasource is "redshift-staging" (schema: mws). Tables and key columns:

mws.orders: id, amazon_order_id, merchant_order_id, purchase_date, last_updated_date, order_status, fulfillment_channel, sales_channel, product_name, sku, asin, item_status, quantity, currency, item_price, item_tax, shipping_price, is_business_order, seller_id, account_id, download_date
mws.inventory: id, country, product_name, fnsku, merchant_sku, asin, condition, price, sales_last_30_days, units_sold_last_30_days, total_units, inbound, available, fc_transfer, unfulfillable, days_of_supply, alert, recommended_replenishment_qty, account_id, download_date
mws.inventory_restock: same structure as inventory with restock order columns
mws.sales_and_traffic_by_asin: id, parent_asin, child_asin, units_ordered, ordered_product_sales_amt, total_order_items, traffic_by_asin_sessions, traffic_by_asin_buy_box_prcntg, traffic_by_asin_units_session_prcntg, account_id, report_start_date, report_end_date, download_date
mws.sales_and_traffic_by_date: id, sale_date, ordered_product_sales_amt, units_ordered, total_order_items, avg_selling_price_amt, units_refunded, refund_rate, page_views, sessions, buy_box_percentage, unit_session_percentage, account_id, download_date
mws.sales_and_traffic_by_sku: same as sales_and_traffic_by_asin but with sku field

Rule types: not_null, row_count, freshness, unique, range, regex, ref_integrity, custom_sql.
Always set source to "redshift-staging". Pick the most relevant table and column from the schema above.
Respond ONLY with valid JSON (no markdown): {"name":"string","type":"string","source":"redshift-staging","table":"mws.TABLE","column":"string","severity":"critical|high|medium|low","schedule":"cron string","params":{},"sql_hint":"exact SQL to run this check"}`,
          messages:[{ role:"user", content: nlpInput }]
        })
      });
      const data = await res.json();
      const raw = data.content?.find(b=>b.type==="text")?.text || "{}";
      const clean = raw.replace(/```json|```/g,"").trim();
      setNlpResult(JSON.parse(clean));
    } catch(err) {
      setNlpResult({ error:`Network/parse error: ${err.message}. Check that backend is running.` });
    }
    setNlpLoading(false);
  };

  const runSchemaScan = async () => {
    setScanLoading(true); setScanResults(null);
    try {
      // 1. Fetch real schema from backend
      const tablesRes = await fetch("https://intentwise-backend-production.up.railway.app/api/tables");
      const tablesData = await tablesRes.json();
      const mwsTables = (tablesData || []).filter(t => (t.schema || t.table_schema) === "mws").map(t => t.name || t.table_name);

      // 2. Ask Claude to suggest test cases based on actual mws schema
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ max_tokens:1500,
          system:`You are a data quality AI for Intentwise. The database is Redshift, schema: mws. Tables available: ${mwsTables.join(", ")}. Key columns per table — orders: amazon_order_id, asin, order_status, item_price, quantity, account_id, download_date. inventory: asin, available, total_units, days_of_supply, alert, account_id. sales_and_traffic_by_date: sale_date, ordered_product_sales_amt, units_ordered, buy_box_percentage, account_id. sales_and_traffic_by_asin: child_asin, units_ordered, traffic_by_asin_buy_box_prcntg, account_id. Suggest 6 high-value test cases covering nulls, duplicates, freshness, range checks, and referential integrity. Respond ONLY with a JSON array (no markdown): [{"table":"mws.TABLE","column":"col","type":"rule_type","name":"short name","severity":"critical|high|medium|low","reason":"why this matters","confidence":0.0-1.0,"sql_hint":"exact SQL"}]`,
          messages:[{ role:"user", content:"Scan mws schema and suggest the most impactful data quality test cases." }]
        })
      });
      const data = await res.json();
      const raw = data.content?.find(b=>b.type==="text")?.text || "[]";
      const clean = raw.replace(/```json|```/g,"").trim();
      setScanResults(JSON.parse(clean));
    } catch(e) { setScanResults([]); }
    setScanLoading(false);
  };

  const acceptNlpRule = () => {
    if (!nlpResult || nlpResult.error) return;
    const newRule = { ...nlpResult, id:`MWS-${String(rules.length+1).padStart(3,"0")}`, status:"active", lastRun:"—", lastResult:"pending", aiGen:true, sql: nlpResult.sql_hint || "" };
    setRules(p => [...p, newRule]);
    setNlpInput(""); setNlpResult(null); setView("list");
  };

  const acceptScanRule = (r) => {
    const newRule = { id:`MWS-${String(rules.length+1).padStart(3,"0")}`, name:r.name, type:r.type, source:"redshift-staging", table:r.table, column:r.column, severity:r.severity, status:"active", lastRun:"—", lastResult:"pending", aiGen:true, schedule:"0 * * * *", sql: r.sql_hint || "" };
    setRules(p => [...p, newRule]);
    setScanResults(p => p ? p.filter(x=>x.name!==r.name) : p);
  };

  const submitBuilder = () => {
    if (!builder.name || !builder.table) return;
    const newRule = { ...builder, id:`VR-${String(rules.length+1).padStart(3,"0")}`, status:"active", lastRun:"—", lastResult:"pending", aiGen:false };
    setRules(p => [...p, newRule]); setView("list");
    setBuilder({ name:"", type:"not_null", source:"redshift-staging", table:"", column:"", severity:"high", schedule:"0 * * * *", params:{} });
  };

  const [runningRules,  setRunningRules]  = useState({});
  const [expandedRule,  setExpandedRule]  = useState(null);
  const [scheduleEdit,  setScheduleEdit]  = useState(null);
  const [cacheStatus,   setCacheStatus]   = useState(null); // { generatedAt, fromCache } // rule id being edited
  const CRON_PRESETS = [
    { label:"Every 15 min",  value:"*/15 * * * *" },
    { label:"Every hour",    value:"0 * * * *" },
    { label:"Every 6 hours", value:"0 */6 * * *" },
    { label:"Daily 2am",     value:"0 2 * * *" },
    { label:"Weekly Mon",    value:"0 6 * * 1" },
  ];  // {ruleId: "running"|"pass"|"fail"|{count,rows}}

  const runRule = async (rule) => {
    if (!rule.sql) return;
    setRunningRules(p => ({...p, [rule.id]:"running"}));
    try {
      const qs = `?sql=${encodeURIComponent(rule.sql)}`;
      const res = await fetch(`https://intentwise-backend-production.up.railway.app/api/query${qs}`);
      const data = await res.json();
      const rows = data.rows || [];
      const count = rows[0] ? (Object.values(rows[0])[0] ?? rows.length) : 0;
      const passed = count === 0;
      setRunningRules(p => ({...p, [rule.id]: passed ? "pass" : {count, rows}}));
      setRules(p => p.map(r => r.id===rule.id
        ? {...r, lastResult: passed?"pass":"fail", lastRun: new Date().toLocaleTimeString()}
        : r
      ));
      if (addAuditEvent) addAuditEvent({
        type:     "rule",
        name:     rule.name,
        table:    rule.table || "—",
        source:   rule.source || "redshift-staging",
        result:   passed ? "pass" : "fail",
        detail:   passed
          ? `Rule passed. No violations found.`
          : `Rule failed. ${count} violation(s) found.`,
        duration: "—",
      });
    } catch(e) {
      setRunningRules(p => ({...p, [rule.id]:"error"}));
      if (addAuditEvent) addAuditEvent({
        type:   "rule",
        name:   rule.name,
        table:  rule.table || "—",
        source: rule.source || "redshift-staging",
        result: "fail",
        detail: `Rule error: ${e.message}`,
        duration: "—",
      });
    }
  };

  const resultColor = { pass:C.green, fail:C.red, pending:C.muted };
  const typeIcon = { not_null:"∅", row_count:"#", freshness:"⏱", unique:"◈", range:"↔", regex:".*", ref_integrity:"⇥", custom_sql:"{}" };

  const Btn = ({active, onClick, children}) => (
    <button onClick={onClick} style={{ padding:"7px 14px", borderRadius:7, border:`1px solid ${active?C.accent+"60":C.border2}`, background:active?`${C.accent}18`:C.bg, color:active?C.accentL:C.muted, fontSize:11, fontWeight:active?700:500, cursor:"pointer" }}>
      {children}
    </button>
  );

  return (
  <>
    <div>
      {/* Sub-nav */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <Btn active={view==="list"}    onClick={()=>setView("list")}>📋 All Rules ({rules.length})</Btn>
          <Btn active={view==="builder"} onClick={()=>setView("builder")}>🔨 Visual Builder</Btn>
          <Btn active={view==="nlp"}     onClick={()=>setView("nlp")}>✨ Natural Language</Btn>
          <Btn active={view==="scan"}    onClick={()=>setView("scan")}>🔍 Schema Scan</Btn>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <button
            onClick={async ()=>{
              const rulesWithSql = rules.filter(r=>r.sql && r.status==="active");
              for (const r of rulesWithSql) { await runRule(r); }
            }}
            style={{ padding:"7px 14px", borderRadius:7, border:`1px solid ${C.green}50`, background:`${C.green}12`, color:C.green, fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}
          >
            ⚡ Run All Active
          </button>
          <button
            onClick={async () => {
              try {
                // Remove AI rules first so regeneration replaces rather than appends
                setRules(prev => prev.filter(r => !r.aiGen));
                await generateRules(true);
              } catch(_) {}
            }}
            style={{ background:`${C.purple}12`, border:`1px solid ${C.purple}30`, borderRadius:7, padding:"6px 12px", cursor:"pointer", fontSize:11, color:C.purple, fontWeight:700, display:"flex", alignItems:"center", gap:5 }}
          >
            <Sparkles size={11} color={C.purple}/> Regenerate Rules
          </button>
          {cacheStatus && (
            <span style={{ fontSize:10, color: cacheStatus.fromCache ? C.muted : C.green, display:"flex", alignItems:"center", gap:4 }}>
              {cacheStatus.fromCache
                ? `💾 Cached · ${cacheStatus.ageStr}`
                : `✨ Generated ${cacheStatus.ageStr}`}
            </span>
          )}
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {["all","active","paused"].map(s=>(
            <button key={s} onClick={()=>setFilterStatus(s)} style={{ padding:"5px 12px", borderRadius:6, border:`1px solid ${filterStatus===s?C.accent+"50":C.border2}`, background:filterStatus===s?`${C.accent}15`:C.bg, color:filterStatus===s?C.accentL:C.muted, fontSize:10, fontWeight:700, textTransform:"uppercase", cursor:"pointer" }}>{s}</button>
          ))}
        </div>
      </div>

      {/* ── List View ── */}
      {view==="list" && (() => {
        // Group rules by table
        const grouped = rules.reduce((acc, r) => {
          const tbl = r.table || "uncategorised";
          if (!acc[tbl]) acc[tbl] = [];
          acc[tbl].push(r);
          return acc;
        }, {});
        const tables = Object.keys(grouped).sort();
        return (
          <div>
            {/* Summary bar */}
            <div style={{ display:"flex", gap:12, alignItems:"center", padding:"10px 4px", marginBottom:8 }}>
              <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{rules.length} Rules</span>
              <span style={{ fontSize:11, color:C.muted }}>across {tables.length} tables</span>
              <span style={{ fontSize:11, color:C.green }}>{rules.filter(r=>r.lastResult==="pass").length} passing</span>
              <span style={{ fontSize:11, color:C.red }}>{rules.filter(r=>r.lastResult==="fail").length} failing</span>
            </div>
            {tables.map(tbl => {
              const tblRules = grouped[tbl];
              const isOpen = !collapsedTables[tbl];
              const passing = tblRules.filter(r=>r.lastResult==="pass").length;
              const failing = tblRules.filter(r=>r.lastResult==="fail").length;
              const shortTbl = tbl.replace("mws.","");
              return (
                <Card key={tbl} style={{ marginBottom:10, overflow:"hidden" }}>
                  {/* Table header row */}
                  <div
                    onClick={() => setCollapsedTables(p => ({ ...p, [tbl]: !p[tbl] }))}
                    style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 16px", cursor:"pointer", background:C.isDark?"#0A0C1090":"#F1F5F9", borderBottom: isOpen?`1px solid ${C.border}`:"none" }}
                  >
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", background: failing>0?C.red:passing>0?C.green:C.muted }} />
                      <span style={{ fontSize:12, fontWeight:700, color:C.text, fontFamily:"monospace" }}>{tbl}</span>
                      <span style={{ fontSize:11, background:`${C.accent}18`, color:C.accent, borderRadius:4, padding:"1px 7px", fontWeight:600 }}>{tblRules.length} rule{tblRules.length!==1?"s":""}</span>
                      {failing>0 && <span style={{ fontSize:11, background:`${C.red}15`, color:C.red, borderRadius:4, padding:"1px 7px", fontWeight:600 }}>⚠ {failing} failing</span>}
                      {passing>0 && <span style={{ fontSize:11, background:`${C.green}15`, color:C.green, borderRadius:4, padding:"1px 7px", fontWeight:600 }}>✓ {passing} passing</span>}
                    </div>
                    <span style={{ color:C.muted, fontSize:12 }}>{isOpen ? "▾" : "▸"}</span>
                  </div>
                  {/* Rule rows */}
                  {isOpen && tblRules.map((r, i) => (
                    <div key={r.id} style={{ borderBottom: i<tblRules.length-1?`1px solid ${C.border}`:"none" }}>
                      <div
                        className="row-hover"
                        onClick={() => setExpandedRule(p => p===r.id ? null : r.id)}
                        style={{ display:"grid", gridTemplateColumns:"64px minmax(180px,1fr) 110px 100px 90px 90px 110px auto", gap:10, padding:"10px 16px", alignItems:"center", cursor:"pointer" }}
                      >
                        {/* ID */}
                        <div style={{ fontFamily:"monospace", fontSize:11, color:C.muted }}>{r.id}</div>
                        {/* Name */}
                        <div>
                          <div style={{ fontSize:12, fontWeight:600, color:C.text, display:"flex", alignItems:"center", gap:6 }}>
                            {r.name}
                            {r.aiGen && <span style={{ fontSize:9, background:`${C.purple}18`, color:C.purple, borderRadius:3, padding:"1px 5px", fontWeight:700 }}>AI</span>}
                          </div>
                          <div style={{ fontSize:10, color:C.muted, fontFamily:"monospace" }}>{r.column}</div>
                        </div>
                        {/* Type */}
                        <div style={{ fontSize:11, background:`${C.accent}12`, color:C.accentL, borderRadius:4, padding:"2px 7px", fontWeight:600, width:"fit-content" }}>{r.type}</div>
                        {/* Severity */}
                        <div style={{ fontSize:11, color:{critical:C.red,high:C.orange,medium:C.yellow,low:C.muted}[r.severity]||C.muted, fontWeight:600 }}>{r.severity}</div>
                        {/* Last Run */}
                        <div style={{ fontSize:10, color:C.muted }}>{r.lastRun}</div>
                        {/* Result */}
                        <div style={{ fontSize:11, color:r.lastResult==="pass"?C.green:r.lastResult==="fail"?C.red:C.muted, fontWeight:600 }}>
                          {r.lastResult==="pass"?"✓ pass":r.lastResult==="fail"?"✗ fail":"—"}
                        </div>
                        {/* Status toggle */}
                        <div onClick={e=>{e.stopPropagation();setRules(p=>p.map(x=>x.id===r.id?{...x,status:x.status==="active"?"paused":"active"}:x))}}
                          style={{ fontSize:10, background:r.status==="active"?`${C.green}15`:`${C.muted}15`, color:r.status==="active"?C.green:C.muted, borderRadius:4, padding:"2px 8px", cursor:"pointer", fontWeight:600 }}>
                          {r.status}
                        </div>
                        {/* Actions */}
                        <div style={{ display:"flex", gap:6, alignItems:"center" }} onClick={e=>e.stopPropagation()}>
                          <button onClick={()=>runRule(r)} style={{ fontSize:10, background:`${C.accent}15`, color:C.accentL, border:"none", borderRadius:5, padding:"3px 9px", cursor:"pointer", fontWeight:700 }}>▶ Run</button>
                          <button onClick={()=>setScheduleEdit(r.id)} style={{ fontSize:11, background:"none", border:"none", cursor:"pointer", color:C.muted }} title="Schedule">⏰</button>
                        </div>
                      </div>
                      {/* Expanded panel */}
                      {expandedRule===r.id && (
                        <div style={{ padding:"12px 16px 14px", background:C.isDark?"#0A0C1060":"#F8FAFC", borderTop:`1px solid ${C.border}` }}>
                          <div style={{ fontSize:11, color:C.muted, marginBottom:6, fontWeight:600 }}>SQL</div>
                          <pre style={{ fontSize:11, color:C.cyan, background:C.isDark?"#0A0C10":"#1E293B", borderRadius:6, padding:"10px 12px", overflowX:"auto", margin:0, fontFamily:"monospace", lineHeight:1.6 }}>{r.sql||"No SQL defined"}</pre>
                          {runningRules[r.id] && (
                            <div style={{ marginTop:10 }}>
                              <div style={{ fontSize:11, color:C.muted, marginBottom:6 }}>RESULTS — {runningRules[r.id].status==="running"?"running…":`${runningRules[r.id].count} rows`}</div>
                              {runningRules[r.id].rows?.length>0 && (
                                <div style={{ overflowX:"auto" }}>
                                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                                    <thead><tr>{Object.keys(runningRules[r.id].rows[0]).map(col=><th key={col} style={{ textAlign:"left", padding:"4px 8px", color:C.muted, borderBottom:`1px solid ${C.border}`, fontWeight:600 }}>{col}</th>)}</tr></thead>
                                    <tbody>{runningRules[r.id].rows.slice(0,50).map((row,ri)=><tr key={ri}>{Object.values(row).map((v,vi)=><td key={vi} style={{ padding:"4px 8px", color:C.text, borderBottom:`1px solid ${C.border}30` }}>{String(v)}</td>)}</tr>)}</tbody>
                                  </table>
                                </div>
                              )}
                              {!runningRules[r.id].rows?.length && runningRules[r.id].status!=="running" && <div style={{fontSize:11,color:C.green}}>✓ No issues found</div>}
                            </div>
                          )}
                          {!runningRules[r.id] && <div style={{fontSize:11,color:C.muted,marginTop:8}}>Click ▶ Run to scan against redshift-staging.</div>}
                        </div>
                      )}
                      {scheduleEdit===r.id && <SchedModal rule={r} T={C} CRON_PRESETS={CRON_PRESETS} setRules={setRules} onClose={()=>setScheduleEdit(null)} />}
                    </div>
                  ))}
                </Card>
              );
            })}
          </div>
        );
      })()}

      {/* ── Visual Builder ── */}
      {view==="builder" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <Card style={{ padding:"20px" }}>
            <SectionHeader icon={FlaskConical} title="Visual Rule Builder" subtitle="Define conditions with a form interface" />
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[["Rule Name", "name", "text", "e.g. Campaign ID not null"],
                ["Data Source", "source", "select-ds", ""],
                ["Table", "table", "text", "e.g. tbl_amzn_campaign_report"],
                ["Column", "column", "text", "e.g. profile_id  (use * for row count)"]
              ].map(([label, key, type, ph]) => (
                <div key={key}>
                  <div style={{ fontSize:10, color:C.muted, marginBottom:5, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" }}>{label}</div>
                  {type==="select-ds"
                    ? <select value={builder[key]} onChange={e=>setBuilder(p=>({...p,[key]:e.target.value}))} style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:7, padding:"8px 10px", color:C.text, fontSize:12, outline:"none" }}>
                        {DATASOURCES.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}
                      </select>
                    : <input value={builder[key]} onChange={e=>setBuilder(p=>({...p,[key]:e.target.value}))} placeholder={ph} style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:7, padding:"8px 10px", color:C.text, fontSize:12, outline:"none" }} />
                  }
                </div>
              ))}

              <div>
                <div style={{ fontSize:10, color:C.muted, marginBottom:8, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" }}>Rule Type</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                  {RULE_TYPES.map(t=>(
                    <button key={t.id} onClick={()=>setBuilder(p=>({...p,type:t.id}))} style={{ padding:"8px 10px", borderRadius:7, border:`1px solid ${builder.type===t.id?C.accent+"60":C.border2}`, background:builder.type===t.id?`${C.accent}15`:C.bg, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:14, width:18 }}>{t.icon}</span>
                      <div>
                        <div style={{ fontSize:11, fontWeight:700, color:builder.type===t.id?C.accentL:C.text }}>{t.label}</div>
                        <div style={{ fontSize:9, color:C.muted }}>{t.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div>
                  <div style={{ fontSize:10, color:C.muted, marginBottom:5, fontWeight:600, textTransform:"uppercase" }}>Severity</div>
                  <select value={builder.severity} onChange={e=>setBuilder(p=>({...p,severity:e.target.value}))} style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:7, padding:"8px 10px", color:C.text, fontSize:12, outline:"none" }}>
                    {["critical","high","medium","low"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:10, color:C.muted, marginBottom:5, fontWeight:600, textTransform:"uppercase" }}>Schedule (cron)</div>
                  <input value={builder.schedule} onChange={e=>setBuilder(p=>({...p,schedule:e.target.value}))} style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:7, padding:"8px 10px", color:C.text, fontSize:12, outline:"none", fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace" }} />
                </div>
              </div>

              <button onClick={submitBuilder} style={{ background:`${C.accent}`, border:"none", borderRadius:8, padding:"10px", cursor:"pointer", color:"white", fontSize:12, fontWeight:700, marginTop:4 }}>
                + Add Rule
              </button>
            </div>
          </Card>

          {/* Preview */}
          <Card style={{ padding:"20px" }}>
            <SectionHeader icon={Eye} title="Rule Preview" subtitle="SQL that will be executed" />
            <div style={{ background:C.bg, borderRadius:8, padding:"14px", fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace", fontSize:11, color:C.cyan, lineHeight:1.8, minHeight:180 }}>
              {builder.type==="not_null"      && `SELECT COUNT(*) as null_count\nFROM ${builder.table||"<table>"}\nWHERE ${builder.column||"<column>"} IS NULL;`}
              {builder.type==="row_count"     && `SELECT COUNT(*) as total_rows\nFROM ${builder.table||"<table>"}\nWHERE report_date = CURRENT_DATE;`}
              {builder.type==="freshness"     && `SELECT MAX(${builder.column||"updated_at"}) as latest\nFROM ${builder.table||"<table>"};\n-- Assert: latest > NOW() - INTERVAL '6 hours'`}
              {builder.type==="unique"        && `SELECT ${builder.column||"<column>"}, COUNT(*) as cnt\nFROM ${builder.table||"<table>"}\nGROUP BY ${builder.column||"<column>"}\nHAVING COUNT(*) > 1;`}
              {builder.type==="range"         && `SELECT COUNT(*) as out_of_range\nFROM ${builder.table||"<table>"}\nWHERE ${builder.column||"<column>"} NOT BETWEEN <min> AND <max>;`}
              {builder.type==="regex"         && `SELECT COUNT(*) as invalid\nFROM ${builder.table||"<table>"}\nWHERE ${builder.column||"<column>"} !~ '<pattern>';`}
              {builder.type==="ref_integrity" && `SELECT COUNT(*) as orphans\nFROM ${builder.table||"<table>"} a\nLEFT JOIN <ref_table> r ON a.${builder.column||"<col>"} = r.id\nWHERE r.id IS NULL;`}
              {builder.type==="custom_sql"    && `-- Write your assertion SQL\n-- Must return 0 rows to pass\nSELECT *\nFROM ${builder.table||"<table>"}\nWHERE <your condition>;`}
            </div>
            <div style={{ marginTop:14 }}>
              <div style={{ fontSize:10, color:C.muted, marginBottom:8, fontWeight:600 }}>RULE SUMMARY</div>
              {[["Name", builder.name||"—"], ["Type", RULE_TYPES.find(t=>t.id===builder.type)?.label||"—"], ["Source", builder.source], ["Table", builder.table||"—"], ["Column", builder.column||"—"], ["Severity", builder.severity], ["Schedule", builder.schedule]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:11, color:C.muted }}>{k}</span>
                  <span style={{ fontSize:11, color:C.text, fontFamily: k==="Schedule"?"monospace":"inherit" }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── NLP View ── */}
      {view==="nlp" && (
        <Card style={{ padding:"22px" }}>
          <SectionHeader icon={Wand2} title="Natural Language → Rule" subtitle="Describe a validation in plain English; AI generates the rule" />
          <div style={{ display:"flex", gap:10, marginBottom:16 }}>
            <input
              value={nlpInput}
              onChange={e=>setNlpInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter" && runNlpParse()}
              placeholder='e.g. "Ensure no null values in profile_id on the campaign report table in Redshift"'
              style={{ flex:1, background:C.bg, border:`1px solid ${C.border2}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:12, outline:"none" }}
            />
            <button onClick={runNlpParse} disabled={nlpLoading} style={{ background:C.accent, border:"none", borderRadius:8, padding:"10px 20px", cursor:"pointer", color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:8 }}>
              {nlpLoading ? <><RefreshCw size={13} style={{animation:"spin 1s linear infinite"}}/> Parsing…</> : <><Sparkles size={13}/> Generate</>}
            </button>
          </div>

          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
            {["no nulls in profile_id on campaign report", "keyword report must have unique rows per date", "account_performance row count must be within 20% of 7-day average", "report table must be updated within last 6 hours"].map(ex=>(
              <button key={ex} onClick={()=>setNlpInput(ex)} style={{ background:C.bg, border:`1px solid ${C.border2}`, borderRadius:20, padding:"4px 12px", cursor:"pointer", fontSize:10, color:C.muted }}>
                "{ex}"
              </button>
            ))}
          </div>

          {nlpResult && !nlpResult.error && (
            <div style={{ background:`${C.green}08`, border:`1px solid ${C.green}30`, borderRadius:10, padding:"18px 20px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <Sparkles size={14} color={C.green} />
                <span style={{ fontSize:13, fontWeight:700, color:C.green }}>Rule Generated</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                {[["Name", nlpResult.name], ["Type", nlpResult.type], ["Source", nlpResult.source], ["Table", nlpResult.table], ["Column", nlpResult.column], ["Severity", nlpResult.severity]].map(([k,v])=>(
                  <div key={k} style={{ background:C.card, borderRadius:7, padding:"8px 12px" }}>
                    <div style={{ fontSize:9, color:C.muted, marginBottom:3, textTransform:"uppercase", fontWeight:700 }}>{k}</div>
                    <div style={{ fontSize:12, color:C.text, fontWeight:600 }}>{v||"—"}</div>
                  </div>
                ))}
              </div>
              {nlpResult.sql_hint && (
                <div style={{ background:C.bg, borderRadius:8, padding:"10px 14px", fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace", fontSize:11, color:C.cyan, marginBottom:14 }}>
                  {nlpResult.sql_hint}
                </div>
              )}
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={acceptNlpRule} style={{ background:C.green, border:"none", borderRadius:8, padding:"9px 22px", cursor:"pointer", color:"white", fontSize:12, fontWeight:700 }}>
                  ✓ Accept & Add Rule
                </button>
                <button onClick={()=>setNlpResult(null)} style={{ background:C.bg, border:`1px solid ${C.border2}`, borderRadius:8, padding:"9px 18px", cursor:"pointer", color:C.muted, fontSize:12 }}>
                  Discard
                </button>
              </div>
            </div>
          )}
          {nlpResult?.error && (
            <div style={{ background:`${C.red}10`, border:`1px solid ${C.red}30`, borderRadius:8, padding:"12px 16px", fontSize:12, color:C.red }}>{nlpResult.error}</div>
          )}
        </Card>
      )}

      {/* ── Schema Scan View ── */}
      {view==="scan" && (
        <Card style={{ padding:"22px" }}>
          <SectionHeader icon={Database} title="Schema Scan → Auto-suggest Rules" subtitle="AI scans your datasource schema and proposes validation rules" />
          <div style={{ display:"flex", gap:10, marginBottom:20, alignItems:"center" }}>
            <select value={selectedDs} onChange={e=>setSelectedDs(e.target.value)} style={{ background:C.bg, border:`1px solid ${C.border2}`, borderRadius:8, padding:"9px 14px", color:C.text, fontSize:12, outline:"none" }}>
              {DATASOURCES.filter(d=>d.status!=="offline").map(d=><option key={d.id} value={d.name}>{d.name} ({d.type})</option>)}
            </select>
            <button onClick={runSchemaScan} disabled={scanLoading} style={{ background:C.accent, border:"none", borderRadius:8, padding:"9px 20px", cursor:"pointer", color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:8 }}>
              {scanLoading ? <><RefreshCw size={13} style={{animation:"spin 1s linear infinite"}}/> Scanning…</> : <><Database size={13}/> Run Scan</>}
            </button>
          </div>

          {/* Static AI suggestions (always visible) */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:10, fontWeight:600, letterSpacing:"0.06em" }}>AI-SUGGESTED (from prior scans)</div>
            {AI_SUGGESTED_RULES.map((r,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px", background:`${C.purple}08`, border:`1px solid ${C.purple}20`, borderRadius:8, marginBottom:8 }}>
                <div style={{ width:36, height:36, borderRadius:8, background:`${C.purple}20`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:13 }}>{typeIcon[r.type]||"?"}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{RULE_TYPES.find(t=>t.id===r.type)?.label} on <code style={{color:C.cyan,fontSize:11}}>{r.table}.{r.column}</code></div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{r.reason}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:r.confidence>90?C.green:r.confidence>80?C.yellow:C.orange }}>{r.confidence}%</div>
                  <div style={{ fontSize:9, color:C.muted }}>confidence</div>
                </div>
                <button onClick={()=>acceptScanRule({...r, name:`${RULE_TYPES.find(t=>t.id===r.type)?.label} on ${r.table}.${r.column}`})} style={{ background:`${C.green}18`, border:`1px solid ${C.green}40`, borderRadius:7, padding:"6px 12px", cursor:"pointer", fontSize:11, color:C.green, fontWeight:700 }}>
                  + Add
                </button>
              </div>
            ))}
          </div>

          {/* Live scan results */}
          {scanResults && (
            <div>
              <div style={{ fontSize:11, color:C.cyan, marginBottom:10, fontWeight:600, letterSpacing:"0.06em" }}>LIVE SCAN RESULTS — {selectedDs}</div>
              {scanResults.length === 0
                ? <div style={{ color:C.muted, fontSize:12 }}>No new suggestions from scan.</div>
                : scanResults.map((r,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px", background:`${C.cyan}06`, border:`1px solid ${C.cyan}20`, borderRadius:8, marginBottom:8 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{r.name}</div>
                        <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{r.reason}</div>
                      </div>
                      <SevBadge sev={r.severity} />
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <div style={{ fontSize:13, fontWeight:800, color:C.cyan }}>{r.confidence}%</div>
                        <div style={{ fontSize:9, color:C.muted }}>confidence</div>
                      </div>
                      <button onClick={()=>acceptScanRule(r)} style={{ background:`${C.green}18`, border:`1px solid ${C.green}40`, borderRadius:7, padding:"6px 12px", cursor:"pointer", fontSize:11, color:C.green, fontWeight:700 }}>+ Add</button>
                    </div>
                  ))
              }
            </div>
          )}
        </Card>
      )}
    </div>
    {scheduleEdit && rules.find(r=>r.id===scheduleEdit) && <SchedModal rule={rules.find(r=>r.id===scheduleEdit)} T={T} CRON_PRESETS={CRON_PRESETS} setRules={setRules} onClose={()=>setScheduleEdit(null)} />}
  </>
  );
}

// ─── Approval Gates Tab ───────────────────────────────────────────────────────
function ApprovalGatesTab() {
  const [gates, setGates]       = useState(INIT_GATES);
  const [pending, setPending]   = useState(PENDING_APPROVALS);
  const [view, setView]         = useState("gates");   // gates | config | pending
  const [editGate, setEditGate] = useState(null);
  const [testStatus, setTestStatus] = useState({});

  const toggleGate = (id) => setGates(p=>p.map(g=>g.id===id?{...g,status:g.status==="active"?"paused":"active"}:g));

  const testChannel = async (gateId, channel) => {
    setTestStatus(p=>({...p,[`${gateId}-${channel}`]:"sending"}));
    await new Promise(r=>setTimeout(r,1400));
    setTestStatus(p=>({...p,[`${gateId}-${channel}`]:"sent"}));
    setTimeout(()=>setTestStatus(p=>{const n={...p};delete n[`${gateId}-${channel}`];return n;}), 3000);
  };

  const approvePA = (id) => setPending(p=>p.filter(x=>x.id!==id));
  const rejectPA  = (id) => setPending(p=>p.filter(x=>x.id!==id));

  const typeColor = { approval:`${C.yellow}`, notify:C.cyan, gate:C.purple };
  const typeIcon  = { approval:"🔒", notify:"📢", gate:"⚙️" };

  const ChannelPill = ({ch}) => {
    const map = { slack:["#4A154B","#E01E5A",<Slack size={10}/>], email:["#1a3a5c","#60A5FA",<Mail size={10}/>] };
    const [bg,col,icon] = map[ch]||["#1E2330",C.muted,null];
    return <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:bg, color:col, border:`1px solid ${col}40`, borderRadius:12, padding:"2px 8px", fontSize:10, fontWeight:600 }}>{icon}{ch}</span>;
  };

  const GateForm = ({gate, onSave, onClose}) => {
    const [form, setForm] = useState(gate || { name:"", type:"approval", triggers:[], channels:["slack"], slackChannel:"", emailTo:"", approvers:[""], autoEscalate:30, status:"active" });
    const set = (k,v) => setForm(p=>({...p,[k]:v}));
    const toggleCh = (ch) => set("channels", form.channels.includes(ch)?form.channels.filter(c=>c!==ch):[...form.channels,ch]);
    return (
      <div style={{ position:"fixed", inset:0, background:"#000000BB", zIndex:60, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ background:C.card, border:`1px solid ${C.border2}`, borderRadius:14, padding:"28px", width:540, maxHeight:"85vh", overflowY:"auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Configure Gate</div>
            <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted }}><X size={16}/></button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {/* Name */}
            <div>
              <div style={{ fontSize:10, color:C.muted, marginBottom:5, textTransform:"uppercase", fontWeight:700 }}>Gate Name</div>
              <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Mage Pause Approval" style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:7, padding:"9px 12px", color:C.text, fontSize:12, outline:"none" }} />
            </div>
            {/* Type */}
            <div>
              <div style={{ fontSize:10, color:C.muted, marginBottom:8, textTransform:"uppercase", fontWeight:700 }}>Gate Type</div>
              <div style={{ display:"flex", gap:8 }}>
                {[["approval","🔒 Approval","Requires human approve/reject"],["notify","📢 Notify","Send alert, no action needed"],["gate","⚙️ Gate","Block pipeline until condition met"]].map(([id,label,desc])=>(
                  <button key={id} onClick={()=>set("type",id)} style={{ flex:1, padding:"10px 8px", borderRadius:8, border:`1px solid ${form.type===id?typeColor[id]+"60":C.border2}`, background:form.type===id?typeColor[id]+"15":C.bg, cursor:"pointer", textAlign:"center" }}>
                    <div style={{ fontSize:16, marginBottom:4 }}>{label.split(" ")[0]}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:form.type===id?typeColor[id]:C.text }}>{label.slice(2)}</div>
                    <div style={{ fontSize:9, color:C.muted, marginTop:2 }}>{desc}</div>
                  </button>
                ))}
              </div>
            </div>
            {/* Channels */}
            <div>
              <div style={{ fontSize:10, color:C.muted, marginBottom:8, textTransform:"uppercase", fontWeight:700 }}>Notification Channels</div>
              <div style={{ display:"flex", gap:8 }}>
                {["slack","email"].map(ch=>(
                  <button key={ch} onClick={()=>toggleCh(ch)} style={{ flex:1, padding:"10px", borderRadius:8, border:`1px solid ${form.channels.includes(ch)?(ch==="slack"?"#E01E5A":"#60A5FA"):C.border2}`, background:form.channels.includes(ch)?`${ch==="slack"?"#4A154B":"#1a3a5c"}`:C.bg, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                    {ch==="slack" ? <Slack size={14} color={form.channels.includes(ch)?"#E01E5A":C.muted}/> : <Mail size={14} color={form.channels.includes(ch)?"#60A5FA":C.muted}/>}
                    <span style={{ fontSize:12, fontWeight:600, color:form.channels.includes(ch)?C.text:C.muted, textTransform:"capitalize" }}>{ch}</span>
                    {form.channels.includes(ch) && <Check size={12} color={C.green}/>}
                  </button>
                ))}
              </div>
            </div>
            {/* Slack config */}
            {form.channels.includes("slack") && (
              <div>
                <div style={{ fontSize:10, color:C.muted, marginBottom:5, textTransform:"uppercase", fontWeight:700 }}>Slack Channel</div>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:C.muted, fontSize:13 }}>#</span>
                  <input value={form.slackChannel.replace("#","")} onChange={e=>set("slackChannel","#"+e.target.value.replace("#",""))} placeholder="dev-python-support" style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:7, padding:"9px 12px 9px 26px", color:C.text, fontSize:12, outline:"none" }} />
                </div>
                <div style={{ marginTop:8, padding:"10px 12px", background:`${C.border}50`, borderRadius:7 }}>
                  <div style={{ fontSize:10, color:C.muted, marginBottom:6, fontWeight:700 }}>SLACK BLOCK KIT PREVIEW</div>
                  <div style={{ background:"#1a1d24", borderRadius:6, padding:"10px 12px", borderLeft:"4px solid #E01E5A" }}>
                    <div style={{ fontSize:11, color:"#E01E5A", fontWeight:700 }}>🔒 Approval Required · {form.name||"Gate Name"}</div>
                    <div style={{ fontSize:11, color:"#94A3B8", marginTop:4 }}>Triggered by: <code style={{color:"#60A5FA",fontSize:10}}>Ops Agent</code></div>
                    <div style={{ display:"flex", gap:6, marginTop:8 }}>
                      <span style={{ background:"#0D7C3D", color:"white", borderRadius:4, padding:"3px 10px", fontSize:11, fontWeight:700 }}>✓ Approve</span>
                      <span style={{ background:"#8B0000", color:"white", borderRadius:4, padding:"3px 10px", fontSize:11, fontWeight:700 }}>✗ Reject</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Email config */}
            {form.channels.includes("email") && (
              <div>
                <div style={{ fontSize:10, color:C.muted, marginBottom:5, textTransform:"uppercase", fontWeight:700 }}>Email To</div>
                <div style={{ position:"relative" }}>
                  <AtSign size={13} color={C.muted} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }} />
                  <input value={form.emailTo} onChange={e=>set("emailTo",e.target.value)} placeholder="ops@intentwise.com" style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:7, padding:"9px 12px 9px 30px", color:C.text, fontSize:12, outline:"none" }} />
                </div>
                <div style={{ marginTop:8, padding:"10px 12px", background:`${C.border}50`, borderRadius:7 }}>
                  <div style={{ fontSize:10, color:C.muted, marginBottom:4, fontWeight:700 }}>EMAIL PREVIEW</div>
                  <div style={{ fontSize:11, color:C.text }}>Subject: <span style={{color:C.yellow}}>[Intentwise Ops] Action Required: {form.name||"Gate Name"}</span></div>
                  <div style={{ fontSize:10, color:C.muted, marginTop:3 }}>Body: Alert details + approve/reject link</div>
                  <div style={{ fontSize:10, color:C.muted }}>Reply-To: ops-noreply@intentwise.com</div>
                </div>
              </div>
            )}
            {/* Approvers */}
            {form.type==="approval" && (
              <div>
                <div style={{ fontSize:10, color:C.muted, marginBottom:5, textTransform:"uppercase", fontWeight:700 }}>Approvers</div>
                <input value={form.approvers.join(", ")} onChange={e=>set("approvers",e.target.value.split(",").map(s=>s.trim()))} placeholder="@Zubair, @Raghavendra" style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:7, padding:"9px 12px", color:C.text, fontSize:12, outline:"none" }} />
              </div>
            )}
            {/* Escalation */}
            <div>
              <div style={{ fontSize:10, color:C.muted, marginBottom:5, textTransform:"uppercase", fontWeight:700 }}>Auto-Escalate After (minutes, 0 = off)</div>
              <input type="number" value={form.autoEscalate} onChange={e=>set("autoEscalate",parseInt(e.target.value)||0)} style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:7, padding:"9px 12px", color:C.text, fontSize:12, outline:"none" }} />
            </div>
            <div style={{ display:"flex", gap:8, paddingTop:8 }}>
              <button onClick={()=>onSave(form)} style={{ flex:1, background:C.accent, border:"none", borderRadius:8, padding:"10px", cursor:"pointer", color:"white", fontSize:12, fontWeight:700 }}>Save Gate</button>
              <button onClick={onClose} style={{ background:C.bg, border:`1px solid ${C.border2}`, borderRadius:8, padding:"10px 20px", cursor:"pointer", color:C.muted, fontSize:12 }}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const saveGate = (form) => {
    if (form.id) { setGates(p=>p.map(g=>g.id===form.id?{...g,...form}:g)); }
    else { setGates(p=>[...p,{...form,id:`GT-${String(p.length+1).padStart(3,"0")}`,lastTriggered:"—",pendingCount:0}]); }
    setEditGate(null);
  };

  const Btn = ({active,onClick,children}) => (
    <button onClick={onClick} style={{ padding:"7px 14px", borderRadius:7, border:`1px solid ${active?C.accent+"60":C.border2}`, background:active?`${C.accent}18`:C.bg, color:active?C.accentL:C.muted, fontSize:11, fontWeight:active?700:500, cursor:"pointer" }}>
      {children}
    </button>
  );

  return (
    <div>
      {editGate !== null && <GateForm gate={editGate===true?null:editGate} onSave={saveGate} onClose={()=>setEditGate(null)} />}

      {/* Sub-nav */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div style={{ display:"flex", gap:6 }}>
          <Btn active={view==="gates"}   onClick={()=>setView("gates")}>⚙️ Gates ({gates.length})</Btn>
          <Btn active={view==="pending"} onClick={()=>setView("pending")}>
            🔔 Pending Approvals {pending.length>0 && <span style={{ background:C.red, color:"white", borderRadius:8, padding:"0 6px", fontSize:10, marginLeft:4 }}>{pending.length}</span>}
          </Btn>
          <Btn active={view==="config"}  onClick={()=>setView("config")}>🔗 Integration Config</Btn>
        </div>
        <button onClick={()=>setEditGate(true)} style={{ background:`${C.accent}20`, border:`1px solid ${C.accent}50`, borderRadius:8, padding:"7px 16px", cursor:"pointer", fontSize:11, color:C.accentL, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
          <Plus size={13}/> New Gate
        </button>
      </div>

      {/* ── Gates List ── */}
      {view==="gates" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {gates.map(g => (
            <Card key={g.id} style={{ padding:"16px 20px" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:`${typeColor[g.type]}18`, border:`1px solid ${typeColor[g.type]}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                    {typeIcon[g.type]}
                  </div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{g.name}</span>
                      <span style={{ fontSize:9, color:typeColor[g.type], background:`${typeColor[g.type]}15`, border:`1px solid ${typeColor[g.type]}30`, borderRadius:4, padding:"1px 7px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>{g.type}</span>
                      <span style={{ fontSize:9, color:C.muted, fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace" }}>{g.id}</span>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                      {g.channels.map(ch=><ChannelPill key={ch} ch={ch}/>)}
                      {g.approvers.map(a=><span key={a} style={{ fontSize:10, color:C.accentL, background:`${C.accent}15`, border:`1px solid ${C.accent}30`, borderRadius:10, padding:"2px 8px" }}>{a}</span>)}
                    </div>
                    <div style={{ display:"flex", gap:16, fontSize:10, color:C.muted }}>
                      <span>Triggers: {g.triggers.join(", ")}</span>
                      <span>Last fired: {g.lastTriggered}</span>
                      {g.autoEscalate>0 && <span>Escalate after {g.autoEscalate}m</span>}
                    </div>
                    {g.slackChannel && <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>Slack: <code style={{color:"#E01E5A",fontSize:10}}>{g.slackChannel}</code></div>}
                    {g.emailTo && <div style={{ fontSize:10, color:C.muted }}>Email: <code style={{color:"#60A5FA",fontSize:10}}>{g.emailTo}</code></div>}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                  {g.pendingCount > 0 && (
                    <div style={{ background:`${C.yellow}20`, border:`1px solid ${C.yellow}50`, borderRadius:6, padding:"3px 10px", fontSize:11, color:C.yellow, fontWeight:700 }}>
                      {g.pendingCount} pending
                    </div>
                  )}
                  <div style={{ display:"flex", gap:6 }}>
                    {g.channels.map(ch=>(
                      <button key={ch} onClick={()=>testChannel(g.id,ch)} style={{ background:C.bg, border:`1px solid ${C.border2}`, borderRadius:6, padding:"5px 10px", cursor:"pointer", fontSize:10, color: testStatus[`${g.id}-${ch}`]==="sent"?C.green:testStatus[`${g.id}-${ch}`]==="sending"?C.yellow:C.muted, display:"flex", alignItems:"center", gap:5 }}>
                        {testStatus[`${g.id}-${ch}`]==="sending" ? <RefreshCw size={10} style={{animation:"spin 1s linear infinite"}}/> : testStatus[`${g.id}-${ch}`]==="sent" ? <Check size={10}/> : <Send size={10}/>}
                        Test {ch}
                      </button>
                    ))}
                    <button onClick={()=>setEditGate(g)} style={{ background:C.bg, border:`1px solid ${C.border2}`, borderRadius:6, padding:"5px 10px", cursor:"pointer", fontSize:10, color:C.muted }}>Edit</button>
                    <button onClick={()=>toggleGate(g.id)} style={{ background:g.status==="active"?`${C.green}15`:`${C.orange}15`, border:`1px solid ${g.status==="active"?C.green:C.orange}40`, borderRadius:6, padding:"5px 10px", cursor:"pointer", fontSize:10, color:g.status==="active"?C.green:C.orange, fontWeight:700 }}>
                      {g.status==="active"?"Active":"Paused"}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Pending Approvals ── */}
      {view==="pending" && (
        <div>
          {pending.length===0 ? (
            <Card style={{ padding:"40px", textAlign:"center" }}>
              <CheckCircle size={32} color={C.green} style={{ margin:"0 auto 12px" }}/>
              <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:6 }}>All clear</div>
              <div style={{ fontSize:12, color:C.muted }}>No pending approvals right now.</div>
            </Card>
          ) : pending.map(pa=>(
            <Card key={pa.id} style={{ padding:"20px", marginBottom:12, border:`1px solid ${SEVERITY[pa.severity]}40` }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:`${SEVERITY[pa.severity]}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Lock size={18} color={SEVERITY[pa.severity]}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{pa.title}</span>
                    <SevBadge sev={pa.severity}/>
                    <span style={{ fontSize:10, color:C.muted, fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace" }}>{pa.id}</span>
                  </div>
                  <div style={{ fontSize:12, color:C.muted, lineHeight:1.6, marginBottom:10 }}>{pa.desc}</div>
                  <div style={{ fontSize:10, color:C.dim }}>Requested by <span style={{color:C.accentL}}>{pa.requestedBy}</span> at {pa.requestedAt} · Gate: <span style={{color:C.yellow}}>{pa.gate}</span> · Alert: <span style={{color:C.cyan}}>{pa.alert}</span></div>
                </div>
                <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                  <button onClick={()=>approvePA(pa.id)} style={{ background:`${C.green}20`, border:`1px solid ${C.green}50`, borderRadius:8, padding:"9px 20px", cursor:"pointer", fontSize:12, color:C.green, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
                    <Check size={13}/> Approve
                  </button>
                  <button onClick={()=>rejectPA(pa.id)} style={{ background:`${C.red}15`, border:`1px solid ${C.red}40`, borderRadius:8, padding:"9px 20px", cursor:"pointer", fontSize:12, color:C.red, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
                    <X size={13}/> Reject
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Integration Config ── */}
      {view==="config" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {/* Slack */}
          <Card style={{ padding:"20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:"#4A154B", display:"flex", alignItems:"center", justifyContent:"center" }}><Slack size={16} color="#E01E5A"/></div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Slack Integration</div>
                <div style={{ fontSize:10, color:C.green }}>● Connected · Bolt SDK</div>
              </div>
            </div>
            {[["Bot Token", "xoxb-••••••••••••", false],["Signing Secret", "••••••••••••••••", false],["Default Channel", "#dev-python-support", true],["Webhook URL", "https://hooks.slack.com/…", true]].map(([k,v,editable])=>(
              <div key={k} style={{ marginBottom:10 }}>
                <div style={{ fontSize:10, color:C.muted, marginBottom:4, fontWeight:600, textTransform:"uppercase" }}>{k}</div>
                <div style={{ background:C.bg, border:`1px solid ${C.border2}`, borderRadius:7, padding:"8px 12px", fontSize:11, color:editable?C.text:C.dim, fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span>{v}</span>
                  {editable && <Copy size={11} color={C.muted} style={{cursor:"pointer"}}/>}
                </div>
              </div>
            ))}
            <div style={{ marginTop:12, padding:"10px 12px", background:`${C.green}10`, border:`1px solid ${C.green}30`, borderRadius:8 }}>
              <div style={{ fontSize:10, color:C.green, fontWeight:700, marginBottom:4 }}>INTERACTIVE BUTTONS</div>
              <div style={{ fontSize:11, color:C.muted }}>Approve/Reject buttons wired via Block Kit. Responses posted back to source channel.</div>
            </div>
          </Card>

          {/* Email */}
          <Card style={{ padding:"20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:"#1a3a5c", display:"flex", alignItems:"center", justifyContent:"center" }}><Mail size={16} color="#60A5FA"/></div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Email · SendGrid</div>
                <div style={{ fontSize:10, color:C.yellow }}>● Configured · Verify DNS</div>
              </div>
            </div>
            {[["API Key", "SG.••••••••••••", false],["From Address", "ops-noreply@intentwise.com", true],["Reply-To", "ops@intentwise.com", true],["SMTP Host", "smtp.sendgrid.net:587", false]].map(([k,v,editable])=>(
              <div key={k} style={{ marginBottom:10 }}>
                <div style={{ fontSize:10, color:C.muted, marginBottom:4, fontWeight:600, textTransform:"uppercase" }}>{k}</div>
                <div style={{ background:C.bg, border:`1px solid ${C.border2}`, borderRadius:7, padding:"8px 12px", fontSize:11, color:editable?C.text:C.dim, fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span>{v}</span>
                  {editable && <Copy size={11} color={C.muted} style={{cursor:"pointer"}}/>}
                </div>
              </div>
            ))}
            <div style={{ marginTop:12, padding:"10px 12px", background:`${C.yellow}10`, border:`1px solid ${C.yellow}30`, borderRadius:8 }}>
              <div style={{ fontSize:10, color:C.yellow, fontWeight:700, marginBottom:4 }}>APPROVAL LINK</div>
              <div style={{ fontSize:11, color:C.muted }}>Email contains signed approve/reject URL. Valid for 2 hours. One-click from inbox.</div>
            </div>
          </Card>

          {/* Webhook */}
          <Card style={{ padding:"20px", gridColumn:"1/-1" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:`${C.purple}20`, display:"flex", alignItems:"center", justifyContent:"center" }}><Webhook size={16} color={C.purple}/></div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Inbound Webhooks</div>
                <div style={{ fontSize:10, color:C.muted }}>Receive approve/reject callbacks from external systems</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {[
                { method:"POST", path:"/webhooks/approve/{gate_id}", desc:"Approve a gate programmatically", color:C.green },
                { method:"POST", path:"/webhooks/reject/{gate_id}",  desc:"Reject a gate programmatically", color:C.red },
                { method:"POST", path:"/webhooks/slack/interactive",  desc:"Slack Block Kit button handler",  color:"#E01E5A" },
              ].map(w=>(
                <div key={w.path} style={{ background:C.bg, border:`1px solid ${C.border2}`, borderRadius:8, padding:"12px 14px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                    <span style={{ fontSize:9, background:`${w.color}20`, color:w.color, border:`1px solid ${w.color}40`, borderRadius:4, padding:"2px 7px", fontWeight:700 }}>{w.method}</span>
                  </div>
                  <code style={{ fontSize:10, color:C.cyan, display:"block", marginBottom:5 }}>{w.path}</code>
                  <div style={{ fontSize:10, color:C.muted }}>{w.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:12, background:C.bg, borderRadius:8, padding:"12px 14px" }}>
              <div style={{ fontSize:10, color:C.muted, marginBottom:6, fontWeight:700 }}>PAYLOAD EXAMPLE</div>
              <code style={{ fontSize:10, color:C.cyan, lineHeight:1.8 }}>
                {"{"} "gate_id": "GT-002", "decision": "approve", "approver": "zubair@intentwise.com", "token": "••••" {"}"}
              </code>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}


// ─── Theme Context ────────────────────────────────────────────────────────────
const ThemeCtx = React.createContext(DARK_THEME);
const useTheme = () => React.useContext(ThemeCtx);

// ─── Command Center Tab ───────────────────────────────────────────────────────
function CommandCenterTab({ onNavigate, kpis, kpisLoading, trend, topAsins, accountId, agentScanResult, agentScanLoading, onAgentScan, alertsState, dataMode }) {
  const T = useTheme();
  const C = T;
  const liveKpiTiles = kpis ? [
    { label:"mws.orders",          value: kpis.orders.total.toLocaleString(),                                                   sub:`${kpis.orders.shipped} shipped · ${kpis.orders.pending} pending`,  color:C.accent  },
    { label:"Revenue",             value:`$${kpis.sales.total_sales.toLocaleString(undefined,{maximumFractionDigits:0})}`,      sub:`${kpis.sales.units.toLocaleString()} units ordered`,               color:C.green   },
    { label:"Buy Box %",           value:`${(kpis.sales.buy_box_pct*100).toFixed(1)}%`,                                         sub:"avg · mws.sales_and_traffic_by_asin",                              color:C.cyan    },
    { label:"Inventory Alerts",    value: kpis.inventory.alerts.toLocaleString(),                                               sub:`${kpis.inventory.out_of_stock} OOS · mws.inventory`,               color: kpis.inventory.alerts>0 ? C.orange : C.green },
    { label:"Sessions (30d)",      value: kpis.sales.sessions.toLocaleString(),                                                 sub:"mws.sales_and_traffic_by_date",                                    color:C.purple  },
    { label:"Refund Rate",         value: kpis.sales.refund_rate != null ? `${(kpis.sales.refund_rate*100).toFixed(1)}%` : "—", sub:"mws.sales_and_traffic_by_date",                                    color: (kpis.sales.refund_rate||0)>0.05 ? C.red : C.green },
  ] : null;
    const liveAlerts = alertsState || [];
  const critCount  = liveAlerts.filter(a=>a.severity==="critical"&&a.status!=="resolved").length;
  const openCount  = liveAlerts.filter(a=>a.status==="open").length;
  const runningAg  = AGENTS.filter(a=>a.status==="running").length;
  const pendingGt  = PENDING_APPROVALS.length;
  const healthyDs  = DATASOURCES.filter(d=>d.status==="healthy").length;
  const failRules  = INIT_RULES.filter(r=>r.lastResult==="fail").length;
  const [now, setNow] = useState(new Date());
  useEffect(()=>{ const t=setInterval(()=>setNow(new Date()),1000); return()=>clearInterval(t); },[]);

  const timeStr = now.toLocaleTimeString("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const dateStr = now.toLocaleDateString("en-IN",{timeZone:"Asia/Kolkata",weekday:"long",month:"short",day:"numeric"});

  // Stage autonomy summary from QA_STAGES
  const overallAuto = Math.round(
    QA_STAGES.reduce((s,st)=>s+st.aiActions,0) /
    QA_STAGES.reduce((s,st)=>s+st.aiActions+st.humanActions,0) * 100
  );

  const metricGrid = [
    { label:"Critical Alerts",   value:critCount,                  color:critCount>0?T.red:T.green,    icon:"🔴", sub: alertsState?.length > 0 ? "from mws scan" : "need immediate action", tab:"alerts" },
    { label:"Open Issues",       value:openCount,                  color:T.orange,                     icon:"🔔", sub: alertsState?.length > 0 ? "detected in Redshift" : "AI-triaged queue", tab:"alerts" },
    { label:"QA Agents Active",  value:runningAg,                  color:T.green,                      icon:"🤖", sub:`of ${AGENTS.length} total`, tab:"agents" },
    { label:"Pending Approvals", value:pendingGt,                  color:pendingGt>0?T.yellow:T.green, icon:"🔒", sub:"awaiting human review",    tab:"gates" },
    { label:"Healthy Sources",   value:`${healthyDs}/${DATASOURCES.length}`, color:healthyDs===DATASOURCES.length?T.green:T.yellow, icon:"🗄️", sub:"pipeline coverage", tab:"sources" },
    { label:"Rules Failing",     value:failRules,                  color:failRules>0?T.red:T.green,    icon:"✓",  sub:"of "+INIT_RULES.length+" total", tab:"rules" },
  ];

  return (
    <div style={{ paddingBottom:24 }}>

      {/* ── Header strip: IST clock + autonomy score ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, padding:"16px 22px", background:T.isDark?`${T.accent}10`:`${T.accent}06`, border:`1px solid ${T.accent}28`, borderRadius:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:46, height:46, borderRadius:13, background:`${T.accent}22`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <LayoutDashboard size={21} color={T.accentL}/>
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:T.text }}>Ops Command Center</div>
            <div style={{ fontSize:11, color:T.muted, marginTop:3 }}>{dateStr} · IST · Agentic QA Platform</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:28 }}>
          {/* Overall autonomy pill */}
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:T.muted, marginBottom:3, fontWeight:600 }}>Overall Autonomy</div>
            <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
              <span style={{ fontSize:32, fontWeight:900, color:T.green, lineHeight:1 }}>{overallAuto}%</span>
              <span style={{ fontSize:11, color:T.green }}>AI-driven</span>
            </div>
          </div>
          {/* IST clock */}
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:30, fontWeight:800, color:T.accent, letterSpacing:"0.04em", fontFamily:"Consolas,monospace" }}>{timeStr}</div>
            <div style={{ fontSize:10, color:T.muted }}>India Standard Time</div>
          </div>
        </div>
      </div>

      {/* ── 6-metric grid (clickable → tab) ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
        {(liveKpiTiles || metricGrid).map(m=>(
          <div key={m.label} onClick={()=>!liveKpiTiles && onNavigate&&onNavigate(m.tab)} style={{ background:T.card, border:`1px solid ${m.color}30`, borderRadius:12, padding:"18px 20px", display:"flex", alignItems:"center", gap:14, cursor: liveKpiTiles?"default":"pointer", transition:"border-color 0.15s", borderLeft:`3px solid ${m.color}` }} className="row-hover">
            <div style={{ fontSize:30 }}>{m.icon||"📊"}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:32, fontWeight:900, color:m.color, lineHeight:1 }}>{kpisLoading ? "…" : m.value}</div>
              <div style={{ fontSize:12, fontWeight:700, color:T.text, marginTop:5 }}>{m.label}</div>
              <div style={{ fontSize:10, color:T.muted, marginTop:2 }}>{m.sub}</div>
            </div>
            <ArrowRight size={14} color={T.dim}/>
          </div>
        ))}
      </div>

      {/* ── Pipeline autonomy mini-bars ── */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px 20px", marginBottom:18 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.text, display:"flex", alignItems:"center", gap:8 }}>
            <Activity size={14} color={T.accentL}/> QA Pipeline — Autonomy Snapshot
          </div>
          <button onClick={()=>onNavigate&&onNavigate("qahealth")} style={{ background:`${T.accent}15`, border:`1px solid ${T.accent}40`, borderRadius:6, padding:"4px 12px", cursor:"pointer", fontSize:10, color:T.accentL, fontWeight:700, display:"flex", alignItems:"center", gap:5 }}>
            Full Report <ArrowRight size={10}/>
          </button>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          {QA_STAGES.map((st,i)=>(
            <React.Fragment key={st.id}>
              <div style={{ flex:1, textAlign:"center" }}>
                <div style={{ fontSize:18, marginBottom:4 }}>{st.icon}</div>
                <div style={{ height:6, background:T.border, borderRadius:3, marginBottom:5, overflow:"hidden" }}>
                  <div style={{ height:6, borderRadius:3, width:`${st.autonomyPct}%`, background:st.color }}/>
                </div>
                <div style={{ fontSize:11, fontWeight:800, color:st.color }}>{st.autonomyPct}%</div>
                <div style={{ fontSize:9, color:T.muted }}>{st.label}</div>
              </div>
              {i<QA_STAGES.length-1 && <div style={{ display:"flex", alignItems:"center", paddingTop:6 }}><ArrowRight size={12} color={T.dim}/></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── 4-panel grid ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

        {/* Top alerts */}
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px 18px" }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ display:"flex", alignItems:"center", gap:8 }}><Bell size={13} color={T.red}/> Top Detected Issues</span>
            <button onClick={()=>onNavigate&&onNavigate("alerts")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:10, color:T.accentL, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>All <ArrowRight size={10}/></button>
          </div>
          {liveAlerts.filter(a=>a.status==="open").slice(0,5).map(a=>{
            const sc={critical:T.red,high:T.orange,medium:T.yellow,low:T.cyan}[a.severity]||T.muted;
            return(
              <div key={a.id} className="row-hover" onClick={()=>window._drillFn&&window._drillFn("alert",a)} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 6px", borderRadius:6, cursor:"pointer" }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:sc, flexShrink:0, animation:a.severity==="critical"?"ping 2s infinite":"none" }}/>
                <span style={{ fontSize:11, color:T.text, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.title}</span>
                <span style={{ fontSize:9, color:sc, fontWeight:700, textTransform:"uppercase", flexShrink:0 }}>{a.severity}</span>
                <span style={{ fontSize:9, color:T.dim, flexShrink:0 }}>{a.ts}</span>
              </div>
            );
          })}
        </div>

        {/* Agent fleet */}
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px 18px" }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ display:"flex", alignItems:"center", gap:8 }}><Bot size={13} color={T.green}/> QA Agent Fleet</span>
            <button onClick={()=>onNavigate&&onNavigate("agents")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:10, color:T.accentL, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>Manage <ArrowRight size={10}/></button>
          </div>
          {AGENTS.map(a=>{
            const sc={running:T.green,idle:T.muted,paused:T.orange}[a.status]||T.muted;
            return(
              <div key={a.id} className="row-hover" style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 6px", borderRadius:6, cursor:"pointer" }}>
                <span style={{ fontSize:14 }}>{a.icon}</span>
                <span style={{ fontSize:11, color:T.text, flex:1 }}>{a.name}</span>
                <div style={{ height:4, width:48, background:T.border, borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:4, borderRadius:2, width:`${a.successRate}%`, background:a.successRate>=90?T.green:a.successRate>=70?T.yellow:T.red }}/>
                </div>
                <span style={{ fontSize:9, color:sc, fontWeight:700, textTransform:"uppercase", width:48, textAlign:"right" }}>{a.status}</span>
              </div>
            );
          })}
        </div>

        {/* Datasource health */}
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px 18px" }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ display:"flex", alignItems:"center", gap:8 }}><Database size={13} color={T.cyan}/> Data Source Health</span>
            <button onClick={()=>onNavigate&&onNavigate("sources")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:10, color:T.accentL, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>Details <ArrowRight size={10}/></button>
          </div>
          {DATASOURCES.map(ds=>{
            const sc={healthy:T.green,degraded:T.yellow,offline:T.red}[ds.status]||T.muted;
            return(
              <div key={ds.id} className="row-hover" style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 6px", borderRadius:6, cursor:"pointer" }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:sc, flexShrink:0 }}/>
                <span style={{ fontSize:11, color:T.text, flex:1 }}>{ds.name}</span>
                <span style={{ fontSize:10, color:T.muted }}>{ds.type}</span>
                <span style={{ fontSize:10, color:ds.latency&&ds.latency>200?T.yellow:T.green, fontFamily:"Consolas,monospace" }}>{ds.latency?`${ds.latency}ms`:"—"}</span>
                <span style={{ fontSize:9, color:sc, fontWeight:700, textTransform:"uppercase" }}>{ds.status}</span>
              </div>
            );
          })}
        </div>

        {/* Roadmap progress + pending approvals */}
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px 18px" }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ display:"flex", alignItems:"center", gap:8 }}><Rocket size={13} color={T.purple}/> Agentic QE Roadmap</span>
            <button onClick={()=>onNavigate&&onNavigate("qahealth")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:10, color:T.accentL, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>Full view <ArrowRight size={10}/></button>
          </div>
          {ROADMAP_MILESTONES.map(m=>{
            const mc={done:T.green,active:T.accent,planned:T.dim}[m.status];
            return(
              <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ width:14, height:14, borderRadius:"50%", background:m.status==="done"?mc:T.card, border:`2px solid ${mc}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {m.status==="done"&&<Check size={8} color={mc}/>}
                  {m.status==="active"&&<div style={{ width:5, height:5, borderRadius:"50%", background:mc, animation:"ping 2s infinite" }}/>}
                </div>
                <span style={{ fontSize:11, color:m.status==="planned"?T.dim:T.text, flex:1 }}>{m.label}</span>
                {m.status==="active" && (
                  <div style={{ width:52, height:4, background:T.border, borderRadius:2, overflow:"hidden" }}>
                    <div style={{ height:4, borderRadius:2, width:`${m.pct}%`, background:mc }}/>
                  </div>
                )}
                <span style={{ fontSize:9, color:mc, fontWeight:700, textTransform:"uppercase", flexShrink:0 }}>{m.status==="done"?"done":m.status==="active"?`${m.pct}%`:"planned"}</span>
              </div>
            );
          })}

          {/* Pending approvals inline */}
          {pendingGt>0 && (
            <div style={{ marginTop:12, padding:"10px 12px", background:`${T.yellow}10`, border:`1px solid ${T.yellow}30`, borderRadius:8 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.yellow, marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>
                <Lock size={11}/> {pendingGt} Pending Approval{pendingGt>1?"s":""}
              </div>
              {PENDING_APPROVALS.slice(0,2).map(p=>(
                <div key={p.id} style={{ fontSize:11, color:T.text, marginBottom:6 }}>
                  <div style={{ marginBottom:4 }}>{p.title}</div>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={()=>onNavigate&&onNavigate("gates")} style={{ background:`${T.green}20`, border:`1px solid ${T.green}40`, borderRadius:6, padding:"3px 12px", cursor:"pointer", fontSize:10, color:T.green, fontWeight:700 }}>Review</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Run History Tab ──────────────────────────────────────────────────────────
function RunHistoryTab({ auditLog }) {
  const T = useTheme();
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");
  const [expanded, setExpanded] = useState(null);

  const log = auditLog || [];

  const rows = log.filter(r => {
    if (filter !== "all" && r.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.name?.toLowerCase().includes(q) && !(r.table||"").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const typeColor = { rule:T.purple, agent:T.green, workflow:T.accent, gate:T.yellow, alert:T.orange };
  const typeIcon  = { rule:"✓", agent:"🤖", workflow:"⚡", gate:"🔒", alert:"🚨" };
  const resultColor = { pass:T.green, fail:T.red, pending:T.yellow, error:T.orange };

  const stats = [
    ["Total Events", log.length,                                            T.text],
    ["Passed",       log.filter(r => r.result==="pass").length,    T.green],
    ["Failed",       log.filter(r => r.result==="fail").length,    T.red],
    ["Pending",      log.filter(r => r.result==="pending").length, T.yellow],
  ];

  const COLS = "64px 96px minmax(200px,1fr) 130px 100px 70px 76px 24px";

  return (
    <div>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:18 }}>
        {stats.map(([l,v,c]) => (
          <div key={l} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:"14px 18px" }}>
            <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
            <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display:"flex", gap:8, marginBottom:14, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1, maxWidth:260 }}>
          <Search size={12} color={T.dim} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events…"
            style={{ width:"100%", background:T.bg, border:`1px solid ${T.border2}`, borderRadius:7, padding:"7px 10px 7px 28px", color:T.text, fontSize:11, outline:"none" }}/>
        </div>
        {["all","rule","agent","alert","workflow","gate"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:"6px 12px", borderRadius:6, cursor:"pointer", fontSize:10, fontWeight:700, textTransform:"uppercase",
              border:`1px solid ${filter===f ? (typeColor[f]||T.accent)+"60" : T.border2}`,
              background: filter===f ? `${typeColor[f]||T.accent}15` : T.bg,
              color: filter===f ? typeColor[f]||T.accentL : T.muted }}>
            {f==="all" ? "All" : f}
          </button>
        ))}
        {log.length > 0 && (
          <span style={{ fontSize:10, color:T.muted, marginLeft:"auto" }}>{rows.length} of {log.length} events</span>
        )}
      </div>

      {/* Table */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:COLS, gap:12, padding:"10px 18px",
          background:T.isDark?"#0A0C10":T.border, borderBottom:`1px solid ${T.border}` }}>
          {["ID","Type","Name / Table","Source","Time","Dur","Result",""].map(h => (
            <div key={h} style={{ fontSize:10, color:T.dim, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</div>
          ))}
        </div>

        {rows.length === 0 && (
          <div style={{ padding:"40px 18px", textAlign:"center", color:T.muted, fontSize:12 }}>
            {log.length === 0
              ? "No events yet — run an agent scan, quality rule, or triage an alert to see events here."
              : "No events match the current filter."}
          </div>
        )}

        {rows.map(r => (
          <div key={r.id}>
            <div onClick={() => setExpanded(expanded===r.id ? null : r.id)} className="row-hover"
              style={{ display:"grid", gridTemplateColumns:COLS, gap:12, padding:"11px 18px",
                borderBottom:`1px solid ${T.border}`, cursor:"pointer",
                background: expanded===r.id ? `${T.accent}08` : "transparent" }}>
              <div style={{ fontSize:10, color:T.muted, fontFamily:"monospace", overflow:"hidden", textOverflow:"ellipsis" }}>{r.id}</div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:11 }}>{typeIcon[r.type] || "•"}</span>
                <span style={{ fontSize:9, color:typeColor[r.type]||T.muted,
                  background:`${typeColor[r.type]||T.muted}15`,
                  border:`1px solid ${typeColor[r.type]||T.muted}30`,
                  borderRadius:4, padding:"1px 5px", fontWeight:700, textTransform:"uppercase" }}>
                  {r.type}
                </span>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.name}</div>
                {r.table && r.table!=="—" && (
                  <div style={{ fontSize:9, color:T.muted, fontFamily:"monospace" }}>{r.table}</div>
                )}
              </div>
              <div style={{ fontSize:10, color:T.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.source || "—"}</div>
              <div style={{ fontSize:10, color:T.muted }}>{r.ts || "—"}</div>
              <div style={{ fontSize:10, color:T.muted, fontFamily:"monospace" }}>{r.duration || "—"}</div>
              <div style={{ fontSize:11, fontWeight:700, color:resultColor[r.result]||T.muted, textTransform:"uppercase" }}>{r.result || "—"}</div>
              <div style={{ color:T.dim }}>
                {expanded===r.id ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
              </div>
            </div>
            {expanded===r.id && (
              <div style={{ padding:"12px 18px 16px 88px", background:T.isDark?`${T.border}30`:`${T.border}60`, borderBottom:`1px solid ${T.border}` }}>
                <div style={{ fontSize:10, color:T.muted, marginBottom:6, fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase" }}>Event Detail</div>
                <div style={{ fontSize:12, color:T.text, lineHeight:1.8 }}>{r.detail || "No detail available."}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── Rule Test Runner Tab ─────────────────────────────────────────────────────
function RuleTestRunnerTab() {
  const T = useTheme();
  const [selectedRule, setSelectedRule] = useState(INIT_RULES[0]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [aiExplain, setAiExplain] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const runTest = async () => {
    setRunning(true); setResult(null); setAiExplain("");
    await new Promise(r=>setTimeout(r,1200));
    const sample = RULE_TEST_SAMPLES[selectedRule.type];
    let res;
    if(selectedRule.type==="not_null"){
      const nullRows = sample.rows.filter(r=>r[sample.cols[0]]===null);
      res = { pass:nullRows.length===0, summary:`Found ${nullRows.length} NULL value(s) in ${selectedRule.column}`, rows:sample.rows, nullCount:nullRows.length };
    } else if(selectedRule.type==="row_count"){
      const m=sample.meta;
      res = { pass:m.today>=m.threshold, summary:`Today: ${m.today.toLocaleString()} rows | 7-day avg: ${m.avg7d.toLocaleString()} | Threshold: ${m.threshold.toLocaleString()}`, meta:m };
    } else if(selectedRule.type==="freshness"){
      const m=sample.meta;
      res = { pass:m.ageHours<=m.thresholdHours, summary:`Last update ${m.ageHours}h ago. Threshold: ${m.thresholdHours}h. Last timestamp: ${m.lastUpdate}`, meta:m };
    } else if(selectedRule.type==="unique"){
      const dupes=sample.dupes;
      res = { pass:dupes.length===0, summary:`${dupes.length} duplicate group(s) found on (${selectedRule.column})`, dupes };
    } else {
      res = { pass:Math.random()>0.4, summary:"Custom rule executed. See details below." };
    }
    setResult(res);
    setRunning(false);
    // Auto-explain failures
    if(!res.pass) await explainFailure(res);
  };

  const explainFailure = async (res) => {
    setAiLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/api/ai/chat`,{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ max_tokens:400,
          system:"You are a data quality AI for Intentwise. Given a failed validation rule test, explain what the failure means in plain English, its likely root cause, and a concise recommended fix. Be specific and actionable. 2-3 sentences max.",
          messages:[{role:"user",content:`Rule: ${selectedRule.name} (${selectedRule.type}) on ${selectedRule.table}.${selectedRule.column}. Result: ${res.summary}. Explain the failure and recommend a fix.`}]
        })
      });
      const data = await resp.json();
      setAiExplain(data.content?.find(b=>b.type==="text")?.text || "");
    } catch(e){ setAiExplain(`❌ Error: ${e.message}`); }
    setAiLoading(false);
  };

  return(
    <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:16, height:"calc(100vh - 200px)", minHeight:500 }}>
      {/* Rule selector */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, fontSize:11, fontWeight:700, color:T.text }}>Select Rule to Test</div>
        <div style={{ flex:1, overflowY:"auto" }}>
          {INIT_RULES.map(r=>(
            <div key={r.id} onClick={()=>{setSelectedRule(r);setResult(null);setAiExplain("");}} style={{ padding:"10px 14px", borderBottom:`1px solid ${T.border}`, cursor:"pointer", background:selectedRule.id===r.id?`${T.accent}12`:"transparent", borderLeft:`3px solid ${selectedRule.id===r.id?T.accent:"transparent"}` }}>
              <div style={{ fontSize:11, fontWeight:selectedRule.id===r.id?700:500, color:selectedRule.id===r.id?T.text:T.muted }}>{r.name}</div>
              <div style={{ fontSize:9, color:T.dim, marginTop:2 }}>{r.table} · {r.type}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Test panel */}
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {/* Rule detail */}
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:"16px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{selectedRule.name}</div>
              <div style={{ fontSize:10, color:T.muted, marginTop:2 }}>{selectedRule.source} → {selectedRule.table} · column: <code style={{color:T.cyan,fontSize:10}}>{selectedRule.column}</code></div>
            </div>
            <button onClick={runTest} disabled={running} style={{ background:T.accent, border:"none", borderRadius:8, padding:"9px 22px", cursor:"pointer", color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:8 }}>
              {running?<><RefreshCw size={13} style={{animation:"spin 1s linear infinite"}}/>Running…</>:<><TestTube2 size={13}/>Run Test</>}
            </button>
          </div>
          {/* SQL preview */}
          <div style={{ background:T.isDark?"#0A0C10":T.border, borderRadius:7, padding:"10px 14px", fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace", fontSize:11, color:T.cyan, lineHeight:1.8 }}>
            {selectedRule.type==="not_null"   &&`SELECT COUNT(*) FROM ${selectedRule.table} WHERE ${selectedRule.column} IS NULL;`}
            {selectedRule.type==="row_count"  &&`SELECT COUNT(*) FROM ${selectedRule.table} WHERE report_date = CURRENT_DATE;`}
            {selectedRule.type==="freshness"  &&`SELECT MAX(${selectedRule.column}) as latest FROM ${selectedRule.table};`}
            {selectedRule.type==="unique"     &&`SELECT ${selectedRule.column}, COUNT(*) FROM ${selectedRule.table} GROUP BY ${selectedRule.column} HAVING COUNT(*)>1;`}
            {selectedRule.type==="custom_sql" &&`-- Custom SQL assertion for ${selectedRule.table}`}
            {selectedRule.type==="regex"      &&`SELECT COUNT(*) FROM ${selectedRule.table} WHERE ${selectedRule.column} !~ '<pattern>';`}
            {!["not_null","row_count","freshness","unique","custom_sql","regex"].includes(selectedRule.type)&&`-- ${selectedRule.type} check on ${selectedRule.table}`}
          </div>
        </div>

        {/* Result */}
        {result&&(
          <div style={{ background:T.card, border:`1px solid ${result.pass?T.green:T.red}40`, borderRadius:10, padding:"18px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:`${result.pass?T.green:T.red}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {result.pass?<CheckCircle size={18} color={T.green}/>:<XCircle size={18} color={T.red}/>}
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:result.pass?T.green:T.red }}>{result.pass?"PASSED":"FAILED"}</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{result.summary}</div>
              </div>
            </div>

            {/* Sample data table */}
            {result.rows&&(
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:10, color:T.muted, marginBottom:6, fontWeight:700, letterSpacing:"0.06em" }}>SAMPLE DATA</div>
                <div style={{ background:T.isDark?"#0A0C10":T.border, borderRadius:7, overflow:"hidden" }}>
                  <div style={{ display:"grid", gridTemplateColumns:`repeat(${Object.keys(result.rows[0]).length},1fr)`, background:T.isDark?"#0F1117":"#E2E8F0", padding:"6px 12px" }}>
                    {Object.keys(result.rows[0]).map(k=><div key={k} style={{ fontSize:9, color:T.dim, fontWeight:700, textTransform:"uppercase" }}>{k}</div>)}
                  </div>
                  {result.rows.map((row,i)=>{
                    const isNull=Object.values(row).some(v=>v===null);
                    return(
                      <div key={i} style={{ display:"grid", gridTemplateColumns:`repeat(${Object.keys(row).length},1fr)`, padding:"7px 12px", borderTop:`1px solid ${T.border}`, background:isNull?`${T.red}10`:"transparent" }}>
                        {Object.values(row).map((v,j)=><div key={j} style={{ fontSize:11, color:v===null?T.red:T.text, fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace" }}>{v===null?"NULL":String(v)}</div>)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {result.dupes&&result.dupes.length>0&&(
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:10, color:T.muted, marginBottom:6, fontWeight:700, letterSpacing:"0.06em" }}>DUPLICATE GROUPS</div>
                {result.dupes.map((d,i)=>(
                  <div key={i} style={{ background:`${T.red}10`, border:`1px solid ${T.red}25`, borderRadius:7, padding:"8px 12px", marginBottom:6, fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace", fontSize:11, color:T.text }}>
                    {Object.entries(d).map(([k,v])=><span key={k} style={{ marginRight:12 }}>{k}: <strong style={{color:k==="count"?T.red:T.cyan}}>{v}</strong></span>)}
                  </div>
                ))}
              </div>
            )}

            {/* AI explanation */}
            {(aiExplain||aiLoading)&&(
              <div style={{ background:`${T.purple}10`, border:`1px solid ${T.purple}30`, borderRadius:8, padding:"12px 14px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
                  <BrainCircuit size={13} color={T.purple}/>
                  <span style={{ fontSize:10, fontWeight:700, color:T.purple, letterSpacing:"0.06em" }}>AI EXPLANATION</span>
                </div>
                {aiLoading
                  ?<div style={{ display:"flex", gap:4 }}>{[0,1,2].map(i=><span key={i} style={{ width:6,height:6,borderRadius:"50%",background:T.purple,animation:`bounce 1.2s ${i*0.2}s infinite`,display:"inline-block" }}/>)}</div>
                  :<div style={{ fontSize:11, color:T.text, lineHeight:1.7 }}>{aiExplain}</div>
                }
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AI Root Cause Tab ────────────────────────────────────────────────────────
function RootCauseTab({ alertsState }) {
  const T = useTheme();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState(CORRELATED_GROUPS);
  const [expanded, setExpanded] = useState("CG-001");
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [analyzing, setAnalyzing] = useState(null);

  const analyzeWithAI = async (group) => {
    if(aiAnalysis[group.id]||analyzing===group.id) return;
    setAnalyzing(group.id);
    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`,{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ max_tokens:600,
          system:"You are a data pipeline root cause analyst for Intentwise. Given a correlated alert group, provide a deeper technical analysis: exact timeline of failure, cascade path, probability of recurrence, and a step-by-step remediation plan with estimated time for each step. Be concrete and specific. Format with clear sections.",
          messages:[{role:"user",content:`Analyze this correlated alert group:
Title: ${group.title}
Root cause: ${group.rootCause}
Alerts: ${group.alerts.join(", ")}
Affected systems: ${group.affectedSystems.join(", ")}
Pattern: ${group.pattern}`}]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==="text")?.text||"Analysis unavailable.";
      setAiAnalysis(p=>({...p,[group.id]:text}));
    } catch(e){ setAiAnalysis(p=>({...p,[group.id]:`Analysis failed: ${e.message}`})); }
    setAnalyzing(null);
  };

  const renderText = (txt) => txt.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part,i)=>{
    if(part.startsWith("**")&&part.endsWith("**")) return <strong key={i} style={{color:T.text}}>{part.slice(2,-2)}</strong>;
    if(part.startsWith("`")&&part.endsWith("`"))   return <code key={i} style={{background:T.isDark?"#1E2330":T.border,color:T.cyan,borderRadius:3,padding:"1px 5px",fontSize:10}}>{part.slice(1,-1)}</code>;
    return part;
  });

  return(
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:`${T.purple}20`, display:"flex", alignItems:"center", justifyContent:"center" }}><BrainCircuit size={16} color={T.purple}/></div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.text }}>AI Root Cause Analyzer</div>
            <div style={{ fontSize:11, color:T.muted }}>Correlated alert groups · {groups.length} active patterns</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px", background:`${T.purple}10`, border:`1px solid ${T.purple}30`, borderRadius:8 }}>
          <Sparkles size={12} color={T.purple}/>
          <span style={{ fontSize:11, color:T.purple, fontWeight:600 }}>AI correlation engine active</span>
        </div>
      </div>

      {/* Ungrouped alerts reminder */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {(alertsState||[]).filter(a=>!CORRELATED_GROUPS.flatMap(g=>g.alerts).includes(a.id)).map(a=>(
          <div key={a.id} style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", background:T.card, border:`1px solid ${T.border}`, borderRadius:20 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:{critical:T.red,high:T.orange,medium:T.yellow,low:T.cyan}[a.severity]||T.muted }}/>
            <span style={{ fontSize:10, color:T.muted }}>{a.id}</span>
            <span style={{ fontSize:10, color:T.text }}>{a.title.slice(0,32)}…</span>
            <span style={{ fontSize:9, color:T.muted, background:`${T.border}`, borderRadius:4, padding:"1px 6px" }}>standalone</span>
          </div>
        ))}
      </div>

      {groups.map(g=>(
        <div key={g.id} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, marginBottom:14, overflow:"hidden" }}>
          {/* Group header */}
          <div onClick={()=>setExpanded(expanded===g.id?null:g.id)} style={{ padding:"16px 20px", cursor:"pointer", display:"flex", alignItems:"flex-start", gap:14, borderBottom:expanded===g.id?`1px solid ${T.border}`:"none" }}>
            <div style={{ width:42, height:42, borderRadius:11, background:`${T.purple}20`, border:`1px solid ${T.purple}40`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:20 }}>🧠</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                <span style={{ fontSize:13, fontWeight:700, color:T.text }}>{g.title}</span>
                <span style={{ fontSize:10, color:T.purple, background:`${T.purple}15`, border:`1px solid ${T.purple}30`, borderRadius:12, padding:"2px 9px", fontWeight:700 }}>{g.confidence}% confidence</span>
                <span style={{ fontSize:9, color:T.muted, fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace" }}>{g.id}</span>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
                {g.alerts.map(id=>{
                  const a=(alertsState||[]).find(x=>x.id===id);
                  const sc={critical:T.red,high:T.orange,medium:T.yellow}[a?.severity]||T.muted;
                  return <span key={id} style={{ fontSize:10, color:sc, background:`${sc}15`, border:`1px solid ${sc}30`, borderRadius:6, padding:"1px 8px", fontWeight:600 }}>{id}</span>;
                })}
              </div>
              <div style={{ fontSize:11, color:T.muted }}>{g.rootCause}</div>
            </div>
            <div style={{ color:T.dim, flexShrink:0 }}>{expanded===g.id?<ChevronUp size={14}/>:<ChevronDown size={14}/>}</div>
          </div>

          {/* Expanded detail */}
          {expanded===g.id&&(
            <div style={{ padding:"18px 20px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                {/* Affected systems */}
                <div style={{ background:T.isDark?"#0A0C10":T.border, borderRadius:8, padding:"12px 14px" }}>
                  <div style={{ fontSize:10, color:T.muted, marginBottom:8, fontWeight:700, letterSpacing:"0.06em" }}>AFFECTED SYSTEMS</div>
                  {g.affectedSystems.map(s=>(
                    <div key={s} style={{ display:"flex", alignItems:"center", gap:7, padding:"4px 0" }}>
                      <div style={{ width:5, height:5, borderRadius:"50%", background:T.red }}/>
                      <span style={{ fontSize:11, color:T.text, fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace" }}>{s}</span>
                    </div>
                  ))}
                </div>
                {/* Pattern note */}
                <div style={{ background:`${T.yellow}08`, border:`1px solid ${T.yellow}25`, borderRadius:8, padding:"12px 14px" }}>
                  <div style={{ fontSize:10, color:T.yellow, marginBottom:6, fontWeight:700, letterSpacing:"0.06em" }}>PATTERN</div>
                  <div style={{ fontSize:11, color:T.text, lineHeight:1.6 }}>{g.pattern}</div>
                </div>
              </div>

              {/* Suggested fix */}
              <div style={{ background:`${T.green}08`, border:`1px solid ${T.green}25`, borderRadius:8, padding:"14px", marginBottom:14 }}>
                <div style={{ fontSize:10, color:T.green, marginBottom:8, fontWeight:700, letterSpacing:"0.06em" }}>SUGGESTED FIX</div>
                {g.suggestedFix.split(". ").filter(Boolean).map((step,i)=>(
                  <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
                    <span style={{ fontSize:11, color:T.green, fontWeight:700, flexShrink:0 }}>{i+1}.</span>
                    <span style={{ fontSize:11, color:T.text, lineHeight:1.6 }}>{step}.</span>
                  </div>
                ))}
              </div>

              {/* Deep AI analysis */}
              <div>
                {!aiAnalysis[g.id]&&analyzing!==g.id&&(
                  <button onClick={()=>analyzeWithAI(g)} style={{ background:`${T.purple}18`, border:`1px solid ${T.purple}40`, borderRadius:8, padding:"9px 20px", cursor:"pointer", color:T.purple, fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:8 }}>
                    <BrainCircuit size={14}/> Deep AI Analysis
                  </button>
                )}
                {analyzing===g.id&&(
                  <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", background:`${T.purple}08`, borderRadius:8 }}>
                    <RefreshCw size={13} color={T.purple} style={{animation:"spin 1s linear infinite"}}/>
                    <span style={{ fontSize:11, color:T.purple }}>Analyzing cascade pattern…</span>
                  </div>
                )}
                {aiAnalysis[g.id]&&(
                  <div style={{ background:`${T.purple}08`, border:`1px solid ${T.purple}25`, borderRadius:8, padding:"14px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
                      <BrainCircuit size={13} color={T.purple}/>
                      <span style={{ fontSize:10, fontWeight:700, color:T.purple, letterSpacing:"0.06em" }}>DEEP AI ANALYSIS</span>
                    </div>
                    <div style={{ fontSize:11, color:T.text, lineHeight:1.8 }}>
                      {aiAnalysis[g.id].split("\n").map((line,i)=><div key={i}>{renderText(line)}</div>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── AI Chat Panel ────────────────────────────────────────────────────────────
function AIChatPanel({ alert, onClose }) {
  const [messages, setMessages] = useState([
    { role:"assistant", content:`I've analyzed **${alert.title}** on \`${alert.table}\`.\n\n${alert.aiSuggestion}\n\nWould you like me to take action, or do you want more details?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(p => [...p, { role:"user", content: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          max_tokens:1000,
          system:`You are an expert Data QE AI agent for Intentwise. You help monitor, triage, and fix data quality issues in a Redshift database (schema: mws).

MWS SCHEMA REFERENCE:
- mws.orders: amazon_order_id, order_status, fulfillment_channel, asin, sku, quantity, item_price, item_tax, currency, seller_id, account_id, purchase_date, download_date
- mws.inventory: asin, merchant_sku, available, total_units, inbound, unfulfillable, days_of_supply, alert, recommended_replenishment_qty, account_id, download_date
- mws.inventory_restock: restock order columns, quantity, account_id, download_date
- mws.sales_and_traffic_by_date: sale_date, ordered_product_sales_amt, units_ordered, units_refunded, refund_rate, sessions, buy_box_percentage, account_id, download_date
- mws.sales_and_traffic_by_asin: child_asin, parent_asin, units_ordered, ordered_product_sales_amt, traffic_by_asin_buy_box_prcntg, traffic_by_asin_sessions, account_id, report_start_date
- mws.sales_and_traffic_by_sku: same as by_asin with sku field

BACKEND API: https://intentwise-backend-production.up.railway.app
- GET /api/query?sql=<SQL> — run any read-only SQL against mws schema
- GET /api/kpis?account_id=<id> — orders, sales, inventory KPIs
- GET /api/alerts/detect?account_id=<id> — live anomaly detection

CURRENT ALERT: ID=${alert.id}, Severity=${alert.severity}, Source=${alert.source||"redshift-staging"}, Table=${alert.table}, Rule=${alert.rule||"N/A"}, Issue="${alert.title}".

Be concise, technical, and actionable. When suggesting SQL, write exact queries against mws.* tables. Format code in backticks.`,
          messages: [...messages, { role:"user", content: userMsg }]
            .filter((m,i,arr) => {
              // API requires first message to be user role
              const firstUserIdx = arr.findIndex(x => x.role === "user");
              return i >= firstUserIdx;
            })
            .map(m=>({ role:m.role, content:m.content }))
        })
      });
      const data = await res.json();
      // Surface any error — backend error, Anthropic error, or missing content
      const errText = !res.ok
        ? `❌ ${res.status}: ${data?.error?.message || data?.error || JSON.stringify(data)}`
        : data?.error
          ? `❌ Backend: ${typeof data.error === "string" ? data.error : data.error.message || JSON.stringify(data.error)}`
          : data?.type === "error"
            ? `❌ Anthropic: ${data?.error?.message || JSON.stringify(data)}`
            : null;
      if (errText) {
        setMessages(p => [...p, { role:"assistant", content: errText }]);
      } else {
        const text = data.content?.find(b=>b.type==="text")?.text || "❌ Empty response — check Railway logs.";
        setMessages(p => [...p, { role:"assistant", content: text }]);
      }
    } catch(err) {
      setMessages(p => [...p, { role:"assistant", content:`❌ Network error: ${err.message}` }]);
    }
    setLoading(false);
  };

  const renderText = (txt) => txt.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} style={{color:C.text}}>{part.slice(2,-2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i} style={{background:"#1E2330",color:C.cyan,borderRadius:3,padding:"1px 5px",fontSize:11}}>{part.slice(1,-1)}</code>;
    return part;
  });

  return (
    <div style={{ position:"fixed", right:0, top:0, bottom:0, width:420, background:C.surface, borderLeft:`1px solid ${C.border2}`, zIndex:50, display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:`${C.purple}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Bot size={16} color={C.purple} />
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:C.text }}>AI Agent Assistant</div>
            <div style={{ fontSize:10, color:C.green, display:"flex", alignItems:"center", gap:4 }}><Dot status="running" /> Live analysis</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, padding:4 }}><X size={16} /></button>
      </div>

      {/* Alert Context */}
      <div style={{ margin:"12px 16px 0", padding:"10px 12px", background:`${C.border}60`, borderRadius:8, borderLeft:`3px solid ${SEVERITY[alert.severity]}` }}>
        <div style={{ fontSize:10, color:C.muted, marginBottom:3 }}>ANALYZING ALERT {alert.id}</div>
        <div style={{ fontSize:12, color:C.text, fontWeight:600 }}>{alert.title}</div>
        <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{alert.source} → {alert.table}</div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:"flex", gap:8, flexDirection: m.role==="user" ? "row-reverse" : "row" }}>
            <div style={{ width:28, height:28, borderRadius:7, background: m.role==="user" ? `${C.accent}30` : `${C.purple}25`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {m.role==="user" ? <span style={{fontSize:11,color:C.accentL}}>You</span> : <Bot size={13} color={C.purple} />}
            </div>
            <div style={{ maxWidth:"82%", background: m.role==="user" ? `${C.accent}18` : C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", fontSize:12, color:C.text, lineHeight:1.7 }}>
              {(() => {
                // Parse content into text segments and SQL blocks
                const content = m.content;
                const parts = [];
                const sqlRegex = /```sql\n([\s\S]*?)```|```([\s\S]*?)```/gi;
                let last = 0, match;
                while ((match = sqlRegex.exec(content)) !== null) {
                  if (match.index > last) parts.push({ type:"text", value: content.slice(last, match.index) });
                  parts.push({ type:"sql", value: (match[1]||match[2]).trim() });
                  last = match.index + match[0].length;
                }
                if (last < content.length) parts.push({ type:"text", value: content.slice(last) });
                return parts.map((p, pi) => p.type === "sql" ? (
                  <div key={pi} style={{ marginTop:8, marginBottom:4, borderRadius:8, overflow:"hidden", border:`1px solid ${C.cyan}40` }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"5px 10px", background:C.isDark?"#0A0C10":"#1E293B" }}>
                      <span style={{ fontSize:10, color:C.cyan, fontWeight:700, letterSpacing:"0.06em" }}>SQL</span>
                      <div style={{ display:"flex", gap:6 }}>
                        <button onClick={() => { navigator.clipboard?.writeText(p.value); }} style={{ fontSize:10, background:"none", border:`1px solid ${C.cyan}40`, borderRadius:4, padding:"2px 8px", cursor:"pointer", color:C.cyan }}>Copy</button>
                        <button onClick={async () => {
                          try {
                            const r = await fetch(`${API_BASE}/api/query?sql=${encodeURIComponent(p.value)}`);
                            const d = await r.json();
                            const rows = d.rows || d;
                            const msg = Array.isArray(rows) && rows.length > 0
                              ? ["**Query Results (" + rows.length + " rows):**", Object.keys(rows[0]).join(" | "), ...rows.slice(0,10).map(row => Object.values(row).join(" | "))].join("\n")
                              : "✓ Query returned 0 rows — no issues found.";
                            setMessages(prev => [...prev, { role:"assistant", content: msg }]);
                          } catch(e) { setMessages(prev => [...prev, { role:"assistant", content:`❌ Query error: ${e.message}` }]); }
                        }} style={{ fontSize:10, background:`${C.green}20`, border:`1px solid ${C.green}40`, borderRadius:4, padding:"2px 8px", cursor:"pointer", color:C.green, fontWeight:700 }}>▶ Run</button>
                      </div>
                    </div>
                    <pre style={{ margin:0, padding:"10px 12px", fontSize:11, color:C.cyan, background:C.isDark?"#0D1017":"#0F172A", overflowX:"auto", lineHeight:1.6, fontFamily:"monospace" }}>{p.value}</pre>
                  </div>
                ) : (
                  <div key={pi}>{p.value.split("\n").map((line,j) => <div key={j} style={{ minHeight: line ? undefined : "0.5em" }}>{renderText(line)}</div>)}</div>
                ));
              })()}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <div style={{ width:28, height:28, borderRadius:7, background:`${C.purple}25`, display:"flex", alignItems:"center", justifyContent:"center" }}><Bot size={13} color={C.purple} /></div>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 14px" }}>
              <span style={{ display:"inline-flex", gap:4 }}>
                {[0,1,2].map(i=><span key={i} style={{ width:6, height:6, borderRadius:"50%", background:C.purple, animation:`bounce 1.2s ${i*0.2}s infinite` }} />)}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Auto-fix pill */}
      {alert.canAutoFix && (
        <div style={{ margin:"0 16px", padding:"10px 14px", background:`${C.green}10`, border:`1px solid ${C.green}40`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Wrench size={13} color={C.green} />
            <span style={{ fontSize:11, color:C.green, fontWeight:600 }}>Auto-fix available</span>
          </div>
          <button style={{ background:`${C.green}20`, border:`1px solid ${C.green}50`, borderRadius:6, padding:"4px 12px", fontSize:11, color:C.green, cursor:"pointer", fontWeight:700 }}>
            Run Fix
          </button>
        </div>
      )}

      {/* Input */}
      <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8 }}>
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter" && send()}
          placeholder="Ask about this alert…"
          style={{ flex:1, background:C.bg, border:`1px solid ${C.border2}`, borderRadius:8, padding:"8px 12px", color:C.text, fontSize:12, outline:"none" }}
        />
        <button onClick={send} disabled={loading} style={{ background:C.accent, border:"none", borderRadius:8, padding:"8px 14px", cursor:"pointer", color:"white", display:"flex", alignItems:"center" }}>
          <Zap size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Alert Row ────────────────────────────────────────────────────────────────
function AlertRow({ alert, onAIClick, onDrill, onResolve, onAutoFix, onTriage, selected }) {
  const [expanded, setExpanded] = useState(false);
  const [fixing, setFixing] = useState(false);
  const isResolved = alert.status === "resolved";
  const statusColor = { open:C.red, triaged:C.yellow, resolved:C.green }[alert.status] || C.muted;

  const handleAutoFix = async (e) => {
    e.stopPropagation();
    setFixing(true);
    await new Promise(r => setTimeout(r, 1800)); // simulate fix running
    onAutoFix && onAutoFix(alert.id);
    setFixing(false);
  };

  const handleResolve = (e) => {
    e.stopPropagation();
    onResolve && onResolve(alert.id);
  };

  const handleInvestigate = (e) => {
    e.stopPropagation();
    onTriage && onTriage(alert.id);
    onDrill && onDrill("alert", alert);
  };

  return (
    <div style={{ borderBottom:`1px solid ${C.border}`, background: selected ? `${C.accent}08` : isResolved ? `${C.green}04` : "transparent", transition:"background 0.15s", opacity: isResolved ? 0.7 : 1 }}>
      <div
        onClick={()=>setExpanded(p=>!p)}
        className="row-hover"
        style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 18px", cursor:"pointer" }}
      >
        <Dot status={alert.severity} />
        <div style={{ width:62, flexShrink:0 }}><SevBadge sev={alert.severity} /></div>
        <div style={{ flex:1, minWidth:0 }}>
          <div onClick={e=>{e.stopPropagation();onDrill&&onDrill("alert",alert);}} style={{ fontSize:13, fontWeight:600, color:C.accentL, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", cursor:"pointer", textDecoration:"underline", textDecorationColor:`${C.accentL}50`, textUnderlineOffset:3 }}>{alert.title}<DataBadge live={alert.id?.startsWith("AGT-")} /></div>
          <div style={{ fontSize:11, color:C.muted, marginTop:3, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
              <span style={{ background:`${C.cyan}15`, color:C.cyan, borderRadius:4, padding:"1px 6px", fontSize:10, fontWeight:700 }}>{alert.source||"redshift-staging"}</span>
              <code style={{color:C.accentL,fontSize:11,fontFamily:'Consolas,monospace', background:`${C.accent}10`, padding:"1px 5px", borderRadius:3}}>{alert.table}</code>
              {alert.rule && <span style={{color:C.muted, fontSize:10}}>rule: {alert.rule}</span>}
            </div>
        </div>
        <div style={{ fontSize:11, color:C.muted, flexShrink:0, width:72, textAlign:"right" }}>{alert.ts}</div>
        <span style={{ color:statusColor, fontSize:11, fontWeight:700, letterSpacing:"0.04em", textTransform:"uppercase", flexShrink:0, width:72, textAlign:"right" }}>{alert.autoFixed?"auto-fixed":alert.status}</span>
        <button
          onClick={e=>{e.stopPropagation();onAIClick(alert);}}
          style={{ background:`${C.purple}20`, border:`1px solid ${C.purple}40`, borderRadius:6, padding:"4px 10px", cursor:"pointer", display:"flex", alignItems:"center", gap:5, flexShrink:0 }}
        >
          <Bot size={11} color={C.purple} />
          <span style={{ fontSize:10, color:C.purple, fontWeight:600 }}>AI</span>
        </button>
        <span style={{ color:C.dim }}>{expanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}</span>
      </div>

      {expanded && (
        <div style={{ padding:"0 16px 14px 40px", display:"flex", gap:12 }}>
          <div style={{ flex:1, borderRadius:8, display:"flex", flexDirection:"column", gap:8 }}>
            {/* Detail / description */}
            {(alert.detail || alert.aiSuggestion) && (
              <div style={{ background:`${C.border}40`, borderRadius:8, padding:"10px 14px", borderLeft:`3px solid ${SEVERITY[alert.severity]}` }}>
                <div style={{ fontSize:10, color:C.muted, marginBottom:5, fontWeight:700, letterSpacing:"0.08em" }}>
                  {alert.aiGenerated ? "AGENT FINDING" : "AI SUGGESTION"}
                </div>
                <div style={{ fontSize:12, color:C.text, lineHeight:1.7 }}>{alert.detail || alert.aiSuggestion}</div>
                {alert.autoFixed && (
                  <div style={{ marginTop:8, fontSize:11, color:C.green, fontWeight:700, display:"flex", alignItems:"center", gap:5 }}>
                    <Check size={12}/> Auto-fixed by AI · no manual action required
                  </div>
                )}
              </div>
            )}
            {/* Agent metadata row */}
            {alert.aiGenerated && (
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {alert.table && (
                  <div style={{ fontSize:11, background:`${C.accent}10`, border:`1px solid ${C.accent}25`, borderRadius:6, padding:"3px 10px", color:C.accentL, fontFamily:"monospace" }}>
                    📋 {alert.table}
                  </div>
                )}
                {alert.affected_rows != null && (
                  <div style={{ fontSize:11, background:`${C.red}10`, border:`1px solid ${C.red}25`, borderRadius:6, padding:"3px 10px", color:C.red }}>
                    ⚠ {alert.affected_rows} affected row{alert.affected_rows !== 1 ? "s" : ""}
                  </div>
                )}
                {alert.source && (
                  <div style={{ fontSize:11, background:`${C.purple}10`, border:`1px solid ${C.purple}25`, borderRadius:6, padding:"3px 10px", color:C.purple }}>
                    🤖 {alert.source}
                  </div>
                )}
                {alert.ts && (
                  <div style={{ fontSize:11, color:C.muted, padding:"3px 0" }}>
                    🕐 {new Date(alert.ts).toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <button
              onClick={e=>{e.stopPropagation(); onAIClick && onAIClick(alert);}}
              style={{ background:`${C.purple}18`, border:`1px solid ${C.purple}50`, borderRadius:7, padding:"7px 14px", cursor:"pointer", fontSize:11, color:C.purple, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}
            >
              <Bot size={12} color={C.purple}/> Open AI Chat
            </button>
            {alert.canAutoFix && !isResolved && (
              <button
                onClick={handleAutoFix}
                disabled={fixing}
                style={{ background:fixing?`${C.green}08`:`${C.green}15`, border:`1px solid ${C.green}40`, borderRadius:7, padding:"7px 14px", cursor:fixing?"not-allowed":"pointer", fontSize:11, color:C.green, fontWeight:700, display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap", minWidth:110, justifyContent:"center" }}
              >
                {fixing ? <><RefreshCw size={11} style={{animation:"spin 1s linear infinite"}}/> Fixing…</> : <><Wrench size={12}/> Auto Fix</>}
              </button>
            )}
            {!isResolved && (
              <button
                onClick={handleInvestigate}
                style={{ background:`${C.accent}15`, border:`1px solid ${C.accent}40`, borderRadius:7, padding:"7px 14px", cursor:"pointer", fontSize:11, color:C.accentL, fontWeight:600, display:"flex", alignItems:"center", gap:6, minWidth:110, justifyContent:"center" }}
              >
                <Eye size={12}/> Investigate
              </button>
            )}
            {!isResolved ? (
              <button
                onClick={handleResolve}
                style={{ background:`${C.border}`, border:`1px solid ${C.border2}`, borderRadius:7, padding:"7px 14px", cursor:"pointer", fontSize:11, color:C.muted, display:"flex", alignItems:"center", gap:6, minWidth:110, justifyContent:"center" }}
              >
                <Check size={12}/> Mark Resolved
              </button>
            ) : (
              <div style={{ padding:"7px 14px", fontSize:11, color:C.green, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
                <CheckCircle size={13}/> Resolved
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Agent Card ───────────────────────────────────────────────────────────────

// ─── Create / Assign Agent Modal ──────────────────────────────────────────────
const AGENT_ICONS = ["📥","📊","🔍","📉","🔎","🔄","⚡","🔬","🧪","🤖","📡","🛡️","⚙️","🔁","📋"];
const TASK_TYPES  = [
  "Missing Data Detection",
  "Pipeline Failure Triage",
  "Schema Drift Monitoring",
  "Row Count Anomaly",
  "Duplicate Row Detection",
  "Replication Lag Check",
  "Step Function Monitor",
  "Custom SQL Validation",
  "Data Freshness Check",
  "Alert Correlation",
];

function CreateAgentModal({ prefill, agents, onClose, onCreate }) {
  const T = useTheme();
  const [name,     setName]     = useState(prefill?.name  || "");
  const [icon,     setIcon]     = useState(prefill?.icon  || "🤖");
  const [taskType, setTaskType] = useState(TASK_TYPES[0]);
  const [schedule, setSchedule] = useState("*/15 * * * *");
  const [targets,  setTargets]  = useState("");
  const [desc,     setDesc]     = useState(prefill?.reason || "");
  const [autoFix,  setAutoFix]  = useState(false);
  const [threshold,setThreshold]= useState("5");
  const [errors,   setErrors]   = useState({});
  const [saving,   setSaving]   = useState(false);

  const validate = () => {
    const e = {};
    if (!name.trim())     e.name     = "Agent name is required";
    if (!targets.trim())  e.targets  = "At least one target table is required";
    if (!schedule.trim()) e.schedule = "Schedule (cron) is required";
    return e;
  };

  const handleCreate = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800)); // brief UX pause
    const newId = "ag" + (agents.length + 1);
    onCreate({
      id:          newId,
      name:        name.trim(),
      icon,
      status:      "idle",
      lastRun:     "—",
      nextRun:     "—",
      runsToday:   0,
      issuesFound: 0,
      fixed:       0,
      successRate: 100,
      avgDuration: "—",
      schedule,
      targets:     targets.split(",").map(t=>t.trim()).filter(Boolean),
      taskType,
      description: desc.trim(),
      autoFix,
    });
    setSaving(false);
  };

  const overlay = {
    position:"fixed", inset:0, background:"rgba(0,0,0,0.55)",
    zIndex:1100, display:"flex", alignItems:"center", justifyContent:"center", padding:24,
  };
  const box = {
    background:T.surface, border:`1px solid ${T.border2}`, borderRadius:14,
    width:"100%", maxWidth:560, maxHeight:"90vh", display:"flex",
    flexDirection:"column", overflow:"hidden",
    boxShadow:"0 24px 60px rgba(0,0,0,0.4)", animation:"fadein 0.15s ease",
  };
  const field = (label, child, err) => (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:10, color:T.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>{label}</div>
      {child}
      {err && <div style={{ fontSize:10, color:T.red, marginTop:4 }}>{err}</div>}
    </div>
  );
  const input = (val, set, placeholder, mono=false, err) => (
    <input
      value={val} onChange={e=>{ set(e.target.value); setErrors(p=>({...p})); }}
      placeholder={placeholder}
      style={{ width:"100%", background:T.isDark?"#0A0C10":T.bg, border:`1px solid ${err?T.red:T.border2}`, borderRadius:7, padding:"9px 12px", color:T.text, fontSize:12, outline:"none", fontFamily:mono?"Consolas,monospace":"inherit" }}
    />
  );

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:"20px 24px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <div style={{ width:40, height:40, borderRadius:11, background:"#6366F118", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:800, color:T.text }}>Create QA Agent</div>
            <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Configure a new autonomous quality monitoring agent</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted }}><X size={16}/></button>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>

          {/* Icon picker */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:10, color:T.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Agent Icon</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {AGENT_ICONS.map(ic=>(
                <button key={ic} onClick={()=>setIcon(ic)} style={{ width:36, height:36, borderRadius:8, border:`2px solid ${icon===ic?"#6366F1":T.border}`, background:icon===ic?"#6366F118":"transparent", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.12s" }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          {field("Agent Name", input(name, setName, "e.g. Late Copy Re-runner", false, errors.name), errors.name)}

          {/* Task type */}
          {field("Task Type", (
            <select value={taskType} onChange={e=>setTaskType(e.target.value)} style={{ width:"100%", background:T.isDark?"#0A0C10":T.bg, border:`1px solid ${T.border2}`, borderRadius:7, padding:"9px 12px", color:T.text, fontSize:12, outline:"none" }}>
              {TASK_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          ))}

          {/* Target tables */}
          {field("Target Tables", input(targets, setTargets, "report, campaign_data, keyword_summary (comma-separated)", false, errors.targets), errors.targets)}

          {/* Schedule */}
          {field("Schedule (cron)", input(schedule, setSchedule, "*/15 * * * *", true, errors.schedule), errors.schedule)}
          <div style={{ fontSize:10, color:T.dim, marginTop:-10, marginBottom:14 }}>
            Common: <span style={{color:"#6366F1",cursor:"pointer"}} onClick={()=>setSchedule("*/15 * * * *")}>every 15 min</span>
            {" · "}<span style={{color:"#6366F1",cursor:"pointer"}} onClick={()=>setSchedule("0 * * * *")}>hourly</span>
            {" · "}<span style={{color:"#6366F1",cursor:"pointer"}} onClick={()=>setSchedule("0 9 * * 1-5")}>weekdays 9 AM</span>
          </div>

          {/* Description */}
          {field("Description / Task", (
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={3} placeholder="What should this agent monitor or do?" style={{ width:"100%", background:T.isDark?"#0A0C10":T.bg, border:`1px solid ${T.border2}`, borderRadius:7, padding:"9px 12px", color:T.text, fontSize:12, outline:"none", fontFamily:"inherit", resize:"vertical", lineHeight:1.6 }}/>
          ))}

          {/* Auto-fix toggle */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", background:T.isDark?"#0A0C10":T.bg, border:`1px solid ${T.border}`, borderRadius:8, marginBottom:14 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:T.text }}>Enable Auto-Fix</div>
              <div style={{ fontSize:10, color:T.muted, marginTop:2 }}>Agent will attempt automatic remediation before alerting</div>
            </div>
            <button onClick={()=>setAutoFix(p=>!p)} style={{ background:autoFix?"#10B98118":"transparent", border:`2px solid ${autoFix?"#10B981":T.border2}`, borderRadius:20, padding:"4px 16px", cursor:"pointer", fontSize:11, fontWeight:700, color:autoFix?"#10B981":T.muted, transition:"all 0.15s" }}>
              {autoFix ? "ON" : "OFF"}
            </button>
          </div>

          {/* Failure threshold */}
          {field("Alert Threshold", (
            <input type="number" min="1" max="100" value={threshold} onChange={e=>setThreshold(e.target.value)} style={{ width:"100%", background:T.isDark?"#0A0C10":T.bg, border:`1px solid ${T.border2}`, borderRadius:7, padding:"9px 12px", color:T.text, fontSize:12, outline:"none" }}/>
          ))}
          <div style={{ fontSize:10, color:T.dim, marginTop:-10, marginBottom:4 }}>Trigger alert when anomalies exceed this count</div>

        </div>

        {/* Footer */}
        <div style={{ padding:"16px 24px", borderTop:`1px solid ${T.border}`, display:"flex", gap:10, flexShrink:0 }}>
          <button
            onClick={handleCreate}
            disabled={saving}
            style={{ flex:1, background:"#6366F1", border:"none", borderRadius:9, padding:"11px", cursor:"pointer", color:"white", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity:saving?0.7:1 }}
          >
            {saving ? <><RefreshCw size={14} style={{animation:"spin 1s linear infinite"}}/> Creating…</> : <><Bot size={14}/> Create Agent</>}
          </button>
          <button onClick={onClose} style={{ background:"none", border:`1px solid ${T.border2}`, borderRadius:9, padding:"11px 22px", cursor:"pointer", color:T.muted, fontSize:13, fontWeight:600 }}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Agent Fleet Tab ──────────────────────────────────────────────────────────
function AgentFleetTab({ onDrill, agentScanResult, agentScanLoading, onAgentScan }) {
  const T = useTheme();
  const [agents, setAgents] = useState(AGENTS.map(a=>({...a})));
  const [selected, setSelected] = useState(null); // agent id
  const [panelTab, setPanelTab] = useState('activity'); // 'activity' | 'evals'
  const [configEdit, setConfigEdit] = useState(null); // agent id being configured
  const [configs, setConfigs] = useState({...AGENT_CONFIG_DEFAULTS});
  const [liveLogs, setLiveLogs] = useState({...AGENT_LOGS});
  const [running, setRunning] = useState(null); // id of agent being manually run
  const [createModal, setCreateModal] = useState(null); // null | prefill obj
  const logRef = useRef(null);

  const selectedAgent = agents.find(a=>a.id===selected);

  // Simulate a new log line every few seconds for running agents
  useEffect(()=>{
    const LIVE_MSGS = [
      "Heartbeat OK — monitoring active",
      "Fetching latest rows from datasource…",
      "No anomalies detected in this cycle",
      "Threshold check passed ✓",
      "Cross-referencing with alert history…",
      "Cycle complete. Sleeping until next run.",
    ];
    const t = setInterval(()=>{
      setAgents(prev=>prev.map(a=>{
        if(a.status!=="running") return a;
        return {...a, lastRun: new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"})};
      }));
      // Add a live log line to each running agent
      setLiveLogs(prev=>{
        const next={...prev};
        agents.forEach(a=>{
          if(a.status!=="running") return;
          const msg = LIVE_MSGS[Math.floor(Math.random()*LIVE_MSGS.length)];
          const ts = new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
          next[a.id] = [{ts, level:"info", msg}, ...(next[a.id]||[])].slice(0,20);
        });
        return next;
      });
    }, 4000);
    return ()=>clearInterval(t);
  }, [agents]);

  // Scroll log to top when selected changes
  useEffect(()=>{ if(logRef.current) logRef.current.scrollTop=0; setPanelTab('activity'); },[selected]);

  const toggleStatus = (id)=>{
    setAgents(prev=>prev.map(a=>{
      if(a.id!==id) return a;
      const next = a.status==="paused" ? "running" : a.status==="running" ? "paused" : "running";
      return {...a, status:next};
    }));
  };

  const runNow = async (id)=>{
    setRunning(id);
    const ts = new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
    setLiveLogs(prev=>({...prev,[id]:[
      {ts, level:"info", msg:"Manual run triggered by user"},
      {ts, level:"info", msg:"Starting immediate execution…"},
      ...(prev[id]||[])
    ]}));
    await new Promise(r=>setTimeout(r,2200));
    const finishTs = new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
    setLiveLogs(prev=>({...prev,[id]:[
      {ts:finishTs, level:"ok", msg:"Manual run complete ✓"},
      ...(prev[id]||[])
    ]}));
    setAgents(prev=>prev.map(a=>a.id===id?{...a,runsToday:a.runsToday+1,lastRun:finishTs}:a));
    setRunning(null);
  };

  const saveConfig = (id, cfg)=>{
    setConfigs(prev=>({...prev,[id]:cfg}));
    setConfigEdit(null);
  };

  const logLevelColor = (level, T) => ({ok:"#10B981",warn:"#F59E0B",error:"#EF4444",info:"#64748B"})[level]||T.muted;

  const statusCol = (s,T)=>({running:T.green,idle:T.muted,paused:T.orange}[s]||T.muted);

  // ── Config Edit Panel ──────────────────────────────────────────────────────
  if(configEdit){
    const ag = agents.find(a=>a.id===configEdit);
    const cfg = {...configs[configEdit]};
    return <AgentConfigPanel agent={ag} config={cfg} onSave={c=>saveConfig(configEdit,c)} onCancel={()=>setConfigEdit(null)} />;
  }

  return (
    <div>
      {/* ── Live Agent Scan Panel ── */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:16, marginBottom:16, display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Zap size={14} color={T.green}/>
            <span style={{ fontWeight:700, fontSize:13, color:T.text }}>Live Agent Scan</span>
            <DataBadge live={!!agentScanResult} />
          </div>
          <button onClick={onAgentScan} disabled={agentScanLoading}
            style={{ background:`${T.green}15`, border:`1px solid ${T.green}40`, borderRadius:7, padding:"5px 14px", cursor:"pointer", fontSize:11, color:T.green, fontWeight:700, display:"flex", alignItems:"center", gap:5 }}>
            {agentScanLoading ? <><RefreshCw size={10} style={{animation:"spin 1s linear infinite"}}/> Scanning…</> : <><Zap size={10}/> Run Scan</>}
          </button>
        </div>
        {agentScanResult?.analysis
          ? <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <div style={{ background:`${T.accent}15`, border:`1px solid ${T.accent}30`, borderRadius:8, padding:"8px 14px", textAlign:"center", minWidth:70 }}>
                <div style={{ fontSize:26, fontWeight:900, color:T.accent }}>{agentScanResult.analysis.quality_score ?? "—"}</div>
                <div style={{ fontSize:9, color:T.muted, fontWeight:700, letterSpacing:"0.5px" }}>QUALITY SCORE</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, color:T.text, lineHeight:1.7, marginBottom:6 }}>{agentScanResult.analysis.summary}</div>
                {agentScanResult.analysis.recommendations?.map((rec,i)=>(
                  <span key={i} style={{ display:"inline-block", fontSize:10, background:`${T.yellow}15`, color:T.yellow, border:`1px solid ${T.yellow}30`, borderRadius:5, padding:"2px 8px", marginRight:5, marginBottom:4 }}>{rec}</span>
                ))}
              </div>
            </div>
          : <div style={{ fontSize:12, color:T.muted }}>
              {agentScanLoading ? "Scanning your mws tables…" : "Run a scan to get AI-powered data quality analysis across all mws tables."}
            </div>
        }
      </div>

      {createModal !== null && (
        <CreateAgentModal
          prefill={createModal}
          agents={agents}
          onClose={()=>setCreateModal(null)}
          onCreate={(newAgent)=>{
            setAgents(p=>[...p, newAgent]);
            setLiveLogs(p=>({...p, [newAgent.id]:[{ts:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"}), level:"info", msg:"Agent created and initialized."}]}));
            setConfigs(p=>({...p, [newAgent.id]:{ schedule:newAgent.schedule, targets:newAgent.targets||[], threshold:5, alertOn:"any_failure", autoFix:newAgent.autoFix||false }}));
            setCreateModal(null);
          }}
        />
      )}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:T.text, display:"flex", alignItems:"center", gap:8 }}>
            <Bot size={16} color={T.accentL}/> QA Agent Fleet
          </div>
          <div style={{ fontSize:11, color:T.muted, marginTop:3 }}>
            {agents.filter(a=>a.status==="running").length} autonomous · {agents.length} total · click a card to inspect
          </div>
        </div>
        <button onClick={()=>setCreateModal({})} style={{ background:T.accent, border:"none", borderRadius:8, padding:"9px 18px", cursor:"pointer", color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
          <Plus size={13}/> Assign New Agent
        </button>
      </div>
    <div style={{ display:"flex", gap:16, minHeight:"calc(100vh - 200px)" }}>

      {/* ── Left: 3-col compact grid ── */}
      <div style={{ flex:"0 0 auto", width: selected ? 420 : "100%" }}>

        {/* Fleet summary strip */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
          {[
            ["Running",  agents.filter(a=>a.status==="running").length,  T.green],
            ["Paused",   agents.filter(a=>a.status==="paused").length,   T.orange],
            ["Idle",     agents.filter(a=>a.status==="idle").length,     T.muted],
            ["Issues",   agents.reduce((s,a)=>s+a.issuesFound,0),        T.red],
          ].map(([l,v,c])=>(
            <div key={l} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:9, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ fontSize:24, fontWeight:800, color:c }}>{v}</div>
              <div style={{ fontSize:11, color:T.muted, fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* 3-col agent grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {agents.map(a=>{
            const sc = statusCol(a.status,T);
            const isSelected = selected===a.id;
            const isRunningNow = running===a.id;
            return (
              <div
                key={a.id}
                onClick={()=>setSelected(isSelected?null:a.id)}
                style={{ background:T.card, border:`2px solid ${isSelected?T.accent:T.border}`, borderRadius:10, padding:"14px", cursor:"pointer", transition:"border-color 0.15s, box-shadow 0.15s", boxShadow:isSelected?`0 0 0 3px ${T.accent}20`:"none" }}
              >
                {/* Card header */}
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                  <div style={{ fontSize:26 }}>{a.icon}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:sc, animation:a.status==="running"?"ping 2s infinite":"none" }}/>
                    <span style={{ fontSize:9, color:sc, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>{a.status}</span>
                  </div>
                </div>

                {/* Name */}
                <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:8, lineHeight:1.3 }}>{a.name}</div>

                {/* Stats row */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:4, marginBottom:10 }}>
                  {[["Runs",a.runsToday,T.accentL],["Issues",a.issuesFound,a.issuesFound>0?T.orange:T.green],["Fixed",a.fixed,T.green]].map(([l,v,c])=>(
                    <div key={l} style={{ textAlign:"center", background:`${T.border}60`, borderRadius:5, padding:"5px 2px" }}>
                      <div style={{ fontSize:14, fontWeight:800, color:c }}>{v}</div>
                      <div style={{ fontSize:9, color:T.muted }}>{l}</div>
                    </div>
                  ))}
                </div>

                {/* Success rate bar */}
                <div style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:T.muted, marginBottom:3 }}>
                    <span>Success rate</span><span style={{ color:a.successRate>=90?T.green:a.successRate>=70?T.yellow:T.red, fontWeight:700 }}>{a.successRate}%</span>
                  </div>
                  <div style={{ height:4, background:T.border, borderRadius:2 }}>
                    <div style={{ height:4, borderRadius:2, width:`${a.successRate}%`, background:a.successRate>=90?T.green:a.successRate>=70?T.yellow:T.red, transition:"width 0.6s ease" }}/>
                  </div>
                </div>

                {/* Controls */}
                <div style={{ display:"flex", gap:5 }} onClick={e=>e.stopPropagation()}>
                  <button
                    onClick={()=>toggleStatus(a.id)}
                    style={{ flex:1, background:a.status==="running"?`${T.orange}15`:`${T.green}15`, border:`1px solid ${a.status==="running"?T.orange:T.green}40`, borderRadius:6, padding:"5px 0", cursor:"pointer", fontSize:10, color:a.status==="running"?T.orange:T.green, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}
                  >
                    {a.status==="running"?<><Pause size={10}/>Pause</>:a.status==="paused"?<><Play size={10}/>Resume</>:<><Play size={10}/>Start</>}
                  </button>
                  <button
                    onClick={()=>runNow(a.id)}
                    disabled={isRunningNow||a.status==="paused"}
                    style={{ flex:1, background:`${T.accent}15`, border:`1px solid ${T.accent}40`, borderRadius:6, padding:"5px 0", cursor:isRunningNow||a.status==="paused"?"not-allowed":"pointer", fontSize:10, color:T.accentL, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:4, opacity:a.status==="paused"?0.4:1 }}
                  >
                    {isRunningNow?<><RefreshCw size={10} style={{animation:"spin 1s linear infinite"}}/>Running</>:<><Play size={10}/>Run Now</>}
                  </button>
                  <button
                    onClick={()=>setConfigEdit(a.id)}
                    style={{ background:`${T.border}`, border:`1px solid ${T.border2}`, borderRadius:6, padding:"5px 8px", cursor:"pointer", color:T.muted }}
                  >
                    <Settings size={11}/>
                  </button>
                </div>

                {/* Last / next run */}
                <div style={{ marginTop:8, display:"flex", justifyContent:"space-between", fontSize:9, color:T.dim }}>
                  <span>Last: <span style={{color:T.muted}}>{a.lastRun}</span></span>
                  <span>Next: <span style={{color:T.muted}}>{a.nextRun}</span></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Suggested new agents */}
        <div style={{ marginTop:16, background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:"16px 18px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <Sparkles size={14} color={T.purple}/>
            <span style={{ fontSize:13, fontWeight:700, color:T.text }}>Suggested New Agents</span>
            <span style={{ fontSize:11, color:T.muted }}>— based on alert patterns</span>
          </div>
          {[
            { name:"Late Copy Re-runner",    icon:"⚡", reason:"GDS BigQuery copy jobs fail silently 2×/week. Auto-retrigger after 30 min." },
            { name:"Step Function Analyzer", icon:"🔬", reason:"3 Step Function failures manually triaged per day. Auto-classify & redrive requester failures." },
          ].map(s=>(
            <div key={s.name} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", background:T.isDark?"#0A0C10":T.border, borderRadius:8, marginBottom:8, border:`1px solid ${T.border2}` }}>
              <span style={{ fontSize:22 }}>{s.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:700, color:T.text }}>{s.name}</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{s.reason}</div>
              </div>
              <button onClick={()=>setCreateModal({name:s.name, icon:s.icon, reason:s.reason})} style={{ background:`${T.accent}18`, border:`1px solid ${T.accent}40`, borderRadius:7, padding:"6px 14px", cursor:"pointer", fontSize:11, color:T.accentL, fontWeight:700, whiteSpace:"nowrap" }}>+ Create</button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: Detail panel ── */}
      {selected && selectedAgent && (
        <div style={{ flex:1, minWidth:0, background:T.card, border:`1px solid ${T.border}`, borderRadius:12, display:"flex", flexDirection:"column", animation:"fadein 0.18s ease", overflow:"hidden" }}>
          {/* Panel header */}
          <div style={{ padding:"16px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:26 }}>{selectedAgent.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:800, color:T.text }}>{selectedAgent.name}</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Avg duration: {selectedAgent.avgDuration} · Success rate: {selectedAgent.successRate}%</div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={()=>setConfigEdit(selected)} style={{ background:`${T.border}`, border:`1px solid ${T.border2}`, borderRadius:7, padding:"6px 12px", cursor:"pointer", color:T.muted, fontSize:11, display:"flex", alignItems:"center", gap:5 }}><Settings size={12}/>Config</button>
              <button onClick={()=>setSelected(null)} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted, padding:4 }}><X size={15}/></button>
            </div>
          </div>

          {/* Config summary strip */}
          <div style={{ padding:"10px 18px", borderBottom:`1px solid ${T.border}`, background:T.isDark?"#0A0C10":T.bg }}>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {[
                ["Schedule", configs[selected]?.schedule],
                ["Target", (configs[selected]?.targets||[]).join(", ")],
                ["Alert on", configs[selected]?.alertOn],
                ["Auto-fix", configs[selected]?.autoFix?"Enabled":"Disabled"],
              ].map(([k,v])=>(
                <div key={k} style={{ display:"flex", gap:5, alignItems:"center" }}>
                  <span style={{ fontSize:10, color:T.dim, fontWeight:700 }}>{k}:</span>
                  <code style={{ fontSize:10, color:T.cyan, background:`${T.cyan}10`, borderRadius:4, padding:"2px 7px", fontFamily:"Consolas,monospace" }}>{v}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Panel tabs */}
          <div style={{ display:"flex", gap:4, padding:"8px 18px", borderBottom:`1px solid ${T.border}`, background:T.surface }}>
            {[
              { id:"activity", label:"Activity Feed", icon:"⚡" },
              { id:"evals",    label:`Evals (${(EVAL_CASES[selected]||[]).length})`, icon:"🧪" },
            ].map(tab=>(
              <button key={tab.id} onClick={()=>setPanelTab(tab.id)} style={{ padding:"6px 14px", borderRadius:7, border:`1px solid ${panelTab===tab.id?T.accent+"50":"transparent"}`, background:panelTab===tab.id?`${T.accent}15`:"transparent", color:panelTab===tab.id?T.accentL:T.muted, fontSize:11, fontWeight:panelTab===tab.id?700:500, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* ── Activity Feed ── */}
          {panelTab==="activity" && (
            <div style={{ flex:1, overflowY:"auto", padding:"14px 18px" }} ref={logRef}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:selectedAgent.status==="running"?T.green:T.muted, animation:selectedAgent.status==="running"?"ping 2s infinite":"none" }}/>
                <span style={{ fontSize:11, fontWeight:700, color:T.text }}>Live Activity Feed</span>
                <span style={{ fontSize:10, color:T.muted }}>— {(liveLogs[selected]||[]).length} events</span>
              </div>
              {(liveLogs[selected]||[]).length===0 && (
                <div style={{ textAlign:"center", color:T.muted, fontSize:12, padding:"24px 0" }}>No activity yet. Run the agent to see logs.</div>
              )}
              {(liveLogs[selected]||[]).map((log,i)=>{
                const lc = logLevelColor(log.level,T);
                const bg = {ok:`${T.green}08`,warn:`${T.yellow}08`,error:`${T.red}08`,info:"transparent"}[log.level]||"transparent";
                return (
                  <div key={i} style={{ display:"flex", gap:10, padding:"7px 10px", borderRadius:7, marginBottom:3, background:bg, animation:i===0?"fadein 0.2s ease":"none" }}>
                    <span style={{ fontSize:9, color:T.dim, fontFamily:"Consolas,monospace", flexShrink:0, width:72, paddingTop:1 }}>{log.ts}</span>
                    <span style={{ fontSize:10, color:lc, fontWeight:700, flexShrink:0, width:20 }}>{log.level==="ok"?"✓":log.level==="warn"?"⚠":log.level==="error"?"✗":"·"}</span>
                    <span style={{ fontSize:12, color:T.text, flex:1, lineHeight:1.5 }}>{log.msg}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Evals Panel ── */}
          {panelTab==="evals" && (
            <div style={{ flex:1, overflowY:"auto" }}>
              <AgentEvalsPanel agentId={selected} agent={selectedAgent} />
            </div>
          )}
        </div>
      )}
    </div>
  </div>
  );
}



// ─── QA Process Health Tab ────────────────────────────────────────────────────
function QAHealthTab() {
  const T = useTheme();
  const [activeStage, setActiveStage] = useState(null);

  const totalAI    = QA_STAGES.reduce((s,st)=>s+st.aiActions,0);
  const totalHuman = QA_STAGES.reduce((s,st)=>s+st.humanActions,0);
  const overallAuto = Math.round((totalAI/(totalAI+totalHuman))*100);
  const totalTables  = RULE_COVERAGE.reduce((s,r)=>s+r.tables,0);
  const coveredTables= RULE_COVERAGE.reduce((s,r)=>s+r.covered,0);
  const coveragePct  = Math.round((coveredTables/totalTables)*100);

  const statusColor = (s) => ({high:T.green, medium:T.yellow, low:T.orange})[s]||T.muted;
  const milestoneColor = (s) => ({done:T.green, active:T.accent, planned:T.muted})[s]||T.muted;

  return (
    <div style={{ paddingBottom:32 }}>

      {/* ── Vision banner ── */}
      <div style={{ background:T.isDark?"linear-gradient(135deg,#0F1117 0%,#1a1040 100%)":"linear-gradient(135deg,#EEF2FF 0%,#F5F3FF 100%)", border:`1px solid ${T.accent}30`, borderRadius:12, padding:"20px 24px", marginBottom:22, display:"flex", alignItems:"center", gap:18 }}>
        <div style={{ width:48, height:48, borderRadius:14, background:`${T.accent}25`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <span style={{ fontSize:24 }}>🤖</span>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:4 }}>Agentic QA Process — Transition Dashboard</div>
          <div style={{ fontSize:12, color:T.muted, lineHeight:1.7 }}>
            Intentwise is transitioning from <span style={{color:T.orange,fontWeight:700}}>manual quality engineering</span> to a fully <span style={{color:T.green,fontWeight:700}}>AI-driven autonomous QA loop</span>. This view tracks autonomy levels across every stage of the detect→triage→fix→verify pipeline, rule coverage across all data sources, and the roadmap to zero-touch quality assurance.
          </div>
        </div>
        <div style={{ textAlign:"center", flexShrink:0 }}>
          <div style={{ fontSize:42, fontWeight:900, color:T.accent, lineHeight:1 }}>{overallAuto}%</div>
          <div style={{ fontSize:11, color:T.muted, marginTop:4, fontWeight:600 }}>Overall Autonomy</div>
        </div>
      </div>

      {/* ── Pipeline Autonomy — 4 stage cards ── */}
      <div style={{ marginBottom:8 }}>
        <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:4 }}>Pipeline Stage Autonomy</div>
        <div style={{ fontSize:11, color:T.muted, marginBottom:14 }}>AI vs human intervention ratio per QA process stage. Click a stage for details.</div>
      </div>

      {/* Stage flow with arrows */}
      <div style={{ display:"flex", alignItems:"stretch", gap:0, marginBottom:22 }}>
        {QA_STAGES.map((stage, i) => {
          const isActive = activeStage === stage.id;
          const barW = stage.autonomyPct;
          return (
            <React.Fragment key={stage.id}>
              <div
                onClick={()=>setActiveStage(isActive ? null : stage.id)}
                style={{ flex:1, background:T.card, border:`2px solid ${isActive?stage.color:T.border}`, borderRadius:10, padding:"16px 14px", cursor:"pointer", transition:"border-color 0.15s, box-shadow 0.15s", boxShadow:isActive?`0 0 0 3px ${stage.color}20`:"none" }}
              >
                {/* Icon + label */}
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                  <span style={{ fontSize:20 }}>{stage.icon}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:800, color:T.text }}>{stage.label}</div>
                    <div style={{ fontSize:9, color:T.muted, marginTop:1 }}>{stage.desc}</div>
                  </div>
                </div>

                {/* Big autonomy % */}
                <div style={{ fontSize:36, fontWeight:900, color:stage.color, lineHeight:1, marginBottom:6 }}>{stage.autonomyPct}%</div>
                <div style={{ fontSize:10, color:T.muted, marginBottom:10, fontWeight:600 }}>
                  Autonomous · <span style={{ color:stage.trend>0?T.green:T.red }}>↑{Math.abs(stage.trend)}% MoM</span>
                </div>

                {/* Progress bar */}
                <div style={{ height:6, background:T.border, borderRadius:3, marginBottom:10, overflow:"hidden" }}>
                  <div style={{ height:6, borderRadius:3, width:`${barW}%`, background:stage.color, transition:"width 0.8s ease" }}/>
                </div>

                {/* AI vs Human breakdown */}
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10 }}>
                  <span><span style={{ color:stage.color, fontWeight:700 }}>{stage.aiActions}</span> <span style={{ color:T.muted }}>AI actions</span></span>
                  <span><span style={{ color:T.orange, fontWeight:700 }}>{stage.humanActions}</span> <span style={{ color:T.muted }}>human</span></span>
                </div>
              </div>

              {/* Arrow between stages */}
              {i < QA_STAGES.length-1 && (
                <div style={{ display:"flex", alignItems:"center", padding:"0 6px", flexShrink:0 }}>
                  <ArrowRight size={16} color={T.border2} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Stage detail panel */}
      {activeStage && (() => {
        const stage = QA_STAGES.find(s=>s.id===activeStage);
        return (
          <div style={{ background:`${stage.color}08`, border:`1px solid ${stage.color}30`, borderRadius:10, padding:"14px 18px", marginBottom:22, animation:"fadein 0.18s ease", display:"flex", gap:14, alignItems:"flex-start" }}>
            <span style={{ fontSize:28 }}>{stage.icon}</span>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:stage.color, marginBottom:4 }}>{stage.label} — Stage Detail</div>
              <div style={{ fontSize:12, color:T.text, lineHeight:1.8 }}>{stage.details}</div>
            </div>
            <button onClick={()=>setActiveStage(null)} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:T.muted }}><X size={13}/></button>
          </div>
        );
      })()}

      {/* ── AI vs Manual Intervention Ratio ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:22 }}>

        {/* Donut-style ratio card */}
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:"18px 20px" }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:14 }}>AI vs Manual Intervention — Last 30 Days</div>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            {/* Stacked bar */}
            <div style={{ flex:1 }}>
              {QA_STAGES.map(stage => {
                const total = stage.aiActions + stage.humanActions;
                const aiPct = Math.round((stage.aiActions/total)*100);
                return (
                  <div key={stage.id} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
                      <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span>{stage.icon}</span>
                        <span style={{ fontWeight:600, color:T.text }}>{stage.label}</span>
                      </span>
                      <span style={{ color:stage.color, fontWeight:700 }}>{aiPct}% AI</span>
                    </div>
                    <div style={{ height:10, background:T.border, borderRadius:5, overflow:"hidden", display:"flex" }}>
                      <div style={{ height:10, background:stage.color, width:`${aiPct}%`, transition:"width 0.8s ease" }}/>
                      <div style={{ height:10, background:T.orange+"60", flex:1 }}/>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:T.muted, marginTop:2 }}>
                      <span>{stage.aiActions} autonomous</span>
                      <span>{stage.humanActions} manual</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Summary */}
            <div style={{ textAlign:"center", flexShrink:0, minWidth:90 }}>
              <div style={{ fontSize:38, fontWeight:900, color:T.accent, lineHeight:1 }}>{overallAuto}%</div>
              <div style={{ fontSize:10, color:T.muted, marginTop:4 }}>Autonomous</div>
              <div style={{ fontSize:10, color:T.orange, fontWeight:700, marginTop:8 }}>{100-overallAuto}%</div>
              <div style={{ fontSize:10, color:T.muted }}>Manual</div>
              <div style={{ marginTop:12, fontSize:9, color:T.green, background:`${T.green}15`, borderRadius:6, padding:"4px 8px", fontWeight:700 }}>↑ {Math.round(overallAuto*0.14)}% vs 6mo ago</div>
            </div>
          </div>
        </div>

        {/* Rule Coverage Heatmap */}
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:"18px 20px" }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:4 }}>Rule Coverage Heatmap</div>
          <div style={{ fontSize:11, color:T.muted, marginBottom:14 }}>{coveragePct}% of tables have active quality rules · {coveredTables}/{totalTables} total</div>
          {RULE_COVERAGE.map(r => {
            const pct = Math.round((r.covered/r.tables)*100);
            const heatColor = pct>=90?T.green:pct>=70?T.yellow:T.orange;
            return (
              <div key={r.source} style={{ marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:3 }}>
                  <span style={{ fontWeight:600, color:T.text }}>{r.source}</span>
                  <div style={{ display:"flex", gap:10, fontSize:10 }}>
                    {r.critical>0  && <span style={{ color:T.red,    fontWeight:700 }}>{r.critical} critical</span>}
                    {r.failing>0   && <span style={{ color:T.orange, fontWeight:700 }}>{r.failing} failing</span>}
                    <span style={{ color:heatColor, fontWeight:700 }}>{pct}%</span>
                  </div>
                </div>
                {/* Heatmap-style segmented bar */}
                <div style={{ display:"flex", gap:1, height:14, borderRadius:4, overflow:"hidden" }}>
                  {Array.from({length:20}, (_,i) => {
                    const threshold = (r.covered/r.tables)*20;
                    const filled = i < threshold;
                    const isCrit = i < (r.critical/r.tables)*20;
                    const isFail = i < (r.failing/r.tables)*20;
                    return (
                      <div key={i} style={{ flex:1, borderRadius:1, background:!filled?T.border:isFail?T.red:isCrit?T.orange:heatColor, opacity:filled?1:0.3, transition:"background 0.3s" }}/>
                    );
                  })}
                </div>
                <div style={{ fontSize:9, color:T.dim, marginTop:2 }}>{r.covered}/{r.tables} tables covered</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Roadmap Tracker ── */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:"18px 20px" }}>
        <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:4 }}>Transition Roadmap — Manual → Fully Agentic QE</div>
        <div style={{ fontSize:11, color:T.muted, marginBottom:20 }}>Six phases to fully autonomous data quality. Each phase builds on the last.</div>

        {/* Timeline track */}
        <div style={{ position:"relative", paddingLeft:24 }}>
          {/* Vertical spine */}
          <div style={{ position:"absolute", left:10, top:8, bottom:8, width:2, background:T.border, borderRadius:1 }}/>

          {ROADMAP_MILESTONES.map((m, i) => {
            const mc = milestoneColor(m.status);
            const isDone    = m.status==="done";
            const isActive  = m.status==="active";
            const isPlanned = m.status==="planned";
            return (
              <div key={m.id} style={{ display:"flex", gap:14, marginBottom:16, position:"relative" }}>
                {/* Node on spine */}
                <div style={{ position:"absolute", left:-14, top:6, width:16, height:16, borderRadius:"50%", background:isDone?mc:isActive?T.card:T.card, border:`2.5px solid ${mc}`, display:"flex", alignItems:"center", justifyContent:"center", zIndex:1, flexShrink:0 }}>
                  {isDone && <Check size={9} color={mc}/>}
                  {isActive && <div style={{ width:6, height:6, borderRadius:"50%", background:mc, animation:"ping 2s infinite" }}/>}
                </div>

                {/* Content */}
                <div style={{ flex:1, background:T.isDark?"#0A0C10":T.bg, border:`1px solid ${isActive?mc+"40":T.border}`, borderRadius:9, padding:"12px 14px", marginLeft:10 }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:10, color:mc, background:`${mc}15`, border:`1px solid ${mc}30`, borderRadius:12, padding:"1px 8px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                          {m.status==="done"?"✓ Complete":m.status==="active"?"⚡ In Progress":"Planned"}
                        </span>
                        <span style={{ fontSize:10, color:T.dim, fontWeight:600 }}>{m.phase}</span>
                        <span style={{ fontSize:10, color:T.dim }}>·</span>
                        <span style={{ fontSize:10, color:T.dim }}>{m.target}</span>
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:4 }}>{m.label}</div>
                      <div style={{ fontSize:11, color:T.muted, lineHeight:1.7 }}>{m.desc}</div>
                    </div>
                    {(isDone || isActive) && (
                      <div style={{ textAlign:"center", flexShrink:0, minWidth:52 }}>
                        <div style={{ fontSize:20, fontWeight:900, color:mc }}>{m.pct}%</div>
                        <div style={{ fontSize:9, color:T.muted }}>done</div>
                      </div>
                    )}
                  </div>
                  {/* Progress bar for active items */}
                  {isActive && (
                    <div style={{ marginTop:10, height:5, background:T.border, borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:5, borderRadius:3, width:`${m.pct}%`, background:mc, transition:"width 1s ease" }}/>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}


// ─── Notification Center ──────────────────────────────────────────────────────
function NotificationCenter({ onClose, alertsState }) {
  const T = useTheme();
  const [tab, setTab]         = useState("channels");  // channels | templates | history
  const [channels, setChannels] = useState(NOTIF_CHANNELS.map(c=>({...c})));
  const [editTpl, setEditTpl]   = useState("detect");
  const [templates, setTemplates] = useState({...NOTIF_TEMPLATES});
  const [testSent, setTestSent]   = useState(null);
  const [slackWebhook, setSlackWebhook] = useState("");
  const [slackTestAlert, setSlackTestAlert] = useState("");
  const alertsList = alertsState?.length > 0 ? alertsState : ALERTS_RAW;
  const [slackResult, setSlackResult] = useState(null); // null | {ok,msg}
  const [slackSending, setSlackSending] = useState(false);

  const toggle = (id) =>
    setChannels(p=>p.map(c=>c.id===id?{...c,enabled:!c.enabled}:c));

  const typeIcon  = (t) => t==="slack"?"💬":"📧";
  const typeColor = (t) => t==="slack"?T.cyan:T.accent;

  const sendTest = async (ch) => {
    setTestSent(ch.id+"_sending");
    await new Promise(r=>setTimeout(r,1400));
    setTestSent(ch.id+"_ok");
    setTimeout(()=>setTestSent(null),2500);
  };

  const sendRealSlack = async () => {
    if (!slackWebhook.startsWith("https://hooks.slack.com/")) {
      setSlackResult({ ok:false, msg:"Invalid webhook URL. Must start with https://hooks.slack.com/" });
      return;
    }
    const alert = alertsList.find(a=>a.id===slackTestAlert) || alertsList[0];
    setSlackSending(true);
    setSlackResult(null);
    const sevEmoji = {critical:"🔴",high:"🟠",medium:"🟡",low:"🔵"}[alert.severity]||"⚪";
    const payload = {
      text: `${sevEmoji} *[${alert.severity.toUpperCase()}] Quality Issue Detected*`,
      blocks: [
        { type:"header", text:{ type:"plain_text", text:`${sevEmoji} Quality Alert — ${alert.severity.toUpperCase()}` } },
        { type:"section", fields:[
          { type:"mrkdwn", text:`*Rule:*\n${alert.rule}` },
          { type:"mrkdwn", text:`*Source:*\n${alert.source}.${alert.table}` },
          { type:"mrkdwn", text:`*Time (IST):*\n${alert.ts}` },
          { type:"mrkdwn", text:`*Status:*\n${alert.status}` },
        ]},
        { type:"section", text:{ type:"mrkdwn", text:`*AI Suggestion:* ${alert.aiSuggestion}` } },
        { type:"context", elements:[{ type:"mrkdwn", text:"Sent from *Intentwise Agentic QA Platform* · Test Alert" }] },
      ]
    };
    try {
      const resp = await fetch(slackWebhook, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        setSlackResult({ ok:true, msg:"✅ Message delivered to Slack!" });
      } else {
        const txt = await resp.text();
        setSlackResult({ ok:false, msg:`Slack returned: ${txt}` });
      }
    } catch(err) {
      setSlackResult({ ok:false, msg:`Network error: ${err.message}. (CORS will block browser → use from backend/Postman for production)` });
    }
    setSlackSending(false);
  };

  const EVENT_LABELS = {detect:"Issue Detected",fix_failed:"Fix Failed",verify:"Verified Fixed",escalate:"Escalation"};

  const panel = {
    position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:1100,
    display:"flex", alignItems:"center", justifyContent:"center", padding:24
  };
  const box = {
    background:T.surface, border:`1px solid ${T.border2}`, borderRadius:14,
    width:"100%", maxWidth:740, maxHeight:"88vh", display:"flex",
    flexDirection:"column", overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,0.5)"
  };

  return (
    <div style={panel} onClick={onClose}>
      <div style={box} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding:"18px 22px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:`${T.cyan}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Bell size={17} color={T.cyan}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:800, color:T.text }}>Notification Center</div>
            <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Route quality alerts to Slack &amp; email · manage message templates</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted }}><X size={16}/></button>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, padding:"10px 22px", borderBottom:`1px solid ${T.border}`, background:T.isDark?"#0A0C10":T.bg }}>
          {[["channels","Channels"],["templates","Templates"],["history","Send History"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{ padding:"6px 16px", borderRadius:7, border:`1px solid ${tab===id?T.accent+"50":"transparent"}`, background:tab===id?`${T.accent}15`:"transparent", color:tab===id?T.accentL:T.muted, fontSize:11, fontWeight:tab===id?700:500, cursor:"pointer" }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"18px 22px" }}>

          {/* ── Channels ── */}
          {tab==="channels" && (
            <div>
              {/* ── Live Slack Webhook Test ── */}
              <div style={{ background:T.isDark?"#0A1A0A":`${T.green}06`, border:`1px solid ${T.green}30`, borderRadius:10, padding:"16px 18px", marginBottom:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                  <span style={{ fontSize:18 }}>💬</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:T.text }}>Live Slack Test</div>
                    <div style={{ fontSize:11, color:T.muted }}>Paste a Slack Incoming Webhook URL and fire a real alert message</div>
                  </div>
                </div>

                {/* Webhook input */}
                <div style={{ marginBottom:10 }}>
                  <div style={{ fontSize:10, color:T.muted, fontWeight:700, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.04em" }}>Incoming Webhook URL</div>
                  <input
                    value={slackWebhook}
                    onChange={e=>setSlackWebhook(e.target.value)}
                    placeholder="https://hooks.slack.com/services/T00000/B00000/XXXXXXXX"
                    style={{ width:"100%", background:T.isDark?"#0A0C10":T.bg, border:`1px solid ${slackWebhook.startsWith("https://hooks.slack.com/")?T.green:T.border2}`, borderRadius:7, padding:"9px 12px", color:T.text, fontSize:12, outline:"none", fontFamily:"Consolas,monospace" }}
                  />
                  <div style={{ fontSize:10, color:T.dim, marginTop:4 }}>
                    Get this from Slack → App → Incoming Webhooks → Add New Webhook to Workspace
                  </div>
                </div>

                {/* Alert selector */}
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10, color:T.muted, fontWeight:700, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.04em" }}>Test Alert</div>
                  <select value={slackTestAlert} onChange={e=>setSlackTestAlert(e.target.value)} style={{ width:"100%", background:T.isDark?"#0A0C10":T.bg, border:`1px solid ${T.border2}`, borderRadius:7, padding:"8px 12px", color:T.text, fontSize:12, outline:"none" }}>
                    {alertsList.map(a=>(
                      <option key={a.id} value={a.id}>[{a.severity.toUpperCase()}] {a.title}</option>
                    ))}
                  </select>
                </div>

                {/* Preview */}
                {slackTestAlert && (() => {
                  const a = alertsList.find(x=>x.id===slackTestAlert);
                  if (!a) return null;
                  const sevEmoji = {critical:"🔴",high:"🟠",medium:"🟡",low:"🔵"}[a.severity]||"⚪";
                  return (
                    <div style={{ background:T.isDark?"#1a2a1a":"#F0FDF4", border:`1px solid ${T.green}30`, borderRadius:7, padding:"10px 12px", marginBottom:12, fontFamily:"Consolas,monospace" }}>
                      <div style={{ fontSize:10, color:T.dim, marginBottom:4, fontWeight:700 }}>PAYLOAD PREVIEW</div>
                      <div style={{ fontSize:11, color:T.text, lineHeight:1.8 }}>
                        <div>{sevEmoji} *[{a.severity.toUpperCase()}] Quality Issue Detected*</div>
                        <div style={{ color:T.muted }}>Rule: {a.rule}</div>
                        <div style={{ color:T.muted }}>Source: {a.source}.{a.table}</div>
                        <div style={{ color:T.muted }}>Time: {a.ts} IST</div>
                        <div style={{ color:T.cyan }}>AI: {a.aiSuggestion?.slice(0,60)}…</div>
                      </div>
                    </div>
                  );
                })()}

                {/* Send button */}
                <button
                  onClick={sendRealSlack}
                  disabled={slackSending || !slackWebhook}
                  style={{ width:"100%", background:slackWebhook?T.green:"#334155", border:"none", borderRadius:8, padding:"10px", cursor:slackWebhook?"pointer":"not-allowed", color:"white", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity:slackSending?0.7:1, transition:"all 0.2s" }}
                >
                  {slackSending
                    ? <><RefreshCw size={14} style={{animation:"spin 1s linear infinite"}}/> Sending to Slack…</>
                    : <><Send size={14}/> Send Test Alert to Slack</>
                  }
                </button>

                {/* Result */}
                {slackResult && (
                  <div style={{ marginTop:10, padding:"10px 12px", background:slackResult.ok?`${T.green}12`:`${T.red}12`, border:`1px solid ${slackResult.ok?T.green:T.red}30`, borderRadius:7, fontSize:12, color:slackResult.ok?T.green:T.red, lineHeight:1.6 }}>
                    {slackResult.msg}
                  </div>
                )}
              </div>
              <div style={{ fontSize:11, color:T.muted, marginBottom:16 }}>
                Channel routing — configure which channels receive alerts for each severity and event type.
              </div>
              {channels.map(ch=>(
                <div key={ch.id} style={{ background:T.card, border:`1px solid ${ch.enabled?T.border2:T.border}`, borderRadius:10, padding:"14px 16px", marginBottom:12, opacity:ch.enabled?1:0.55, transition:"opacity 0.2s" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <span style={{ fontSize:20 }}>{typeIcon(ch.type)}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{ch.name}</div>
                      <code style={{ fontSize:10, color:T.dim, fontFamily:"Consolas,monospace" }}>{ch.webhook||ch.name}</code>
                    </div>
                    {/* Toggle */}
                    <button onClick={()=>toggle(ch.id)} style={{ background:ch.enabled?`${T.green}18`:`${T.muted}18`, border:`1px solid ${ch.enabled?T.green:T.border2}`, borderRadius:20, padding:"5px 14px", cursor:"pointer", fontSize:11, fontWeight:700, color:ch.enabled?T.green:T.muted, display:"flex", alignItems:"center", gap:6 }}>
                      {ch.enabled?<><Check size={11}/>Enabled</>:<><X size={11}/>Disabled</>}
                    </button>
                    {/* Test */}
                    <button onClick={()=>sendTest(ch)} disabled={!ch.enabled||testSent?.startsWith(ch.id)} style={{ background:`${T.cyan}12`, border:`1px solid ${T.cyan}30`, borderRadius:7, padding:"5px 12px", cursor:ch.enabled?"pointer":"not-allowed", fontSize:11, color:T.cyan, fontWeight:600, display:"flex", alignItems:"center", gap:5, opacity:ch.enabled?1:0.4 }}>
                      {testSent===ch.id+"_sending"?<><RefreshCw size={11} style={{animation:"spin 1s linear infinite"}}/>Sending…</>:testSent===ch.id+"_ok"?<><Check size={11}/>Sent!</>:<><Send size={11}/>Test</>}
                    </button>
                  </div>
                  {/* Severity chips */}
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
                    <span style={{ fontSize:10, color:T.dim, fontWeight:700, marginRight:2 }}>Severities:</span>
                    {["critical","high","medium","low"].map(s=>{
                      const on = ch.severities.includes(s);
                      const sc = {critical:T.red,high:T.orange,medium:T.yellow,low:T.cyan}[s];
                      return <span key={s} style={{ fontSize:10, color:on?sc:T.dim, background:on?`${sc}15`:T.border, border:`1px solid ${on?sc+"40":T.border2}`, borderRadius:12, padding:"2px 9px", fontWeight:on?700:400, textTransform:"uppercase" }}>{s}</span>;
                    })}
                    <span style={{ fontSize:10, color:T.dim, fontWeight:700, marginLeft:8, marginRight:2 }}>Events:</span>
                    {ch.events.map(ev=>(
                      <span key={ev} style={{ fontSize:10, color:T.accent, background:`${T.accent}12`, border:`1px solid ${T.accent}30`, borderRadius:12, padding:"2px 9px", fontWeight:600 }}>{EVENT_LABELS[ev]||ev}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Templates ── */}
          {tab==="templates" && (
            <div style={{ display:"grid", gridTemplateColumns:"180px 1fr", gap:16 }}>
              {/* Template selector */}
              <div>
                <div style={{ fontSize:10, color:T.muted, fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>Event Type</div>
                {Object.entries(EVENT_LABELS).map(([id,label])=>(
                  <button key={id} onClick={()=>setEditTpl(id)} style={{ display:"block", width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${editTpl===id?T.accent+"50":"transparent"}`, background:editTpl===id?`${T.accent}15`:"transparent", color:editTpl===id?T.accentL:T.muted, fontSize:12, fontWeight:editTpl===id?700:400, cursor:"pointer", textAlign:"left", marginBottom:4 }}>
                    {label}
                  </button>
                ))}
              </div>
              {/* Template editor */}
              <div>
                <div style={{ fontSize:10, color:T.muted, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>Subject</div>
                <input
                  value={templates[editTpl]?.subject||""}
                  onChange={e=>setTemplates(p=>({...p,[editTpl]:{...p[editTpl],subject:e.target.value}}))}
                  style={{ width:"100%", background:T.isDark?"#0A0C10":T.bg, border:`1px solid ${T.border2}`, borderRadius:7, padding:"8px 12px", color:T.text, fontSize:12, outline:"none", marginBottom:12, fontFamily:"Consolas,monospace" }}
                />
                <div style={{ fontSize:10, color:T.muted, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>Message Body</div>
                <textarea
                  value={templates[editTpl]?.body||""}
                  onChange={e=>setTemplates(p=>({...p,[editTpl]:{...p[editTpl],body:e.target.value}}))}
                  rows={12}
                  style={{ width:"100%", background:T.isDark?"#0A0C10":T.bg, border:`1px solid ${T.border2}`, borderRadius:7, padding:"10px 12px", color:T.text, fontSize:11, outline:"none", fontFamily:"Consolas,monospace", lineHeight:1.8, resize:"vertical" }}
                />
                <div style={{ marginTop:8, fontSize:10, color:T.dim }}>
                  Variables: <code style={{color:T.cyan,fontFamily:"Consolas,monospace"}}>{'{{severity}} {{source}} {{table}} {{rule}} {{ts}} {{ai_suggestion}}'}</code>
                </div>
                <button style={{ marginTop:12, background:T.accent, border:"none", borderRadius:8, padding:"8px 20px", cursor:"pointer", color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
                  <Save size={13}/> Save Template
                </button>
              </div>
            </div>
          )}

          {/* ── History ── */}
          {tab==="history" && (
            <div>
              <div style={{ fontSize:11, color:T.muted, marginBottom:14 }}>Recent notifications sent by the platform.</div>
              {NOTIF_HISTORY.map(n=>(
                <div key={n.id} className="row-hover" style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:8, borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:18 }}>{n.channel.startsWith("#")?"💬":"📧"}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:T.text }}>{n.title}</div>
                    <div style={{ fontSize:10, color:T.muted, marginTop:2 }}>{n.channel} · {n.ts}</div>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, color:T.green, background:`${T.green}12`, border:`1px solid ${T.green}30`, borderRadius:12, padding:"2px 9px", textTransform:"uppercase" }}>{n.status}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


// ─── Command Palette (Cmd+K) ──────────────────────────────────────────────────
function CommandPalette({ onClose, onNavigate, alertsState }) {
  const T = useTheme();
  const [q, setQ]       = useState("");
  const [sel, setSel]   = useState(0);
  const inputRef        = useRef(null);

  useEffect(()=>{ inputRef.current?.focus(); },[]);
  useEffect(()=>{ setSel(0); },[q]);

  const ALL_ITEMS = [
    // Tabs
    { type:"nav",   icon:"🏠", label:"Ops Command Center",   hint:"Tab",  action:"tab:dashboard"  },
    { type:"nav",   icon:"🤖", label:"QA Process Health",    hint:"Tab",  action:"tab:qahealth"   },
    { type:"nav",   icon:"🔔", label:"Detect & Triage",      hint:"Tab",  action:"tab:alerts"     },
        { type:"nav",   icon:"🤖", label:"QA Agents",            hint:"Tab",  action:"tab:agents"     },
    { type:"nav",   icon:"🔀", label:"Remediation Flows",    hint:"Tab",  action:"tab:workflows"  },
    { type:"nav",   icon:"✓",  label:"Quality Rules",        hint:"Tab",  action:"tab:rules"      },
        { type:"nav",   icon:"🔒", label:"Human-in-the-Loop",    hint:"Tab",  action:"tab:gates"      },
    { type:"nav",   icon:"📋", label:"Audit Trail",          hint:"Tab",  action:"tab:history"    },
    { type:"nav",   icon:"🗄️", label:"Data Sources",         hint:"Tab",  action:"tab:sources"    },
    // Alerts
    ...(alertsState||[]).map(a=>({ type:"alert", icon:{critical:"🔴",high:"🟠",medium:"🟡",low:"🔵"}[a.severity]||"⚪", label:a.title, hint:a.severity, action:"drill:alert:"+a.id, data:a })),
    // Agents
    ...AGENTS.map(a=>({ type:"agent", icon:a.icon, label:a.name, hint:a.status, action:"drill:agent:"+a.id, data:a })),
    // Rules
    ...INIT_RULES.map(r=>({ type:"rule", icon:"✓", label:r.name, hint:r.type, action:"drill:rule:"+r.id, data:r })),
    // Sources
    ...DATASOURCES.map(d=>({ type:"source", icon:"🗄️", label:d.name, hint:d.status, action:"drill:source:"+d.id, data:d })),
  ];

  const TYPE_LABELS = { nav:"Navigation", alert:"Alert", agent:"Agent", rule:"Rule", source:"Source" };
  const TYPE_COLORS = { nav:T.accent, alert:T.red, agent:T.green, rule:T.purple, source:T.cyan };

  const filtered = q.trim()
    ? ALL_ITEMS.filter(it=>it.label.toLowerCase().includes(q.toLowerCase())||it.hint?.toLowerCase().includes(q.toLowerCase())||TYPE_LABELS[it.type]?.toLowerCase().includes(q.toLowerCase()))
    : ALL_ITEMS.filter(it=>it.type==="nav");

  const handleKey = (e) => {
    if(e.key==="ArrowDown"){ e.preventDefault(); setSel(s=>Math.min(s+1,filtered.length-1)); }
    if(e.key==="ArrowUp")  { e.preventDefault(); setSel(s=>Math.max(s-1,0)); }
    if(e.key==="Enter")    { e.preventDefault(); if(filtered[sel]) activate(filtered[sel]); }
    if(e.key==="Escape")   { onClose(); }
  };

  const activate = (item) => {
    if(item.action.startsWith("tab:")) {
      onNavigate(item.action.replace("tab:",""));
    } else if(item.action.startsWith("drill:alert:")) {
      const a = (alertsState||[]).find(x=>x.id===item.action.replace("drill:alert:",""));
      if(a && window._drillFn) window._drillFn("alert",a);
    } else if(item.action.startsWith("drill:agent:")) {
      const a = AGENTS.find(x=>x.id===item.action.replace("drill:agent:",""));
      if(a && window._drillFn) window._drillFn("agent",a);
    } else if(item.action.startsWith("drill:rule:")) {
      const r = INIT_RULES.find(x=>x.id===item.action.replace("drill:rule:",""));
      if(r && window._drillFn) window._drillFn("rule",r);
    } else if(item.action.startsWith("drill:source:")) {
      const d = DATASOURCES.find(x=>x.id===item.action.replace("drill:source:",""));
      if(d && window._drillFn) window._drillFn("datasource",d);
    }
    onClose();
  };

  // Group results
  const grouped = {};
  filtered.forEach(it=>{ if(!grouped[it.type]) grouped[it.type]=[]; grouped[it.type].push(it); });

  let globalIdx = 0;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.72)", zIndex:1200, display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:"12vh" }} onClick={onClose}>
      <div style={{ width:"100%", maxWidth:580, background:T.surface, border:`1px solid ${T.border2}`, borderRadius:14, overflow:"hidden", boxShadow:"0 32px 80px rgba(0,0,0,0.6)", animation:"fadein 0.12s ease" }} onClick={e=>e.stopPropagation()}>
        {/* Search input */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 16px", borderBottom:`1px solid ${T.border}` }}>
          <Search size={16} color={T.muted}/>
          <input
            ref={inputRef}
            value={q}
            onChange={e=>setQ(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search tabs, alerts, agents, rules…"
            style={{ flex:1, background:"none", border:"none", outline:"none", color:T.text, fontSize:14, fontFamily:"inherit" }}
          />
          {q && <button onClick={()=>setQ("")} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted }}><X size={13}/></button>}
          <kbd style={{ fontSize:10, color:T.dim, background:T.border, borderRadius:4, padding:"2px 6px", fontFamily:"Consolas,monospace" }}>ESC</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight:420, overflowY:"auto" }}>
          {filtered.length===0 && (
            <div style={{ padding:"28px", textAlign:"center", color:T.muted, fontSize:12 }}>No results for "{q}"</div>
          )}
          {Object.entries(grouped).map(([type, items])=>(
            <div key={type}>
              <div style={{ padding:"8px 16px 4px", fontSize:10, color:T.dim, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>{TYPE_LABELS[type]}</div>
              {items.map(item=>{
                const idx = globalIdx++;
                const isSelected = idx===sel;
                return (
                  <div
                    key={item.action}
                    onClick={()=>activate(item)}
                    onMouseEnter={()=>setSel(idx)}
                    style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 16px", cursor:"pointer", background:isSelected?`${T.accent}15`:"transparent", transition:"background 0.08s" }}
                  >
                    <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
                    <span style={{ flex:1, fontSize:13, color:T.text, fontWeight:isSelected?600:400 }}>{item.label}</span>
                    <span style={{ fontSize:10, color:TYPE_COLORS[item.type]||T.muted, background:`${TYPE_COLORS[item.type]||T.muted}15`, borderRadius:10, padding:"2px 8px", fontWeight:600, textTransform:"uppercase", flexShrink:0 }}>{item.hint}</span>
                    {isSelected && <ArrowRight size={13} color={T.accent}/>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div style={{ padding:"8px 16px", borderTop:`1px solid ${T.border}`, display:"flex", gap:16, fontSize:10, color:T.dim }}>
          <span><kbd style={{ background:T.border, borderRadius:3, padding:"1px 5px", fontFamily:"Consolas,monospace" }}>↑↓</kbd> navigate</span>
          <span><kbd style={{ background:T.border, borderRadius:3, padding:"1px 5px", fontFamily:"Consolas,monospace" }}>↵</kbd> open</span>
          <span><kbd style={{ background:T.border, borderRadius:3, padding:"1px 5px", fontFamily:"Consolas,monospace" }}>ESC</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

// ─── Agent Evals Panel ────────────────────────────────────────────────────────
function AgentEvalsPanel({ agentId, agent }) {
  const T = useTheme();
  const [cases, setCases] = useState(
    (EVAL_CASES[agentId]||[]).map(c=>({...c}))
  );
  const [running, setRunning] = useState(null);   // eval id being judged
  const [runningAll, setRunningAll] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [filterCat, setFilterCat] = useState("all");

  const updateCase = (id, patch) =>
    setCases(prev => prev.map(c => c.id===id ? {...c,...patch} : c));

  // Judge a single eval case via Claude API
  const judgeCase = async (ec) => {
    setRunning(ec.id);
    updateCase(ec.id, { verdict:null, score:null, judgeRationale:"Evaluating…" });
    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          max_tokens:600,
          system:`You are an expert AI evaluator for a data quality monitoring platform (Intentwise). 
You will be given an eval case with: category, expected output, and actual output.
Your job: score the actual output vs expected on a scale of 1–10, give a verdict (PASS/PARTIAL/FAIL), and write a 2–3 sentence rationale.

Scoring guide:
- 9–10: Actual fully meets expected, specific and actionable
- 7–8: Mostly correct, minor gaps
- 5–6: Partially correct, significant gaps
- 1–4: Wrong, missing key elements, or harmful

Respond ONLY with valid JSON (no markdown):
{"verdict":"PASS|PARTIAL|FAIL","score":8,"rationale":"Your 2-3 sentence rationale here."}`,
          messages:[{
            role:"user",
            content:`Category: ${ec.category}
Label: ${ec.label}
Input context: ${ec.input}
Expected: ${ec.expected}
Actual: ${ec.actual}

Evaluate the actual output.`
          }]
        })
      });
      const data = await res.json();
      const raw = data.content?.find(b=>b.type==="text")?.text || "{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      updateCase(ec.id, {
        verdict: parsed.verdict || "FAIL",
        score:   parsed.score   || 0,
        judgeRationale: parsed.rationale || "No rationale returned.",
      });
    } catch(e) {
      updateCase(ec.id, { verdict:"ERROR", score:0, judgeRationale:"Eval failed — API error." });
    }
    setRunning(null);
  };

  // Run all unscored cases
  const judgeAll = async () => {
    setRunningAll(true);
    const unscored = cases.filter(c=>!c.verdict);
    for (const ec of unscored) {
      await judgeCase(ec);
      await new Promise(r=>setTimeout(r,400));
    }
    setRunningAll(false);
  };

  const scored    = cases.filter(c=>c.verdict && c.verdict!=="ERROR");
  const avgScore  = scored.length ? (scored.reduce((s,c)=>s+(c.score||0),0)/scored.length).toFixed(1) : null;
  const passCount = cases.filter(c=>c.verdict==="PASS").length;
  const partCount = cases.filter(c=>c.verdict==="PARTIAL").length;
  const failCount = cases.filter(c=>c.verdict==="FAIL").length;

  const verdictColor = v => ({PASS:T.green, PARTIAL:T.yellow, FAIL:T.red, ERROR:T.muted})[v] || T.muted;
  const scoreColor   = s => s>=8?T.green:s>=6?T.yellow:T.red;
  const catColor     = cat => CATEGORY_META[cat]?.color || T.muted;

  const visible = cases.filter(c => filterCat==="all" || c.category===filterCat);

  return (
    <div style={{ padding:"16px 18px" }}>

      {/* ── Header strip ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:`${T.purple}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:18 }}>🧪</span>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:T.text }}>Eval Framework</div>
            <div style={{ fontSize:11, color:T.muted }}>{cases.length} cases · AI judge powered by Claude</div>
          </div>
        </div>
        <button
          onClick={judgeAll}
          disabled={runningAll || cases.every(c=>c.verdict)}
          style={{ background:T.purple, border:"none", borderRadius:8, padding:"8px 18px", cursor:runningAll||cases.every(c=>c.verdict)?"not-allowed":"pointer", color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:7, opacity:cases.every(c=>c.verdict)?0.4:1 }}
        >
          {runningAll
            ? <><RefreshCw size={13} style={{animation:"spin 1s linear infinite"}}/>Judging…</>
            : <><Sparkles size={13}/>Run All Evals</>
          }
        </button>
      </div>

      {/* ── Score summary ── */}
      {scored.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
          {[
            ["Avg Score", avgScore+"/10", avgScore>=8?T.green:avgScore>=6?T.yellow:T.red],
            ["Pass",      passCount,      T.green],
            ["Partial",   partCount,      T.yellow],
            ["Fail",      failCount,      T.red],
          ].map(([l,v,c])=>(
            <div key={l} style={{ background:T.isDark?`${c}10`:`${c}08`, border:`1px solid ${c}30`, borderRadius:9, padding:"10px 14px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:800, color:c }}>{v}</div>
              <div style={{ fontSize:10, color:T.muted, marginTop:3, fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Category filter ── */}
      <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
        {["all","agent_output","rule_quality","claude_response"].map(cat=>{
          const meta = CATEGORY_META[cat];
          const active = filterCat===cat;
          const col = meta?.color || T.accent;
          return (
            <button key={cat} onClick={()=>setFilterCat(cat)} style={{ padding:"5px 12px", borderRadius:20, border:`1px solid ${active?col+"60":T.border2}`, background:active?`${col}15`:T.isDark?"#0A0C10":T.bg, color:active?col:T.muted, fontSize:10, fontWeight:active?700:500, cursor:"pointer" }}>
              {meta?.icon||"🔎"} {meta?.label||"All"}
            </button>
          );
        })}
      </div>

      {/* ── Eval cases ── */}
      {visible.length===0 && (
        <div style={{ textAlign:"center", color:T.muted, fontSize:12, padding:"24px 0" }}>No eval cases for this agent yet.</div>
      )}

      {visible.map(ec=>{
        const isExpanded = expanded===ec.id;
        const isRunning  = running===ec.id;
        const catMeta    = CATEGORY_META[ec.category] || {};
        const vc = ec.verdict ? verdictColor(ec.verdict) : T.muted;

        return (
          <div key={ec.id} style={{ background:T.isDark?"#0A0C10":T.bg, border:`1px solid ${isExpanded?T.accent+"40":T.border}`, borderRadius:10, marginBottom:10, overflow:"hidden", transition:"border-color 0.15s" }}>

            {/* Case header row */}
            <div
              onClick={()=>setExpanded(isExpanded?null:ec.id)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", cursor:"pointer" }}
            >
              {/* Category pill */}
              <span style={{ fontSize:10, color:catMeta.color||T.muted, background:`${catMeta.color||T.muted}15`, border:`1px solid ${catMeta.color||T.muted}30`, borderRadius:12, padding:"2px 9px", fontWeight:700, flexShrink:0, whiteSpace:"nowrap" }}>
                {catMeta.icon} {catMeta.label}
              </span>

              {/* Label */}
              <span style={{ fontSize:12, fontWeight:600, color:T.text, flex:1 }}>{ec.label}</span>

              {/* Score */}
              {ec.score!=null && !isRunning && (
                <span style={{ fontSize:13, fontWeight:800, color:scoreColor(ec.score), flexShrink:0 }}>{ec.score}/10</span>
              )}

              {/* Verdict badge */}
              {ec.verdict && !isRunning && (
                <span style={{ fontSize:10, fontWeight:700, color:vc, background:`${vc}15`, border:`1px solid ${vc}30`, borderRadius:12, padding:"2px 9px", flexShrink:0, textTransform:"uppercase" }}>
                  {ec.verdict}
                </span>
              )}

              {/* Run button */}
              <button
                onClick={e=>{e.stopPropagation(); judgeCase(ec);}}
                disabled={!!running||runningAll}
                style={{ background:isRunning?`${T.purple}10`:`${T.purple}18`, border:`1px solid ${T.purple}40`, borderRadius:6, padding:"5px 11px", cursor:running?"not-allowed":"pointer", color:T.purple, fontSize:10, fontWeight:700, display:"flex", alignItems:"center", gap:5, flexShrink:0, opacity:running&&!isRunning?0.4:1 }}
              >
                {isRunning
                  ? <><RefreshCw size={11} style={{animation:"spin 1s linear infinite"}}/>Judging</>
                  : <><Sparkles size={11}/>{ec.verdict?"Re-eval":"Judge"}</>
                }
              </button>

              <span style={{ color:T.dim }}>{isExpanded?<ChevronUp size={13}/>:<ChevronDown size={13}/>}</span>
            </div>

            {/* Expanded detail — side-by-side comparison */}
            {isExpanded && (
              <div style={{ borderTop:`1px solid ${T.border}`, padding:"14px", animation:"fadein 0.18s ease" }}>

                {/* Input context */}
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10, color:T.dim, fontWeight:700, marginBottom:5, letterSpacing:"0.05em", textTransform:"uppercase" }}>Input Context</div>
                  <div style={{ fontSize:11, color:T.muted, background:T.isDark?"#13161E":T.border, borderRadius:7, padding:"9px 12px", lineHeight:1.6 }}>{ec.input}</div>
                </div>

                {/* Side-by-side expected vs actual */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:10, color:T.green, fontWeight:700, marginBottom:5, letterSpacing:"0.05em", textTransform:"uppercase", display:"flex", alignItems:"center", gap:5 }}>
                      <CheckCircle size={11}/> Expected
                    </div>
                    <div style={{ fontSize:11, color:T.text, background:`${T.green}08`, border:`1px solid ${T.green}25`, borderRadius:8, padding:"10px 12px", lineHeight:1.7, minHeight:70 }}>
                      {ec.expected}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize:10, color:T.cyan, fontWeight:700, marginBottom:5, letterSpacing:"0.05em", textTransform:"uppercase", display:"flex", alignItems:"center", gap:5 }}>
                      <Eye size={11}/> Actual Output
                    </div>
                    <div style={{ fontSize:11, color:T.text, background:`${T.cyan}08`, border:`1px solid ${T.cyan}25`, borderRadius:8, padding:"10px 12px", lineHeight:1.7, minHeight:70 }}>
                      {ec.actual}
                    </div>
                  </div>
                </div>

                {/* AI judge result */}
                {(ec.judgeRationale || isRunning) && (
                  <div style={{ background:`${T.purple}08`, border:`1px solid ${T.purple}25`, borderRadius:8, padding:"12px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <BrainCircuit size={13} color={T.purple}/>
                      <span style={{ fontSize:10, fontWeight:700, color:T.purple, letterSpacing:"0.06em", textTransform:"uppercase" }}>Claude AI Judge</span>
                      {ec.score!=null && !isRunning && (
                        <span style={{ marginLeft:"auto", fontSize:15, fontWeight:800, color:scoreColor(ec.score) }}>{ec.score}/10</span>
                      )}
                      {ec.verdict && !isRunning && (
                        <span style={{ fontSize:11, fontWeight:700, color:verdictColor(ec.verdict), background:`${verdictColor(ec.verdict)}15`, border:`1px solid ${verdictColor(ec.verdict)}30`, borderRadius:12, padding:"2px 10px", textTransform:"uppercase" }}>
                          {ec.verdict}
                        </span>
                      )}
                    </div>
                    {isRunning
                      ? <div style={{ display:"flex", alignItems:"center", gap:8, color:T.muted, fontSize:12 }}>
                          <RefreshCw size={12} style={{animation:"spin 1s linear infinite", color:T.purple}}/> Claude is evaluating this output…
                        </div>
                      : <div style={{ fontSize:12, color:T.text, lineHeight:1.8 }}>{ec.judgeRationale}</div>
                    }
                  </div>
                )}

                {/* Prompt if not yet judged */}
                {!ec.judgeRationale && !isRunning && (
                  <div style={{ textAlign:"center", padding:"10px 0" }}>
                    <button onClick={()=>judgeCase(ec)} style={{ background:`${T.purple}18`, border:`1px solid ${T.purple}40`, borderRadius:8, padding:"8px 20px", cursor:"pointer", color:T.purple, fontSize:12, fontWeight:700, display:"inline-flex", alignItems:"center", gap:7 }}>
                      <Sparkles size={13}/>Run AI Judge on this case
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Agent Config Panel ───────────────────────────────────────────────────────
function AgentConfigPanel({ agent, config, onSave, onCancel }) {
  const T = useTheme();
  const [cfg, setCfg] = useState({...config});
  const set = (k,v) => setCfg(p=>({...p,[k]:v}));

  const Field = ({label, k, placeholder}) => (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:11, color:T.muted, fontWeight:700, display:"block", marginBottom:5, letterSpacing:"0.04em", textTransform:"uppercase" }}>{label}</label>
      <input
        value={cfg[k]||""}
        onChange={e=>set(k,e.target.value)}
        placeholder={placeholder}
        style={{ width:"100%", background:T.isDark?"#0A0C10":T.border, border:`1px solid ${T.border2}`, borderRadius:7, padding:"9px 12px", color:T.text, fontSize:12, outline:"none", fontFamily:"Consolas,monospace" }}
      />
    </div>
  );

  return (
    <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"22px 24px", maxWidth:560 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <span style={{ fontSize:26 }}>{agent.icon}</span>
        <div>
          <div style={{ fontSize:14, fontWeight:800, color:T.text }}>{agent.name}</div>
          <div style={{ fontSize:11, color:T.muted }}>Agent configuration</div>
        </div>
        <button onClick={onCancel} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:T.muted }}><X size={16}/></button>
      </div>

      <Field label="Cron Schedule" k="schedule" placeholder="*/30 * * * *" />
      <Field label="Target Tables / Sources" k="targets" placeholder="prod-postgres.report" />
      <Field label="Threshold" k="threshold" placeholder="0 missing" />
      <Field label="Alert Condition" k="alertOn" placeholder="any_missing" />

      <div style={{ marginBottom:18 }}>
        <label style={{ fontSize:11, color:T.muted, fontWeight:700, display:"block", marginBottom:8, letterSpacing:"0.04em", textTransform:"uppercase" }}>Auto-Fix</label>
        <div style={{ display:"flex", gap:8 }}>
          {[true,false].map(v=>(
            <button key={String(v)} onClick={()=>set("autoFix",v)} style={{ flex:1, padding:"9px", borderRadius:7, border:`1px solid ${cfg.autoFix===v?T.accent+"60":T.border2}`, background:cfg.autoFix===v?`${T.accent}15`:T.isDark?"#0A0C10":T.border, cursor:"pointer", fontSize:12, fontWeight:cfg.autoFix===v?700:400, color:cfg.autoFix===v?T.accentL:T.muted }}>
              {v?"✓ Enabled":"✗ Disabled"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background:T.isDark?"#0A0C10":T.bg, border:`1px solid ${T.border}`, borderRadius:8, padding:"10px 14px", marginBottom:18 }}>
        <div style={{ fontSize:10, color:T.muted, marginBottom:6, fontWeight:700 }}>PREVIEW</div>
        <code style={{ fontSize:11, color:T.cyan, fontFamily:"Consolas,monospace", lineHeight:1.8 }}>
          schedule: {cfg.schedule}<br/>
          targets: [{(cfg.targets||"").toString()}]<br/>
          alert_on: {cfg.alertOn}<br/>
          auto_fix: {String(cfg.autoFix)}
        </code>
      </div>

      <div style={{ display:"flex", gap:10 }}>
        <button onClick={()=>onSave(cfg)} style={{ flex:1, background:T.accent, border:"none", borderRadius:8, padding:"10px", cursor:"pointer", color:"white", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <Save size={14}/> Save Configuration
        </button>
        <button onClick={onCancel} style={{ background:T.isDark?"#0A0C10":T.border, border:`1px solid ${T.border2}`, borderRadius:8, padding:"10px 20px", cursor:"pointer", color:T.muted, fontSize:12 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function AgentCard({ agent, onDrill }) {
  // kept for DrillModal compat — not used in main tab anymore
  const statusCol = { running:C.green, idle:C.muted, paused:C.orange }[agent.status] || C.muted;
  return (
    <div onClick={()=>onDrill&&onDrill('agent',agent)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:9, padding:"12px 14px", cursor:"pointer" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <span style={{ fontSize:13, fontWeight:700, color:C.accentL }}>{agent.icon} {agent.name}</span>
        <span style={{ fontSize:9, color:statusCol, fontWeight:700, textTransform:"uppercase" }}>{agent.status}</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
        {[["Runs",agent.runsToday,C.accentL],["Issues",agent.issuesFound,agent.issuesFound>0?C.orange:C.green],["Fixed",agent.fixed,C.green]].map(([l,v,c])=>(
          <div key={l} style={{ textAlign:"center", background:`${C.border}50`, borderRadius:5, padding:"6px 2px" }}>
            <div style={{ fontSize:16, fontWeight:800, color:c }}>{v}</div>
            <div style={{ fontSize:9, color:C.muted }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KPI({ label, value, sub, trend, icon: Icon, color, spark, onClick, badge }) {
  const up = trend > 0, down = trend < 0;
  return (
    <Card style={{ padding:"16px 18px", cursor:onClick?"pointer":"default" }} onClick={onClick}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
        <div>
          <div style={{ fontSize:11, color:C.muted, letterSpacing:"0.04em", textTransform:"uppercase", fontWeight:700, marginBottom:6 }}>{label}</div>
          <div style={{ fontSize:30, fontWeight:800, color:color||C.text, lineHeight:1 }}>{value}</div>
          {sub && <div style={{ fontSize:11, color:C.muted, marginTop:5 }}>{sub}</div>}
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:`${color||C.accent}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon size={16} color={color||C.accentL} />
          </div>
          {spark && <Spark data={spark} color={color||C.accentL} />}
        </div>
      </div>
      {trend !== undefined && (
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          {up ? <ArrowUpRight size={13} color={C.green}/> : down ? <ArrowDownRight size={13} color={C.red}/> : <Minus size={13} color={C.muted}/>}
          <span style={{ fontSize:11, color:up?C.green:down?C.red:C.muted, fontWeight:600 }}>{Math.abs(trend)}% vs yesterday</span>
        </div>
      )}
    </Card>
  );
}

// ─── Datasource Row ───────────────────────────────────────────────────────────
const DS_ICONS = { PostgreSQL:"🐘", Redshift:"🔴", BigQuery:"🔵", Snowflake:"❄️", MySQL:"🐬", GSheets:"📊" };
function DSRow({ ds, onDrill }) {
  const statusCol = { healthy:C.green, degraded:C.yellow, offline:C.red }[ds.status] || C.muted;
  return (
    <div className="row-hover" style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 18px", borderBottom:`1px solid ${C.border}` }}>
      <span style={{ fontSize:18 }}>{DS_ICONS[ds.type]||"🗄️"}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{ds.name}</div>
        <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{ds.type} · {ds.tables} tables{ds.host ? ` · ${ds.host.split(".")[0]}…` : ""}</div>
      </div>
      <div style={{ textAlign:"right", flexShrink:0 }}>
        {ds.latency ? <div style={{ fontSize:11, color:ds.latency>200?C.yellow:C.green, fontWeight:600 }}>{ds.latency}ms</div> : <div style={{ fontSize:11, color:C.red }}>—</div>}
        <div style={{ fontSize:10, color:C.muted }}>latency</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
        <Dot status={ds.status} />
        <span style={{ fontSize:10, color:statusCol, fontWeight:600, textTransform:"uppercase", minWidth:52 }}>{ds.status}</span>
      </div>
      <button
        onClick={()=>onDrill&&onDrill("datasource",ds)}
        style={{ background:`${C.accent}14`, border:`1px solid ${C.accent}40`, borderRadius:7, padding:"5px 13px", cursor:"pointer", fontSize:11, color:C.accentL, fontWeight:700, display:"flex", alignItems:"center", gap:5, flexShrink:0 }}
      >
        <Settings size={11}/> Configure
      </button>
    </div>
  );
}




// ─── Datasource Drill Panel (extracted to avoid conditional hooks) ────────────
function DatasourceDrillPanel({ ds, onClose, onNavigate, tab, setTab, alertsState }) {
  const T = useTheme();
  const sc = {healthy:T.green,degraded:T.yellow,offline:T.red}[ds.status]||T.muted;
  const relatedAlerts = (alertsState||[]).filter(a=>a.source===ds.name);
  const relatedRules  = INIT_RULES.filter(r=>r.source===ds.id||r.source===ds.name);

  const [host,      setHost]      = useState(ds.host        || "");
  const [port,      setPort]      = useState(ds.port        || "");
  const [database,  setDatabase]  = useState(ds.database    || "");
  const [schema,    setSchema]    = useState(ds.schema      || "");
  const [user,      setUser]      = useState(ds.user        || "");
  const [password,  setPassword]  = useState("");
  const [sslMode,   setSslMode]   = useState(ds.sslMode     || "require");
  const [syncSched, setSyncSched] = useState(ds.syncSchedule|| "0 * * * *");
  const [desc,      setDesc]      = useState(ds.description || "");
  const [showPass,  setShowPass]  = useState(false);
  const [testing,   setTesting]   = useState(false);
  const [testResult,setTestResult]= useState(null);
  const [saved,     setSaved]     = useState(false);


}

// ─── Universal Drill Modal ────────────────────────────────────────────────────
// drillTarget: { type: "alert"|"rule"|"agent"|"datasource"|"history"|"kpi", data: {...} }
function DrillModal({ target, onClose, onNavigate, alertsState }) {
  const T = useTheme();
  const [tab, setTab] = useState("overview");
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState("");
  const [resolved, setResolved] = useState(false);
  const [liveData,    setLiveData]    = useState(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError,   setLiveError]   = useState(null);

  // Fetch live preview when "data" tab is opened
  React.useEffect(() => {
    if (tab !== "data") return;
    const tbl = target?.data?.table;
    if (!tbl) return;
    // parse "schema.table" or just "table"
    const parts = tbl.split(".");
    const schema = parts.length > 1 ? parts[0] : "mws";
    const table  = parts.length > 1 ? parts[1] : parts[0];
    setLiveData(null); setLiveError(null); setLiveLoading(true);
    fetch(`${API_BASE}/api/preview?schema=${encodeURIComponent(schema)}&table=${encodeURIComponent(table)}&limit=10`)
      .then(r => r.json())
      .then(d => { if (d.error) setLiveError(d.error); else setLiveData(d.rows || d); })
      .catch(e => setLiveError(e.message))
      .finally(() => setLiveLoading(false));
  }, [tab, target?.data?.table]);

  // All hooks must be declared before any conditional returns
  const type = target?.type;
  const data = target?.data;

  if (!target) return null;



  const tableData = liveData;
  const statusColor = { open:T.red, triaged:T.yellow, resolved:T.green, pass:T.green, fail:T.red, pending:T.yellow, running:T.cyan, idle:T.muted, paused:T.orange, healthy:T.green, degraded:T.yellow, offline:T.red }[data.status||data.result||data.lastResult||""] || T.muted;

  const runRule = async () => {
    setRunning(true); setRunResult(null); setAiText("");
    await new Promise(r=>setTimeout(r, 1400));
    const fail = data.lastResult === "fail" || data.type === "freshness" || data.type === "unique";
    const pass = !fail;
    setRunResult({ pass, summary: pass ? `✓ All checks passed on ${data.table}` : `✗ Rule failed: ${data.name}. ${data.type==="freshness"?"Data is 8.3h old (threshold 6h).":data.type==="unique"?"1,842 duplicate rows found.":"Check threshold exceeded."}` });
    if (!pass) fetchAIExplain();
    setRunning(false);
  };

  const fetchAIExplain = async () => {
    setAiLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ max_tokens:350,
          system:"You are a data quality expert for Intentwise. Given a failed data rule, explain root cause and give a specific 2-step fix. Be concise and technical.",
          messages:[{role:"user", content:`Rule failed: ${data.name} (${data.type}) on ${data.source} → ${data.table}. Give root cause + fix in 2-3 sentences.`}]
        })
      });
      const d = await res.json();
      setAiText(d.content?.find(b=>b.type==="text")?.text || "");
    } catch(e) { setAiText(""); }
    setAiLoading(false);
  };

  const overlay = { position:"fixed", inset:0, background:"rgba(0,0,0,0.72)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:24 };
  const panel   = { background:T.surface, border:`1px solid ${T.border2}`, borderRadius:14, width:"100%", maxWidth:820, maxHeight:"88vh", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,0.6)" };
  const Btn = ({children, color, onClick, disabled, small}) => (
    <button onClick={onClick} disabled={disabled} style={{ background:`${color}18`, border:`1px solid ${color}40`, borderRadius:7, padding:small?"5px 12px":"8px 18px", cursor:disabled?"not-allowed":"pointer", color, fontSize:small?10:12, fontWeight:700, display:"flex", alignItems:"center", gap:6, opacity:disabled?0.5:1, whiteSpace:"nowrap" }}>
      {children}
    </button>
  );
  const TabBtn = ({id, label, icon}) => (
    <button onClick={()=>setTab(id)} style={{ padding:"7px 14px", borderRadius:7, border:`1px solid ${tab===id?T.accent+"50":"transparent"}`, background:tab===id?`${T.accent}15`:"transparent", color:tab===id?T.accentL:T.muted, fontSize:11, fontWeight:tab===id?700:500, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
      {icon} {label}
    </button>
  );

  // ── ALERT detail ──────────────────────────────────────────────────────────
  if (type === "alert") {
    const a = data;
    const sc = {critical:T.red,high:T.orange,medium:T.yellow,low:T.cyan}[a.severity]||T.muted;
    return (
      <div style={overlay} onClick={onClose}>
        <div style={panel} onClick={e=>e.stopPropagation()}>
          {/* Header */}
          <div style={{ padding:"18px 22px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"flex-start", gap:14 }}>
            <div style={{ width:42, height:42, borderRadius:11, background:`${sc}20`, border:`1px solid ${sc}40`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <AlertOctagon size={20} color={sc}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:800, color:T.text, marginBottom:4 }}>{a.title}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:10, color:sc, background:`${sc}15`, border:`1px solid ${sc}30`, borderRadius:12, padding:"2px 9px", fontWeight:700, textTransform:"uppercase" }}>{a.severity}</span>
                <span style={{ fontSize:10, color:T.muted }}>{a.source}</span>
                <code style={{ fontSize:10, color:T.cyan, background:`${T.cyan}10`, borderRadius:4, padding:"2px 7px" }}>{a.table}</code>
                <span style={{ fontSize:10, color:T.muted }}>{a.rule}</span>
                <span style={{ fontSize:10, color:T.muted }}>{a.ts}</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {!resolved && <Btn color={T.green} onClick={()=>setResolved(true)}><Check size={12}/>Resolve</Btn>}
              {resolved && <span style={{color:T.green,fontSize:11,fontWeight:700}}>✓ Resolved</span>}
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted, padding:4 }}><X size={16}/></button>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:4, padding:"10px 22px", borderBottom:`1px solid ${T.border}` }}>
            <TabBtn id="overview" label="Overview" icon="📋"/>
            <TabBtn id="data"     label="Table Data" icon="🗄️"/>
            <TabBtn id="ai"       label="AI Analysis" icon="🤖"/>
            <TabBtn id="history"  label="Similar Alerts" icon="📜"/>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"18px 22px" }}>
            {tab==="overview" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:"14px" }}>
                  <div style={{ fontSize:10, color:T.muted, fontWeight:700, marginBottom:8, letterSpacing:"0.08em" }}>DETAILS</div>
                  {[["Status",a.status],["Source",a.source],["Table",a.table],["Rule",a.rule],["Detected",a.ts]].map(([k,v])=>(
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${T.border}`, fontSize:11 }}>
                      <span style={{color:T.muted}}>{k}</span>
                      <span style={{color:T.text, fontWeight:600}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background:`${sc}08`, border:`1px solid ${sc}25`, borderRadius:10, padding:"14px" }}>
                  <div style={{ fontSize:10, color:sc, fontWeight:700, marginBottom:8, letterSpacing:"0.08em" }}>AI SUGGESTION</div>
                  <div style={{ fontSize:12, color:T.text, lineHeight:1.7 }}>{a.aiSuggestion}</div>
                  <div style={{ marginTop:12, display:"flex", gap:8 }}>
                    {a.canAutoFix && <Btn color={T.green} small><Wrench size={11}/>Auto Fix</Btn>}
                    <Btn color={T.accent} small onClick={()=>setTab("data")}><Eye size={11}/>View Data</Btn>
                  </div>
                </div>
              </div>
            )}
            {tab==="data" && (
              <div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:T.text }}>
                    Sample rows from <code style={{color:T.cyan,fontSize:12}}>{a.table}</code>
                  </div>
                  <Btn color={T.accent} small onClick={()=>onNavigate&&onNavigate("sources")}><TableProperties size={11}/>Browse Full Schema</Btn>
                </div>
                {tableData && tableData.length > 0 ? (
                  <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:8, overflow:"auto" }}>
                    <div style={{ display:"grid", gridTemplateColumns:`repeat(${Object.keys(tableData[0]).length},minmax(120px,1fr))`, background:T.isDark?"#0A0C10":T.border, padding:"7px 14px", gap:12, minWidth:"max-content" }}>
                      {Object.keys(tableData[0]).map(k=><div key={k} style={{fontSize:9,color:T.dim,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>{k}</div>)}
                    </div>
                    {tableData.map((row,i)=>{
                      const hasNull = Object.values(row).some(v=>v===null);
                      const isDupe = i===1||i===3;
                      return (
                        <div key={i} style={{ display:"grid", gridTemplateColumns:`repeat(${Object.keys(row).length},minmax(120px,1fr))`, padding:"8px 14px", borderTop:`1px solid ${T.border}`, gap:12, background:hasNull?`${T.red}10`:isDupe?`${T.orange}08`:"transparent", minWidth:"max-content" }}>
                          {Object.values(row).map((v,j)=>(
                            <div key={j} style={{fontSize:11,color:v===null?T.red:isDupe&&j===0?T.orange:T.text,fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace"}}>
                              {v===null?<span style={{fontWeight:700}}>NULL ⚠</span>:String(v)}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                    <div style={{padding:"6px 14px",fontSize:10,color:T.muted,borderTop:`1px solid ${T.border}`}}>
                      Showing 5 sample rows · <span style={{color:T.red}}>Red = NULL</span> · <span style={{color:T.orange}}>Orange = Duplicate</span>
                    </div>
                  </div>
                ) : liveLoading ? (
                  <div style={{color:T.muted,fontSize:12,padding:"24px 0",textAlign:"center"}}>⏳ Loading live data…</div>
                ) : liveError ? (
                  <div style={{color:T.red,fontSize:12,padding:"20px 0",textAlign:"center"}}>⚠ {liveError}</div>
                ) : (
                  <div style={{color:T.muted,fontSize:12,padding:"20px 0",textAlign:"center"}}>No rows returned for this table.</div>
                )}
              </div>
            )}
            {tab==="ai" && (
              <div>
                <div style={{ background:`${T.purple}08`, border:`1px solid ${T.purple}25`, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
                  <div style={{fontSize:10,color:T.purple,fontWeight:700,marginBottom:6,letterSpacing:"0.08em"}}>AI ROOT CAUSE ANALYSIS</div>
                  <div style={{fontSize:12,color:T.text,lineHeight:1.8}}>{a.aiSuggestion}</div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {[["Correlated Group","CG-001 — Redshift lag cascade"],["Pattern","Seen 2x in 30 days"],["Estimated Fix Time","15–30 min"],["Auto-Fix Available",a.canAutoFix?"Yes":"No"]].map(([k,v])=>(
                    <div key={k} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 14px"}}>
                      <div style={{fontSize:10,color:T.muted,marginBottom:4}}>{k}</div>
                      <div style={{fontSize:12,fontWeight:700,color:T.text}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab==="history" && (
              <div>
                <div style={{fontSize:12,color:T.muted,marginBottom:12}}>Recent alerts on <code style={{color:T.cyan}}>{a.table}</code></div>
                {RUN_HISTORY.filter(r=>r.table===a.table||r.name.toLowerCase().includes(a.table.split("_")[2]||"x")).slice(0,5).concat(RUN_HISTORY.slice(0,3)).slice(0,5).map(r=>(
                  <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:T.card,border:`1px solid ${T.border}`,borderRadius:8,marginBottom:6,cursor:"pointer"}} onClick={()=>onNavigate&&onNavigate("history")}>
                    <span style={{fontSize:10,fontWeight:700,color:r.result==="fail"?T.red:r.result==="pass"?T.green:T.yellow,textTransform:"uppercase"}}>{r.result}</span>
                    <span style={{fontSize:11,color:T.text,flex:1}}>{r.name}</span>
                    <span style={{fontSize:10,color:T.muted,fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace"}}>{r.ts}</span>
                    <ArrowRight size={12} color={T.dim}/>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── RULE detail ───────────────────────────────────────────────────────────
  if (type === "rule") {
    const r = data;
    const resultColor = {pass:T.green, fail:T.red, pending:T.yellow}[r.lastResult]||T.muted;
    return (
      <div style={overlay} onClick={onClose}>
        <div style={panel} onClick={e=>e.stopPropagation()}>
          <div style={{ padding:"18px 22px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"flex-start", gap:14 }}>
            <div style={{ width:42, height:42, borderRadius:11, background:`${T.purple}20`, border:`1px solid ${T.purple}40`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:20 }}>✓</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:800, color:T.text, marginBottom:4 }}>{r.name}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <code style={{ fontSize:10, color:T.cyan, background:`${T.cyan}10`, borderRadius:4, padding:"2px 7px" }}>{r.source}</code>
                <code style={{ fontSize:10, color:T.purple, background:`${T.purple}10`, borderRadius:4, padding:"2px 7px" }}>{r.table}</code>
                <span style={{ fontSize:10, color:T.muted }}>{r.type} · col: {r.column}</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <Btn color={T.accent} onClick={runRule} disabled={running}>
                {running ? <><RefreshCw size={12} style={{animation:"spin 1s linear infinite"}}/>Running…</> : <><Play size={12}/>Run Now</>}
              </Btn>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted, padding:4 }}><X size={16}/></button>
          </div>

          <div style={{ display:"flex", gap:4, padding:"10px 22px", borderBottom:`1px solid ${T.border}` }}>
            <TabBtn id="overview" label="Overview" icon="📋"/>
            <TabBtn id="sql"      label="SQL Query" icon="💾"/>
            <TabBtn id="data"     label="Sample Data" icon="🗄️"/>
            <TabBtn id="history"  label="Run History" icon="📜"/>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"18px 22px" }}>
            {tab==="overview" && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
                  {[["Type",r.type],["Table",r.table],["Column",r.column],["Schedule",r.schedule],["Severity",r.severity],["Status",r.status],["Last Run",r.lastRun],["Last Result",r.lastResult]].map(([k,v])=>(
                    <div key={k} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 14px"}}>
                      <div style={{fontSize:10,color:T.muted,marginBottom:4}}>{k}</div>
                      <div style={{fontSize:12,fontWeight:700,color:k==="Last Result"?resultColor:T.text}}>{v}</div>
                    </div>
                  ))}
                </div>
                {/* Run result inline */}
                {runResult && (
                  <div style={{ background:runResult.pass?`${T.green}10`:`${T.red}10`, border:`1px solid ${runResult.pass?T.green:T.red}40`, borderRadius:10, padding:"14px 16px", marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      {runResult.pass?<CheckCircle size={16} color={T.green}/>:<XCircle size={16} color={T.red}/>}
                      <span style={{ fontSize:13, fontWeight:800, color:runResult.pass?T.green:T.red }}>{runResult.pass?"PASSED":"FAILED"}</span>
                    </div>
                    <div style={{ fontSize:11, color:T.text }}>{runResult.summary}</div>
                    {(aiLoading||aiText) && (
                      <div style={{ marginTop:10, background:`${T.purple}10`, border:`1px solid ${T.purple}30`, borderRadius:8, padding:"10px 12px" }}>
                        <div style={{ fontSize:9, color:T.purple, fontWeight:700, marginBottom:6, letterSpacing:"0.08em" }}>AI ROOT CAUSE</div>
                        {aiLoading
                          ? <div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:T.purple,animation:`bounce 1.2s ${i*0.2}s infinite`,display:"inline-block"}}/>)}</div>
                          : <div style={{fontSize:11,color:T.text,lineHeight:1.7}}>{aiText}</div>
                        }
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {tab==="sql" && (
              <div>
                <div style={{ background:T.isDark?"#0A0C10":"#F1F5F9", border:`1px solid ${T.border}`, borderRadius:8, padding:"16px 18px", fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace", fontSize:12, color:T.cyan, lineHeight:2, marginBottom:12 }}>
                  <div style={{ color:T.dim, marginBottom:4, fontSize:10 }}>-- Generated validation query</div>
                  {r.type==="not_null"   && `SELECT\n  COUNT(*) AS null_count,\n  COUNT(*) * 100.0 / COUNT(1) AS null_pct\nFROM ${r.table}\nWHERE ${r.column} IS NULL\n  AND report_date >= CURRENT_DATE - 1;`}
                  {r.type==="row_count"  && `SELECT\n  report_date,\n  COUNT(*) AS row_count\nFROM ${r.table}\nWHERE report_date >= CURRENT_DATE - 7\nGROUP BY 1\nORDER BY 1 DESC;`}
                  {r.type==="freshness"  && `SELECT\n  MAX(${r.column}) AS latest_update,\n  DATEDIFF('hour', MAX(${r.column}), GETDATE()) AS age_hours\nFROM ${r.table};`}
                  {r.type==="unique"     && `SELECT\n  ${r.column}, COUNT(*) AS occurrences\nFROM ${r.table}\nWHERE report_date >= CURRENT_DATE - 1\nGROUP BY ${r.column}\nHAVING COUNT(*) > 1\nORDER BY occurrences DESC\nLIMIT 20;`}
                  {r.type==="custom_sql" && `-- Custom assertion\nSELECT COUNT(*) AS violations\nFROM ${r.table}\nWHERE /* your condition here */;`}
                  {!["not_null","row_count","freshness","unique","custom_sql"].includes(r.type) && `SELECT * FROM ${r.table} LIMIT 5;`}
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn color={T.accent} onClick={runRule} disabled={running}>
                    {running?<><RefreshCw size={12} style={{animation:"spin 1s linear infinite"}}/>Running…</>:<><Play size={12}/>Run Query</>}
                  </Btn>
                  <Btn color={T.muted} small><Copy size={11}/>Copy SQL</Btn>
                </div>
              </div>
            )}
            {tab==="data" && (
              <div>
                {tableData && tableData.length > 0 ? (
                  <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:8, overflow:"auto" }}>
                    <div style={{ display:"grid", gridTemplateColumns:`repeat(${Object.keys(tableData[0]).length},minmax(110px,1fr))`, background:T.isDark?"#0A0C10":T.border, padding:"7px 14px", gap:10, minWidth:"max-content" }}>
                      {Object.keys(tableData[0]).map(k=><div key={k} style={{fontSize:9,color:T.dim,fontWeight:700,textTransform:"uppercase"}}>{k}</div>)}
                    </div>
                    {tableData.map((row,i)=>{
                      const hasNull=Object.values(row).some(v=>v===null);
                      return (
                        <div key={i} style={{ display:"grid", gridTemplateColumns:`repeat(${Object.keys(row).length},minmax(110px,1fr))`, padding:"8px 14px", borderTop:`1px solid ${T.border}`, gap:10, background:hasNull?`${T.red}12`:"transparent", minWidth:"max-content" }}>
                          {Object.values(row).map((v,j)=>(
                            <div key={j} style={{fontSize:11,color:v===null?T.red:T.text,fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace"}}>
                              {v===null?<span style={{fontWeight:700}}>NULL ⚠</span>:String(v)}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ) : <div style={{color:T.muted,fontSize:12,textAlign:"center",padding:"24px 0"}}>No sample data for this table.</div>}
              </div>
            )}
            {tab==="history" && (
              <div>
                {RUN_HISTORY.filter(rh=>rh.name===r.name||rh.table===r.table).concat(RUN_HISTORY.filter(rh=>rh.type==="rule")).slice(0,6).map(rh=>(
                  <div key={rh.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.card,border:`1px solid ${T.border}`,borderRadius:8,marginBottom:6}}>
                    <span style={{fontSize:11,fontWeight:800,color:rh.result==="pass"?T.green:rh.result==="fail"?T.red:T.yellow,textTransform:"uppercase",width:48,flexShrink:0}}>{rh.result}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,color:T.text}}>{rh.name}</div>
                      <div style={{fontSize:10,color:T.muted,marginTop:2}}>{rh.detail}</div>
                    </div>
                    <span style={{fontSize:10,color:T.muted,fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace",flexShrink:0}}>{rh.ts} · {rh.duration}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── AGENT detail ──────────────────────────────────────────────────────────
  if (type === "agent") {
    const a = data;
    const sc = {running:T.green,idle:T.muted,paused:T.orange}[a.status]||T.muted;
    return (
      <div style={overlay} onClick={onClose}>
        <div style={panel} onClick={e=>e.stopPropagation()}>
          <div style={{ padding:"18px 22px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:42, height:42, borderRadius:11, background:`${sc}20`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Bot size={20} color={sc}/></div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:800, color:T.text }}>{a.name}</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:3 }}>Last run: {a.lastRun} · Next: {a.nextRun}</div>
            </div>
            <span style={{color:sc,fontSize:11,fontWeight:700,textTransform:"uppercase",background:`${sc}15`,border:`1px solid ${sc}30`,borderRadius:8,padding:"4px 12px"}}>{a.status}</span>
            <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:T.muted,padding:4 }}><X size={16}/></button>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"18px 22px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:18 }}>
              {[["Runs Today",a.runsToday,T.accentL],["Issues Found",a.issuesFound,a.issuesFound>0?T.orange:T.green],["Auto Fixed",a.fixed,T.green]].map(([l,v,c])=>(
                <div key={l} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"16px",textAlign:"center"}}>
                  <div style={{fontSize:28,fontWeight:800,color:c}}>{v}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:4}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:"14px 16px" }}>
              <div style={{fontSize:10,color:T.muted,fontWeight:700,marginBottom:10,letterSpacing:"0.08em"}}>RECENT RUNS</div>
              {RUN_HISTORY.filter(rh=>rh.type==="agent"&&rh.name===a.name).concat(RUN_HISTORY.filter(rh=>rh.type==="agent")).slice(0,5).map(rh=>(
                <div key={rh.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:10,fontWeight:700,color:rh.result==="pass"?T.green:T.yellow,width:44,flexShrink:0,textTransform:"uppercase"}}>{rh.result}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:T.text}}>{rh.detail}</div>
                  </div>
                  <span style={{fontSize:10,color:T.muted,fontFamily:"'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace"}}>{rh.ts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── DATASOURCE detail ─────────────────────────────────────────────────────
  if (type === "datasource") {
    return <DatasourceDrillPanel ds={data} onClose={onClose} onNavigate={onNavigate} tab={tab} setTab={setTab} alertsState={alertsState} />;
  }

  return null;
}


// ─── DB Explorer Tab ──────────────────────────────────────────────────────────
const API_BASE = "https://intentwise-backend-production.up.railway.app";

function DBExplorerTab({ kpis, kpisLoading, alertsState, setActiveTab: setActiveTabProp, accounts, accountId, setAccountId, liveRules, rulesLoading, agentScanResult, agentScanLoading, onAgentScan, trend, topAsins, dataMode }) {
  const T = useTheme();
  const [schemas,           setSchemas]           = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [error,             setError]             = useState(null);
  const [expandedSchemas,   setExpandedSchemas]   = useState({});
  const [preview,           setPreview]           = useState(null);
  const [previewLoading,    setPreviewLoading]    = useState(false);
  const [sql,               setSql]               = useState("");
  const [queryResult,       setQueryResult]       = useState(null);
  const [queryLoading,      setQueryLoading]      = useState(false);
  const [queryError,        setQueryError]        = useState(null);
  const [view,              setView]              = useState("explorer");
  const [savedQueries,      setSavedQueries]      = useState([
    { id:"sq-1", name:"Orders last 7 days",  sql:"SELECT amazon_order_id, asin, order_status, item_price, purchase_date\nFROM mws.orders\nWHERE purchase_date >= CURRENT_DATE - 7\nORDER BY purchase_date DESC\nLIMIT 100" },
    { id:"sq-2", name:"Low inventory ASINs", sql:"SELECT asin, product_name, available, days_of_supply\nFROM mws.inventory\nWHERE available < 10\nORDER BY available ASC" },
    { id:"sq-3", name:"Buy box < 50%",       sql:"SELECT child_asin, traffic_by_asin_buy_box_prcntg, units_ordered\nFROM mws.sales_and_traffic_by_asin\nWHERE traffic_by_asin_buy_box_prcntg < 0.5\nORDER BY traffic_by_asin_buy_box_prcntg ASC\nLIMIT 50" },
  ]);
  const [saveModalOpen,     setSaveModalOpen]     = useState(false);
  const [saveName,          setSaveName]          = useState("");
  const [showSavedDropdown, setShowSavedDropdown] = useState(false);

  useEffect(() => {
    fetch(API_BASE + "/api/tables")
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); }
        else {
          setSchemas(data);
          if (data.length > 0) setExpandedSchemas({ [data[0].table_schema || data[0].schema]: true });
        }
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const toggleSchema = (s) => setExpandedSchemas(p => ({ ...p, [s]: !p[s] }));

  const loadPreview = async (schema, table) => {
    setPreview({ schema, table, data: null });
    setPreviewLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/preview?schema=${encodeURIComponent(schema)}&table=${encodeURIComponent(table)}&limit=50`);
      const data = await res.json();
      setPreview({ schema, table, data });
    } catch(e) {
      setPreview({ schema, table, data: { error: e.message } });
    }
    setPreviewLoading(false);
  };

  const runQuery = async () => {
    if (!sql.trim()) return;
    setQueryLoading(true); setQueryResult(null); setQueryError(null);
    try {
      const res = await fetch(API_BASE + "/api/query?sql=" + encodeURIComponent(sql));
      const data = await res.json();
      if (data.error) setQueryError(data.error);
      else setQueryResult(data);
    } catch(e) { setQueryError(e.message); }
    setQueryLoading(false);
  };

  const confirmSave = () => {
    if (!saveName.trim()) return;
    setSavedQueries(p => [...p, { id:`sq-${Date.now()}`, name:saveName.trim(), sql }]);
    setSaveModalOpen(false);
  };

  const grouped = schemas.reduce((acc, t) => {
    const s = t.schema || t.table_schema;
    const n = t.name  || t.table_name;
    if (!s || !n) return acc;
    if (!acc[s]) acc[s] = [];
    acc[s].push(n);
    return acc;
  }, {});

  return (
    <div style={{ height:"calc(100vh - 120px)", display:"flex", flexDirection:"column", gap:0, position:"relative" }}>

      <div style={{ display:"flex", gap:8, alignItems:"center", padding:"10px 0 12px", flexWrap:"wrap" }}>
        {["explorer","query"].map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{ fontSize:11, fontWeight:700, padding:"5px 14px", borderRadius:7, cursor:"pointer",
              border:`1px solid ${view===v ? T.accent : T.border2}`,
              background: view===v ? `${T.accent}18` : "none",
              color: view===v ? T.accentL : T.muted }}>
            {v === "explorer" ? "Schema Explorer" : "Query Editor"}
          </button>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:11, background:`${T.green}18`, border:`1px solid ${T.green}30`, color:T.green, borderRadius:6, padding:"3px 10px", fontWeight:700 }}>LIVE</span>
          <span style={{ fontSize:11, color:T.muted }}>redshift-staging</span>
        </div>
      </div>

      {view === "explorer" && (
        <div style={{ display:"flex", gap:12, flex:1, minHeight:0 }}>
          <div style={{ width:240, background:T.card, border:`1px solid ${T.border}`, borderRadius:10, overflow:"auto", flexShrink:0 }}>
            <div style={{ padding:"10px 14px", borderBottom:`1px solid ${T.border}`, fontSize:10, color:T.muted, fontWeight:700, letterSpacing:"0.07em" }}>TABLES</div>
            {loading && <div style={{ padding:16, fontSize:12, color:T.muted }}>Loading…</div>}
            {error   && <div style={{ padding:16, fontSize:12, color:T.red }}>{error}</div>}
            {Object.entries(grouped).map(([schema, tables]) => (
              <div key={schema}>
                <div onClick={() => toggleSchema(schema)}
                  style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", cursor:"pointer",
                    background: expandedSchemas[schema] ? `${T.accent}08` : "none",
                    borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:10, color:T.muted }}>{expandedSchemas[schema] ? "▾" : "▸"}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:T.accent, fontFamily:"monospace" }}>{schema}</span>
                  <span style={{ fontSize:10, color:T.muted, marginLeft:"auto" }}>{tables.length}</span>
                </div>
                {expandedSchemas[schema] && tables.map(t => (
                  <div key={t} onClick={() => loadPreview(schema, t)}
                    style={{ padding:"6px 14px 6px 28px", cursor:"pointer", fontSize:11, fontFamily:"monospace",
                      color: preview?.table===t ? T.accentL : T.text,
                      background: preview?.table===t ? `${T.accent}12` : "none",
                      borderBottom:`1px solid ${T.border}20` }}>
                    {t}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ flex:1, background:T.card, border:`1px solid ${T.border}`, borderRadius:10, overflow:"auto" }}>
            {!preview && (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:T.muted, fontSize:12 }}>
                Select a table to preview data
              </div>
            )}
            {preview && (
              <div>
                <div style={{ padding:"10px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:T.text, fontFamily:"monospace" }}>{preview.schema}.{preview.table}</span>
                  <button onClick={() => { setSql(`SELECT *\nFROM ${preview.schema}.${preview.table}\nLIMIT 100`); setView("query"); }}
                    style={{ fontSize:10, background:`${T.accent}15`, border:`1px solid ${T.accent}30`, borderRadius:5, padding:"2px 9px", cursor:"pointer", color:T.accentL, fontWeight:700, marginLeft:"auto" }}>
                    Open in Query Editor →
                  </button>
                </div>
                {previewLoading && <div style={{ padding:16, fontSize:12, color:T.muted }}>Loading preview…</div>}
                {preview.data && !previewLoading && (
                  preview.data.error
                    ? <div style={{ padding:16, fontSize:12, color:T.red }}>{preview.data.error}</div>
                    : preview.data.rows && preview.data.rows.length > 0
                      ? (
                        <div style={{ overflowX:"auto" }}>
                          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                            <thead>
                              <tr>{Object.keys(preview.data.rows[0]).map(col => (
                                <th key={col} style={{ textAlign:"left", padding:"7px 12px", color:T.muted, borderBottom:`1px solid ${T.border}`, fontWeight:700, whiteSpace:"nowrap", background:T.isDark?"#0A0C10":T.border, fontSize:10 }}>{col}</th>
                              ))}</tr>
                            </thead>
                            <tbody>{preview.data.rows.map((row, ri) => (
                              <tr key={ri} style={{ borderBottom:`1px solid ${T.border}20` }}>
                                {Object.values(row).map((v, j) => (
                                  <td key={j} style={{ padding:"6px 12px", color:T.text, whiteSpace:"nowrap", maxWidth:200, overflow:"hidden", textOverflow:"ellipsis" }}>
                                    {v == null ? <span style={{ color:T.muted }}>NULL</span> : String(v)}
                                  </td>
                                ))}
                              </tr>
                            ))}</tbody>
                          </table>
                        </div>
                      )
                      : <div style={{ padding:16, fontSize:12, color:T.muted }}>No rows returned.</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {view === "query" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10, flex:1, minHeight:0 }}>
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, overflow:"hidden" }}>
            <div style={{ padding:"8px 14px", borderBottom:`1px solid ${T.border}`, fontSize:10, color:T.muted, fontWeight:700, letterSpacing:"0.07em" }}>SQL QUERY — Ctrl+Enter to run</div>
            <textarea value={sql} onChange={e => setSql(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) runQuery(); }}
              placeholder="SELECT * FROM mws.orders LIMIT 100"
              rows={6}
              style={{ width:"100%", background:T.isDark?"#0A0C10":T.bg, border:"none", padding:"12px 14px", color:T.text, fontSize:12, fontFamily:"Consolas,monospace", outline:"none", resize:"vertical", boxSizing:"border-box" }}
            />
            <div style={{ padding:"8px 14px", borderTop:`1px solid ${T.border}`, display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
              <button onClick={runQuery} disabled={queryLoading || !sql.trim()}
                style={{ background:T.accent, border:"none", borderRadius:8, padding:"7px 18px", cursor:"pointer", color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:6, opacity: (queryLoading || !sql.trim()) ? 0.6 : 1 }}>
                {queryLoading
                  ? <><RefreshCw size={12} style={{ animation:"spin 1s linear infinite" }}/> Running…</>
                  : <>⚡ Run</>}
              </button>
              <button onClick={() => { if (sql.trim()) { setSaveName(""); setSaveModalOpen(true); } }}
                style={{ background:"none", border:`1px solid ${T.border2}`, borderRadius:8, padding:"7px 12px", cursor:"pointer", color:T.muted, fontSize:11, fontWeight:600 }}>
                💾 Save
              </button>
              <div style={{ position:"relative" }}>
                <button onClick={() => setShowSavedDropdown(p => !p)}
                  style={{ background:"none", border:`1px solid ${T.border2}`, borderRadius:8, padding:"7px 12px", cursor:"pointer", color:T.muted, fontSize:11, fontWeight:600 }}>
                  📂 Saved ({savedQueries.length}) ▾
                </button>
                {showSavedDropdown && (
                  <div style={{ position:"absolute", top:"110%", left:0, minWidth:220, background:T.card, border:`1px solid ${T.border2}`, borderRadius:10, boxShadow:"0 8px 32px rgba(0,0,0,0.2)", zIndex:200, overflow:"hidden" }}>
                    {savedQueries.length === 0
                      ? <div style={{ padding:"12px 14px", fontSize:11, color:T.muted }}>No saved queries yet.</div>
                      : savedQueries.map(q => (
                        <div key={q.id}
                          style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 14px", borderBottom:`1px solid ${T.border}`, cursor:"pointer" }}
                          onClick={() => { setSql(q.sql); setShowSavedDropdown(false); }}>
                          <span style={{ fontSize:11, color:T.text, fontWeight:600 }}>{q.name}</span>
                          <button onClick={e => { e.stopPropagation(); setSavedQueries(p => p.filter(x => x.id !== q.id)); }}
                            style={{ background:"none", border:"none", cursor:"pointer", color:T.muted, fontSize:12, padding:"0 4px" }}>✕</button>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
              {queryResult && <span style={{ fontSize:11, color:T.green }}>✓ {queryResult.count} rows</span>}
              {queryError  && <span style={{ fontSize:11, color:T.red }}>✗ {queryError}</span>}
            </div>
          </div>

          {queryResult && queryResult.rows && (
            <div style={{ flex:1, background:T.card, border:`1px solid ${T.border}`, borderRadius:10, overflow:"auto" }}>
              <div style={{ padding:"8px 14px", borderBottom:`1px solid ${T.border}`, fontSize:10, color:T.muted, fontWeight:700, letterSpacing:"0.07em" }}>
                RESULTS — {queryResult.count} rows
              </div>
              {queryResult.rows.length > 0
                ? (
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                      <thead>
                        <tr>{Object.keys(queryResult.rows[0]).map(col => (
                          <th key={col} style={{ textAlign:"left", padding:"7px 12px", color:T.muted, borderBottom:`1px solid ${T.border}`, fontWeight:700, background:T.isDark?"#0A0C10":T.border, whiteSpace:"nowrap", fontSize:10 }}>{col}</th>
                        ))}</tr>
                      </thead>
                      <tbody>{queryResult.rows.map((row, ri) => (
                        <tr key={ri} style={{ borderBottom:`1px solid ${T.border}20` }}>
                          {Object.values(row).map((v, j) => (
                            <td key={j} style={{ padding:"6px 12px", color:T.text, whiteSpace:"nowrap", maxWidth:240, overflow:"hidden", textOverflow:"ellipsis" }}>
                              {v == null ? <span style={{ color:T.muted }}>NULL</span> : String(v)}
                            </td>
                          ))}
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                )
                : <div style={{ padding:16, fontSize:12, color:T.muted }}>Query returned 0 rows.</div>
              }
            </div>
          )}
        </div>
      )}

      {saveModalOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:T.card, border:`1px solid ${T.border2}`, borderRadius:14, padding:"24px", width:340 }}>
            <div style={{ fontSize:14, fontWeight:700, color:T.text, marginBottom:14 }}>Save Query</div>
            <input autoFocus value={saveName} onChange={e => setSaveName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") confirmSave(); }}
              placeholder="Query name…"
              style={{ width:"100%", background:T.bg, border:`1px solid ${T.border2}`, borderRadius:8, padding:"9px 12px", color:T.text, fontSize:12, outline:"none", boxSizing:"border-box", marginBottom:12 }}
            />
            <div style={{ fontSize:11, color:T.muted, fontFamily:"monospace", background:T.isDark?"#0A0C10":T.border, borderRadius:6, padding:"8px 10px", marginBottom:14, whiteSpace:"pre-wrap", maxHeight:80, overflow:"auto" }}>
              {sql.slice(0, 200)}{sql.length > 200 ? "…" : ""}
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button onClick={() => setSaveModalOpen(false)}
                style={{ background:"none", border:`1px solid ${T.border2}`, borderRadius:7, padding:"7px 16px", cursor:"pointer", color:T.muted, fontSize:12 }}>
                Cancel
              </button>
              <button onClick={confirmSave}
                style={{ background:T.accent, border:"none", borderRadius:7, padding:"7px 16px", cursor:"pointer", color:"white", fontSize:12, fontWeight:700 }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetectTriageRootCause({ alertsState, sevFilter, setSevFilter, search, setSearch,
  resolveAlert, triageAlert, autoFixAlert, openDrill, setAiPanel, aiPanel, dataMode }) {
  const T = useTheme();
  const [sub, setSub] = useState("triage");

  const liveAlerts = (alertsState || []).filter(a => dataMode === "prod" ? a.id?.startsWith("AGT-") : !a.id?.startsWith("AGT-"));

  const filtered = liveAlerts.filter(a =>
    (sevFilter === "all" || a.severity === sevFilter) &&
    (!search || a.title?.toLowerCase().includes(search.toLowerCase()) || a.table?.toLowerCase().includes(search.toLowerCase()))
  );

  const critCount = liveAlerts.filter(a => a.severity === "critical").length;
  const openCount = liveAlerts.filter(a => a.status !== "resolved").length;

  return (
    <div style={{ paddingBottom:24 }}>
      {/* Sub-nav */}
      <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:16, background:T.card, border:`1px solid ${T.border2}`, borderRadius:10, padding:4, width:"fit-content" }}>
        {[
          { id:"triage", label:"Detect & Triage",     icon:Bell },
        ].map(({ id, label, icon:Icon }) => (
          <button key={id} onClick={()=>setSub(id)}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 16px", borderRadius:7, border:"none", cursor:"pointer", fontSize:11, fontWeight:sub===id?700:500,
              background: sub===id ? T.accent : "transparent",
              color: sub===id ? "#fff" : T.muted, transition:"all 0.15s", fontFamily:"Calibri,sans-serif" }}>
            <Icon size={12}/>{label}
          </button>
        ))}
      </div>

      {/* ── Detect & Triage ── */}
      {sub === "triage" && (
        <>
          <Card style={{ marginBottom:16 }}>
            <SectionHeader
              icon={Bell}
              title="Detected Quality Issues"
              subtitle={`${critCount} critical · ${openCount} open · redshift-staging`}
              action={
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search alerts…"
                    style={{ background:T.bg, border:`1px solid ${T.border2}`, borderRadius:7, padding:"5px 10px", color:T.text, fontSize:11, outline:"none", width:160, fontFamily:"Calibri,sans-serif" }}/>
                  <div style={{ display:"flex", gap:4 }}>
                    {["all","critical","high","medium","low"].map(s=>(
                      <button key={s} onClick={()=>setSevFilter(s)}
                        style={{ padding:"4px 10px", borderRadius:6, border:`1px solid ${sevFilter===s?T.accent:T.border2}`, background:sevFilter===s?`${T.accent}15`:"transparent",
                          color:sevFilter===s?T.accent:T.muted, fontSize:10, fontWeight:600, cursor:"pointer", textTransform:"capitalize", fontFamily:"Calibri,sans-serif" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              }
            />
          </Card>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {filtered.length === 0
              ? <Card style={{ padding:"32px", textAlign:"center" }}><div style={{ color:T.muted, fontSize:12 }}>No alerts match current filters.</div></Card>
              : filtered.map(a => (
                  <AlertRow key={a.id} alert={a} selected={aiPanel?.id===a.id}
                    onAIClick={setAiPanel} onDrill={openDrill}
                    onResolve={resolveAlert} onAutoFix={autoFixAlert} onTriage={triageAlert}/>
                ))
            }
          </div>
        </>
      )}

    </div>
  );
}

function RulesAndValidationWrapper({ liveRules, rulesLoading, addAuditEvent }) {
  const T = useTheme();
  const C = T;
  const [view, setView] = React.useState("rules");
  const tabs = [
    { id:"rules", label:"Quality Rules", icon:Shield },
    { id:"validation", label:"Rule Validation", icon:TestTube2 },
  ];
  return (
    <div>
      {/* Sub-nav */}
      <div style={{ display:"flex", gap:4, marginBottom:18, borderBottom:`1px solid ${T.border}`, paddingBottom:0 }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setView(t.id)}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", background:"none", border:"none",
              borderBottom: view===t.id ? `2px solid ${T.accent}` : "2px solid transparent",
              color: view===t.id ? T.accent : T.muted,
              fontSize:12, fontWeight: view===t.id ? 700 : 500, cursor:"pointer", marginBottom:-1 }}>
            <t.icon size={13}/> {t.label}
          </button>
        ))}
      </div>
      {view === "rules"      && <ValidationRulesTab liveRules={liveRules} rulesLoading={rulesLoading} addAuditEvent={addAuditEvent} />}
      {view === "validation" && <RuleTestRunnerTab />}
    </div>
  );
}

// ─── Dataflows Tab ────────────────────────────────────────────────────────────
const INIT_DATAFLOWS = [
  {
    id: "df-001", name: "Daily Order Health", status: "active",
    query: `SELECT order_status, COUNT(*) as count, SUM(item_price) as revenue\nFROM mws.orders\nWHERE purchase_date >= CURRENT_DATE - 1\nGROUP BY order_status`,
    schedule: "0 6 * * *", lastRun: "Today 6:00 AM", lastResult: "pass",
    lastRows: 4, alertOn: "row_count < 1 OR error",
    description: "Check order volume and status distribution daily.",
  },
  {
    id: "df-002", name: "Inventory Stockout Alert", status: "active",
    query: `SELECT asin, product_name, available, days_of_supply\nFROM mws.inventory\nWHERE days_of_supply < 7\nORDER BY days_of_supply ASC`,
    schedule: "0 */6 * * *", lastRun: "Today 12:00 PM", lastResult: "fail",
    lastRows: 3, alertOn: "rows > 0",
    description: "Surface ASINs at risk of stockout within 7 days.",
  },
  {
    id: "df-003", name: "Buy Box Degradation", status: "active",
    query: `SELECT child_asin, traffic_by_asin_buy_box_prcntg as buy_box_pct,\n  units_ordered, ordered_product_sales_amt\nFROM mws.sales_and_traffic_by_asin\nWHERE traffic_by_asin_buy_box_prcntg < 0.8\nORDER BY ordered_product_sales_amt DESC\nLIMIT 20`,
    schedule: "0 8 * * *", lastRun: "Today 8:00 AM", lastResult: "pass",
    lastRows: 0, alertOn: "rows > 5",
    description: "Flag ASINs where buy box % drops below 80%.",
  },
];

const DF_CRON_PRESETS = [
  { label:"Every 15 min", value:"*/15 * * * *" },
  { label:"Every hour",   value:"0 * * * *"    },
  { label:"Every 6h",     value:"0 */6 * * *"  },
  { label:"Daily 6am",    value:"0 6 * * *"    },
  { label:"Weekly Mon",   value:"0 6 * * 1"    },
];

function DataflowsTab() {
  const T = useTheme();
  const [flows, setFlows]               = useState(INIT_DATAFLOWS);
  const [selected, setSelected]         = useState(INIT_DATAFLOWS[0].id);
  const [editQuery, setEditQuery]       = useState(INIT_DATAFLOWS[0].query);
  const [runState, setRunState]         = useState({}); // {dfId: "running"|{rows,cols}|"error"}
  const [aiPane, setAiPane]             = useState(false);
  const [aiMessages, setAiMessages]     = useState([]);
  const [aiInput, setAiInput]           = useState("");
  const [aiLoading, setAiLoading]       = useState(false);
  const [schedPane, setSchedPane]       = useState(false);
  const [newFlow, setNewFlow]           = useState(false);
  const [newName, setNewName]           = useState("");
  const [newDesc, setNewDesc]           = useState("");
  const chatEndRef = useRef(null);

  const flow = flows.find(f => f.id === selected) || flows[0];

  // Sync editQuery when selection changes
  useEffect(() => { setEditQuery(flow.query); setAiPane(false); setAiMessages([]); }, [selected]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [aiMessages]);

  const runFlow = async (f) => {
    const q = f.id === selected ? editQuery : f.query;
    setRunState(p => ({...p, [f.id]:"running"}));
    try {
      const res  = await fetch(`${API_BASE}/api/query?sql=${encodeURIComponent(q)}`);
      const data = await res.json();
      const rows = data.rows || [];
      const cols = rows.length > 0 ? Object.keys(rows[0]) : [];
      const result = { rows, cols, ts: new Date().toLocaleTimeString() };
      setRunState(p => ({...p, [f.id]: result}));
      setFlows(p => p.map(x => x.id===f.id
        ? {...x, lastRun:`Today ${result.ts}`, lastResult: rows.length>0?"pass":"pass", lastRows:rows.length}
        : x));
      // AI auto-check for anomalies
      if (rows.length > 0) autoAnomalyCheck(f, rows);
    } catch(e) {
      setRunState(p => ({...p, [f.id]:"error"}));
    }
  };

  const autoAnomalyCheck = async (f, rows) => {
    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ max_tokens:400,
          system:`You are a data quality AI for Intentwise. Analyse query results briefly. If anomalies detected, respond with a short 1-2 sentence alert starting with "⚠ Anomaly:". If results look normal, respond with "✓ Results look healthy." Only respond with one of those two formats.`,
          messages:[{ role:"user", content:`Dataflow: "${f.name}"\nAlert condition: ${f.alertOn}\nRow count: ${rows.length}\nFirst 3 rows: ${JSON.stringify(rows.slice(0,3))}` }]
        })
      });
      const d = await res.json();
      const msg = d.content?.find(b=>b.type==="text")?.text || "";
      if (msg) {
        setAiMessages(p => [...p, { role:"assistant", content:msg, auto:true }]);
        setAiPane(true);
      }
    } catch(_) {}
  };

  const sendAiMessage = async () => {
    if (!aiInput.trim() || aiLoading) return;
    const userMsg = aiInput.trim();
    setAiInput("");
    const nextMsgs = [...aiMessages, { role:"user", content:userMsg }];
    setAiMessages(nextMsgs);
    setAiLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ max_tokens:800,
          system:`You are a SQL + data quality AI assistant for Intentwise. The user is working on a Dataflow called "${flow.name}". Current SQL:\n\`\`\`sql\n${editQuery}\n\`\`\`\nRedshift schema: mws — tables: orders, inventory, inventory_restock, sales_and_traffic_by_date, sales_and_traffic_by_asin, sales_and_traffic_by_sku.\nHelp the user write, fix, or optimise their SQL, explain results, or set up alert conditions. When suggesting SQL changes, wrap the full updated query in \`\`\`sql\n...\n\`\`\` blocks.`,
          messages: nextMsgs.filter((m,i,a)=>{const fi=a.findIndex(x=>x.role==="user");return i>=fi;}).map(m=>({role:m.role,content:m.content}))
        })
      });
      const d = await res.json();
      const reply = d.content?.find(b=>b.type==="text")?.text || "❌ No response. Check ANTHROPIC_API_KEY in Railway.";
      setAiMessages(p => [...p, { role:"assistant", content:reply }]);
      // Auto-apply SQL if suggested
      const sqlMatch = reply.match(/```sql\n([\s\S]*?)```/);
      if (sqlMatch) {
        setEditQuery(sqlMatch[1].trim());
        setFlows(p => p.map(x => x.id===selected ? {...x, query:sqlMatch[1].trim()} : x));
      }
    } catch(_) {
      setAiMessages(p => [...p, { role:"assistant", content:"API error. Please try again." }]);
    } finally { setAiLoading(false); }
  };

  const saveQuery = () => {
    setFlows(p => p.map(x => x.id===selected ? {...x, query:editQuery} : x));
  };

  const createFlow = () => {
    if (!newName.trim()) return;
    const nf = { id:`df-${Date.now()}`, name:newName.trim(), status:"active",
      query:`SELECT *\nFROM mws.orders\nLIMIT 10`, schedule:"0 6 * * *",
      lastRun:"Never", lastResult:"pending", lastRows:0, alertOn:"error", description:newDesc.trim() };
    setFlows(p => [...p, nf]);
    setSelected(nf.id);
    setNewName(""); setNewDesc(""); setNewFlow(false);
  };

  const result = runState[flow?.id];
  const STATUS_COLOR = { active:T.green, paused:T.muted, error:T.red };

  return (
    <div style={{ display:"flex", height:"calc(100vh - 120px)", gap:0, background:T.bg, borderRadius:12, overflow:"hidden", border:`1px solid ${T.border2}` }}>

      {/* ── Left panel: flow list ── */}
      <div style={{ width:220, borderRight:`1px solid ${T.border2}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"12px 14px 8px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:11, fontWeight:700, color:T.muted, letterSpacing:"0.08em" }}>DATAFLOWS</span>
          <button onClick={()=>setNewFlow(true)} style={{ background:`${T.accent}15`, border:`1px solid ${T.accent}30`, borderRadius:5, padding:"2px 7px", cursor:"pointer", color:T.accent, fontSize:11, fontWeight:700 }}>+ New</button>
        </div>
        {newFlow && (
          <div style={{ padding:"8px 10px", borderBottom:`1px solid ${T.border}`, display:"flex", flexDirection:"column", gap:5 }}>
            <div style={{ display:"flex", gap:4 }}>
              <input autoFocus value={newName} onChange={e=>setNewName(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&createFlow()}
                placeholder="Flow name…" style={{ flex:1, background:T.bg, border:`1px solid ${T.accent}`, borderRadius:5, padding:"4px 7px", color:T.text, fontSize:11, outline:"none" }} />
              <button onClick={createFlow} style={{ background:T.accent, border:"none", borderRadius:5, padding:"4px 8px", cursor:"pointer", color:"white", fontSize:10, fontWeight:700 }}>✓</button>
            <button onClick={()=>setNewFlow(false)} style={{ background:"none", border:`1px solid ${T.border2}`, borderRadius:5, padding:"4px 6px", cursor:"pointer", color:T.muted, fontSize:10 }}>✕</button>
            </div>
            <input value={newDesc} onChange={e=>setNewDesc(e.target.value)}
              placeholder="Description (optional)…"
              style={{ width:"100%", background:T.bg, border:`1px solid ${T.border2}`, borderRadius:5, padding:"4px 7px", color:T.muted, fontSize:10, outline:"none", boxSizing:"border-box" }} />
          </div>
        )}
        <div style={{ flex:1, overflowY:"auto" }}>
          {flows.map(f => (
            <div key={f.id}>
              <div onClick={()=>setSelected(f.id)}
                style={{ padding:"10px 14px", cursor:"pointer", borderBottom:`1px solid ${T.border}`,
                  background: selected===f.id ? `${T.accent}12` : "transparent",
                  borderLeft: selected===f.id ? `3px solid ${T.accent}` : "3px solid transparent" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:12, fontWeight:600, color:selected===f.id?T.accent:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:130 }}>{f.name}</span>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:STATUS_COLOR[f.status]||T.muted, flexShrink:0 }} />
                </div>
                <div style={{ fontSize:10, color:T.muted }}>
                  {runState[f.id]==="running" ? "⏳ running…" :
                   runState[f.id] && typeof runState[f.id]==="object" ? `✓ ${runState[f.id].rows.length} rows · ${runState[f.id].ts}` :
                   f.lastRun}
                </div>
                <div style={{ marginTop:4, display:"flex", gap:4 }}>
                  <span style={{ fontSize:9, padding:"1px 5px", borderRadius:3,
                    background: f.lastResult==="pass"?`${T.green}18`:f.lastResult==="fail"?`${T.red}18`:`${T.muted}18`,
                    color: f.lastResult==="pass"?T.green:f.lastResult==="fail"?T.red:T.muted }}>
                    {f.lastResult}
                  </span>
                </div>
              </div>
              {selected === f.id && flows.length > 1 && (
                <div style={{ display:"flex", justifyContent:"flex-end", padding:"4px 10px", borderBottom:`1px solid ${T.border}` }}>
                  <button onClick={e=>{ e.stopPropagation(); const remaining=flows.filter(x=>x.id!==f.id); setFlows(remaining); setSelected(remaining[0].id); }}
                    style={{ fontSize:9, background:"none", border:`1px solid ${T.red}30`, borderRadius:4, padding:"2px 7px", cursor:"pointer", color:T.red }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Center: query editor + results ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* toolbar */}
        <div style={{ padding:"10px 16px", borderBottom:`1px solid ${T.border2}`, display:"flex", alignItems:"center", gap:8 }}>
          <Workflow size={14} color={T.accent} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{flow.name}</div>
            {flow.description && <div style={{ fontSize:10, color:T.muted, marginTop:1 }}>{flow.description}</div>}
          </div>
          <span style={{ fontSize:10, color:T.muted, background:T.border, borderRadius:4, padding:"2px 7px" }}>{flow.schedule}</span>
          <button onClick={()=>setSchedPane(p=>!p)} title="Set schedule" style={{ background:"none", border:`1px solid ${T.border2}`, borderRadius:5, padding:"4px 8px", cursor:"pointer", color:T.muted, fontSize:10, display:"flex", alignItems:"center", gap:4 }}>
            <Clock size={11}/> Schedule
          </button>
          <button onClick={saveQuery} style={{ background:"none", border:`1px solid ${T.border2}`, borderRadius:5, padding:"4px 8px", cursor:"pointer", color:T.muted, fontSize:10, display:"flex", alignItems:"center", gap:4 }}>
            <Save size={11}/> Save
          </button>
          <button onClick={()=>runFlow(flow)} disabled={runState[flow.id]==="running"}
            style={{ background:runState[flow.id]==="running"?`${T.green}30`:T.green, border:"none", borderRadius:6, padding:"5px 14px", cursor:"pointer", color:"white", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:5, opacity:runState[flow.id]==="running"?0.6:1 }}>
            <Play size={11}/> {runState[flow.id]==="running"?"Running…":"Run"}
          </button>
          <button onClick={()=>{setAiPane(p=>!p);}} style={{ background:aiPane?`${T.purple}20`:`${T.border}`, border:`1px solid ${aiPane?T.purple:T.border2}`, borderRadius:6, padding:"5px 10px", cursor:"pointer", color:aiPane?T.purple:T.muted, fontSize:11, display:"flex", alignItems:"center", gap:5 }}>
            <Bot size={12} color={aiPane?T.purple:T.muted}/> AI
            {aiMessages.length > 0 && <span style={{ width:6, height:6, borderRadius:"50%", background:T.purple }} />}
          </button>
        </div>

        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* SQL editor */}
          <div style={{ padding:"0 0 0 0", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ padding:"6px 16px", fontSize:9, color:T.muted, fontWeight:700, letterSpacing:"0.08em", borderBottom:`1px solid ${T.border}` }}>QUERY</div>
            <textarea value={editQuery} onChange={e=>setEditQuery(e.target.value)}
              spellCheck={false}
              style={{ width:"100%", minHeight:160, maxHeight:260, padding:"12px 16px", background:T.bg, border:"none", outline:"none", color:T.text, fontSize:12, fontFamily:"Consolas,'Cascadia Code',monospace", resize:"vertical", boxSizing:"border-box", lineHeight:1.7 }} />
          </div>

          {/* Results */}
          <div style={{ flex:1, overflow:"auto" }}>
            <div style={{ padding:"6px 16px", fontSize:9, color:T.muted, fontWeight:700, letterSpacing:"0.08em", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:8 }}>
              <span>RESULTS</span>
              {result && typeof result==="object" && <span style={{color:T.green}}>· {result.rows.length} rows · {result.ts}</span>}
              {result==="running" && <span style={{color:T.muted}}>· running…</span>}
              {result==="error"   && <span style={{color:T.red}}>· error</span>}
            </div>
            {!result && (
              <div style={{ padding:"32px", textAlign:"center", color:T.muted, fontSize:12 }}>
                Click <strong>Run</strong> to execute this query against <code style={{color:T.accentL}}>redshift-staging</code>
              </div>
            )}
            {result==="running" && <div style={{ padding:"24px", textAlign:"center", color:T.muted, fontSize:12 }}>Running query…</div>}
            {result==="error"   && <div style={{ padding:"24px", textAlign:"center", color:T.red,  fontSize:12 }}>Query failed. Check SQL syntax or connection.</div>}
            {result && typeof result==="object" && result.rows.length === 0 && (
              <div style={{ padding:"24px", textAlign:"center", color:T.green, fontSize:12 }}>✓ Query returned 0 rows — no issues found.</div>
            )}
            {result && typeof result==="object" && result.rows.length > 0 && (
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                  <thead>
                    <tr style={{ background:T.border, position:"sticky", top:0 }}>
                      {result.cols.map(c => (
                        <th key={c} style={{ padding:"7px 12px", textAlign:"left", color:T.muted, fontWeight:700, fontSize:10, whiteSpace:"nowrap", borderRight:`1px solid ${T.border2}` }}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row,i) => (
                      <tr key={i} style={{ borderBottom:`1px solid ${T.border}`, background:i%2===0?"transparent":`${T.border}30` }}>
                        {result.cols.map(c => (
                          <td key={c} style={{ padding:"6px 12px", color:T.text, whiteSpace:"nowrap", maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", borderRight:`1px solid ${T.border}` }}>{String(row[c]??"-")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Right: schema browser ── */}
      <div style={{ width:200, borderLeft:`1px solid ${T.border2}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"10px 12px 8px", borderBottom:`1px solid ${T.border}`, fontSize:10, fontWeight:700, color:T.muted, letterSpacing:"0.08em" }}>MWS SCHEMA</div>
        <div style={{ flex:1, overflowY:"auto", padding:"6px 0" }}>
          {[
            { t:"orders",                      cols:["amazon_order_id","order_status","asin","item_price","purchase_date"] },
            { t:"inventory",                   cols:["asin","available","days_of_supply","alert","account_id"] },
            { t:"inventory_restock",           cols:["asin","quantity","account_id","download_date"] },
            { t:"sales_and_traffic_by_date",   cols:["sale_date","ordered_product_sales_amt","sessions","buy_box_percentage"] },
            { t:"sales_and_traffic_by_asin",   cols:["child_asin","units_ordered","traffic_by_asin_buy_box_prcntg"] },
            { t:"sales_and_traffic_by_sku",    cols:["sku","units_ordered","ordered_product_sales_amt"] },
          ].map(({ t, cols }) => (
            <SchemaTableRow key={t} table={t} cols={cols} T={T}
              onInsert={col => setEditQuery(q => q + (col ? `\n-- ${t}.${col}` : `\nFROM mws.${t}`))} />
          ))}
        </div>
      </div>

      {/* ── AI Chat slide-in ── */}
      {aiPane && (
        <div style={{ width:320, borderLeft:`1px solid ${T.border2}`, display:"flex", flexDirection:"column", background:T.surface, flexShrink:0 }}>
          <div style={{ padding:"10px 14px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Bot size={13} color={T.purple}/>
              <span style={{ fontSize:12, fontWeight:700, color:T.text }}>AI Assistant</span>
            </div>
            <button onClick={()=>setAiPane(false)} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted }}><X size={13}/></button>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"10px 12px", display:"flex", flexDirection:"column", gap:8 }}>
            {aiMessages.length === 0 && (
              <div style={{ fontSize:11, color:T.muted, lineHeight:1.6 }}>
                Ask me to write SQL, explain results, optimise queries, or set up alert conditions for this dataflow.
              </div>
            )}
            {aiMessages.map((m, i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:m.role==="user"?"flex-end":"flex-start" }}>
                {m.auto && <span style={{ fontSize:9, color:T.purple, marginBottom:2 }}>AUTO-ANALYSIS</span>}
                <div style={{ maxWidth:"92%", padding:"8px 10px", borderRadius:8, fontSize:11, lineHeight:1.6,
                  background: m.role==="user"?`${T.accent}20`:m.auto?`${T.purple}12`:T.card,
                  color: T.text, border:`1px solid ${m.role==="user"?T.accent:m.auto?T.purple:T.border}` }}>
                  {(() => {
                    const content = m.content;
                    const parts = [];
                    const sqlRe = /```sql\n([\s\S]*?)```|```([\s\S]*?)```/gi;
                    let last = 0, match;
                    while ((match = sqlRe.exec(content)) !== null) {
                      if (match.index > last) parts.push({ type:"text", value: content.slice(last, match.index) });
                      parts.push({ type:"sql", value: (match[1]||match[2]).trim() });
                      last = match.index + match[0].length;
                    }
                    if (last < content.length) parts.push({ type:"text", value: content.slice(last) });
                    return parts.map((p, pi) => p.type === "sql" ? (
                      <div key={pi} style={{ marginTop:6, borderRadius:7, overflow:"hidden", border:`1px solid ${T.cyan}40` }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"4px 9px", background:T.isDark?"#0A0C10":"#1E293B" }}>
                          <span style={{ fontSize:10, color:T.cyan, fontWeight:700 }}>SQL</span>
                          <div style={{ display:"flex", gap:5 }}>
                            <button onClick={() => navigator.clipboard?.writeText(p.value)} style={{ fontSize:10, background:"none", border:`1px solid ${T.cyan}40`, borderRadius:4, padding:"2px 7px", cursor:"pointer", color:T.cyan }}>Copy</button>
                            <button onClick={() => { setEditQuery(p.value); }} style={{ fontSize:10, background:`${T.accent}20`, border:`1px solid ${T.accent}40`, borderRadius:4, padding:"2px 7px", cursor:"pointer", color:T.accentL, fontWeight:700 }}>← Use</button>
                            <button onClick={async () => {
                              try {
                                const r = await fetch(`${API_BASE}/api/query?sql=${encodeURIComponent(p.value)}`);
                                const d = await r.json();
                                const rows = d.rows || d;
                                const msg = Array.isArray(rows) && rows.length > 0
                                  ? `Results (${rows.length} rows):\n` + Object.keys(rows[0]).join(" | ") + "\n" + rows.slice(0,10).map(row=>Object.values(row).join(" | ")).join("\n")
                                  : "✓ 0 rows returned.";
                                setAiMessages(prev => [...prev, { role:"assistant", content: msg }]);
                              } catch(e) { setAiMessages(prev => [...prev, { role:"assistant", content:`❌ ${e.message}` }]); }
                            }} style={{ fontSize:10, background:`${T.green}20`, border:`1px solid ${T.green}40`, borderRadius:4, padding:"2px 7px", cursor:"pointer", color:T.green, fontWeight:700 }}>▶ Run</button>
                          </div>
                        </div>
                        <pre style={{ margin:0, padding:"8px 10px", fontSize:11, color:T.cyan, background:T.isDark?"#0D1017":"#0F172A", overflowX:"auto", lineHeight:1.6, fontFamily:"monospace" }}>{p.value}</pre>
                      </div>
                    ) : (
                      <div key={pi}>{p.value.split("\n").map((line,j) => <div key={j} style={{ minHeight: line ? undefined : "0.5em" }}>{line}</div>)}</div>
                    ));
                  })()}
                </div>
              </div>
            ))}
            {aiLoading && <div style={{ fontSize:11, color:T.muted }}>Thinking…</div>}
            <div ref={chatEndRef}/>
          </div>
          <div style={{ padding:"8px 10px", borderTop:`1px solid ${T.border}`, display:"flex", gap:6 }}>
            <textarea value={aiInput} onChange={e=>setAiInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendAiMessage();}}}
              placeholder="Ask AI to write or fix SQL…" rows={2}
              style={{ flex:1, background:T.bg, border:`1px solid ${T.border2}`, borderRadius:6, padding:"6px 8px", color:T.text, fontSize:11, outline:"none", resize:"none", fontFamily:"inherit" }} />
            <button onClick={sendAiMessage} disabled={aiLoading}
              style={{ background:T.accent, border:"none", borderRadius:6, padding:"6px 10px", cursor:"pointer", color:"white", alignSelf:"flex-end" }}>
              <Send size={12}/>
            </button>
          </div>
        </div>
      )}

      {/* ── Schedule pane ── */}
      {schedPane && (
        <div style={{ position:"absolute", top:120, right:aiPane?340:10, width:260, background:T.card, border:`1px solid ${T.border2}`, borderRadius:12, padding:"16px", zIndex:100, boxShadow:"0 8px 32px rgba(0,0,0,0.2)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <span style={{ fontSize:12, fontWeight:700, color:T.text }}>Schedule</span>
            <button onClick={()=>setSchedPane(false)} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted }}><X size={12}/></button>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
            {DF_CRON_PRESETS.map(p => (
              <button key={p.value} onClick={()=>setFlows(fs=>fs.map(f=>f.id===selected?{...f,schedule:p.value}:f))}
                style={{ fontSize:10, padding:"3px 8px", borderRadius:5,
                  border:`1px solid ${flow.schedule===p.value?T.accent:T.border2}`,
                  background:flow.schedule===p.value?`${T.accent}15`:T.bg,
                  color:flow.schedule===p.value?T.accent:T.muted, cursor:"pointer" }}>
                {p.label}
              </button>
            ))}
          </div>
          <input value={flow.schedule} onChange={e=>setFlows(fs=>fs.map(f=>f.id===selected?{...f,schedule:e.target.value}:f))}
            style={{ width:"100%", background:T.bg, border:`1px solid ${T.border2}`, borderRadius:6, padding:"6px 8px", color:T.text, fontSize:11, fontFamily:"Consolas,monospace", outline:"none", boxSizing:"border-box" }}
            placeholder="0 6 * * *" />
          <div style={{ fontSize:10, color:T.muted, marginTop:6 }}>Alert condition: <code style={{color:T.accentL}}>{flow.alertOn}</code></div>
          <div style={{ marginTop:10, display:"flex", gap:6 }}>
            <input value={flow.alertOn} onChange={e=>setFlows(fs=>fs.map(f=>f.id===selected?{...f,alertOn:e.target.value}:f))}
              style={{ flex:1, background:T.bg, border:`1px solid ${T.border2}`, borderRadius:6, padding:"5px 8px", color:T.text, fontSize:11, fontFamily:"Consolas,monospace", outline:"none" }}
              placeholder="rows > 0 OR error" />
          </div>
          <button onClick={()=>{ setSchedPane(false); }}
            style={{ marginTop:10, width:"100%", background:T.accent, border:"none", borderRadius:6, padding:"7px", cursor:"pointer", color:"white", fontSize:11, fontWeight:700 }}>
            ✓ Save Schedule
          </button>
        </div>
      )}
    </div>
  );
}

function SchemaTableRow({ table, cols, T, onInsert }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div onClick={()=>setOpen(p=>!p)} style={{ padding:"5px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:5, userSelect:"none" }}>
        {open ? <ChevronDown size={10} color={T.muted}/> : <ChevronRight size={10} color={T.muted}/>}
        <span style={{ fontSize:11, color:T.text, fontFamily:"Consolas,monospace" }}>{table}</span>
        <button onClick={e=>{e.stopPropagation();onInsert(null);}} title="Insert FROM clause"
          style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:T.accent, fontSize:9, padding:"1px 4px" }}>+FROM</button>
      </div>
      {open && (
        <div style={{ paddingLeft:22 }}>
          {cols.map(c => (
            <div key={c} onClick={()=>onInsert(c)} style={{ padding:"3px 8px", cursor:"pointer", fontSize:10, color:T.muted, fontFamily:"Consolas,monospace", display:"flex", alignItems:"center", gap:4 }}
              className="row-hover">
              <span style={{ color:T.border2 }}>—</span> {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// AI AGENTS TAB
// ─────────────────────────────────────────────────────────────────────────────
const agents = [
  { id:"AGT-ORD",  table:"mws.orders",                   label:"Orders Agent",         icon:"📦", desc:"Detects duplicate orders, NULL ASINs on shipped items, price anomalies, stale download dates." },
  { id:"AGT-INV",  table:"mws.inventory",                label:"Inventory Agent",       icon:"🏭", desc:"Flags negative available qty, zero days-of-supply, missing restock recommendations." },
  { id:"AGT-RST",  table:"mws.inventory_restock",        label:"Restock Agent",         icon:"🔄", desc:"Detects zero/negative restock quantities, stale restock records, missing account linkage." },
  { id:"AGT-STD",  table:"mws.sales_and_traffic_by_date",label:"Sales by Date Agent",   icon:"📅", desc:"Checks for missing days in last 30d, anomalous revenue drops, refund rate spikes." },
  { id:"AGT-ASN",  table:"mws.sales_and_traffic_by_asin",label:"Sales by ASIN Agent",   icon:"🔖", desc:"Validates buy-box % range, detects session anomalies, flags zero-unit ASINs with traffic." },
  { id:"AGT-SKU",  table:"mws.sales_and_traffic_by_sku", label:"Sales by SKU Agent",    icon:"🏷️", desc:"Cross-checks SKU sales vs ASIN sales, detects orphaned SKUs, revenue outliers." },
];

function AIAgentsTab({ agentStates, setAgentStates, setAlertsState, accountId, addAuditEvent, alertsState }) {
  const C = React.useContext(ThemeCtx);
  const [running,        setRunning]        = React.useState({});
  const [expanded,       setExpanded]       = React.useState(null);
  const [scanAllLoading, setScanAllLoading] = React.useState(false);
  const [agents,         setAgents]         = React.useState([]);
  const [agentsLoading,  setAgentsLoading]  = React.useState(true);
  const API_BASE_AGENTS = "https://intentwise-backend-production.up.railway.app";

  // Table name → emoji icon heuristic
  const tableIcon = (name) => {
    if (name.includes("order"))    return "📦";
    if (name.includes("inventor")) return "🏭";
    if (name.includes("restock"))  return "🔄";
    if (name.includes("traffic"))  return "📊";
    if (name.includes("sales"))    return "💰";
    if (name.includes("sku"))      return "🏷️";
    if (name.includes("asin"))     return "🔖";
    if (name.includes("date"))     return "📅";
    if (name.includes("report"))   return "📋";
    if (name.includes("return"))   return "↩️";
    if (name.includes("fee"))      return "💸";
    if (name.includes("settle"))   return "🏦";
    return "🗂️";
  };

  // Build human-readable label from snake_case table name
  const tableLabel = (name) =>
    name.replace(/_/g, " ").replace(/\w/g, c => c.toUpperCase()) + " Agent";

  React.useEffect(() => {
    setAgentsLoading(true);
    fetch(API_BASE_AGENTS + "/api/tables")
      .then(r => r.json())
      .then(data => {
        const tables = Array.isArray(data) ? data : [];
        const built = tables.map((t, i) => {
          const sc = t.schema || t.table_schema || "mws";
          const nm = t.name   || t.table_name   || `table_${i}`;
          return {
            id:    `AGT-${sc.toUpperCase().slice(0,3)}-${i}`,
            table: `${sc}.${nm}`,
            schema: sc,
            name:   nm,
            label:  tableLabel(nm),
            icon:   tableIcon(nm),
            desc:   `AI agent that scans ${sc}.${nm} and infers anomalies from column values and data patterns.`,
          };
        });
        setAgents(built);
        // Seed agentStates for any new agents
        setAgentStates(prev => {
          const next = { ...prev };
          built.forEach(a => { if (!next[a.id]) next[a.id] = { status:"idle", alertsFiled:0, log:[] }; });
          return next;
        });
        setAgentsLoading(false);
      })
      .catch(() => {
        // Fallback to the original 6 known tables
        const fallback = [
          { id:"AGT-MWS-0", table:"mws.orders",                    name:"orders",                    schema:"mws", label:"Orders Agent",          icon:"📦", desc:"Scans orders table." },
          { id:"AGT-MWS-1", table:"mws.inventory",                  name:"inventory",                 schema:"mws", label:"Inventory Agent",        icon:"🏭", desc:"Scans inventory table." },
          { id:"AGT-MWS-2", table:"mws.inventory_restock",          name:"inventory_restock",         schema:"mws", label:"Restock Agent",          icon:"🔄", desc:"Scans inventory_restock table." },
          { id:"AGT-MWS-3", table:"mws.sales_and_traffic_by_date",  name:"sales_and_traffic_by_date", schema:"mws", label:"Sales by Date Agent",    icon:"📅", desc:"Scans sales_and_traffic_by_date table." },
          { id:"AGT-MWS-4", table:"mws.sales_and_traffic_by_asin",  name:"sales_and_traffic_by_asin", schema:"mws", label:"Sales by ASIN Agent",    icon:"🔖", desc:"Scans sales_and_traffic_by_asin table." },
          { id:"AGT-MWS-5", table:"mws.sales_and_traffic_by_sku",   name:"sales_and_traffic_by_sku",  schema:"mws", label:"Sales by SKU Agent",     icon:"🏷️", desc:"Scans sales_and_traffic_by_sku table." },
        ];
        setAgents(fallback);
        setAgentsLoading(false);
      });
  }, []);

  const runAgent = async (agent) => {
    setRunning(p => ({ ...p, [agent.id]: true }));
    setAgentStates(p => ({ ...p, [agent.id]: { ...p[agent.id], status:"running", log:["🔍 Connecting to Redshift…"] } }));
    if (addAuditEvent) addAuditEvent({ type:"agent", name:`${agent.label} scan started`, table:agent.table, source:agent.schema, result:"pending", detail:`Agent ${agent.id} initiated scan of ${agent.table}.`, duration:"—" });

    try {
      // Step 1: fetch a sample from that table
      const qs = accountId && accountId !== "all" ? `&account_id=${accountId}` : "";
      const previewRes = await fetch(`${API_BASE_AGENTS}/api/preview?schema=mws&table=${agent.table.replace("mws.","")}&limit=200${qs}`);
      const preview = await previewRes.json();
      const rows = preview.rows || preview || [];

      setAgentStates(p => ({ ...p, [agent.id]: { ...p[agent.id], log:[...p[agent.id].log, `📊 Loaded ${rows.length} rows from ${agent.table}`] } }));

      if (!rows.length) {
        setAgentStates(p => ({ ...p, [agent.id]: { status:"idle", lastRun: new Date().toLocaleTimeString(), alertsFiled:0, log:[...p[agent.id].log, "⚠️ No rows returned — table may be empty for this account."] } }));
        setRunning(p => ({ ...p, [agent.id]: false }));
        return;
      }

      // Step 2: send to AI for anomaly analysis
      const colNames = Object.keys(rows[0]);
      const sample = rows.slice(0, 50);

      const aiRes = await fetch(`${API_BASE_AGENTS}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 1500,
          system: `You are an autonomous data quality agent for an Amazon seller analytics platform. You are scanning the table "${agent.table}" in a Redshift database.

Your task: inspect the sample data provided and detect any real data quality anomalies.

Table: ${agent.table}
Columns: ${colNames.join(", ")}

Use the column names to infer what each column represents and what valid values should look like. Apply these universal rules:
- Flag NULL or empty values in columns that should never be null (IDs, required keys, foreign keys)
- Flag numeric columns with impossible values (negative quantities, prices or percentages out of range)
- Flag percentage columns (containing "pct", "prcntg", "rate", "percentage") with values outside 0–1 or 0–100
- Flag date columns (containing "date") where values are older than 14 days (stale data)
- Flag columns that should be unique (IDs, order numbers) if duplicates exist in the sample
- Flag logical contradictions (e.g. sales > 0 but units = 0, available > total, restock qty <= 0)
- Flag any statistical outliers: values more than 3x the median for quantity/price/revenue columns

Respond ONLY with a JSON object (no markdown, no explanation):
{
  "anomalies_found": <integer>,
  "severity": "critical|high|medium|low|none",
  "summary": "<one sentence>",
  "alerts": [
    { "title": "<short title>", "detail": "<what was found and why it matters>", "severity": "critical|high|medium|low", "affected_rows": <integer> }
  ],
  "log": ["<step 1>", "<step 2>"]
}`,
          messages: [{ role: "user", content: `Analyse this sample (${sample.length} rows) from ${agent.table} and return your JSON findings:

${JSON.stringify(sample, null, 2)}` }]
        })
      });

      const aiData = await aiRes.json();
      const raw = aiData.content?.find(b => b.type === "text")?.text || "{}";
      const result = JSON.parse(raw.replace(/```json|```/g, "").trim());

      const alerts = (result.alerts || []).map((a, i) => ({
        id: `${agent.id}-${Date.now()}-${i}`,
        title: a.title,
        detail: a.detail,
        severity: a.severity || result.severity || "medium",
        table: agent.table,
        source: agent.label,
        ts: new Date().toISOString(),
        status: "open",
        aiGenerated: true,
      }));

      // File alerts into the global alerts state
      if (alerts.length > 0) {
        setAlertsState(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          return [...prev, ...alerts.filter(a => !existingIds.has(a.id))];
        });
      }

      setAgentStates(p => ({
        ...p,
        [agent.id]: {
          status: result.anomalies_found > 0 ? "alert" : "healthy",
          lastRun: new Date().toLocaleTimeString(),
          alertsFiled: alerts.length,
          severity: result.severity,
          summary: result.summary,
          log: [...(result.log || []), alerts.length > 0 ? `🚨 Filed ${alerts.length} alert(s)` : "✅ No anomalies detected"],
        }
      }));

    } catch(e) {
      setAgentStates(p => ({ ...p, [agent.id]: { status:"error", lastRun: new Date().toLocaleTimeString(), alertsFiled:0, log:[`❌ Error: ${e.message}`] } }));
    }

    if (addAuditEvent) {
      const st = agentStates[agent.id] || {};
      addAuditEvent({
        type:   "agent",
        name:   `${agent.label} scan complete`,
        table:  agent.table,
        source: agent.schema || "mws",
        result: st.alertsFiled > 0 ? "fail" : "pass",
        detail: st.summary || (st.alertsFiled > 0 ? `Filed ${st.alertsFiled} alert(s).` : "No anomalies detected."),
        duration: "—",
      });
    }
    setRunning(p => ({ ...p, [agent.id]: false }));
  };

  const runAllAgents = async () => {
    setScanAllLoading(true);
    for (const agent of agents) {
      await runAgent(agent);
    }
    setScanAllLoading(false);
  };

  const statusColor = (s, C) => ({ healthy:C.green, alert:C.red, running:C.yellow, error:C.orange, idle:C.muted })[s] || C.muted;
  const statusLabel = (s) => ({ healthy:"✓ Healthy", alert:"⚠ Anomalies", running:"⟳ Scanning…", error:"✗ Error", idle:"— Not run" })[s] || "—";

  const totalAlerts = Object.values(agentStates).reduce((sum, s) => sum + (s.alertsFiled || 0), 0);
  const healthyCount = Object.values(agentStates).filter(s => s.status === "healthy").length;
  const alertCount   = Object.values(agentStates).filter(s => s.status === "alert").length;

  return (
    <div style={{ paddingBottom:32 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:18, fontWeight:700, color:C.text, display:"flex", alignItems:"center", gap:10 }}>
            <BrainCircuit size={20} color={C.purple}/> AI Agents
          </div>
          <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>Autonomous agents that scan mws tables, detect anomalies and file alerts</div>
        </div>
        <button
          onClick={runAllAgents}
          disabled={scanAllLoading}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 18px", background: scanAllLoading?`${C.muted}20`:`${C.purple}18`, border:`1px solid ${scanAllLoading?C.muted:C.purple}50`, borderRadius:9, cursor: scanAllLoading?"not-allowed":"pointer", fontSize:12, color: scanAllLoading?C.muted:C.purple, fontWeight:700 }}
        >
          <BrainCircuit size={13}/> {scanAllLoading ? "Scanning all tables…" : "Run All Agents"}
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Total Agents",    value:agents.length, color:C.accent,  icon:"🤖" },
          { label:"Healthy",         value:healthyCount,       color:C.green,   icon:"✓" },
          { label:"Anomalies Found", value:alertCount,         color:C.red,     icon:"⚠" },
          { label:"Alerts Filed",    value:totalAlerts,        color:C.orange,  icon:"🔔" },
        ].map(({ label, value, color, icon }) => (
          <div key={label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px" }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:6 }}>{icon} {label.toUpperCase()}</div>
            <div style={{ fontSize:26, fontWeight:800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Agent cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {agentsLoading ? (
          <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"48px 0", color:C.muted, fontSize:13 }}>
            <RefreshCw size={20} style={{ animation:"spin 1s linear infinite", marginBottom:10 }} color={C.accent}/>
            <div>Discovering tables…</div>
          </div>
        ) : agents.length === 0 ? (
          <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"48px 0", color:C.muted, fontSize:13 }}>
            No tables found in mws schema.
          </div>
        ) : agents.map(agent => {
          const st = agentStates[agent.id] || {};
          const isRunning = running[agent.id];
          const isExpanded = expanded === agent.id;
          const sc = statusColor(isRunning ? "running" : st.status, C);

          return (
            <div key={agent.id} style={{ background:C.card, border:`1px solid ${isExpanded?C.accent:C.border}`, borderRadius:12, overflow:"hidden", transition:"border 0.2s" }}>
              {/* Agent row */}
              <div
                onClick={() => setExpanded(p => p === agent.id ? null : agent.id)}
                style={{ display:"grid", gridTemplateColumns:"40px 1fr 180px 130px 120px 110px auto", gap:12, padding:"14px 18px", alignItems:"center", cursor:"pointer" }}
              >
                {/* Icon */}
                <div style={{ fontSize:22, textAlign:"center" }}>{agent.icon}</div>
                {/* Label + table */}
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{agent.label}</div>
                  <div style={{ fontSize:11, color:C.muted, fontFamily:"monospace", marginTop:2 }}>{agent.table}</div>
                </div>
                {/* Status */}
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:sc, boxShadow: isRunning?`0 0 6px ${sc}`:undefined }} />
                  <span style={{ fontSize:11, color:sc, fontWeight:600 }}>{statusLabel(isRunning?"running":st.status)}</span>
                </div>
                {/* Last run */}
                <div style={{ fontSize:11, color:C.muted }}>{st.lastRun ? `Last: ${st.lastRun}` : "Never run"}</div>
                {/* Alerts filed */}
                <div style={{ fontSize:11 }}>
                  {st.alertsFiled > 0
                    ? <span style={{ color:C.red, fontWeight:700 }}>🔔 {st.alertsFiled} alert{st.alertsFiled!==1?"s":""}</span>
                    : <span style={{ color:C.muted }}>No alerts</span>}
                </div>
                {/* Severity badge */}
                <div>
                  {st.severity && st.severity !== "none" && (
                    <span style={{ fontSize:10, fontWeight:700, borderRadius:5, padding:"2px 8px", background:`${{critical:C.red,high:C.orange,medium:C.yellow,low:C.green}[st.severity]||C.muted}18`, color:{critical:C.red,high:C.orange,medium:C.yellow,low:C.green}[st.severity]||C.muted }}>
                      {st.severity}
                    </span>
                  )}
                </div>
                {/* Run button */}
                <button
                  onClick={e => { e.stopPropagation(); runAgent(agent); }}
                  disabled={isRunning}
                  style={{ padding:"6px 14px", background:isRunning?`${C.muted}15`:`${C.accent}18`, border:`1px solid ${isRunning?C.muted:C.accent}40`, borderRadius:7, cursor:isRunning?"not-allowed":"pointer", fontSize:11, color:isRunning?C.muted:C.accentL, fontWeight:700, whiteSpace:"nowrap" }}
                >
                  {isRunning ? "⟳ Scanning" : "▶ Run"}
                </button>
              </div>

              {/* Expanded panel */}
              {isExpanded && (
                <div style={{ borderTop:`1px solid ${C.border}`, padding:"14px 18px", background:C.isDark?"#0A0C1060":"#F8FAFC" }}>
                  <div style={{ fontSize:11, color:C.muted, marginBottom:8 }}>{agent.desc}</div>
                  {st.summary && (
                    <div style={{ fontSize:12, color:C.text, background:`${C.accent}10`, border:`1px solid ${C.accent}30`, borderRadius:8, padding:"8px 12px", marginBottom:10 }}>
                      💡 {st.summary}
                    </div>
                  )}
                  {st.log && st.log.length > 0 && (
                    <div>
                      <div style={{ fontSize:10, color:C.muted, fontWeight:700, marginBottom:6, letterSpacing:"0.08em" }}>SCAN LOG</div>
                      <div style={{ background:C.isDark?"#0A0C10":"#1E293B", borderRadius:7, padding:"10px 12px", fontFamily:"monospace", fontSize:11 }}>
                        {st.log.map((line, i) => (
                          <div key={i} style={{ color: line.startsWith("❌")?"#EF4444":line.startsWith("🚨")?"#F97316":line.startsWith("✅")?"#10B981":"#94A3B8", marginBottom:3 }}>{line}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!st.log && <div style={{ fontSize:11, color:C.muted }}>Click ▶ Run to start this agent.</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


export default function AIOpsMonitor() {
  const [theme, setTheme] = useState("light");
  const [dataMode, setDataMode] = useState("prod"); // "demo" | "prod"
  const T = theme === "dark" ? DARK_THEME : LIGHT_THEME;
  // Keep module-level C in sync for non-hook components
  C = T;

  const [aiPanel, setAiPanel]   = useState(null);
  const [drill, setDrill]     = useState(null); // { type, data }
  const [alertsState, setAlertsState] = useState([]); // live: populated by /api/alerts/detect; demo: ALERTS_RAW
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [lastScan, setLastScan] = useState(null);

  // ── Real data state ──────────────────────────────────────────────────────
  const [accounts,    setAccounts]    = useState([]);
  const [accountId,   setAccountId]   = useState("all");
  const [kpis,        setKpis]        = useState(null);
  const [kpisLoading, setKpisLoading] = useState(false);
  const [trend,       setTrend]       = useState([]);
  const [topAsins,    setTopAsins]    = useState([]);
  const [inventory,   setInventory]   = useState([]);
  const [liveRules,   setLiveRules]   = useState([]);
  const [rulesLoading,setRulesLoading]= useState(false);
  const [agentScanResult, setAgentScanResult] = useState(null);
  const [agentScanLoading, setAgentScanLoading] = useState(false);
  const [agentStates, setAgentStates] = useState({}); // agentId -> { status, lastRun, alertsFiled, log }

  // Load accounts on mount
  useEffect(() => {
    fetch("https://intentwise-backend-production.up.railway.app/api/accounts")
      .then(r=>r.json())
      .then(data=>{ if(Array.isArray(data)) setAccounts(data); })
      .catch(()=>{});
  }, []);

  // Load KPIs + trend + top ASINs when account changes
  useEffect(() => {
    setKpisLoading(true);
    const qs = accountId==="all" ? "" : `?account_id=${accountId}`;
    Promise.all([
      fetch(`https://intentwise-backend-production.up.railway.app/api/kpis${qs}`).then(r=>r.json()),
      fetch(`https://intentwise-backend-production.up.railway.app/api/trend${qs}`).then(r=>r.json()),
      fetch(`https://intentwise-backend-production.up.railway.app/api/top-asins${qs}`).then(r=>r.json()),
      fetch(`https://intentwise-backend-production.up.railway.app/api/inventory${qs}`).then(r=>r.json()),
    ]).then(([k,t,a,i]) => {
      if(!k.error) setKpis(k);
      if(Array.isArray(t)) setTrend(t);
      if(Array.isArray(a)) setTopAsins(a);
      if(Array.isArray(i)) setInventory(i);
      setKpisLoading(false);
    }).catch(()=>setKpisLoading(false));
  }, [accountId]);

  // Load rules when account changes
  useEffect(() => {
    setRulesLoading(true);
    const qs = accountId==="all" ? "" : `?account_id=${accountId}`;
    fetch(`https://intentwise-backend-production.up.railway.app/api/rules${qs}`)
      .then(r=>r.json())
      .then(data=>{ if(Array.isArray(data)) setLiveRules(data); setRulesLoading(false); })
      .catch(()=>setRulesLoading(false));
  }, [accountId]);

  const runFullAgentScan = async () => {
    setAgentScanLoading(true);
    try {
      const qs = accountId==="all" ? "" : `?account_id=${accountId}`;
      const res = await fetch(`https://intentwise-backend-production.up.railway.app/api/agents/full-scan${qs}`, {method:"POST"});
      const data = await res.json();
      setAgentScanResult(data);
      if(data.alerts && Array.isArray(data.alerts) && data.alerts.length>0) {
        setAlertsState(prev => {
          const existingIds = new Set(prev.map(a=>a.id));
          const newAlerts = data.alerts.filter(a=>!existingIds.has(a.id));
          return [...newAlerts, ...prev];
        });
      }
    } catch(e) { console.error(e); }
    setAgentScanLoading(false);
  };
  const resolveAlert = (id) => {
    const alert = alertsState.find(a => a.id === id);
    setAlertsState(p => p.map(a => a.id===id ? {...a, status:"resolved"} : a));
    if (addAuditEvent) addAuditEvent({
      type:   "alert",
      name:   `Resolved: ${alert?.title || id}`,
      table:  alert?.table  || "—",
      source: alert?.source || "—",
      result: "pass",
      detail: `Alert marked as resolved manually.`,
      duration: "—",
    });
  };
  const triageAlert = (id) => {
    const alert = alertsState.find(a => a.id === id);
    setAlertsState(p => p.map(a => a.id===id ? {...a, status:"triaged"} : a));
    if (addAuditEvent) addAuditEvent({
      type:   "alert",
      name:   `Investigating: ${alert?.title || id}`,
      table:  alert?.table  || "—",
      source: alert?.source || "—",
      result: "pending",
      detail: `Alert marked for investigation.`,
      duration: "—",
    });
  };
  const autoFixAlert = (id) => {
    const alert = alertsState.find(a => a.id === id);
    setAlertsState(p => p.map(a => a.id===id ? {...a, status:"resolved", autoFixed:true} : a));
    if (addAuditEvent) addAuditEvent({
      type:   "alert",
      name:   `Auto-Fixed: ${alert?.title || id}`,
      table:  alert?.table  || "—",
      source: alert?.source || "—",
      result: "pass",
      detail: `Alert auto-fixed by AI agent.`,
      duration: "—",
    });
  };

  const runAgentScan = async () => {
    setAlertsLoading(true);
    try {
      const qs = accountId === "all" ? "" : `?account_id=${accountId}`;
      const res = await fetch(`https://intentwise-backend-production.up.railway.app/api/alerts/detect${qs}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setAlertsState(prev => {
          const existingIds = new Set(prev.map(a=>a.id));
          const newAlerts = data.filter(a=>!existingIds.has(a.id));
          return [...newAlerts, ...prev];
        });
      }
      setLastScan(new Date().toLocaleTimeString("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit"}));
    } catch(e) { console.error("Scan failed:", e); }
    setAlertsLoading(false);
  };

  // Auto-scan alerts on load; full AI scan is manual (slow)
  useEffect(() => { runAgentScan(); }, []);
  const [notifOpen, setNotifOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const openDrill = (type, data) => setDrill({type, data});
  const handleNavigate = (tab, data) => { setActiveTab(tab); setDrill(null); };
  // expose for non-hook components
  useEffect(() => { window._drillFn = openDrill; return () => { delete window._drillFn; }; }, []);
  const [sevFilter, setSevFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tick,     setTick]     = useState(0);
  const [auditLog, setAuditLog] = useState(RUN_HISTORY);

  const addAuditEvent = React.useCallback((event) => {
    setAuditLog(prev => [{
      id:  `AE-${Date.now()}`,
      ts:  new Date().toLocaleTimeString(),
      ...event,
    }, ...prev].slice(0, 500));
  }, []);

  // Pulse the "last updated" timer
  useEffect(() => {
    const t = setInterval(() => setTick(p=>p+1), 30000);
    return () => clearInterval(t);
  }, []);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(p=>!p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const alerts = (alertsState||[]).filter(a => {
    // Demo mode: show ALERTS_RAW (A0xx); Live mode: show all alertsState
    if (dataMode === "demo" && a.id?.startsWith("AGT-")) return false;
    if (sevFilter !== "all" && a.severity !== sevFilter) return false;
    if (search && !a.title?.toLowerCase().includes(search.toLowerCase()) && !a.table?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const critCount  = alertsState.filter(a=>a.severity==="critical"&&a.status!=="resolved").length;
  const openCount  = alertsState.filter(a=>a.status==="open").length;
  const fixedCount = alertsState.filter(a=>a.status==="resolved").length;
  const runningAgents = AGENTS.filter(a=>a.status==="running").length;

  const TABS = [
    { id:"qahealth",   label:"Health & Insights",   icon:Activity,        count:0 },
    { id:"dashboard",  label:"Ops Command Center",   icon:LayoutDashboard, count:0 },
    { id:"alerts",     label:"Detect & Triage",      icon:Bell,            count:openCount },
    { id:"automation", label:"Automation & Controls", icon:Cpu,             count:0 },
    { id:"rules",      label:"Quality Rules",        icon:Shield,          count:INIT_RULES.filter(r=>r.lastResult==="fail").length },
    { id:"history",    label:"Audit Trail",          icon:History,         count:0 },
    { id:"sources",    label:"Data Sources",         icon:Database,        count:DATASOURCES.filter(d=>d.status!=="healthy").length },
    { id:"dbexplorer", label:"DB Explorer",          icon:Database,        count:0, badge:"LIVE" },
    { id:"dataflows",  label:"Dataflows",            icon:Workflow,        count:0 },
    { id:"agents",     label:"AI Agents",             icon:BrainCircuit,    count:0, badge:"NEW" },
  ];

  return (
    <ThemeCtx.Provider value={T}>
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text, fontFamily:"'Calibri', 'Gill Sans', 'Trebuchet MS', 'Helvetica Neue', Arial, sans-serif", transition:"background 0.2s, color 0.2s" }}>
      <style>{`
        /* Calibri is a system font — no import needed */
        * { box-sizing:border-box; margin:0; padding:0; }
        html, body { font-family:'Calibri', 'Gill Sans', 'Trebuchet MS', 'Helvetica Neue', Arial, sans-serif; font-size:14px; background:${T.bg}; color:${T.text}; transition:background 0.2s, color 0.2s; }
        h1,h2,h3,h4,h5,h6 { font-family:'Calibri', 'Gill Sans', 'Trebuchet MS', 'Helvetica Neue', Arial, sans-serif; font-weight:700; }
        code, pre, .mono { font-family:'Consolas', 'Cascadia Code', 'Fira Code', 'Courier New', monospace; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:${T.surface}; }
        ::-webkit-scrollbar-thumb { background:${T.border2}; border-radius:4px; }
        ::-webkit-scrollbar-thumb:hover { background:${T.muted}; }
        input, select, textarea { font-family:'Calibri', 'Gill Sans', 'Trebuchet MS', 'Helvetica Neue', Arial, sans-serif; }
        input::placeholder { color:${T.dim}; }
        select option { background:${T.card}; color:${T.text}; }
        button { font-family:'Calibri', 'Gill Sans', 'Trebuchet MS', 'Helvetica Neue', Arial, sans-serif; }
        .row-hover:hover { background:${T.accent}08 !important; transition:background 0.12s; }
        .clickable-link { color:${T.accentL}; text-decoration:underline; text-decoration-color:${T.accentL}50; text-underline-offset:3px; cursor:pointer; }
        .clickable-link:hover { color:${T.accent}; }
        @keyframes ping { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(1.8);opacity:0} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── Header ── */}
      <header style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:`${T.accent}25`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Shield size={15} color={T.accentL} />
            </div>
            <span style={{ fontSize:15, fontWeight:800, color:T.text, letterSpacing:"0.01em" }}>Intentwise</span>
            <span style={{ fontSize:15, color:T.dim, margin:"0 2px" }}>·</span>
            <span style={{ fontSize:14, color:T.muted, fontWeight:500 }}>Agentic QA Platform</span>
          </div>
          {critCount > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:6, background:`${T.red}15`, border:`1px solid ${T.red}40`, borderRadius:20, padding:"3px 10px" }}>
              <AlertCircle size={11} color={T.red} />
              <span style={{ fontSize:11, color:T.red, fontWeight:700 }}>{critCount} critical</span>
            </div>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:10, color:T.dim }}>Updated {tick === 0 ? "just now" : `${tick * 30}s ago`}</span>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <button onClick={()=>setPaletteOpen(true)} style={{ background:T.border, border:`1px solid ${T.border2}`, borderRadius:7, padding:"6px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:11, color:T.muted }}>
              <Search size={13}/> <span>Search</span> <kbd style={{ fontSize:9, background:T.isDark?"#1E2330":T.border, borderRadius:4, padding:"1px 5px", color:T.dim, fontFamily:"Consolas,monospace" }}>⌘K</kbd>
            </button>
          {/* Data Mode Toggle */}
          <div style={{ display:"flex", alignItems:"center", gap:1, background:T.border, borderRadius:8, padding:2 }}>
            <button
              onClick={()=>{ setDataMode("demo"); setAlertsState(ALERTS_RAW.map(a=>({...a}))); }}
              style={{ padding:"4px 10px", borderRadius:6, border:"none", cursor:"pointer", fontSize:10, fontWeight:700, letterSpacing:"0.03em",
                background: dataMode==="demo" ? T.card : "transparent",
                color: dataMode==="demo" ? T.muted : T.dim,
                boxShadow: dataMode==="demo" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition:"all 0.15s" }}
            >DEMO</button>
            <button
              onClick={()=>{ setDataMode("prod"); setAlertsState([]); }}
              style={{ padding:"4px 10px", borderRadius:6, border:"none", cursor:"pointer", fontSize:10, fontWeight:700, letterSpacing:"0.03em",
                background: dataMode==="prod" ? T.green : "transparent",
                color: dataMode==="prod" ? "white" : T.dim,
                boxShadow: dataMode==="prod" ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
                transition:"all 0.15s" }}
            >LIVE</button>
          </div>
          <button onClick={()=>setNotifOpen(true)} style={{ background:T.border, border:`1px solid ${T.border2}`, borderRadius:7, padding:"6px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:11, color:T.muted }}>
            <Bell size={13} /> Notifications
          </button>
          {/* ── Theme Toggle ── */}
          <button
            onClick={()=>setTheme(p=>p==="dark"?"light":"dark")}
            style={{ background:T.border, border:`1px solid ${T.border2}`, borderRadius:7, padding:"6px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:11, color:T.muted, transition:"all 0.2s" }}
            title="Toggle light/dark theme"
          >
            {theme==="dark"
              ? <><Sun size={14} color="#F59E0B"/><span style={{color:"#F59E0B",fontWeight:600}}>Light</span></>
              : <><Moon size={14} color={T.accent}/><span style={{color:T.accent,fontWeight:600}}>Dark</span></>
            }
          </button>
          <button style={{ background:T.border, border:`1px solid ${T.border2}`, borderRadius:7, padding:"6px", cursor:"pointer", color:T.muted }}>
            <Settings size={14} />
          </button>
          </div>
        </div>
      </header>

      <div style={{ display:"flex", height:"calc(100vh - 60px)", overflow:"hidden" }}>
        {/* ── Sidebar ── */}
        <aside style={{ width:220, background:T.surface, borderRight:`1px solid ${T.border}`, padding:"16px 12px", display:"flex", flexDirection:"column", gap:2, flexShrink:0, overflowY:"auto" }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:9, padding:"9px 12px", borderRadius:8, border:`1px solid ${active?T.accent+"40":"transparent"}`, background: active?`${T.accent}12`:"transparent", cursor:"pointer", textAlign:"left", width:"100%", transition:"background 0.15s", position:"relative" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <Icon size={14} color={active?T.accentL:T.muted} />
                  <span style={{ fontSize:12, color:active?T.text:T.muted, fontWeight:active?700:400, letterSpacing:"0.01em" }}>{tab.label}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  {tab.badge && <span style={{ background:T.green, color:"white", borderRadius:4, padding:"1px 5px", fontSize:8, fontWeight:800, letterSpacing:"0.05em" }}>{tab.badge}</span>}
                  {tab.count > 0 && <span style={{ background:active?T.accent:T.isDark?"#1E2330":T.border, color:active?"white":T.muted, borderRadius:10, padding:"2px 7px", fontSize:10, fontWeight:700, minWidth:18, textAlign:"center" }}>{tab.count}</span>}
                </div>
              </button>
            );
          })}

          <div style={{ marginTop:"auto", paddingTop:16, borderTop:`1px solid ${T.border}` }}>
            <div style={{ fontSize:9, color:T.dim, marginBottom:8, letterSpacing:"0.08em", fontWeight:700, paddingLeft:10 }}>QUICK LINKS</div>
            {[
               ["Remediation Flows", Layers,  "workflows", null],
              ["Quality Rules",  Settings,  "rules",     null],
              ["Audit Trail",    History,   "history",   null],
              ["Intentwise Docs", ExternalLink, null, "https://docs.intentwise.com"],
            ].map(([label, Icon, tab, href])=>(
              <button
                key={label}
                onClick={()=> tab ? setActiveTab(tab) : window.open(href,"_blank")}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px", borderRadius:6, border:"none", background:"transparent", cursor:"pointer", width:"100%", color:T.muted, fontSize:10, transition:"background 0.12s, color 0.12s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=T.accent+"12"; e.currentTarget.style.color=T.accentL; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=T.muted; }}
              >
                <Icon size={11} />
                <span style={{flex:1, textAlign:"left"}}>{label}</span>
                {href
                  ? <ExternalLink size={9} style={{flexShrink:0}} />
                  : <ArrowRight size={9} style={{flexShrink:0}} />
                }
              </button>
            ))}
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={{ flex:1, overflowY:"auto", padding:"24px 28px", marginRight: aiPanel ? 420 : 0, transition:"margin 0.2s", background:T.bg }}>

          {/* KPIs */}
          {dataMode === "prod" && kpis && (
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10, padding:"6px 12px", background:`${T.green}10`, border:`1px solid ${T.green}30`, borderRadius:8 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:T.green, display:"inline-block" }}/>
              <span style={{ fontSize:11, color:T.green, fontWeight:600 }}>Live Redshift data</span>
              <span style={{ fontSize:10, color:T.muted, marginLeft:"auto" }}>account: {accountId === "all" ? "all accounts" : accountId}</span>
            </div>
          )}
          {dataMode === "demo" && (
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10, padding:"6px 12px", background:`${T.muted}10`, border:`1px solid ${T.muted}20`, borderRadius:8 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:T.muted, display:"inline-block" }}/>
              <span style={{ fontSize:11, color:T.muted, fontWeight:600 }}>Demo mode — switch to LIVE to see real data</span>
            </div>
          )}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
            <KPI label="Detected Issues"
                 value={dataMode==="prod" && kpis ? alertsState.filter(a=>a.status==="open").length : openCount}
                 sub={dataMode==="prod" && kpis ? `${alertsState.filter(a=>a.severity==="critical"&&a.status!=="resolved").length} critical` : `${critCount} critical`}
                 trend={12} icon={Bell}
                 color={(kpis ? alertsState.filter(a=>a.status==="open").length : openCount)>4?T.red:T.orange}
                 spark={SPARKLINE.slice(-10)} onClick={()=>setActiveTab && setActiveTab('alerts')}
                 badge={kpis?"LIVE":null} />
            <KPI label="Total Revenue"
                 value={dataMode==="prod" && kpis ? `$${(kpis.sales.total_sales/1000).toFixed(0)}k` : fixedCount}
                 sub={kpis ? `${kpis.sales.units.toLocaleString()} units ordered` : "no human touch"}
                 trend={-8} icon={kpis?TrendingUp:Wrench}
                 color={T.green} spark={SPARKLINE.slice(-10).map(v=>v*0.5)}
                 badge={kpis?"LIVE":null} />
            <KPI label={kpis?"Pending Orders":"QA Agents Active"}
                 value={dataMode==="prod" && kpis ? kpis.orders.pending : runningAgents}
                 sub={kpis ? `${kpis.orders.canceled} canceled` : "autonomous coverage"}
                 trend={0} icon={kpis?Clock:Bot}
                 color={kpis&&kpis.orders.pending>100?T.red:T.purple}
                 spark={[4,4,5,4,5,5,4,5,6,5]} onClick={()=>setActiveTab && setActiveTab('agents')}
                 badge={kpis?"LIVE":null} />
            <KPI label={kpis?"Buy Box %":"Mean Time to Detect"}
                 value={dataMode==="prod" && kpis ? `${(kpis.sales.buy_box_pct*100).toFixed(1)}%` : "4.2m"}
                 sub={kpis ? `${kpis.inventory.out_of_stock} SKUs out of stock` : "↓22% vs manual baseline"}
                 trend={-22} icon={kpis?BarChart3:Clock}
                 color={T.cyan} spark={SPARKLINE.slice(-10).map(v=>100-v)}
                 badge={kpis?"LIVE":null} />
          </div>

          {/* ── Health & Insights Tab ── */}
          {activeTab === "qahealth" && (
            <div style={{ paddingBottom:24 }}>
              <SectionHeader icon={Activity} title="Health & Insights" subtitle="Pipeline health metrics and QA process analytics — coming soon" />
              <div style={{ marginTop:4, padding:"32px", background:T.card, border:`1px dashed ${T.border2}`, borderRadius:12, textAlign:"center" }}>
                <Activity size={32} color={T.border2} style={{ marginBottom:12 }}/>
                <div style={{ fontSize:13, color:T.muted, marginBottom:6 }}>Health dashboards will be wired to <code style={{color:T.accentL,fontFamily:"Consolas,monospace"}}>redshift-staging</code> in a future release.</div>
                <div style={{ fontSize:11, color:T.muted }}>Coverage metrics, pipeline SLAs, and QA trend charts coming soon.</div>
              </div>
            </div>
          )}

          {/* ── Detect & Triage + Root Cause Tab ── */}
          {activeTab === "alerts" && (
            <>
              <DetectTriageRootCause
                alertsState={alertsState} sevFilter={sevFilter} setSevFilter={setSevFilter}
                search={search} setSearch={setSearch}
                resolveAlert={resolveAlert} triageAlert={triageAlert} autoFixAlert={autoFixAlert}
                openDrill={openDrill} setAiPanel={setAiPanel} aiPanel={aiPanel}
                dataMode={dataMode}
                addAuditEvent={addAuditEvent}
              />
              <div style={{ marginTop:20 }}>
                <RootCauseTab alertsState={alertsState} />
              </div>
            </>
          )}

          {/* ── Automation & Controls Tab ── */}
          {activeTab === "automation" && (
            <div style={{ paddingBottom:24 }}>
              <SectionHeader icon={Cpu} title="Automation & Controls" subtitle="QA agents, remediation flows and approval gates — coming soon" />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginTop:4 }}>
                {[
                  { icon:Bot,       title:"QA Agents",          desc:"Autonomous agents that scan mws tables, detect anomalies and file alerts.", badge:"Soon" },
                  { icon:GitBranch, title:"Remediation Flows",  desc:"Automated workflows to fix, requeue or escalate detected data issues.",   badge:"Soon" },
                  { icon:Lock,      title:"Human-in-the-Loop",  desc:"Approval gates requiring human sign-off before high-risk auto-fixes run.", badge:"Soon" },
                ].map(({ icon:Icon, title, desc, badge }) => (
                  <div key={title} style={{ background:T.card, border:`1px solid ${T.border2}`, borderRadius:12, padding:"20px 22px" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:`${T.accent}12`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon size={18} color={T.accent}/>
                      </div>
                      <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.08em", color:T.muted, background:T.border, borderRadius:4, padding:"2px 7px" }}>{badge}</span>
                    </div>
                    <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:6 }}>{title}</div>
                    <div style={{ fontSize:12, color:T.muted, lineHeight:1.6 }}>{desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:20, padding:"16px 20px", background:T.card, border:`1px dashed ${T.border2}`, borderRadius:12, textAlign:"center" }}>
                <div style={{ fontSize:12, color:T.muted }}>These capabilities will be wired to <code style={{color:T.accentL,fontFamily:"Consolas,monospace"}}>redshift-staging</code> · mws schema in a future release.</div>
              </div>
            </div>
          )}

          {/* ── Sources Tab ── */}
          {activeTab === "sources" && (
            <div>
              <SectionHeader icon={Database} title="Data Sources" subtitle="Pipeline coverage & connection health" />
              <Card>
                {DATASOURCES.map(ds=><DSRow key={ds.id} ds={ds} onDrill={openDrill}/>)}
              </Card>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:14 }}>
                <Card style={{ padding:"16px 18px" }}>
                  <SectionHeader icon={Activity} title="Continuous Schema Monitoring" subtitle="Next scan: 12:00 PM" />
                  {DATASOURCES.filter(d=>d.status==="healthy").slice(0,3).map(d=>(
                    <div key={d.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                      <span>{DS_ICONS[d.type]}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:11, color:C.text }}>{d.name}</div>
                        <div style={{ fontSize:10, color:C.muted }}>{d.tables} tables to scan</div>
                      </div>
                      <span style={{ fontSize:10, color:C.muted }}>Scheduled</span>
                    </div>
                  ))}
                </Card>
                <Card style={{ padding:"16px 18px" }}>
                  <SectionHeader icon={Shield} title="AI-Generated Quality Rules" subtitle="Self-evolving rule corpus" />
                  {["NULL check on report.profile_id", "Row count ≥ 100 for campaign_report", "Freshness < 6h for account_performance"].map(r=>(
                    <div key={r} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                      <Sparkles size={11} color={C.purple} />
                      <span style={{ fontSize:11, color:C.text, flex:1 }}>{r}</span>
                      <span style={{ fontSize:10, color:C.green }}>Active</span>
                    </div>
                  ))}
                </Card>
              </div>
              <StagingPanel />
            </div>
          )}

          {/* ── DB Explorer Tab ── */}
          {activeTab === "dbexplorer" && (
            <DBExplorerTab
              kpis={kpis} kpisLoading={kpisLoading}
              alertsState={alertsState} setActiveTab={setActiveTab}
              accounts={accounts} accountId={accountId} setAccountId={setAccountId}
              liveRules={liveRules} rulesLoading={rulesLoading}
              agentScanResult={agentScanResult} agentScanLoading={agentScanLoading} runFullAgentScan={runFullAgentScan}
              trend={trend} topAsins={topAsins} lastScan={lastScan}
              dataMode={dataMode}
            />
          )}

          {/* ── Dataflows Tab ── */}
          {activeTab === "dataflows" && (
            <div style={{ paddingBottom:24 }}>
              <SectionHeader icon={Workflow} title="Dataflows" subtitle="Query · Schedule · AI anomaly detection — redshift-staging" />
              <DataflowsTab />
            </div>
          )}


          {/* ── AI Agents Tab ── */}
          {activeTab === "agents" && (
            <div style={{ paddingBottom:24 }}>
              <AIAgentsTab
                agentStates={agentStates}
                setAgentStates={setAgentStates}
                setAlertsState={setAlertsState}
                accountId={accountId}
                alertsState={alertsState}
                addAuditEvent={addAuditEvent}
              />
            </div>
          )}

          {/* ── Dashboard Tab ── */}
          {activeTab === "dashboard" && (
            <div style={{ paddingBottom:24 }}>
              <CommandCenterTab onNavigate={setActiveTab} kpis={dataMode==="prod"?kpis:null} kpisLoading={kpisLoading} trend={trend} topAsins={topAsins} accountId={accountId} agentScanResult={dataMode==="prod"?agentScanResult:null} agentScanLoading={agentScanLoading} onAgentScan={runFullAgentScan} alertsState={dataMode==="prod"?alertsState:null} dataMode={dataMode} />
            </div>
          )}

          {/* ── Run History Tab ── */}
          {activeTab === "history" && (
            <div style={{ paddingBottom:24 }}>
              <RunHistoryTab />
            </div>
          )}

          

          {/* ── Rules Tab (+ Validation) ── */}
          {activeTab === "rules" && (
            <div style={{ paddingBottom:24 }}>
              <RulesAndValidationWrapper liveRules={dataMode==="prod"?liveRules:[]} rulesLoading={rulesLoading} addAuditEvent={addAuditEvent} />
            </div>
          )}
          
          
        </main>
      </div>

      {/* AI Chat Side Panel */}
      {aiPanel && <AIChatPanel alert={aiPanel} onClose={()=>setAiPanel(null)} />}
      {/* Drill-Down Modal */}
      {drill && <DrillModal target={drill} onClose={()=>setDrill(null)} onNavigate={handleNavigate} alertsState={alertsState} />}
      {notifOpen  && <NotificationCenter onClose={()=>setNotifOpen(false)} alertsState={alertsState} />}
      {paletteOpen && <CommandPalette onClose={()=>setPaletteOpen(false)} onNavigate={(tab)=>{ setActiveTab(tab); setPaletteOpen(false); }} alertsState={alertsState} />}
    </div>
    </ThemeCtx.Provider>
  );
}
