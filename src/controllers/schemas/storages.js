const DEFAULT_HEADERS = {
  headers: {
    type: 'object',
    properties: {
      Authorization: { type: 'string' }
    },
    required: ['Authorization']
  }
}

const DEFAUTL_PARAMS = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  }
}

exports.create = {
  schema: {
    ...DEFAULT_HEADERS,
    body: {
      type: 'object',
      nullable: true,
      properties: {
        title: { type: 'string' },
        description: { type: 'string' }
      }
    }
  }
}

exports.contents = {
  schema: {
    ...DEFAULT_HEADERS,
    ...DEFAUTL_PARAMS
  }
}

exports.update = {
  schema: {
    ...DEFAULT_HEADERS,
    ...DEFAUTL_PARAMS
  }
}

exports.delete = {
  schema: {
    ...DEFAULT_HEADERS,
    ...DEFAUTL_PARAMS
  }
}
