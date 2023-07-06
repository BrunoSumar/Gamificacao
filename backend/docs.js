module.exports = [
  require('@fastify/swagger-ui'),
  {
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'Documentação rota API',
        description: 'Descrição das rotas',
      },
      host: '0.0.0.0:80',
      basePath: '/api',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [{
        name: 'User',
        description: 'User\'s API'
      }, ],
    },
    uiConfig: {
      docExpansion: 'none', // expand/not all the documentations none|list|full
      deepLinking: true
    },
    uiHooks: {
      onRequest: function(request, reply, next) {
        next();
      },
      preHandler: function(request, reply, next) {
        next();
      }
    },
    staticCSP: false,
    transformStaticCSP: (header) => header,
    exposeRoute: true
  }
];
