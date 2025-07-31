const nameHasNumber = (name) => /\d/.test(name);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validateSignupInput = (data) => {
  const errors = [];

  if (!data.firstName || typeof data.firstName !== 'string' || nameHasNumber(data.firstName)) {
    errors.push('Invalid Firstname.');
  }

  if (!data.lastName || typeof data.lastName !== 'string' || nameHasNumber(data.lastName)) {
    errors.push('Invalid Lastname.');
  }

  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('A valid email is required.');
  }

  if (!data.password || !passwordRegex.test(data.password)) {
    errors.push('Password must be at least 8 characters and include 1 uppercase letter, 1 number, and 1 special character.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Example: validate query
export const validatePaginationQuery = (query) => {
  const errors = [];

  if (query.page && isNaN(Number(query.page))) {
    errors.push('Page must be a number.');
  }

  if (query.limit && isNaN(Number(query.limit))) {
    errors.push('Limit must be a number.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Example: validate params
export const validateUserIdParam = (params) => {
  const errors = [];

  if (!params.userId || !/^\d+$/.test(params.userId)) {
    errors.push('userId must be a numeric value.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
