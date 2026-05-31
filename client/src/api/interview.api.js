import { apiClient } from './client.js';

export async function startInterview() {
  const { data } = await apiClient.post('/api/interviews/start');
  return data.data;
}

export async function getMyInterviews() {
  const { data } = await apiClient.get('/api/interviews/mine');
  return data.data;
}

export async function getInterview(id) {
  const { data } = await apiClient.get(`/api/interviews/${id}`);
  return data.data;
}

export async function getNextQuestion(id) {
  const { data } = await apiClient.get(`/api/interviews/${id}/next-question`);
  return data.data;
}

export async function updateSession(id, sessionData) {
  const { data } = await apiClient.patch(`/api/interviews/${id}/session`, sessionData);
  return data.data;
}

export async function saveResponseMetadata(id, payload) {
  const { data } = await apiClient.patch(`/api/interviews/${id}/responses`, payload);
  return data.data;
}

export async function uploadRecording(id, questionIndex, blob) {
  const form = new FormData();
  form.append('recording', blob, `question-${questionIndex}.webm`);
  form.append('questionIndex', String(questionIndex));
  const { data } = await apiClient.post(`/api/interviews/${id}/recordings`, form);
  return data.data;
}

export async function finishInterview(id) {
  const { data } = await apiClient.post(`/api/interviews/${id}/finish`);
  return data.data;
}

export async function logProctoringEvent(id, payload) {
  const { data } = await apiClient.post(`/api/interviews/${id}/proctoring`, payload);
  return data.data;
}

export async function requestTranscription(id) {
  const { data } = await apiClient.post(`/api/interviews/${id}/transcribe`);
  return data.data;
}
