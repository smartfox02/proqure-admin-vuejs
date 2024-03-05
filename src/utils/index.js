import moment from 'moment'
import app from '@/main'
const toastPlugin = app.config.globalProperties.$toast
export const isEmpty = (value) => {
  if (value === undefined || value === null) return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'string') return value.trim().length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

export const isValidEmail = (email) => {
  if (email) {
    // Use a regular expression to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  } else {
    return true
  }
}

export const validatePhoneNumber = (phoneNumber) => {
  if (phoneNumber) {
    const regex = /^\d{11,}$/ // Matches 11 or more digits
    return regex.test(phoneNumber)
  } else {
    return true
  }
}

export const getDateTimeFormat = (date) => {
  let formattedDate = moment(date).format('YYYY-MM-DD')
  let formattedTime = moment(date).format('HH:mm:ss')
  return formattedDate + ' ' + formattedTime
}

export const getDateFormat = (date) => {
  let formattedDate = moment(date).format('YYYY-MM-DD')
  return formattedDate
}

export const toastr = {
  success: (message) => {
    toastPlugin.open({
      message: `${message}!`,
      type: 'success',
      position: 'top-right',
      duration: 3500,
    })
  },
  info: (message) => {
    toastPlugin.open({
      message: `${message}!`,
      type: 'info',
      position: 'top-right',
      duration: 3500,
    })
  },
  warning: (message) => {
    toastPlugin.open({
      message: `${message}!`,
      type: 'warning',
      position: 'top-right',
      duration: 3500,
    })
  },
  error: (message) => {
    toastPlugin.open({
      message: `${message}!`,
      type: 'error',
      position: 'top-right',
      duration: 3500,
    })
  },
}

export const randomString = (n) => {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  const length = n // specify the desired length of the random string

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }
  return result
}
