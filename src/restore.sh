#!/usr/bin/env bash
## pour ssai
cp /opt/server-api/backups/bd_*.tar.gz  /opt/server-api/uploads/bd_*.tar.gz 
# --------------------------------------------------------------------------
RESTORE_DIR="/opt/server-api/uploads"
RESTORE_DATAS_GLADYS="/var/lib/gladysassistant"
RESTORE_DB="gladys-production.db"
RESTORE_DIRDB="$RESTORE_DATAS_GLADYS/$RESTORE_DB"
RESTORE_DUCKDB="$RESTORE_DATAS_GLADYS/gladys-production.duckdb"
## TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$RESTORE_DIR/restore.log"
#
cd $RESTORE_DIR
echo "[$(date)] Starting Docker restore" >> "$LOG_FILE"
# RESTAURATION
echo "[$(date)] Inporting datas:"$RESTORE_DATAS_GLADYS >> "$LOG_FILE"
tar -xzf bd_*.tar.gz
rm -R bd_*.tar.gz
sqlite3 $RESTORE_DIRDB ".restore '/var/uploads/$RESTORE_DB'" 2>> "$LOG_FILE"
cp "${RESTORE_DIR}/bdd-${TIMESTAMP}.duck" $RESTORE_DUCKDB  2>/dev/null || true
ls -ln
cp "${RESTORE_DIR}/bdd-${TIMESTAMP}.duck.wal" "$RESTORE_DUCKDB.wal"  2>/dev/null || true

ls -ln $RESTORE_DATAS_GLADYS


