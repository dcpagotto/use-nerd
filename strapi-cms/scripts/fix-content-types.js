const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Strapi Content Types...\n');

const apiDir = path.join(__dirname, '../src/api');

// Content types to fix
const contentTypes = [
  'hero-section',
  'banner',
  'page',
  'nerd-premiado',
  'featured-product',
  'site-setting',
  'blog-post'
];

contentTypes.forEach(contentType => {
  const contentTypeDir = path.join(apiDir, contentType);
  const routesDir = path.join(contentTypeDir, 'routes');
  const controllersDir = path.join(contentTypeDir, 'controllers');
  const servicesDir = path.join(contentTypeDir, 'services');

  // Create directories
  [routesDir, controllersDir, servicesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Create routes file
  const routesFile = path.join(routesDir, `${contentType}.js`);
  if (!fs.existsSync(routesFile)) {
    fs.writeFileSync(routesFile, `module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/${contentType}s',
      handler: '${contentType}.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/${contentType}s/:id',
      handler: '${contentType}.findOne',
      config: {
        policies: [],
      },
    },
  ],
};
`);
    console.log(`✅ Created routes for ${contentType}`);
  }

  // Create controller file
  const controllerFile = path.join(controllersDir, `${contentType}.js`);
  if (!fs.existsSync(controllerFile)) {
    fs.writeFileSync(controllerFile, `'use strict';

/**
 * ${contentType} controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::${contentType}.${contentType}');
`);
    console.log(`✅ Created controller for ${contentType}`);
  }

  // Create service file
  const serviceFile = path.join(servicesDir, `${contentType}.js`);
  if (!fs.existsSync(serviceFile)) {
    fs.writeFileSync(serviceFile, `'use strict';

/**
 * ${contentType} service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::${contentType}.${contentType}');
`);
    console.log(`✅ Created service for ${contentType}`);
  }
});

console.log('\n✅ All content types fixed!\n');
console.log('Next: Restart Strapi with: docker restart use-nerd-strapi');
