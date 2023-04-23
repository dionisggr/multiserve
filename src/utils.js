function isBrowserRequest(req) {
  const userAgent = req.headers && req.headers['user-agent'];
  const localRuntimes = ['PostmanRuntime', 'axios', 'vscode-restclient'];
  const isLocalRuntime = localRuntimes.some(runtime => userAgent.includes(runtime));

  return !isLocalRuntime;
}

function isAdminRequest(req) {
  const { user } = req;

  return user && user.is_admin;
}

function customError(message, status) {
  const error = new Error(message);
  error.status = status;

  return error;
}

module.exports = {
  isBrowserRequest,
  isAdminRequest,
  customError,
};
