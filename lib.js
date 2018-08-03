const jsftp = require('jsftp'),
  { SocksClient } = require('socks');

const init = async (config) => {
  const { host, port, user, pass, proxyEnabled, proxy } = config;
  const ftpConfig = Object.assign({}, { host, port, user, pass });
  if (proxyEnabled) {
    const socketConnection = await SocksClient.createConnection({
      proxy: {
        ipaddress: proxy.host,
        port: proxy.port,
        type: proxy.type
      },
      command: 'connect',
      destination: {
        host,
        port: parseInt(port, 10)
      }
    });
    ftpConfig.createSocket = () => socketConnection.socket;
  }
  const ftp = new jsftp(ftpConfig);
  ftp.on('data', data => {
    console.log('DEBUG data', data);
  });
  ftp.on('connect', data => {
    console.log('DEBUG connect', data);
  });
  ftp.on('error', data => {
    console.log('DEBUG error', data);
  });
  ftp.on('progress', data => {
    console.log('DEBUG progress', data);
  });
  ftp.on('timeout', data => {
    console.log('DEBUG timeout', data);
  });
  return ftp;
};

const uploadFile = async (ftp, data, filePath) => new Promise((resolve, reject) => {
  ftp.put(data, filePath, (error) => {
    if (error) {
      reject(error);
      return;
    }
    resolve();
  });
});

const execRaw = async (ftp, command, data) => new Promise((resolve, reject) => {
  ftp.raw(command, data, (error, res) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(res);
  });
});

const ls = async (ftp, dir) => new Promise((resolve, reject) => {
  ftp.ls(dir, (error, res) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(res);
  });
});

module.exports = {
  init,
  uploadFile,
  execRaw,
  ls
};
