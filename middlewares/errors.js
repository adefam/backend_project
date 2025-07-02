
class UserAuthError extends Error {
    constructor(message = 'Permission error') {
      super(message);
      this.name = 'UserAuthError';
      this.code = 403;
    }
  }
  
  export { UserAuthError };
  