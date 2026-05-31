import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.jsx';
import HardwareCheck from '../../components/candidate/HardwareCheck.jsx';
import { useHardwareCheck } from '../../hooks/useHardwareCheck.js';
import * as interviewApi from '../../api/interview.api.js';
import Spinner from '../../components/common/Spinner.jsx';

export default function HardwareCheckPage() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { videoRef, status, runCheck, stopStream } = useHardwareCheck();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const canContinue = status.camera === 'ok' && status.microphone === 'ok';

  const handleContinue = async () => {
    setSaving(true);
    setError('');
    try {
      await interviewApi.updateSession(interviewId, {
        hardwareCheckPassed: true,
        cameraGranted: true,
        microphoneGranted: true,
      });
      stopStream();
      navigate(`/candidate/interview/${interviewId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout centered>
      {saving ? (
        <Spinner label="Saving..." />
      ) : (
        <>
          <HardwareCheck
            videoRef={videoRef}
            status={status}
            onRunCheck={runCheck}
            onContinue={handleContinue}
            canContinue={canContinue}
          />
          {error && <div className="alert alert--error">{error}</div>}
        </>
      )}
    </PageLayout>
  );
}
