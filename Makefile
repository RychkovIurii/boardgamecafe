SHELL := /bin/bash
PROJECT ?= cafeboardgame
COMPOSE := docker compose -p $(PROJECT)

.PHONY: default up detached down stop restart fclean re prune logs logs-backend logs-frontend shell-backend shell-frontend help

default: up

up:
	if [ ! -d mongo/db_mounted ]; then mkdir -p mongo/db_mounted; fi
	$(COMPOSE) up --build

detached:
	if [ ! -d mongo/db_mounted ]; then mkdir -p mongo/db_mounted; fi
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down

stop:
	$(COMPOSE) stop

restart:
	$(COMPOSE) restart

fclean:
	$(COMPOSE) down -v --remove-orphans || true
	docker system prune -a -f --volumes --filter "label=project=$(PROJECT)"
	@read -p "Remove mongo/db_mounted data directory? [y/N] " response; \
	case "$$response" in \
		y|Y|yes|YES) sudo rm -rf mongo/db_mounted && echo "Mongo data directory removed." ;; \
		*) echo "Mongo data directory preserved." ;; \
	esac

re: fclean up

prune:
	docker system prune -a -f --volumes --filter "label=project=$(PROJECT)"

logs:
	$(COMPOSE) logs -f

logs-backend:
	$(COMPOSE) logs -f backend

logs-frontend:
	$(COMPOSE) logs -f frontend

shell-backend:
	$(COMPOSE) exec backend sh

shell-frontend:
	$(COMPOSE) exec frontend sh

# --------------------------
# Default target: show usage
# --------------------------
help:
	@echo "Usage:"
	@echo "  make / make up           # Build images and start the stack in the background"
	@echo "  make detached            # Build images and start the stack in detached mode"
	@echo "  make down                # Stop and remove containers"
	@echo "  make stop                # Stop services without removing them"
	@echo "  make restart             # Restart all services"
	@echo "  make logs                # Follow logs for every service"
	@echo "  make logs-backend        # Follow backend logs only"
	@echo "  make logs-frontend       # Follow frontend logs only"
	@echo "  make shell-backend       # Open an interactive shell in the backend container"
	@echo "  make shell-frontend      # Open an interactive shell in the frontend container"
	@echo "  make prune               # Prune Docker resources tagged project=$(PROJECT)"
	@echo "  make fclean              # Tear down stack, prune labeled resources, optionally clear mongo/db_mounted"
	@echo "  make re                  # Equivalent to make fclean && make up"
	@echo "  make help                # Show this help message"

# Catch-all for unknown targets
%:
	@echo "Unknown command: $@"
	@$(MAKE) help
