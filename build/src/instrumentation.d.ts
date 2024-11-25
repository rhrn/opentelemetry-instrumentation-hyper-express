import { InstrumentationBase, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
import type { HyperExpressInstrumentationConfig } from './types';
export declare class HyperExpressInstrumentation extends InstrumentationBase {
    constructor(config?: HyperExpressInstrumentationConfig);
    private _moduleVersion?;
    private _isDisabled;
    setConfig(config?: HyperExpressInstrumentationConfig): void;
    getConfig(): HyperExpressInstrumentationConfig;
    init(): InstrumentationNodeModuleDefinition;
    private _middlewarePatcher;
    private _methodPatcher;
    private _handlerPatcher;
}
//# sourceMappingURL=instrumentation.d.ts.map