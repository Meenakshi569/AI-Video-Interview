# AI Video Interview System

## Overview

The AI Video Interview System is an automated candidate screening platform designed to streamline the first round of recruitment interviews. The platform enables recruiters to conduct asynchronous interviews where candidates answer questions through webcam and microphone while the system records responses, generates transcripts, and tracks suspicious activity for integrity monitoring.

This system aims to reduce recruiter workload, improve scalability, and provide a structured evaluation process while maintaining a high-fidelity record of candidate communication and technical responses.

---

# 1. Problem Understanding

## What Problem Are We Solving?

Traditional first-round recruitment interviews are time-consuming, repetitive, and difficult to scale when recruiters must evaluate hundreds or thousands of candidates.

Challenges in traditional hiring include:

* Manual screening consumes recruiter time
* Scheduling conflicts delay interviews
* Lack of standardized evaluation
* Difficulty reviewing candidate responses later
* Limited scalability during mass hiring

The AI Video Interview System automates the initial screening process by providing a structured interview workflow where candidates can complete interviews independently while recruiters review recorded responses later.

## Why Is This System Needed?

Recruiters need a scalable way to:

* Screen large candidate volumes asynchronously
* Maintain interview consistency
* Review responses multiple times
* Track candidate communication skills
* Monitor suspicious behaviors during interviews
* Reduce operational hiring costs

Candidates benefit from:

* Flexible interview timing
* Self-paced response process
* No scheduling dependency
* Improved accessibility

---

# 2. Architecture Overview

## High-Level System Architecture

The system follows a MERN stack architecture with modular service separation.

### Frontend

* React + Vite (JSX)
* Candidate interview workflow
* Recruiter dashboard
* Media recording interface
* Real-time suspicious activity tracking

### Backend

* Node.js + Express
* REST APIs
* Authentication and authorization
* Media handling
* Interview session management

### Database

* MongoDB
* Stores:

  * Candidate data
  * Interview sessions
  * Question metadata
  * Video response metadata
  * Suspicious activity logs
  * Transcripts

### Storage

* Local disk storage (development)
* Cloud-storage-ready architecture for future AWS S3 / Cloudflare R2 integration

### AI Processing

* Speech-to-text transcription pipeline
* Interview transcript generation

---

## High-Level Architecture Flow

```text
Candidate
   ↓
React Frontend
   ↓
Node.js/Express Backend
   ↓
MongoDB + File Storage
   ↓
Transcription Service
   ↓
Recruiter Dashboard
```

---

## Media Flow (Frontend → Backend → Storage → Transcription)

The platform records interview responses using the browser MediaRecorder API.

### Flow

```text
Candidate starts recording
        ↓
MediaRecorder captures video/audio chunks
        ↓
Frontend sends chunks to backend
        ↓
Backend stores chunks
        ↓
Chunks merged into final media file
        ↓
Transcription service processes media
        ↓
Transcript saved to MongoDB
        ↓
Recruiter dashboard displays transcript
```

### Why Chunk-Based Upload?

Instead of uploading one massive video file after recording completion, media is uploaded in chunks.

Benefits:

* Prevents complete data loss during disconnection
* Lower memory consumption
* Faster recovery during network issues
* Supports resumable uploads
* Better scalability

---

## WebSocket/Event Flow Explanation

WebSockets and browser event listeners are used to monitor candidate activity in real time.

Tracked activities include:

* Tab switching
* Window visibility changes
* Camera disconnects
* Microphone disconnects
* Session interruptions

Example flow:

```text
Candidate switches tab
       ↓
Browser event triggered
       ↓
Event sent to backend
       ↓
Suspicious activity stored
       ↓
Recruiter sees warning in dashboard
```

---

# 3. Technical Decisions & Tradeoffs

## Why This Architecture?

A MERN architecture was selected because:

* Fast full-stack development
* JavaScript consistency across frontend/backend
* MongoDB flexibility for interview metadata
* Scalable REST API architecture

Benefits:

* Modular codebase
* Easy deployment
* Easy maintenance
* Good ecosystem support

---

## Why Streaming Over Full Upload?

### Traditional Full Upload

```text
Record complete video
      ↓
Upload at end
```

Problems:

* Large upload failures
* High memory usage
* Data loss during disconnection

### Streaming / Chunk Upload

```text
Record chunk
      ↓
Upload chunk
      ↓
Repeat
```

Advantages:

* Partial progress preserved
* Better fault tolerance
* Lower upload risk
* Easier recovery logic

---

## Design Tradeoffs

### Local Disk Storage vs Cloud Storage

Chosen:

* Local disk during development

Reason:

* Faster implementation
* Easier debugging

Future Improvement:

* AWS S3 / Cloudflare R2 integration

---

### Real-Time Monitoring vs Batch Monitoring

Chosen:

* Real-time tracking

Reason:

* Immediate suspicious activity detection
* Better recruiter trust

Tradeoff:

* Slightly higher system complexity

---

# 4. Failure Scenarios & Edge Cases

The system accounts for multiple real-world failures.

| Scenario                | Risk                        |
| ----------------------- | --------------------------- |
| Network interruptions   | Upload failures             |
| Duplicate chunks        | Duplicate media writes      |
| Camera disconnect       | Missing candidate recording |
| Microphone disconnect   | Audio loss                  |
| Partial upload failures | Incomplete recordings       |
| Empty media chunks      | Storage waste               |
| Corrupted chunks        | Media reconstruction issues |
| WebSocket disconnects   | Missing activity tracking   |

---

## Edge Cases Considered

### Network Interruptions

Candidate internet may disconnect mid-interview.

Handling:

* Uploaded chunks remain saved
* Interview state persists

---

### Duplicate Chunks

Chunks may accidentally upload twice.

Handling:

* Deterministic naming and validation logic

---

### Camera/Microphone Disconnect

Candidate hardware may stop unexpectedly.

Handling:

* Warning shown to candidate
* Event logged

---

### Partial Upload Failure

Only part of recording uploads successfully.

Handling:

* Retry logic
* Session persistence

---

### Empty or Corrupted Chunks

Invalid chunks can occur due to browser interruptions.

Handling:

* Validation before merge
* Corrupted chunks skipped

---

### WebSocket Reconnects

Temporary connection loss may occur.

Handling:

* Automatic reconnect attempts
* Resume event streaming

---

# 5. Recovery Mechanisms

## Reconnect Handling

Interview sessions persist in the database.

Stored state includes:

* Current question index
* Session progress
* Uploaded chunks
* Candidate metadata

Candidates can resume without restarting.

---

## Retry & Recovery Logic

When upload failures occur:

```text
Chunk upload fails
       ↓
Retry mechanism triggered
       ↓
Re-upload attempted
       ↓
Continue interview
```

---

## Chunk Recovery Strategy

Chunks are saved using deterministic ordering.

Example:

```text
chunk_001.webm
chunk_002.webm
chunk_003.webm
```

Benefits:

* Correct ordering
* Reliable media reconstruction
* Out-of-order upload recovery

---

## Failure Handling Strategy

The system follows graceful degradation:

* Recover when possible
* Retry failed operations
* Log failures for debugging
* Preserve candidate progress

---

# 6. Product Thinking

## Recruiter Experience Considerations

The recruiter dashboard is designed for efficient review.

Features:

* Candidate list view
* Interview playback
* Transcript visibility
* Suspicious activity monitoring
* Centralized evaluation workflow

Benefits:

* Faster screening
* Better hiring consistency
* Replayable interviews

---

## Candidate Experience Considerations

Candidate experience was prioritized through:

### Hardware Check Page

Before interview start:

* Camera validation
* Microphone validation

Purpose:

* Reduce failed interviews
* Reduce support requests

### Smooth Interview Flow

Design decisions:

* Clear question display
* Simple recording controls
* Minimal distractions
* Auto progression

---

## Suspicious Activity Tracking

Activities monitored:

* Tab switching
* Browser visibility changes
* Camera disconnect
* Microphone disconnect

These activities are logged and visible to recruiters.

---

## UX Decisions Made

Key UX decisions:

* Minimal UI clutter
* Clear recording state
* Responsive design
* Resume-friendly session flow
* Real-time warnings

---

# 7. Scalability Considerations

## What May Break at Scale?

Potential bottlenecks:

### Large Concurrent Uploads

Many simultaneous interviews may overload storage throughput.

### Transcription Delays

Speech-to-text pipelines may slow under heavy load.

### Database Write Volume

Large candidate numbers increase metadata writes.

---

## Performance Bottlenecks

Possible bottlenecks include:

* Video upload throughput
* Media processing latency
* Database query load
* Concurrent WebSocket connections

---

## Future Improvements for High Concurrency

Potential upgrades:

* AWS S3 / Cloudflare R2 storage
* Queue-based processing
* Background worker services
* Horizontal backend scaling
* CDN-based media delivery
* Distributed logging

---

# 8. Observability & Debugging

## Logging Strategy

Application events are logged for debugging.

Examples:

```text
Interview started
Chunk uploaded
Recording stopped
Transcription completed
Socket disconnected
Upload failed
```

---

## Error Tracking

System errors tracked include:

* Upload failures
* Transcription failures
* Media corruption
* Authentication failures

Errors are logged for review.

---

## Production Failure Debugging

Production debugging approach:

* Request logging
* Error logs
* Session state inspection
* Media validation logs
* Retry failure tracking

This enables faster issue diagnosis.

---

# 9. AI Usage Documentation

## How AI Tools Were Used

AI tools were used as development accelerators for:

* System architecture brainstorming
* Backend structure planning
* FFmpeg/media-processing understanding
* Prompt-based debugging
* UI refinement ideas
* Technical tradeoff evaluation

---

## Prompt / Thought Process Used

Development followed an iterative process:

### Understand

Understanding the interview workflow and system requirements.

### Explore

Exploring multiple approaches:

* Streaming vs full upload
* Storage strategies
* Transcription methods
* Proctoring mechanisms

### Decide

Selecting approaches based on scalability, reliability, and implementation simplicity.

---

## Human Decisions vs AI Assistance

### AI-Assisted

* Architecture ideas
* Code generation support
* Debugging assistance
* API implementation suggestions

### Human Decisions

* Final architecture selection
* Folder structure decisions
* Feature prioritization
* UI/UX decisions
* Logic validation
* Testing and debugging

All generated code was reviewed, modified, and validated manually.

---

# 10. Demo & Walkthrough

## Setup Instructions

### Clone Repository

```bash
git clone <repository-url>
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## Demo Video

Demo Video Link:

```text
Add your video link here
```

---

## Live Demo Link

Live Application:

```text
Add deployment link here
```

---

## System Walkthrough

1. Candidate signs in
2. Hardware check validates camera/mic
3. Interview begins
4. Candidate answers questions
5. Responses recorded and uploaded
6. Suspicious activities tracked
7. Transcript generated
8. Recruiter reviews responses, transcript, and activity logs

---

# Conclusion

The AI Video Interview System provides an automated, scalable, and recruiter-friendly approach to first-round hiring by combining video interviews, transcription, suspicious activity monitoring, and structured candidate evaluation in a unified platform.
