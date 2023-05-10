#!/bin/sh

#!/bin/sh

CONNECTION_STRING="$PROD_DB_URL"
BACKUP_DIR="src/db/backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql.gz"

pg_dump -Z 9 --file="$BACKUP_FILE" "$CONNECTION_STRING"
