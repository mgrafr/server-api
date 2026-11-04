#!/bin/bash
BACKUP_DIR="/opt/server-api/backups"
# test -w $BACKUP_DIR && echo "Writable" || echo "Not writable" 
BACKUP_DATAS_GLADYS="/var/lib/gladysassistant"
BACKUP_DB="gladys-production.db"
BACKUP_DIRDB="$BACKUP_DATAS_GLADYS/$BACKUP_DB"
BACKUP_DUCKDB="$BACKUP_DATAS_GLADYS/gladys-production.duckdb"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$BACKUP_DIR/backup.log"

echo "[$(date)] Starting Docker backup" >> "$LOG_FILE"
# Backup container persistent datas gladys
# Lorsque DuckDB ouvre la sauvegarde, il rejoue automatiquement le WAL. Cela vous donne l’état le plus récent.
# Note : Cela ne fonctionne de manière fiable que si aucune écriture n’a lieu entre les deux opérations de copiage
    echo "[$(date)] Exporting datas: ${BACKUP_DATAS_GLADYS}" >> $LOG_FILE
# Cette transaction verrouille automatiquement la base de données pour l’écriture, mais permet des lectures simultanées    
    sqlite3 $BACKUP_DIRDB ".backup '$BACKUP_DIR/$BACKUP_DB'" 2>> "$LOG_FILE"
    cp $BACKUP_DUCKDB "${BACKUP_DIR}/gladys-production.duck" 2>/dev/null || true
    if [ -f "$BACKUP_DUCKDB.wal" ]; then
      cp "$BACKUP_DUCKDB.wal" "${BACKUP_DIR}/gladys-production.duck.wal" 2>/dev/null || true
    fi  
 cd $BACKUP_DIR   
    tar -cvzf datas.tar.gz gladys-production.db gladys-production.duck gladys-production.duck.wal  2>> "$LOG_FILE"
    cp  datas.tar.gz  "bd_$TIMESTAMP".tar.gz
    echo "bd_$TIMESTAMP.tar.gz" > sauvegarde.txt  
    rm  gladys-production.*

echo "[$(date)] Compressing backup completed" >> "$LOG_FILE"

# Calculate size
SIZE=$(du -sh "bd_${TIMESTAMP}.tar.gz" | cut -f1)
echo "[$(date)] Backup completed. Size: $SIZE" >> "$LOG_FILE"

# Keep only last 5 backups
find "$BACKUP_DIR"  -name "bd_*.tar.gz" -type f -mtime +5 -delete

# Verify backup
ls -lh /opt/server-api/backups/

