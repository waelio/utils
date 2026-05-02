const dialogDefaults = {
  title: "Loading ...",
  dark: false,
  message: "0%",
  progress: {
    color: "primary",
  },
  persistent: false,
  ok: false,
};

const notifyDefaults = {
  timeout: 10000,
  position: "top",
};

const loadingDefaults = {
  message: "Processing ...",
};

const loadingBarDefaults = {
  color: "amber-7",
  size: "10px",
  position: "top",
};

const defaultStyles = {
  info: {
    icon: "info",
    color: "info",
    type: "info",
  },
  success: {
    icon: "check_circle",
    color: "positive",
    type: "positive",
  },
  warning: {
    icon: "warning",
    color: "warning",
    type: "warning",
  },
  error: {
    icon: "error",
    color: "negative",
    type: "negative",
  },
};

export {
  dialogDefaults,
  notifyDefaults,
  loadingBarDefaults,
  defaultStyles,
  loadingDefaults,
};
