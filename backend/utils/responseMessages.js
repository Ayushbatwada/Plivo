function serverError() {
    this.code = 500;
    this.status = 'failure';
    this.message = 'Server error';
}

function dbError() {
    this.code = 500;
    this.status = 'failure';
    this.message = 'Database error';
}

function payloadError() {
    this.code = 400;
    this.status = 'failure';
    this.message = 'Payload is incorrect. One or more data is missing';
}

function successMessage() {
    this.code = 200;
    this.status = 'success';
}

function notFound() {
    this.code = 200;
    this.status = 'not_found';
    this.message = 'Queried object does not exist';
}

function alreadyExist() {
    this.code = 200;
    this.status = 'already_exist';
}

function generalFailure() {
    this.code = 404;
    this.status = 'failure';
}

function unauthorised() {
    this.code = 401;
    this.status = 'unauthorised';
    this.message = 'User is not authorised';
}

module.exports = {
    serverError: serverError,
    dbError: dbError,
    payloadError: payloadError,
    successMessage: successMessage,
    notFound: notFound,
    alreadyExist: alreadyExist,
    generalFailure: generalFailure,
    unauthorised: unauthorised
}
