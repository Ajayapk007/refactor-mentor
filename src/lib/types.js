/**
 * @typedef {'critical' | 'warning' | 'suggestion'} Severity
 */

/**
 * @typedef {Object} Issue
 * @property {Severity} severity
 * @property {string} title
 * @property {string} explanation
 */

/**
 * @typedef {Object} ReviewData
 * @property {string} time_complexity      - e.g. 'O(n²)'
 * @property {string} space_complexity     - e.g. 'O(1)'
 * @property {string} improved_tc          - e.g. 'O(n log n)'
 * @property {string} improved_sc          - e.g. 'O(n)'
 * @property {Issue[]} issues
 * @property {string} refactored_code
 * @property {string} verdict              - one brutal sentence
 */

/**
 * @typedef {Object} Message
 * @property {'user' | 'assistant'} role
 * @property {string} content              - raw text for history
 * @property {ReviewData} [reviewData]     - parsed, for UI rendering
 * @property {boolean} [isFollowUp]        - plain text, no structured view
 */

export {};