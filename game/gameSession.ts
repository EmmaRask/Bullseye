
export type GameStatus = 'not_started' | 'playing' | 'finished';

type ModalConfig = {
  message: string;
  buttonText: string;
  buttonUrl: string;
};

const GAME_STATUS_KEY = 'game_status';
const TRANSACTION_KEY = 'transaction';

export const modalConfig: Record<GameStatus, ModalConfig> = {
  not_started: {
    message: 'Game not started properly. Return to start.',
    buttonText: 'Go to Start',
    buttonUrl: '/',
  },
  playing: {
    message: 'Game still in progress. Return to game.',
    buttonText: 'Resume Game',
    buttonUrl: '/play',
  },
  finished: {
    message: 'Game not quit properly. Return to results.',
    buttonText: 'Go to Results',
    buttonUrl: '/result',
  },
};

export const gameSession = {
  getStatus(): GameStatus {
    if (typeof window === 'undefined') return 'not_started';

    const status = sessionStorage.getItem(GAME_STATUS_KEY);

    if (
      status === 'not_started' ||
      status === 'playing' ||
      status === 'finished'
    ) {
      return status;
    }

    return 'not_started';
  },

  setStatus(status: GameStatus): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(GAME_STATUS_KEY, status);
  },

  hasTransaction(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(sessionStorage.getItem(TRANSACTION_KEY));
  },

  getTransaction(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TRANSACTION_KEY);
},

  getModalConfig(): ModalConfig {
    return modalConfig[this.getStatus()];
  },

  startGame(): void {
    this.setStatus('playing');
  },

  finishGame(): void {
    this.setStatus('finished');
  },

  reset(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(GAME_STATUS_KEY);
    sessionStorage.removeItem(TRANSACTION_KEY);
  },

  setTransaction(transaction: unknown): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(TRANSACTION_KEY, JSON.stringify(transaction));
  this.setStatus('playing');
  },
};