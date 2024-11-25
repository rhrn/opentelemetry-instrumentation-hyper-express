"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIBRARY_NAME = exports.SpanKind = exports.SpanName = exports.SpanTags = exports.AttributeNames = void 0;
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
var AttributeNames;
(function (AttributeNames) {
    AttributeNames["TYPE"] = "hyper-express.type";
    AttributeNames["NAME"] = "hyper-express.name";
    AttributeNames["METHOD"] = "hyper-express.method";
    AttributeNames["VERSION"] = "hyper-express.version";
})(AttributeNames = exports.AttributeNames || (exports.AttributeNames = {}));
var SpanTags;
(function (SpanTags) {
    SpanTags["COMPONENT"] = "component";
    SpanTags["RESOURCE"] = "resource.name";
    SpanTags["KIND"] = "span.kind";
})(SpanTags = exports.SpanTags || (exports.SpanTags = {}));
var SpanName;
(function (SpanName) {
    SpanName["REQUEST"] = "hyper-express.request";
    SpanName["MIDDLEWARE"] = "hyper-express.middleware";
})(SpanName = exports.SpanName || (exports.SpanName = {}));
var SpanKind;
(function (SpanKind) {
    SpanKind["SERVER"] = "server";
    SpanKind["CLIENT"] = "client";
    SpanKind["PRODUCER"] = "producer";
    SpanKind["CONSUMER"] = "consumer";
    SpanKind["INTERNAL"] = "internal";
})(SpanKind = exports.SpanKind || (exports.SpanKind = {}));
exports.LIBRARY_NAME = 'hyper-express';
//# sourceMappingURL=AttributeNames.js.map