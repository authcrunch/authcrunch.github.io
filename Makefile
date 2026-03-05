PROJECT_NAME="authcrunch-docs"
PROJECT_VERSION:=$(shell cat VERSION | head -1)
GIT_COMMIT:=$(shell git describe --dirty --always)
GIT_BRANCH:=$(shell git rev-parse --abbrev-ref HEAD -- | head -1)
LATEST_GIT_COMMIT:=$(shell git log --format="%H" -n 1 | head -1)
BUILD_USER:=$(shell whoami)
BUILD_DATE:=$(shell date +"%Y-%m-%d")
BUILD_DIR:=$(shell pwd)

all: info build
	@echo "$@: complete"

.PHONY: info
info:
	@versioned --sync package.json
	@echo "DEBUG: $(PROJECT_NAME) Version: $(PROJECT_VERSION), Branch: $(GIT_BRANCH), Revision: $(GIT_COMMIT)"
	@echo "DEBUG: Build on $(BUILD_DATE) by $(BUILD_USER)"

.PHONY: build
build:
	@echo "$@: started"
	@echo "$@: complete"

.PHONE: clean
clean:
	@echo "$@: started"
	@echo "$@: complete"

.PHONE: test
test: clean
	@echo "$@: started"
	@echo "$@: complete"

.PHONY: release
release:
	@echo "$@: started"
	@versioned --sync package.json
	@if [ $(GIT_BRANCH) != "main" ]; then echo "cannot release to non-main branch $(GIT_BRANCH)" && false; fi
	@git diff-index --quiet HEAD -- || ( echo "git directory is dirty, commit changes first" && false )
	@versioned -patch
	@versioned --sync package.json
	@echo "Patched version"
	@git add VERSION package.json
	@git commit -m "released v`cat VERSION | head -1`"
	@git tag -a v`cat VERSION | head -1` -m "v`cat VERSION | head -1`"
	@git push
	@git push --tags
	@@echo "If necessary, run the following commands:"
	@echo "  git push --delete origin v$(PROJECT_VERSION)"
	@echo "  git tag --delete v$(PROJECT_VERSION)"
	@echo "$@: complete"
