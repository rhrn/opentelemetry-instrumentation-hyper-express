import { Span } from '@opentelemetry/api';
import type { MiddlewareHandler, Request as HyperExpressRequest } from 'hyper-express';
import { LayerType } from './types';
declare interface RequestWithRoute extends HyperExpressRequest {
}
export declare type Request = RequestWithRoute;
export declare type Metadata = {
    path?: string;
    methodName?: string;
    type: LayerType;
};
export declare type NestedRequestHandlers = Array<NestedRequestHandlers | MiddlewareHandler>;
/**
 * extends opentelemetry/api Span object to instrument the root span name of http instrumentation
 */
export interface InstrumentationSpan extends Span {
    name?: string;
}
export {};
//# sourceMappingURL=internal-types.d.ts.map