import { createSwaggerSpec } from 'next-swagger-doc'

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Nomad Cafe API',
        version: '1.0.0',
        description: 'API documentation for the Nomad Cafe application - a TON blockchain-based cafe ordering system',
      },
      servers: [
        {
          url: '/api',
          description: 'API Server',
        },
      ],
      components: {
        schemas: {
          Cafe: {
            type: 'object',
            properties: {
              id: { type: 'number', description: 'Unique cafe identifier' },
              name: { type: 'string', description: 'Cafe name' },
              address: { type: 'string', description: 'Physical address' },
              lat: { type: 'number', format: 'double', description: 'Latitude coordinate' },
              lng: { type: 'number', format: 'double', description: 'Longitude coordinate' },
              wallet_address: { type: 'string', description: 'TON wallet address for payments' },
              distance_m: { type: 'number', format: 'double', description: 'Distance in meters from query location' },
            },
            required: ['id', 'name', 'address', 'lat', 'lng', 'wallet_address', 'distance_m'],
          },
          OrderItem: {
            type: 'object',
            properties: {
              menu_item_id: { type: 'string', description: 'Menu item identifier' },
              qty: { type: 'number', description: 'Quantity ordered' },
              price_ton: { type: 'number', format: 'double', description: 'Price per item in TON' },
            },
            required: ['menu_item_id', 'qty', 'price_ton'],
          },
          Order: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', description: 'Order identifier' },
              total_amount_ton: { type: 'number', format: 'double', description: 'Total amount in TON' },
            },
            required: ['id', 'total_amount_ton'],
          },
          Payment: {
            type: 'object',
            properties: {
              recipient: { type: 'string', description: 'TON wallet address to receive payment' },
              amount_ton: { type: 'number', format: 'double', description: 'Payment amount in TON' },
              text: { type: 'string', description: 'Payment comment/memo' },
              ton_uri: { type: 'string', description: 'TON payment URI' },
            },
            required: ['recipient', 'amount_ton', 'text', 'ton_uri'],
          },
          Error: {
            type: 'object',
            properties: {
              error: { type: 'string', description: 'Error message' },
            },
          },
        },
      },
      paths: {
        '/cafes/nearest': {
          get: {
            summary: 'Get nearest cafes',
            description: 'Returns a list of cafes sorted by distance from the given coordinates',
            tags: ['Cafes'],
            parameters: [
              {
                name: 'lat',
                in: 'query',
                required: true,
                schema: { type: 'number', format: 'double' },
                description: 'Latitude of the search location',
              },
              {
                name: 'lng',
                in: 'query',
                required: true,
                schema: { type: 'number', format: 'double' },
                description: 'Longitude of the search location',
              },
              {
                name: 'limit',
                in: 'query',
                required: false,
                schema: { type: 'number', default: 5 },
                description: 'Maximum number of cafes to return',
              },
            ],
            responses: {
              '200': {
                description: 'List of nearest cafes',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Cafe' },
                    },
                  },
                },
              },
              '400': {
                description: 'Invalid parameters',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' },
                  },
                },
              },
            },
          },
        },
        '/orders': {
          post: {
            summary: 'Create an order',
            description: 'Creates a new order and generates payment details',
            tags: ['Orders'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      items: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/OrderItem' },
                        description: 'List of items to order',
                      },
                    },
                    required: ['items'],
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Order created successfully',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        order: { $ref: '#/components/schemas/Order' },
                        payment: { $ref: '#/components/schemas/Payment' },
                      },
                    },
                  },
                },
              },
              '400': {
                description: 'Invalid request',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' },
                  },
                },
              },
            },
          },
        },
        '/payments/submit': {
          post: {
            summary: 'Submit payment proof',
            description: 'Submit payment transaction details for verification',
            tags: ['Payments'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['order_id', 'tx_boc', 'from'],
                    properties: {
                      order_id: {
                        type: 'string',
                        format: 'uuid',
                        description: 'Order identifier',
                      },
                      tx_boc: {
                        type: 'string',
                        description: 'Transaction Bag of Cells (BOC)',
                      },
                      from: {
                        type: 'string',
                        description: 'Sender TON wallet address',
                      },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Payment submission accepted',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        order_id: { type: 'string', format: 'uuid' },
                      },
                      required: ['success', 'message', 'order_id'],
                    },
                  },
                },
              },
              '500': {
                description: 'Server error',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  return spec
}
