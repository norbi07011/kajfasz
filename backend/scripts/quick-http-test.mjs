import http from 'node:http';
const PORT = Number(process.env.PORT) || 8200;
const HOST = '0.0.0.0';
process.on('uncaughtException', e => console.error('uncaughtException', e));
process.on('unhandledRejection', e => console.error('unhandledRejection', e));
const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK\n');
});
server.on('error', e => console.error('server.error', e));
server.listen(PORT, HOST, () => console.log(`TEST ${HOST}:${PORT}`));