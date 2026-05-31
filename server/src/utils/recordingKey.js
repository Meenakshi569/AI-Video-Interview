export function buildRecordingKey(interviewId, questionIndex, ext = 'webm') {
  return `interviews/${interviewId}/q${questionIndex}.${ext}`;
}
