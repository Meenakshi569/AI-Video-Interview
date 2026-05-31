import { apiClient } from './client.js';

export async function listInterviews() {
  const { data } = await apiClient.get('/api/recruiter/interviews');
  return data.data;
}

export async function getInterviewDetail(id) {
  const { data } = await apiClient.get(`/api/recruiter/interviews/${id}`);
  return data.data;
}

export async function getTranscript(id) {
  const { data } = await apiClient.get(`/api/recruiter/interviews/${id}/transcript`);
  return data.data;
}

export async function requestTranscription(id) {
  const { data } = await apiClient.post(`/api/recruiter/interviews/${id}/transcribe`);
  return data.data;
}
