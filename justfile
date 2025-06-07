# https://github.com/casey/just
# https://just.systems/

dev:
    bun run dev

build:
    bun run build

build-for-test:
    VITE_TEST=1 bun run build

lint:
    bun run lint:check

format:
    bun run lint

install:
    bun install

outdated:
    bun outdated
    bunx npm-check-updates --interactive

codegen:
    curl -s http://localhost:3000
    npm run playwright:codegen

test:
    bun run test

# alias
upgrade: outdated
