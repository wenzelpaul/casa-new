import 'dotenv/config';
import Client from 'ssh2-sftp-client';
import fs from 'fs';
import path from 'path';

const sftp = new Client();
const config = {
  host: process.env.SFTP_HOST,
  port: 22,
  username: process.env.SFTP_USER,
  password: process.env.SFTP_PASS,
};

async function uploadDir(client, localDir, remoteDir) {
  try {
    // Create remote directory if it doesn't exist
    await client.mkdir(remoteDir, true);

    const items = fs.readdirSync(localDir);

    for (const item of items) {
      const localPath = path.join(localDir, item);
      const remotePath = path.posix.join(remoteDir, item);
      const stats = fs.statSync(localPath);

      if (stats.isDirectory()) {
        await uploadDir(client, localPath, remotePath);
      } else {
        await client.put(localPath, remotePath);
      }
    }
  } catch (err) {
    console.error(`Error uploading ${localDir}:`, err.message);
  }
}

async function deleteRemoteDir(client, remoteDir) {
  try {
    const list = await client.list(remoteDir);

    for (const item of list) {
      const itemPath = path.posix.join(remoteDir, item.name);
      if (item.type === 'd') {
        await deleteRemoteDir(client, itemPath);
        await client.rmdir(itemPath);
      } else {
        await client.delete(itemPath);
      }
    }
  } catch (err) {
    console.error(`Error deleting contents of ${remoteDir}:`, err.message);
  }
}

async function main() {
  try {
    await sftp.connect(config);

    const remoteDir = process.env.SFTP_REMOTE_DIR;
    const localDir = '_site';

    console.log(`Deleting existing contents in ${remoteDir}...`);
    await deleteRemoteDir(sftp, remoteDir);

    console.log(`Uploading contents of ${localDir} to ${remoteDir}...`);
    await uploadDir(sftp, localDir, remoteDir);

    console.log('Upload completed successfully.');
  } catch (err) {
    console.error('Upload failed:', err.message);
  } finally {
    await sftp.end();
  }
}

main();