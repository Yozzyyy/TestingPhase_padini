# param(
#     [Parameter(Position=0)]
#     [string]$Target,
    
#     [string]$MSG = ""
# )

# $BACKEND_CONTAINER = "padini-hr-chatbot-backend-1"


# function run($cmd) {
#     Invoke-Expression $cmd
#     if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
# }

# function exec($cmd) {
#     run "docker exec -it $BACKEND_CONTAINER bash -c `"$cmd`""
# }

# function migrate-up       { exec "cd src && alembic upgrade head" }
# function migrate-down     { exec "cd src && alembic downgrade -1" }
# function migrate-down-all { exec "cd src && alembic downgrade base" }

# function migrate-history  { run "cd backend; .\.virtualENV\Scripts\Activate.ps1 ;alembic history; deactivate; cd .." }
# function migrate-current  { run "cd backend;  .\.virtualENV\Scripts\Activate.ps1 ;alembic current; deactivate; cd .." }

# function migrate-new {
#     if (-not $MSG) {
#         Write-Host "Error: Provide a message. Example: .\make.ps1 migrate-new -MSG 'add users table'" -ForegroundColor Red
#         return
#     }
#     run "cd backend; .\.virtualENV\Scripts\Activate.ps1 ;alembic revision --autogenerate -m '$MSG'; deactivate; cd .."
# }

# function up               { run "docker compose up --build" }
# function down             { run "docker compose down" }
# function nuke             { run "docker compose down -v --remove-orphans" }
# function status           { run "docker compose ps" }
# function restart-backend  { run "docker compose restart backend" }

# function logs             { run "docker compose logs -f" }
# function logs-backend     { run "docker compose logs -f backend" }
# function logs-db          { run "docker compose logs -f database" }

# function rasa-train       { run "docker exec -it $RASA_CONTAINER rasa train" }
# function rasa-shell       { run "docker exec -it $RASA_CONTAINER rasa shell" }

# function shell            { run "docker exec -it $CONTAINER bash" }

# function help {
#     Write-Host ""
#     Write-Host "Available commands:" -ForegroundColor Cyan
#     Write-Host ""
#     Write-Host "  Migrations" -ForegroundColor Yellow
#     Write-Host "    .\make.ps1 migrate-new -MSG 'add users table'  Generate migration on host"
#     Write-Host "    .\make.ps1 migrate-up                          Apply all pending migrations"
#     Write-Host "    .\make.ps1 migrate-down                        Roll back one migration"
#     Write-Host "    .\make.ps1 migrate-down-all                    Roll back all migrations"
#     Write-Host "    .\make.ps1 migrate-history                     View migration history"
#     Write-Host "    .\make.ps1 migrate-current                     View current migration"
#     Write-Host ""
#     Write-Host "  Docker" -ForegroundColor Blue
#     Write-Host "    .\make.ps1 up                                  Build and start all containers"
#     Write-Host "    .\make.ps1 down                                Stop all containers"
#     Write-Host "    .\make.ps1 nuke                                Stop and wipe all volumes"
#     Write-Host "    .\make.ps1 status                              Show container statuses"
#     Write-Host "    .\make.ps1 restart-backend                     Restart backend only"
#     Write-Host ""
#     Write-Host "  Logs" -ForegroundColor DarkGray
#     Write-Host "    .\make.ps1 logs                                Stream all logs"
#     Write-Host "    .\make.ps1 logs-backend                        Stream backend logs"
#     Write-Host "    .\make.ps1 logs-db                             Stream database logs"
#     Write-Host ""
#     Write-Host "  Rasa" -ForegroundColor Green
#     Write-Host "    .\make.ps1 rasa-train                          Train Rasa model"
#     Write-Host "    .\make.ps1 rasa-shell                          Open Rasa shell"
#     Write-Host ""
#     Write-Host "  Misc" -ForegroundColor Cyan
#     Write-Host "    .\make.ps1 shell                               Open backend bash terminal"
#     Write-Host "    .\make.ps1 help                                Show this help message"
#     Write-Host ""
# }

# switch ($Target) {
#     "migrate-up"       { migrate-up }
#     "migrate-down"     { migrate-down }
#     "migrate-down-all" { migrate-down-all }
#     "migrate-history"  { migrate-history }
#     "migrate-current"  { migrate-current }
#     "migrate-new"      { migrate-new }
#     "up"               { up }
#     "down"             { down }
#     "nuke"             { nuke }
#     "status"           { status }
#     "restart-backend"  { restart-backend }
#     "logs"             { logs }
#     "logs-backend"     { logs-backend }
#     "logs-db"          { logs-db }
#     "rasa-train"       { rasa-train }
#     "rasa-shell"       { rasa-shell }
#     "shell"            { shell }
#     "help"             { help }
#     default {
#         Write-Host "Unknown command: '$Target'" -ForegroundColor Red
#         help
#     }
# }