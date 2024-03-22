import logger from '../utils/logger';

export default function initServer(connPort, expApp) {
  try {
    expApp.listen(connPort, () => logger.info('Server initiated successfully', {
      infoMetadata: `http://localhost:${connPort}`,
    }));
  } catch (err) {
    logger.error('Failed to initiate the server', { errorMetadata: err });
    process.exit(1);
  }
}
