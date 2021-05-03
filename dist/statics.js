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
  },
  notifyDefaults = {
    timeout: 10000,
    position: 'top',
  },
  loadingDefaults = {
    spinner: QSpinnerGears,
    message: 'Processing ...',
  },
  loadingBarDefaults = {
    color: 'amber-7',
    size: '10px',
    position: 'top',
  },
  defaultStyles = {
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



module.exports = {
  dialogDefaults: dialogDefaults,
  notifyDefaults: notifyDefaults,
  loadingBarDefaults: loadingBarDefaults,
  defaultStyles: defaultStyles,
  loadingDefaults: defaultStyles,
}
