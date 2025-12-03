// Queue Type Definitions
// Type definitions for queue-related data structures

// QueueEntry - Metadata stored in Redis hash
// @typedef {Object} QueueEntry
// @property {string} playerId - Player ID
// @property {string} heroId - Hero ID (default hero for MVP)
// @property {number} globalScore - Player's global score (used for queue ordering)
// @property {string} socketId - Socket.io socket ID
// @property {number} timestamp - Timestamp when player joined queue

// QueueStatus - Returned to client with queue information
// @typedef {Object} QueueStatus
// @property {number} position - Player's position in queue (0-based, -1 if not in queue)
// @property {number} estimatedWaitTime - Estimated wait time in seconds
// @property {number} queueSize - Total number of players in queue

module.exports = {
  // Types are defined via JSDoc above
  // No runtime exports needed for type definitions
};
