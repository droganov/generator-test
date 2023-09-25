NODE_ENV = export $(shell cat .env | xargs)

api:
	$(NODE_ENV) && pnpm run yobta-api

d:
	pnpm run dev

lint:
	pnpm run lint

lint-fix:
	pnpm run lint:fix

pretty:
	pnpm run prettify

test:
	pnpm run test:watch

typecheck:
	pnpm run typecheck

check:
	make typecheck
	make lint
	pnpm run test

up:
	pnpm up -L

build:
	make check
	pnpm run build

i:
	rm -rf node_modules
	pnpm i
