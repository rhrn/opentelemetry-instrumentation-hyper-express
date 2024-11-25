import { Span } from '@opentelemetry/api';
import { InstrumentationConfig } from '@opentelemetry/instrumentation';
import type { Request } from 'hyper-express';
export declare enum LayerType {
    MIDDLEWARE = "middleware",
    REQUEST = "request"
}
export interface HyperExpressRequestInfo {
    request: Request;
    layerType: LayerType;
}
/**
 * Function that can be used to add custom attributes to the current span
 * @param span - The restify handler span.
 * @param info - The restify request info object.
 */
export interface HyperExpressAttributeFunction {
    (span: Span, info: HyperExpressRequestInfo): void;
}
/**
 * Options available for the restify Instrumentation
 */
export interface HyperExpressInstrumentationConfig extends InstrumentationConfig {
    /** Function for adding custom attributes to each handler span */
    requestHook?: HyperExpressAttributeFunction;
}
//# sourceMappingURL=types.d.ts.map