const { Dark, QSpinnerGears } = require('quasar')
const color = Dark.isActive ? 'accent' : 'primary'
const dialogDefaults = {
  title: 'Loading ...',
  dark: Dark.isActive,
  message: '0%',
  progress: {
    spinner: QSpinnerGears,
    color,
  },
  persistent: false, // we want the user to not be able to close it
  ok: false,
}
const notifyDefaults = {
  timeout: 10000,
  position: 'top',
}
const loadingDefaults = {
  spinner: QSpinnerGears,
  message: 'Processing ...',
}
const loadingBarDefaults = {
  color: 'amber-7',
  size: '10px',
  position: 'top',
}
const defaultStyles = {
  info: {
    icon: 'fa fa-check',
    color: 'info',
    type: 'info',
  },
  success: {
    icon: 'fa fa-check',
    color: 'positive',
    type: 'positive',
  },
  warning: {
    icon: 'fa fa-exclamation',
    color: 'warning',
    type: 'warning',
  },
  error: {
    icon: 'fa fa-exclamation',
    color: 'negative',
    type: 'negative',
  },
}

exports.dialogDefaults = dialogDefaults
exports.notifyDefaults = notifyDefaults
exports.loadingBarDefaults = loadingBarDefaults
exports.defaultStyles = defaultStyles
exports.loadingDefaults = loadingDefaults
