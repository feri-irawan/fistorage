const DEFAULT_BODY = {
  body: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    },
    required: ['username', 'password']
  }
}

const DEFAULT_HEADERS = {
  headers: {
    type: 'object',
    properties: {
      'Content-Type': { type: 'string' }
    },
    required: ['Content-Type']
  }
}

exports.signup = {
  schema: {
    ...DEFAULT_HEADERS,
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', nullable: true, default: null },
        username: { type: 'string' },
        password: { type: 'string' }
      },
      required: ['username', 'password']
    }
  }
}

exports.login = {
  schema: {
    ...DEFAULT_BODY,
    ...DEFAULT_HEADERS
  }
}

exports.update = {
  schema: {
    body: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },

        data: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            username: { type: 'string' },
            password: { type: 'string' },
            token: { type: 'boolean' }
          }
        }
      },
      required: ['username', 'password', 'data']
    }
  }
}

exports.newToken = {
  schema: {
    ...DEFAULT_BODY,
    ...DEFAULT_HEADERS
  }
}
