SHELL := /bin/bash
COMPOSE := docker compose

.PHONY: default up down stop restart fclean re logs logs-backend logs-frontend shell-backend shell-frontend

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
	rm -rf db_mounted

re: fclean up

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
