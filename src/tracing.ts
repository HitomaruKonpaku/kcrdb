import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks'
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { Logger } from './shared/logger'

const logger = new Logger('Tracing')

const enabled = false
  || ['true', '1'].includes(process.env.METRICS_ENABLED ?? '')

const host = process.env.HOST || 'localhost'
const port = Number(process.env.METRICS_PORT) || 8081
const xUrl = `http://${host}:${port}/metrics`

class XNodeSDK extends NodeSDK {
  get url() {
    return xUrl
  }
}

// eslint-disable-next-line import/no-mutable-exports
let otelSDK: XNodeSDK | undefined

if (enabled) {
  otelSDK = new XNodeSDK({
    metricReader: new PrometheusExporter(
      {
        port,
      },
      () => {
        // logger.log(`📊 Metrics: ${xUrl}`)
      },
    ),
    contextManager: new AsyncLocalStorageContextManager(),
    instrumentations: [
      // getNodeAutoInstrumentations({
      //   '@opentelemetry/instrumentation-nestjs-core': {},
      // }),
      new NestInstrumentation(),
    ],
  })

  process.on('SIGTERM', () => {
    if (!otelSDK) {
      return
    }

    otelSDK
      .shutdown()
      .then(() => logger.log('Tracing terminated'))
      .catch((error) => logger.log('Error terminating tracing', error))
      .finally(() => process.exit(0))
  })
}

export default otelSDK
