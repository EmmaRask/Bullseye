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
    const status = localStorage.getItem(GAME_STATUS_KEY);
    return (status as GameStatus) || 'not_started';
  },

  setStatus(status: GameStatus): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(GAME_STATUS_KEY, status);
  },

  hasTransaction(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(TRANSACTION_KEY);
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
    localStorage.removeItem(GAME_STATUS_KEY);
    localStorage.removeItem(TRANSACTION_KEY);
  },

  setTransaction(transactionId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TRANSACTION_KEY, transactionId);
    // When transaction is set, update status to 'playing'
    this.setStatus('playing');
  },
};
