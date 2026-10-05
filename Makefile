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

.PHONY: sync-release-version
sync-release-version:
	@node assets/scripts/release-version.mjs sync

.PHONY: check-release-version
check-release-version:
	@node assets/scripts/release-version.mjs check

.PHONY: release
release:
	@node assets/scripts/release-version.mjs release
