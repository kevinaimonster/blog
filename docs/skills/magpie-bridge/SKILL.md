---
name: magpie-bridge
description: Configure and troubleshoot a local Magpie gateway so Claude Code can use a Codex ChatGPT subscription. Covers the macOS desktop app, the gpt-claude launcher, worktrees, and Fast controls for new or existing sessions.
---

# Magpie bridge for Claude Code and Codex

Use Magpie's existing account discovery, protocol translation, model picker, and Fast settings. The intended path is Claude Code → local Magpie gateway → a Codex account. The Codex client itself does not need to be connected unless the user also requests that.

The accompanying [article](https://kevin1988.fun/notes/claude-code-codex-magpie/) explains the workflow and its observed results. The [macOS launcher](assets/gpt-claude) is an installation template, not a command to run without checking the user's environment.

## Carry out the requested operation

For a setup request, complete these steps using the user's existing authorization. For a check-only request, inspect and report without modifying configuration. For a Fast-only request, keep the work within that requested scope.

1. **Inspect the Mac.** Resolve the app and CLI paths and versions, the gateway listener, and any existing `gpt-claude`, `gcl`, and launch agents. Identify the current model and whether there are active requests. Read the relevant settings without exposing credentials. If this is another OS, adapt using current Magpie documentation instead of running the macOS template unchanged.
2. **Resolve missing prerequisites.** Reuse working installations. If Magpie is missing, use its official desktop distribution at `https://usemagpie.ai`; verify the current installation instructions. If Claude Code or Codex is missing, use that tool's official installation flow. A missing or expired account requires the user's sign-in, not a fabricated token or a copied credential in chat. Continue independent preparation while waiting for login.
3. **Confirm the provider and model.** Check Magpie's discovered Codex account and its available model IDs. Use the model the user requested if available. If a choice is still required, present the actual available options rather than assuming the template default is supported. Do not reconnect the Codex client unless requested.
4. **Prepare the desktop runtime.** Start the existing app. When requested, enable login startup and local-only Web access from its settings. Keep one desktop process in charge of the gateway and Web UI. If replacing a daemon, prepare backups and wait for active work to finish before the switch. Treat additional crash recovery as a separate requested configuration.
5. **Install the launcher.** Locate `assets/gpt-claude` relative to this SKILL.md, inspect the target file, and back it up if it exists. Adapt the template's model, app/CLI paths, gateway address and authentication to the inspected machine. Install it executable at `~/.local/bin/gpt-claude`, ensure that directory is on PATH, and preserve invocation-only settings. Do not replace global Claude settings as an incidental part of wrapper installation.
6. **Set up the requested shortcut.** If the user asked for `gcl`, preserve `"$@"`, remove the conflicting alias, and place the function after shell plugin loading. Preserve an explicitly chosen existing permission mode; do not add permission-bypass flags by default. Verify command resolution in a fresh shell.
7. **Verify the connection.** Run shell syntax and help checks, then one short, tool-free request when authorized. Correlate its result with Magpie's actual agent/model/status. Test Fast only if requested; read all three tier fields and leave model-wide Fast unchanged unless that broader setting was requested. Do not repeatedly spend subscription allowance trying to manufacture a successful result.
8. **Hand over usable commands.** Report the installed paths, selected model, listener ownership, startup configuration, and the observed request result. Give `gpt-claude`, `gpt-claude --fast`, and the requested shortcut/worktree examples. State any missing prerequisite or unverified behavior. When blocked, retain a usable existing configuration and identify the exact next action needed.

For Fast on an existing session: first identify the actual active model, explain that the gateway switch affects every session using that client/model, and change it only within the user's authorized scope. Use the control described below and verify a subsequent request; do not restart the session or gateway just to apply it.

## Inspect before changing

- Check the installed Magpie, Claude Code, and Codex versions and their help. Inspect listener PIDs, relevant settings, and available models. Report only necessary fields, never tokens, refresh credentials, cookies, or keyed Web URLs.
- Keep the user's model, effort, global settings, and runtime choice. The template uses `codex/gpt-6-astra`, port 3425, `/Applications/magpie.app`, and `/usr/bin/python3`; adapt those to the actual machine.
- Distinguish an existing Codex sign-in from an installed CLI. Confirm that Magpie has a usable account and model. Account import is not a read-only discovery operation and may sign the source tool out.

## Runtime

When the user wants one desktop app, let it own the gateway, menu bar, and optional local browser page. Do not add a second persistent `serve` or `web` process. Use the desktop settings to enable local browser access; the example port is 3430.

`magpie autostart on` configures login startup. Crash recovery is a separate launch-agent configuration. If requested, preserve intentional Quit behavior with `KeepAlive` / `SuccessfulExit: false`, and verify that the installed Magpie version does not rewrite custom plist fields. Inspect `internal/autostart/autostart_darwin.go` before relying on such customizations.

Before a restart or daemon migration, inspect `/v1/magpie/concurrency` with the actual gateway credentials and wait for active work to finish. Do not stop active requests just to demonstrate recovery. After migration, verify the daemon is removed and both enabled ports belong to the desktop process. Plugin-host child processes are not duplicate desktop installations.

Browser authentication uses a key-bearing link that sets a cookie before redirecting. Automated Web checks need a CookieJar. The gateway bearer token is not the browser key. Never bundle either private credential into this skill.

## Claude Code connection

For a saved global change, use the Agents page or `magpie claude codex/MODEL`, after backing up the relevant settings. For invocation-only routing, adapt and install `assets/gpt-claude`, preserving any user's existing modifications. Do not overwrite their global Claude model merely to install the wrapper.

The template sends invocation settings for `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, and an empty `ANTHROPIC_API_KEY`. Its `magpie-claude` token is a local example marker, not a remote gateway credential. Use the configured access key when one is required.

Preserve arguments, including `-w/--worktree`. A `gcl` shortcut should pass `"$@"` intact. Do not add permission-bypass flags unless the user requests or already uses them. Oh My Zsh's Git plugin defines its own `gcl` alias: remove that alias and define the wrapper function after plugin loading. Diagnose with `type -a gcl` before blaming worktree support. Test worktrees only in a suitable Git repository.

## Fast and its scope

- `gpt-claude --fast` applies to the process being launched. It adds `speed: "fast"` through `CLAUDE_CODE_EXTRA_BODY`; Magpie translates it into `service_tier: "priority"` for the Codex backend. Preserve other caller-supplied extra-body fields.
- For existing sessions, use Magpie → Agents → Claude Code → model picker → ⚡ Fast. Confirm the active model first. This affects subsequent requests from **all sessions using that client-and-model combination**, not just one session. Do not expand a single-session request to this broader scope without resolving that mismatch.
- `--no-fast` requests standard speed from the client. It does not cancel a Fast override in Magpie. Turn off the relevant gateway setting as well when the user wants ordinary speed.
- An in-flight request cannot change tier midway. Changing startup environment does not change an already-running process. A session-specific alternative is to finish the current turn, exit, and resume the same session with the Fast launcher; verify resume arguments and session ID first.
- Claude's native `/fast` state is not evidence of the Codex tier. Ultrafast is a separate capability; do not enable it merely because Fast was requested.

The verified model-level API is `POST /api/agent-fast` on the authenticated management interface, with `{"for":"claude","ref":"codex/MODEL","fast":true,"ultra":false}`. Check the installed source before automation. The endpoint saves the setting and invalidates held provider settings; prefer it or the GUI over editing JSON behind the running app.

## Verify and report accurately

Use shell syntax and help checks for the wrapper, then a short real request when authorized. For example, the tested CLI accepted `gpt-claude --fast --bare -p 'Reply with exactly FAST_OK. Do not use tools.' --tools '' --no-session-persistence --output-format json`. Verify available flags for another version.

Inspect the relevant Magpie usage entry for agent, actual model, status, `tier_asked`, `tier_sent`, and `tier_served`. Distinguish requested, sent, and upstream-confirmed tiers. In the November 4, 2026 check, the call returned HTTP 200 and `FAST_OK`, with `fast → priority → not reported`. Do not turn that into a speed benchmark or a claim that the final processing tier was confirmed.

Fast increases allowance consumption. Check [current OpenAI Docs](https://learn.chatgpt.com/docs/agent-configuration/speed), distinguishing included subscription limits, purchased credits, and API-key pricing. Do not freeze today's multipliers into permanent assumptions.

Report login-item configuration separately from an actual login test, and configured crash recovery separately from a recovery test. Keep source changes, local configuration, live verification, and publication status distinct.
