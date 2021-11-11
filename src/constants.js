export const MILLISECONDS = 1
export const SECONDS = 1000 * MILLISECONDS
export const MINUTES = 60 * SECONDS
export const HOURS = 60 * MINUTES
export const DAYS = 24 * HOURS
export const POLLING_INTERVAL = 0.25 * SECONDS
export const TIMEOUT = 30 * SECONDS

export const BUTTON_TEXT = chrome.i18n.getMessage("buttonText")

export const constants = {
  MILLISECONDS,
  SECONDS,
  MINUTES,
  HOURS,
  DAYS,
  POLLING_INTERVAL,
  TIMEOUT,
  BUTTON_TEXT,
}

export default constants
