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
| Windows, x64 | the archive, below | the same, with the new version |

On Debian, Ubuntu and WSL, add the repository and its key once:

```bash
curl -fsSL https://europe-west2-apt.pkg.dev/doc/repo-signing-key.gpg \
  | sudo gpg --dearmor --output /usr/share/keyrings/kz-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/kz-archive-keyring.gpg] https://europe-west2-apt.pkg.dev/projects/ticketing-shared apt-public main" \
  | sudo tee /etc/apt/sources.list.d/kz.list
sudo apt-get update && sudo apt-get install kz
```

On Windows, download the archive and unpack it. Replace `X.Y.Z` with the version you want:

```powershell
$version = "X.Y.Z"
$url = "https://artifactregistry.googleapis.com/download/v1/projects/ticketing-shared/locations/europe-west2/repositories/binaries-public/files/kz:${version}:kz-${version}-win-x64.zip:download?alt=media"
Invoke-WebRequest $url -OutFile kz.zip
Expand-Archive kz.zip -DestinationPath "$env:LOCALAPPDATA\Programs\kz" -Force
# then add %LOCALAPPDATA%\Programs\kz to your PATH
```

Once a day kz checks that it is as new as the platform, and tells you how to update when it is not.

## Sign in

```bash
kz auth login                # in your browser
kz auth login --no-browser   # on a machine with no browser - over SSH, in a container
kz auth status
```

`kz auth login` opens the box office's sign-in page in your browser, and you sign in as yourself. kz keeps the sign-in in your own configuration folder and renews it before it expires. With `--no-browser`, kz prints the sign-in address instead: open it in a browser on any machine, sign in, then paste back the whole address of the page the browser cannot open.

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
- `--fields` shows only the fields it names, as dotted paths (`--fields name,venue.name`); `--full` shows every object one level down.
- A list returns one page, and prints a token when more follow. `--page-token` continues from that token, `--all` fetches every page, and `--limit 10` fetches at most 10 in all.

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
