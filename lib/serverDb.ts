import fs from 'fs';
import path from 'path';

export interface BotVideo {
  id: string;
  title: string;
  url: string;
  author: string;
  category: string;
  description: string;
  isCustom: boolean;
  addedAt: string;
  source: 'bot' | 'web';
}

export interface DbConnectionLog {
  id: string;
  timestamp: string;
  type: 'SYNC' | 'BOT_WRITE' | 'WEB_WRITE' | 'HEALTH_CHECK';
  status: 'SUCCESS' | 'ERROR';
  details: string;
  durationMs: number;
}

export interface DatabaseSchema {
  videos: BotVideo[];
  logs: DbConnectionLog[];
  serverRequests: number;
}

const DB_FILE_PATH = path.join('/tmp', 'nocturnal_db.json');

// Helper to initialize the DB file if it doesn't exist
function initDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      const initialData: DatabaseSchema = {
        videos: [],
        logs: [
          {
            id: 'init-' + Date.now(),
            timestamp: new Date().toISOString(),
            type: 'HEALTH_CHECK',
            status: 'SUCCESS',
            details: 'Base de datos Nocturna inicializada correctamente en /tmp/nocturnal_db.json',
            durationMs: 1
          }
        ],
        serverRequests: 1
      };
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(content) as DatabaseSchema;
  } catch (error) {
    console.error('Error initializing nocturnal DB, returning fallback data:', error);
    return { videos: [], logs: [], serverRequests: 0 };
  }
}

// Get entire database state
export function getDb(): DatabaseSchema {
  return initDb();
}

// Save database state
export function saveDb(data: DatabaseSchema): boolean {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Failed to write database file:', error);
    return false;
  }
}

// Add a connection log
export function addConnectionLog(
  type: DbConnectionLog['type'],
  status: DbConnectionLog['status'],
  details: string,
  durationMs: number
): DbConnectionLog {
  const db = initDb();
  const newLog: DbConnectionLog = {
    id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    type,
    status,
    details,
    durationMs
  };
  
  db.logs.unshift(newLog);
  // Keep last 100 logs
  if (db.logs.length > 100) {
    db.logs = db.logs.slice(0, 100);
  }
  
  saveDb(db);
  return newLog;
}

// Increment server request metric
export function incrementRequestCount(): number {
  const db = initDb();
  db.serverRequests = (db.serverRequests || 0) + 1;
  saveDb(db);
  return db.serverRequests;
}
