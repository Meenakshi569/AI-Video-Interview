import { useCallback, useRef, useState } from 'react';

export function useMediaRecorder(streamRef) {
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [blob, setBlob] = useState(null);
  const [error, setError] = useState(null);

  const clearPreview = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setBlob(null);
    chunksRef.current = [];
  }, [previewUrl]);

  const startRecording = useCallback(async () => {
    setError(null);
    clearPreview();

    try {
      let stream = streamRef?.current;
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : '';

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const recorded = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'video/webm',
        });
        setBlob(recorded);
        setPreviewUrl(URL.createObjectURL(recorded));
        setRecording(false);
      };

      recorderRef.current = recorder;
      recorder.start(1000);
      setRecording(true);
    } catch (err) {
      setError(err.message || 'Could not start recording');
    }
  }, [streamRef, clearPreview]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop();
    }
  }, []);

  return {
    recording,
    previewUrl,
    blob,
    error,
    startRecording,
    stopRecording,
    clearPreview,
  };
}
