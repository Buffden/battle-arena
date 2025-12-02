/**
 * Logger Utility
 * Provides centralized logging functionality
 */
/* eslint-disable no-console */

const nodeEnv = process.env.NODE_ENV || 'development';

/**
 * Log levels
 */
const LogLevel = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

/**
 * Format log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {any} [data] - Additional data to log
 * @returns {string} Formatted log message
 */
function formatLog(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data })
  };

  if (nodeEnv === 'production') {
    return JSON.stringify(logEntry);
  }

  // Pretty print for development
  return `${timestamp} [${level}] ${message}${data ? ` ${JSON.stringify(data, null, 2)}` : ''}`;
}

/**
 * Log error message
 * @param {string} message - Error message
 * @param {Error|any} [error] - Error object or additional data
 */
function error(message, error = null) {
  console.error(formatLog(LogLevel.ERROR, message, error));
}

/**
 * Log warning message
 * @param {string} message - Warning message
 * @param {any} [data] - Additional data
 */
function warn(message, data = null) {
  console.warn(formatLog(LogLevel.WARN, message, data));
}

/**
 * Log info message
 * @param {string} message - Info message
 * @param {any} [data] - Additional data
 */
function info(message, data = null) {
  console.info(formatLog(LogLevel.INFO, message, data));
}

/**
 * Log debug message (only in development)
 * @param {string} message - Debug message
 * @param {any} [data] - Additional data
 */
function debug(message, data = null) {
  if (nodeEnv === 'development') {
    console.debug(formatLog(LogLevel.DEBUG, message, data));
  }
}

module.exports = {
  error,
  warn,
  info,
  debug,
  LogLevel
};
