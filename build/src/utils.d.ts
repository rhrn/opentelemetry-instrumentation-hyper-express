import { SpanKind, SpanStatusCode } from "@opentelemetry/api";
import type { Server } from "hyper-express";
export declare const isPromise: (value?: any) => value is Promise<unknown>;
export declare const isAsyncFunction: (value?: unknown) => boolean;
export declare const parseResponseStatus: (kind: SpanKind, statusCode?: number | undefined) => SpanStatusCode;
export declare const getScheme: (app: Server) => "https://" | "http://";
//# sourceMappingURL=utils.d.ts.map