import { useEffect, useRef } from 'react';
import * as interviewApi from '../api/interview.api.js';

export function useProctoring(interviewId, enabled = true) {
  const lastSent = useRef({});

  useEffect(() => {
    if (!interviewId || !enabled) return;

    const send = async (type, metadata = {}) => {
      const key = `${type}-${metadata.reason || ''}`;
      const now = Date.now();
      if (lastSent.current[key] && now - lastSent.current[key] < 2000) return;
      lastSent.current[key] = now;

      try {
        await interviewApi.logProctoringEvent(interviewId, { type, metadata });
      } catch {
        /* non-blocking */
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        send('page_hidden', { reason: 'visibilitychange' });
        send('tab_switch', { reason: 'document.hidden' });
      } else {
        send('page_visible', { reason: 'visibilitychange' });
      }
    };

    const onBlur = () => send('window_blur', { reason: 'window.blur' });
    const onFocus = () => send('window_focus', { reason: 'window.focus' });

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, [interviewId, enabled]);
}
