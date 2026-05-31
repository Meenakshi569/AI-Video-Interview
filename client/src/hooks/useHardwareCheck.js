import { useCallback, useEffect, useRef, useState } from 'react';

export function useHardwareCheck() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState({
    camera: 'idle',
    microphone: 'idle',
    error: null,
  });

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const runCheck = useCallback(async () => {
    setStatus({ camera: 'checking', microphone: 'checking', error: null });
    stopStream();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      setStatus({
        camera: videoTrack ? 'ok' : 'fail',
        microphone: audioTrack ? 'ok' : 'fail',
        error: null,
      });

      return {
        cameraGranted: Boolean(videoTrack),
        microphoneGranted: Boolean(audioTrack),
      };
    } catch (err) {
      setStatus({
        camera: 'fail',
        microphone: 'fail',
        error: err.message || 'Permission denied',
      });
      return { cameraGranted: false, microphoneGranted: false };
    }
  }, [stopStream]);

  useEffect(() => () => stopStream(), [stopStream]);

  return { videoRef, status, runCheck, stopStream };
}
