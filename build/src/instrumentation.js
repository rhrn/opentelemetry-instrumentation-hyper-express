"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperExpressInstrumentation = void 0;
const api = require("@opentelemetry/api");
const types_1 = require("./types");
const AttributeNames_1 = require("./enums/AttributeNames");
// import { VERSION } from './version';
const constants = require("./constants");
const instrumentation_1 = require("@opentelemetry/instrumentation");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const utils_1 = require("./utils");
const core_1 = require("@opentelemetry/core");
const api_1 = require("@opentelemetry/api");
const APM_TYPE = process.env.APM_TYPE;
const SEMATTRS_HTTP_REQUEST_ID = 'http.x_request_id';
class HyperExpressInstrumentation extends instrumentation_1.InstrumentationBase {
    constructor(config = {}) {
        super(`@opentelemetry/instrumentation-${constants.MODULE_NAME}`, "0.38.0", config);
        this._isDisabled = false;
    }
    setConfig(config = {}) {
        this._config = Object.assign({}, config);
    }
    getConfig() {
        return this._config;
    }
    init() {
        const module = new instrumentation_1.InstrumentationNodeModuleDefinition(constants.MODULE_NAME, constants.SUPPORTED_VERSIONS, (moduleExports, moduleVersion) => {
            this._moduleVersion = moduleVersion;
            return moduleExports;
        });
        module.files.push(new instrumentation_1.InstrumentationNodeModuleFile('hyper-express/src/components/Server.js', constants.SUPPORTED_VERSIONS, moduleExports => {
            this._isDisabled = false;
            const Server = moduleExports;
            for (const name of constants.HYPER_EXPRESS_METHODS) {
                // console.log("name", name);
                if ((0, instrumentation_1.isWrapped)(Server.prototype[name])) {
                    this._unwrap(Server.prototype, name);
                }
                this._wrap(Server.prototype, name, this._methodPatcher.bind(this));
            }
            for (const name of constants.HYPER_EXPRESS_MW_METHODS) {
                if ((0, instrumentation_1.isWrapped)(Server.prototype[name])) {
                    this._unwrap(Server.prototype, name);
                }
                this._wrap(Server.prototype, name, this._middlewarePatcher.bind(this));
            }
            return moduleExports;
        }, moduleExports => {
            this._isDisabled = true;
            if (moduleExports) {
                const Server = moduleExports;
                for (const name of constants.HYPER_EXPRESS_METHODS) {
                    this._unwrap(Server.prototype, name);
                }
                for (const name of constants.HYPER_EXPRESS_MW_METHODS) {
                    this._unwrap(Server.prototype, name);
                }
            }
        }));
        return module;
    }
    _middlewarePatcher(original, methodName) {
        const instrumentation = this;
        return function (...handler) {
            return original.call(this, instrumentation._handlerPatcher({ type: types_1.LayerType.MIDDLEWARE, methodName }, handler));
        };
    }
    _methodPatcher(original, methodName) {
        const instrumentation = this;
        return function (path, ...handler) {
            return original.call(this, path, ...instrumentation._handlerPatcher({ type: types_1.LayerType.REQUEST, path, methodName }, handler));
        };
    }
    // will return the same type as `handler`, but all functions recursively patched
    _handlerPatcher(metadata, handler) {
        if (Array.isArray(handler)) {
            return handler.map(handler => this._handlerPatcher(metadata, handler));
        }
        if (typeof handler === 'function') {
            return (req, res, next) => {
                if (this._isDisabled) {
                    return handler(req, res, next);
                }
                // const route =
                //   typeof req.getRoute === 'function'
                //     ? req.getRoute()?.path
                //     : req.route?.path;
                //@ts-ignore
                const reqRoute = req.route;
                // console.log("req.route", reqRoute);
                const route = reqRoute.pattern;
                // console.log("yello", req, req.app);
                // replace HTTP instrumentations name with one that contains a route
                const httpMetadata = (0, core_1.getRPCMetadata)(api.context.active());
                if ((httpMetadata === null || httpMetadata === void 0 ? void 0 : httpMetadata.type) === core_1.RPCType.HTTP) {
                    httpMetadata.route = route;
                }
                const fnName = handler.name || undefined;
                const resource = metadata.type === types_1.LayerType.REQUEST
                    ? `${reqRoute.method} ${route}`
                    : `middleware - ${fnName || 'anonymous'}`;
                let spanName = '';
                switch (APM_TYPE) {
                    case 'DD':
                        spanName = metadata.type === types_1.LayerType.REQUEST ? AttributeNames_1.SpanName.REQUEST : AttributeNames_1.SpanName.MIDDLEWARE;
                        break;
                    case 'ELASTIC':
                        spanName = resource;
                        break;
                }
                let attributes = {
                    [AttributeNames_1.AttributeNames.NAME]: fnName,
                    [AttributeNames_1.AttributeNames.VERSION]: this._moduleVersion || 'n/a',
                    [AttributeNames_1.AttributeNames.TYPE]: metadata.type,
                    [AttributeNames_1.AttributeNames.METHOD]: reqRoute.method,
                    [AttributeNames_1.SpanTags.COMPONENT]: AttributeNames_1.LIBRARY_NAME,
                    [AttributeNames_1.SpanTags.KIND]: AttributeNames_1.SpanKind.SERVER,
                    [AttributeNames_1.SpanTags.RESOURCE]: resource,
                };
                if (metadata.type === types_1.LayerType.REQUEST) {
                    //@ts-ignore
                    attributes[semantic_conventions_1.SEMATTRS_HTTP_ROUTE] = route,
                        attributes[semantic_conventions_1.SEMATTRS_HTTP_HOST] = req.headers.host;
                    attributes[semantic_conventions_1.SEMATTRS_HTTP_METHOD] = reqRoute.method;
                    attributes[semantic_conventions_1.SEMATTRS_HTTP_USER_AGENT] = req.headers['user-agent'];
                    attributes[semantic_conventions_1.SEMATTRS_HTTP_TARGET] = route;
                    attributes[semantic_conventions_1.SEMATTRS_HTTP_URL] = (0, utils_1.getScheme)(req.app) + req.headers.host + req.url;
                    attributes[semantic_conventions_1.SEMATTRS_HTTP_CLIENT_IP] = req.ip;
                    attributes[SEMATTRS_HTTP_REQUEST_ID] = req.headers['x-request-id'];
                }
                const span = this.tracer.startSpan(spanName, {
                    attributes,
                    kind: metadata.type === types_1.LayerType.REQUEST ? 1 : 0,
                }, api.context.active());
                const instrumentation = this;
                const requestHook = instrumentation.getConfig().requestHook;
                if (requestHook) {
                    (0, instrumentation_1.safeExecuteInTheMiddle)(() => {
                        return requestHook(span, {
                            request: req,
                            layerType: metadata.type,
                        });
                    }, e => {
                        if (e) {
                            instrumentation._diag.error('request hook failed', e);
                        }
                    }, true);
                }
                const patchedNext = (err) => {
                    if (err) {
                        span.end();
                    }
                    next(err);
                };
                // patchedNext.ifError = next.ifError; // todo: fix me
                const wrapPromise = (promise) => {
                    return promise
                        .then(value => {
                        // console.log("wrapPromise", res.statusCode, metadata.type);
                        if (metadata.type === types_1.LayerType.REQUEST) {
                            // console.log("wrapPromise", res.statusCode, metadata.type);
                            // span.setAttribute(SEMATTRS_HTTP_STATUS_CODE, res.statusCode);
                            span.setAttributes({
                                [semantic_conventions_1.SEMATTRS_HTTP_STATUS_CODE]: res.statusCode,
                            });
                            span.setStatus({
                                code: (0, utils_1.parseResponseStatus)(api_1.SpanKind.SERVER, res.statusCode),
                            });
                        }
                        // span.setAttribute(AttributeNames.STATUS_CODE, res.statusCode);
                        span.end();
                        return value;
                    })
                        .catch(err => {
                        span.recordException(err);
                        span.end();
                        throw err;
                    });
                };
                // console.log("lol", api.context.active(), span);
                const newContext = api.trace.setSpan(api.context.active(), span);
                return api.context.with(newContext, (req, res, next) => {
                    if ((0, utils_1.isAsyncFunction)(handler)) {
                        return wrapPromise(handler(req, res, next));
                    }
                    try {
                        const result = handler(req, res, next);
                        if ((0, utils_1.isPromise)(result)) {
                            return wrapPromise(result);
                        }
                        span.end();
                        return result;
                    }
                    catch (err) {
                        span.recordException(err);
                        span.end();
                        throw err;
                    }
                }, this, req, res, patchedNext);
            };
        }
        return handler;
    }
}
exports.HyperExpressInstrumentation = HyperExpressInstrumentation;
//# sourceMappingURL=instrumentation.js.map