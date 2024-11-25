'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// import api = require('@opentelemetry/api');
// const { diag, DiagConsoleLogger, DiagLogLevel } = api;
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.VERBOSE);
const hyper_express_1 = require("hyper-express");
const server = new hyper_express_1.Server({});
const PORT = 8080;
// server.pre((req: any, res: any, next: () => void) => {
//   next();
// });
// `setDefaultName` shows up in spans as the name
// const setDefaultName = (req: { defaultName: string; }, res: any, next: () => void) => {
//   req.defaultName = 'Stranger';
//   next();
// };
server.use((req, res, next) => {
    /*
      noop to showcase use with an array.
      as this is an anonymous fn, the name is not known and cannot be displayed in traces.
     */
    next();
});
function myMiddleware(req, res, next) {
    next();
}
server.use(myMiddleware);
// named function to be used in traces
// eslint-disable-next-line prefer-arrow-callback
server.get('/hello/:name', (req, res, next) => {
    console.log('Handling hello');
    // res.send(`Hello, ${req.params.name}\n`);
    res.sendStatus(400).send(JSON.stringify({ sucess: false }));
});
server.get('/bye/:name', (req, res, next) => {
    console.log('Handling bye');
    res.send("bye");
});
server.listen(PORT, () => {
    console.log('Ready on %s', server.port);
});
//# sourceMappingURL=app.js.map