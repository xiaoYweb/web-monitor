export function setConfig(options) {
  Object.assign(config, {
    ...options
  })
}

export function getConfig() {
  return config;
}
