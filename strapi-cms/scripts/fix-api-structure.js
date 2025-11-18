const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Strapi API Structure for i18n...\n');

const apiDir = path.join(__dirname, '../src/api');

// Get all API directories
const apis = fs.readdirSync(apiDir).filter(file => {
  return fs.statSync(path.join(apiDir, file)).isDirectory();
});

apis.forEach(apiName => {
  const apiPath = path.join(apiDir, apiName);
  const controllersDir = path.join(apiPath, 'controllers');
  const servicesDir = path.join(apiPath, 'services');

  // Create directories if they don't exist
  [controllersDir, servicesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Create controller file
  const controllerFile = path.join(controllersDir, `${apiName}.js`);
  if (!fs.existsSync(controllerFile)) {
    fs.writeFileSync(controllerFile, `'use strict';

/**
 * ${apiName} controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::${apiName}.${apiName}');
`);
    console.log(`✅ Created controller for ${apiName}`);
  }

  // Create service file
  const serviceFile = path.join(servicesDir, `${apiName}.js`);
  if (!fs.existsSync(serviceFile)) {
    fs.writeFileSync(serviceFile, `'use strict';

/**
 * ${apiName} service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::${apiName}.${apiName}');
`);
    console.log(`✅ Created service for ${apiName}`);
  }
});

console.log('\n✅ All API structures fixed!');
console.log('Next: Restart Strapi with: docker restart use-nerd-strapi');
