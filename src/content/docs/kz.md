---
title: kz
description: The Management API as commands - install it, sign in, and read and change your data from a terminal or a script.
---

kz is the [Management API](/api/management/) as commands. Every group, query and mutation is a command with its own `--help`, so you can read and change your data from a terminal or a script without writing GraphQL.

## Install

| Machine | Install | Update |
| :--- | :--- | :--- |
| macOS, Apple silicon | `brew tap kaizenticketing/kz https://github.com/kaizenticketing/homebrew`, then `brew install kaizenticketing/kz/kz` | `brew upgrade kz` |
| Linux, x64 or arm64 | the apt repository, below | `sudo apt-get update && sudo apt-get install --only-upgrade kz` |
| Windows, x64 | `winget install --id KaizenTicketing.kz` | `winget upgrade --id KaizenTicketing.kz` |

On Debian, Ubuntu and WSL, add the repository and its key once:

```bash
curl -fsSL https://europe-west2-apt.pkg.dev/doc/repo-signing-key.gpg \
  | sudo gpg --dearmor --output /usr/share/keyrings/kz-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/kz-archive-keyring.gpg] https://europe-west2-apt.pkg.dev/projects/ticketing-shared kz-apt main" \
  | sudo tee /etc/apt/sources.list.d/kz.list
sudo apt-get update && sudo apt-get install kz
```

Once a day kz checks that it is as new as the platform, and tells you how to update when it is not.

## Sign in

kz sends every request with an access token, and keeps it in your own configuration folder:

```bash
kz config set environment prod
kz auth login --token <token>
kz auth status
```

How your software gets a token of its own is not published yet - ask your Kaizen contact.

## Commands

`kz <group> <resource> <verb>`, as the API's groups are laid out:

```bash
kz catalog events list --statuses published
kz catalog events describe <event id> --fields venue.name,onsales.validFrom
kz catalog price-types list --format csv > price-types.csv
kz venues list
```

- `--help` on any command lists its flags, and the fields of what it returns.
- A terminal gets a table; anything else gets JSON. `--format json`, `table`, `csv` or `value(code,name)` chooses.
- `--fields` adds fields to what is shown, as dotted paths; `--full` shows every object one level down.
- A list returns a page. `--limit` sets its size, `--page-token` continues from the token kz printed, and `--all` fetches every page.

## Changes

Every mutation is a command too, and `--dry-run` prints what kz would send without sending it:

```bash
kz customers restriction-reasons save --id <id> --name "Away supporter" --dry-run
kz customers restriction-reasons save --id <id> --name "Away supporter"
```

A `save` with `--id` reads the item first, changes only the flags you give, and sends the rest back as it was.

For anything no command covers, send your own GraphQL document:

```bash
kz graphql query.graphql --var id=<event id>
```

## Exit codes

| Code | Meaning |
| :--- | :--- |
| 0 | Done. |
| 1 | The API, the network or the server refused or failed - the message says which. |
| 2 | The command line is wrong. Nothing was sent. |
| 3 | Not found, or your organisation cannot see it. |
| 4 | Not signed in, or the API refused the token. |
