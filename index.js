const lib = require('./lib'),
  path = require('path');

const config = {
  host: process.env.SYNC_FTP_HOST || 'localhost',
  port: process.env.SYNC_FTP_PORT || 21,
  user: process.env.SYNC_FTP_USER || 'anonymous',
  pass: process.env.SYNC_FTP_PASS || '@anonymous',
  proxyEnabled: process.env.SYNC_FTP_PROXY_ENABLED === 'true',
  proxy: {
    host: process.env.SYNC_FTP_PROXY_HOST || '192.168.1.45',
    port: process.env.SYNC_FTP_PROXY_PORT ? parseInt(process.env.SYNC_FTP_PROXY_PORT, 10) : 9239,
    type: process.env.SYNC_FTP_PROXY_TYPE ? parseInt(process.env.SYNC_FTP_PROXY_TYPE, 10) : 5
  }
};

let targetFilePath;

process.argv.forEach((val, index) => {
  if ( /file=/.test(val) ) {
    targetFilePath = val.replace('file=','');
  }
});

if (!targetFilePath) {
  throw new Error('targetFilePath required!');
}

const exec = async () => {
  try{
    console.log('start');
    console.log('exec ls');
    const ftpConnection = await lib.init(config);
    const list = await lib.ls(ftpConnection, '.');
    console.log('ls result', JSON.stringify(list));
    const dummyFileName = Date.now();
    console.log('exec upload', targetFilePath, dummyFileName);
    const absoluteTargetFilePath = path.join(__dirname, targetFilePath);
    await lib.uploadFile(ftpConnection, absoluteTargetFilePath, dummyFileName);
    console.log('end');  
    process.exit(0);
  } catch(err) {
    console.log('error', err);
    process.exit(-1);
    throw err;
  }
}

exec();