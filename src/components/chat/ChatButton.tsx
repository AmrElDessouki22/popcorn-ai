'use client';

import { useState } from 'react';
import { ChatWidget } from './ChatWidget';
import styles from './ChatButton.module.css';

export function ChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <button
        className={styles.chatButton}
        onClick={() => setIsChatOpen(true)}
        title="Open AI Assistant"
      >
        <svg className={styles.chatIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className={styles.chatButtonText}>AI Assistant</span>
        <div className={styles.chatPulse}></div>
      </button>
      
      <ChatWidget 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
}