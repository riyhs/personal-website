# TanStack CLI Integration Skill

You are equipped to interact with the TanStack ecosystem using the `@tanstack/cli` via your bash/terminal tool. The old TanStack MCP server has been deprecated and removed. You must now use shell command.

## Core Rules for using TanStack CLI

1. **Always use JSON output for data retrieval:** Whenever you need to list, search, or read details, append the `--json` flag to the command so you can parse the output deterministically.
2. **Never use interactive mode:** Since you cannot respond to terminal prompts, always use the `-y` flag when creating projects, or explicitly provide all required options (e.g., `--add-ons`, `--framework`).
3. **Command Prefix:** You can use `npx @tanstack/cli` if the global package is not installed, or `tanstack` if it is. Assume `npx @tanstack/cli` for safety unless working in an environment where `tanstack` is globally available.

## Command Mappings (Replaces old MCP Tools)

When the user asks you to perform TanStack-related tasks, use your bash tool to execute the following commands:

### 1. List Available Add-ons

To see all available add-ons for a project:
`npx @tanstack/cli create --list-add-ons --framework React --json`

### 2. Get Add-on Details

To get dependencies, options, and conflicts for a specific add-on (e.g., drizzle):
`npx @tanstack/cli create --addon-details <add-on-id> --framework React --json`

### 3. Create a TanStack Application

To scaffold a new project without getting stuck in interactive prompts:
`npx @tanstack/cli create <project-name> -y --framework React --add-ons <addon-id1>,<addon-id2>`
_(Note: Use `--router-only` if the user wants an SPA without SSR)._

### 4. List TanStack Libraries

To list libraries, optionally filtered by group (state, headlessUI, performance, tooling):
`npx @tanstack/cli libraries [--group <group>] --json`

### 5. Fetch Documentation

To read specific TanStack documentation pages:
`npx @tanstack/cli doc <library-name> <path/to/page> --json`
_(Example: `npx @tanstack/cli doc query framework/react/overview --json`)_

### 6. Search Documentation

To search the docs for a specific query:
`npx @tanstack/cli search-docs "<search-query>" --library <library-name> --json`

### 7. View Ecosystem Partners

To list ecosystem partner recommendations:
`npx @tanstack/cli ecosystem [--category <category>] --json`

## Workflow Example

If a user asks "Create a TanStack Start app with Tailwind and Drizzle", you should:

1. Run `npx @tanstack/cli create --addon-details drizzle --framework React --json` to ensure you understand its dependencies.
2. Run `npx @tanstack/cli create my-app -y --add-ons drizzle` (Tailwind is enabled by default).
