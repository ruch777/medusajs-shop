interface PluginOptions {
  config?: {
    host?: string
    apiKey?: string
  }
}

export default function validatePlugin(options: PluginOptions) {
  if (options.config?.host && !options.config?.apiKey) {
    throw new Error('MeiliSearch requires both host and apiKey configuration')
  }
  return true
} 