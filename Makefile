install:
	npm ci
start:
	npx babel-node src/bin/gendiff.js ${o}
publish:
	npm publish --dry-run
lint:
	npx eslint .
test:
	npm test
test-coverage:
	npm test -- --coverage
build:
	npm run build

