# Queue Removal Scenarios Analysis

## Overview

This document outlines all scenarios where users should be removed from the matchmaking queue and tracks implementation status.

---

## ✅ IMPLEMENTED Scenarios

### 1. **Manual Leave Queue** ✅

- **Trigger**: User clicks "Leave Queue" button
- **Implementation**:
  - Frontend: `matchmaking.component.ts` → `leaveQueue()` method
  - Backend: `server.js` → `leave-queue` event handler
  - QueueManager: `removeFromQueue()` method
- **Status**: ✅ Fully implemented
- **Location**:
  - Frontend: `frontend-service/src/app/components/matchmaking/matchmaking.component.ts:121`
  - Backend: `backend-services/matchmaking-service/server.js:69`

### 2. **WebSocket Disconnect** ✅

- **Trigger**: User closes browser/tab, network disconnection, browser crash
- **Implementation**:
  - Backend: `server.js` → `disconnect` event handler
  - Removes from queue unless it's a server-initiated disconnect
- **Status**: ✅ Implemented (with exception for server-initiated disconnect)
- **Location**: `backend-services/matchmaking-service/server.js:117`
- **Note**: Currently removes on ALL disconnects except `'io server disconnect'`

### 3. **Navigation Away (Back Button)** ✅

- **Trigger**: User clicks browser back button or navigates away
- **Implementation**:
  - Frontend: `matchmaking.component.ts` → `goBack()` method calls `leaveQueue()`
  - Also handles router navigation events
- **Status**: ✅ Implemented
- **Location**: `frontend-service/src/app/components/matchmaking/matchmaking.component.ts:144`

### 4. **Route Navigation Away** ✅

- **Trigger**: User navigates to a different route (e.g., dashboard, profile)
- **Implementation**:
  - Frontend: `matchmaking.component.ts` → Router events subscription
  - Calls `leaveQueue()` when navigating away
- **Status**: ✅ Implemented
- **Location**: `frontend-service/src/app/components/matchmaking/matchmaking.component.ts:47`

---

## ❌ NOT IMPLEMENTED Scenarios

### 5. **Match Found - Remove from Queue** ❌

- **Trigger**: Matchmaking algorithm finds a match for the player
- **Expected Behavior**:
  - Remove player from queue
  - Create match/lobby
  - Notify player of match found
- **Status**: ❌ Not implemented (matchmaking algorithm not implemented)
- **Priority**: 🔴 HIGH (Core functionality)
- **Related**: Matchmaking algorithm, match creation

### 6. **Queue Timeout (Extended Wait)** ✅

- **Trigger**: Player waits in queue for extended period (1 minute)
- **Expected Behavior**:
  - Remove player from queue after timeout
  - Notify player: "Queue session timed out after 1 minute. Please try again."
- **Status**: ✅ Implemented
- **Priority**: 🟡 MEDIUM
- **Location**:
  - Backend: `backend-services/matchmaking-service/server.js:138` (timeout checker)
  - Backend: `backend-services/matchmaking-service/src/services/QueueManager.js:188` (removeTimedOutPlayers method)
  - Frontend: `frontend-service/src/app/services/matchmaking.service.ts` (queue-timeout event handler)
- **Implementation Details**:
  - Timeout: 1 minute (60000ms)
  - Check interval: Every 10 seconds
  - Automatically removes players who have been waiting > 1 minute
  - Emits `queue-timeout` event to notify players

### 7. **Match Acceptance Timeout** ❌

- **Trigger**: Player doesn't accept match within time limit (e.g., 30 seconds)
- **Expected Behavior**:
  - Remove player from queue
  - Return other player to queue or find new match
  - Notify both players
- **Status**: ❌ Not implemented (match acceptance flow not implemented)
- **Priority**: 🔴 HIGH (Core functionality)

### 8. **Match Rejection** ❌

- **Trigger**: Player explicitly rejects a found match
- **Expected Behavior**:
  - Remove player from queue (or return to queue after cooldown)
  - Return other player to queue
  - Apply rejection cooldown (prevent abuse)
- **Status**: ❌ Not implemented (match acceptance flow not implemented)
- **Priority**: 🔴 HIGH (Core functionality)

### 9. **Arena Selection Timeout** ❌

- **Trigger**: Player doesn't complete arena selection within time limit (e.g., 5 minutes)
- **Expected Behavior**:
  - Cancel match
  - Return both players to queue
  - Notify players of timeout
- **Status**: ❌ Not implemented (arena selection flow not implemented)
- **Priority**: 🟡 MEDIUM

### 10. **Arena Selection Disconnect** ❌

- **Trigger**: Player disconnects during arena selection phase
- **Expected Behavior**:
  - Cancel match
  - Return other player to queue
  - Notify players
- **Status**: ❌ Not implemented (arena selection flow not implemented)
- **Priority**: 🟡 MEDIUM

### 11. **Weapon Selection Timeout** ❌

- **Trigger**: Player doesn't complete weapon selection within time limit (e.g., 2 minutes)
- **Expected Behavior**:
  - Cancel match
  - Return both players to queue
  - Notify players of timeout
- **Status**: ❌ Not implemented (weapon selection flow not implemented)
- **Priority**: 🟡 MEDIUM

### 12. **Weapon Selection Disconnect** ❌

- **Trigger**: Player disconnects during weapon selection phase
- **Expected Behavior**:
  - Cancel match
  - Return other player to queue
  - Notify players
- **Status**: ❌ Not implemented (weapon selection flow not implemented)
- **Priority**: 🟡 MEDIUM

### 13. **JWT Token Expiration** ❌

- **Trigger**: JWT token expires while player is in queue
- **Expected Behavior**:
  - Validate token on queue operations
  - Remove player from queue if token expired
  - Notify player to re-authenticate
- **Status**: ❌ Not implemented (JWT validation not implemented)
- **Priority**: 🟡 MEDIUM (Security concern)
- **Note**: Currently token is sent but not validated

### 14. **Duplicate Queue Entry Prevention** ❌

- **Trigger**: Player tries to join queue when already in queue
- **Expected Behavior**:
  - Check if player already in queue
  - Either prevent duplicate join OR remove old entry and add new one
  - Handle multiple socket connections from same user
- **Status**: ❌ Not implemented
- **Priority**: 🟡 MEDIUM (Edge case handling)

### 15. **Server Shutdown/Maintenance** ❌

- **Trigger**: Server needs to shutdown for maintenance
- **Expected Behavior**:
  - Gracefully notify all players in queue
  - Clear queue state
  - Save queue state for recovery (optional)
- **Status**: ❌ Not implemented
- **Priority**: 🟢 LOW (Operational concern)

### 16. **Inactive Connection Detection** ❌

- **Trigger**: Player's connection is inactive for extended period (e.g., 5+ minutes)
- **Expected Behavior**:
  - Detect inactive connections (no ping/pong)
  - Remove from queue
  - Notify player
- **Status**: ❌ Not implemented
- **Priority**: 🟡 MEDIUM (Prevent stale queue entries)

---

## 📊 Summary

| Category                | Implemented | Not Implemented | Total  |
| ----------------------- | ----------- | --------------- | ------ |
| **User-Initiated**      | 3           | 1               | 4      |
| **Connection Issues**   | 1           | 2               | 3      |
| **Match Flow**          | 0           | 4               | 4      |
| **Selection Flows**     | 0           | 4               | 4      |
| **Security/Validation** | 0           | 2               | 2      |
| **Operational**         | 0           | 1               | 1      |
| **TOTAL**               | **5**       | **13**          | **18** |

---

## 🎯 Implementation Priority

### 🔴 HIGH Priority (Core Functionality)

1. Match Found - Remove from Queue
2. Match Acceptance Timeout
3. Match Rejection

### 🟡 MEDIUM Priority (Important Features)

4. ~~Queue Timeout (Extended Wait)~~ ✅ **IMPLEMENTED**
5. JWT Token Expiration
6. Duplicate Queue Entry Prevention
7. Inactive Connection Detection
8. Arena/Weapon Selection Timeouts & Disconnects

### 🟢 LOW Priority (Operational)

9. Server Shutdown/Maintenance

---

## 🔍 Current Implementation Details

### Implemented Removal Logic

```javascript
// Backend: server.js
socket.on('leave-queue', async () => {
  await queueManager.removeFromQueue(socket.id);
});

socket.on('disconnect', async reason => {
  if (reason !== 'io server disconnect') {
    await queueManager.removeFromQueue(socket.id);
  }
});
```

### QueueManager.removeFromQueue()

- Removes from Redis sorted set
- Removes socket ID mapping
- Removes user ID mapping
- Removes player metadata
- Handles missing entries gracefully

---

## 📝 Notes

1. **TTL on Redis Keys**: Currently set to 1 hour (3600 seconds) - this provides passive cleanup but doesn't actively remove players from queue
2. **Reconnection Handling**: Players can reconnect to queue if they refresh page (implemented)
3. **No Active Timeout Checking**: No background job/cron to check for timeouts
4. **JWT Validation Missing**: Token is sent but not validated or used to extract userId

---

## 🚀 Next Steps

1. Implement matchmaking algorithm (removes players when match found)
2. Add JWT token validation and userId extraction
3. Implement match acceptance/rejection flow
4. Add queue timeout checking (background job)
5. Add duplicate entry prevention
6. Implement selection phase timeouts
