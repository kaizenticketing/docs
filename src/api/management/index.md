---
title: Management API
description: The GraphQL API behind the box office - its operations and types.
---

The Management API is the GraphQL API behind the box office: the same queries and mutations, with the same permissions. Every request is an HTTP `POST` of a GraphQL document to one address:

```
https://api.ktckts.com/management
```

```bash
curl https://api.ktckts.com/management \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "query": "query { version }" }'
```

## Signing in

Every request carries an access token in its `Authorization` header. How your software gets a token of its own is not published yet - ask your Kaizen contact.

## Groups

Every query and mutation sits in a group - catalog, venues, customers and so on - so a document names the group first:

```graphql
query {
  catalog {
    event(first: 10) {
      edges { node { id code name { unlocalisedString } } }
    }
  }
}
```

**Operations** lists each query and mutation under its group, and **Types** every type they use.

## Paging

A query that lists returns a page: its `edges`, each with a `node`, and its `pageInfo`. `first` sets the page size, and `after` takes the `pageInfo.endCursor` of the page before to fetch the next one, while `pageInfo.hasNextPage` is true. `totalCount` counts every item, not just the page.

## kz

[kz](/kz/) is this API as commands, with `--help` for each one.
