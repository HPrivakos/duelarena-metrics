# archives

Downloads archives from 2024-01-01 to 2024-06-10 from Atlas Corp: https://dao-data.atlascorp.io/archive/list
Extract all of the tar into an ./archives directory so you have all .json files from 2024-01-01 to 2024-06-10

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run getDuelArena.ts # take all atlascorp data and generate files containing only duelarena data
bun run index.ts # get stats
```

This project was created using `bun init` in bun v1.1.8. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
