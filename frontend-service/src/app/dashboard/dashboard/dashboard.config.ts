export interface StatCardConfig {
  label: string;
  key: string;
  icon?: string;
}

export interface DashboardButtonConfig {
  label: string;
  icon: string;
  action?: string; // route or function name
}

export interface TableColumnConfig {
  label: string;
  key: string;
}

export const STAT_CARDS: StatCardConfig[] = [
  { label: 'WINS', key: 'wins' },
  { label: 'PRACTICE', key: 'practice' },
  { label: 'RATCHET', key: 'ratchet' },
];

export const DASHBOARD_BUTTONS: DashboardButtonConfig[] = [
  { label: 'PLAY', icon: '▶', action: 'play' },
  { label: 'LEADERBOARD', icon: '🏆', action: 'leaderboard' },
  { label: 'PREV MATCHES', icon: '📜', action: 'matches' },
  { label: 'PROFILE', icon: '👤', action: 'profile' },
  { label: 'SETTINGS', icon: '⚙️', action: 'settings' },
  { label: 'LOGIN/REGISTER', icon: '🔑', action: 'login' }
];

export const TABLE_COLUMNS: TableColumnConfig[] = [
  { label: 'MATCH', key: 'match' },
  { label: 'OPPONENT', key: 'opponent' },
  { label: 'RESULT', key: 'result' },
  { label: 'XP+GAINED', key: 'xp' },
  { label: 'NEW', key: 'new' },
]; 