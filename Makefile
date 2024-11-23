init-db:
   docker-compose up

stop-db:
   docker-compose down

rebuild-db:
   docker-compose down --volumes --remove-orphans
   docker-compose up --build
