BACKEND_CONTAINER=padini-hr-chatbot-backend-1
# RASA_CONTAINER=padini-hr-chatbot-rasa-1

.PHONY: migrate-up migrate-down migrate-down-all migrate-history migrate-current migrate-new \
		up down nuke status restart-backend \
		logs logs-backend logs-db \
		rasa-train rasa-shell \
		shell

#Database Migration via Alembic
migrate-up:
	docker exec -it $(BACKEND_CONTAINER) bash -c "alembic upgrade head"

migrate-down:
	docker exec -it $(BACKEND_CONTAINER) bash -c "alembic downgrade -1"

migrate-down-all:
	docker exec -it $(BACKEND_CONTAINER) bash -c "alembic downgrade base"

migrate-history:
	docker exec -it $(BACKEND_CONTAINER) bash -c "alembic history"

migrate-current:
	docker exec -it $(BACKEND_CONTAINER) bash -c "alembic current"

migrate-new:
	docker exec -it $(BACKEND_CONTAINER) bash -c "alembic revision --autogenerate -m '$(MSG)'"
	docker cp $(BACKEND_CONTAINER):/app/src/alembic/versions/. ./backend/alembic/versions/

seed-up:
	docker exec -it $(BACKEND_CONTAINER) bash -c "python seed.py"
# Docker shortcuts
up:
	docker compose up --build

down:
	docker compose down

nuke:
	docker compose down -v --remove-orphans

status:
	docker compose ps

restart-backend:
	docker compose restart backend

# Logs
logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-db:
	docker compose logs -f database

# Rasa
# rasa-train:
# 	docker exec -it $(RASA_CONTAINER) rasa train

# rasa-shell:
# 	docker exec -it $(RASA_CONTAINER) rasa shell

# Misc
shell:
	docker exec -it $(CONTAINER) bash