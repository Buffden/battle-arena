// QueueEntry Model
// Represents a player's entry in the matchmaking queue

// QueueEntry class
class QueueEntry {
  // Create a QueueEntry
  constructor(playerId, heroId, globalScore, socketId, timestamp) {
    this.playerId = playerId;
    this.heroId = heroId;
    this.globalScore = globalScore;
    this.socketId = socketId;
    this.timestamp = timestamp || Date.now();
  }

  // Convert QueueEntry to JSON object
  toJSON() {
    return {
      playerId: this.playerId,
      heroId: this.heroId,
      globalScore: this.globalScore,
      socketId: this.socketId,
      timestamp: this.timestamp
    };
  }

  // Create QueueEntry from JSON object
  static fromJSON(data) {
    return new QueueEntry(
      data.playerId,
      data.heroId,
      data.globalScore,
      data.socketId,
      data.timestamp
    );
  }

  // Validate QueueEntry data
  validate() {
    return (
      this.playerId &&
      typeof this.playerId === 'string' &&
      this.heroId &&
      typeof this.heroId === 'string' &&
      typeof this.globalScore === 'number' &&
      this.socketId &&
      typeof this.socketId === 'string' &&
      typeof this.timestamp === 'number'
    );
  }
}

module.exports = QueueEntry;
