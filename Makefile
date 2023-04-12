PROJECT_NAME:= kitty-facty

.PHONY: all
all: help

.PHONY: help
help:
	@echo "------------------------------------------------------------------------"
	@echo "${PROJECT_NAME}"
	@echo "------------------------------------------------------------------------"
	@grep -E '^[a-zA-Z0-9_/%\-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: serve
serve: ## Run locally
	npm run dev

.PHONY: build
build: lint ## Build application binaries
	npm run build

.PHONY: lint
lint: ## Run linters
	npm run lint

.PHONY: test
test: lint ## Run unit tests
	npm run test

.PHONY: image
image: ## Create Docker image
	docker build -t kitty-facty .

.PHONY: docker-up
docker-up: ## Start docker image
	docker run -p 3000:3000 kitty-facty
