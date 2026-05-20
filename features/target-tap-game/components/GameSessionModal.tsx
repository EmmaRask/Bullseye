'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { gameSession } from '../../../game/gameSession';
import styles from './GameSessionModal.module.css';

const PAGE_STATUS_MAP: Record<string, 'not_started' | 'playing' | 'finished'> = {
  '/': 'not_started',
  '/play': 'playing',
  '/result': 'finished',
};

export function GameSessionModal() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const currentStatus = gameSession.getStatus();
    const expectedStatus = PAGE_STATUS_MAP[pathname];

    // Show modal if current status doesn't match expected status for this page
    if (expectedStatus && currentStatus !== expectedStatus) {
      console.log(`Modal showing: current status "${currentStatus}" doesn't match expected "${expectedStatus}" for path "${pathname}"`);
      setIsOpen(true);
    } else {
      console.log(`Modal hidden: status "${currentStatus}" matches expected "${expectedStatus}" for path "${pathname}"`);
      setIsOpen(false);
    }
  }, [pathname, isMounted]);

  if (!isMounted) return null;

  const config = gameSession.getModalConfig();

  const handleNavigation = () => {
    router.push(config.buttonUrl);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p className={styles.message}>{config.message}</p>
        <button 
          className={styles.button}
          onClick={handleNavigation}
        >
          {config.buttonText}
        </button>
      </div>
    </div>
  );
}
