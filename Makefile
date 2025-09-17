SHELL := /bin/bash
PROJECT ?= cafeboardgame
COMPOSE := docker compose -p $(PROJECT)

.PHONY: default up down stop restart fclean re prune logs logs-backend logs-frontend shell-backend shell-frontend

default: up

up:
	if [ ! -d db_mounted ]; then mkdir -p db_mounted; fi
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down

stop:
	$(COMPOSE) stop

restart: stop up

fclean:
	$(COMPOSE) down -v --remove-orphans || true
	docker system prune -a -f --volumes --filter "label=project=$(PROJECT)"
	sudo rm -rf db_mounted

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
