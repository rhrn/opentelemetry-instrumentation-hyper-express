"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_node_1 = require("@opentelemetry/sdk-node");
const sdk_trace_node_1 = require("@opentelemetry/sdk-trace-node");
// import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
const instrumentation_1 = require("./instrumentation");
const exporter_zipkin_1 = require("@opentelemetry/exporter-zipkin");
const exporter_jaeger_1 = require("@opentelemetry/exporter-jaeger");
// import * as ot from '@opentelemetry/api';
// const { RestifyInstrumentation } = require('@opentelemetry/instrumentation-restify');
const Exporter = ((exporterParam) => {
    if (typeof exporterParam === 'string') {
        const exporterString = exporterParam.toLowerCase();
        if (exporterString.startsWith('z')) {
            return exporter_zipkin_1.ZipkinExporter;
        }
        if (exporterString.startsWith('j')) {
            return exporter_jaeger_1.JaegerExporter;
        }
    }
    return sdk_trace_node_1.ConsoleSpanExporter;
})('console');
// const otelTracer = ot.trace.getTracer(
//   'my-service'
// )
const sdk = new sdk_node_1.NodeSDK({
    serviceName: "my-service",
    traceExporter: new Exporter(),
    metricReader: new sdk_metrics_1.PeriodicExportingMetricReader({
        exporter: new sdk_metrics_1.ConsoleMetricExporter(),
    }),
    instrumentations: [new instrumentation_1.HyperExpressInstrumentation()],
});
sdk.start();
//# sourceMappingURL=testInstrumentation.js.map