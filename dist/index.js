"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const app_1 = __importDefault(require("./app"));
(0, debug_1.default)('ts-express:server');
const port = Number.parseInt(process.env.PORT || '3000');
if (Number.isNaN(port)) {
    console.error('PORT must be a number');
    process.exit(1);
}
const server = app_1.default.listen(port, () => {
    console.info(`Serveur disponible à http://localhost:${port}`);
});
server.on('error', onError);
server.on('listening', onListening);
function onError(error) {
    if (error.syscall !== 'listen')
        throw error;
    let bind = 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
        default:
            throw error;
    }
}
function onListening() {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` :
        (addr ? `port ${addr.port}` : ``);
    (0, debug_1.default)(`Listening on ${bind}`);
}
//# sourceMappingURL=index.js.map