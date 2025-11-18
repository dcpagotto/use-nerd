const fs = require('fs');
const path = require('path');

console.log('🔧 Temporarily disabling i18n in all Content Types...\n');

const apiDir = path.join(__dirname, '../src/api');

// Get all API directories
const apis = fs.readdirSync(apiDir).filter(file => {
  return fs.statSync(path.join(apiDir, file)).isDirectory();
});

apis.forEach(apiName => {
  const schemaPath = path.join(apiDir, apiName, 'content-types', apiName, 'schema.json');

  if (fs.existsSync(schemaPath)) {
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    // Remove i18n from pluginOptions if it exists
    if (schema.pluginOptions && schema.pluginOptions.i18n) {
      delete schema.pluginOptions.i18n;
      console.log(`✅ Disabled i18n for ${apiName}`);
    }

    // Remove i18n from all attributes
    if (schema.attributes) {
      Object.keys(schema.attributes).forEach(attrKey => {
        const attr = schema.attributes[attrKey];
        if (attr.pluginOptions && attr.pluginOptions.i18n) {
          delete attr.pluginOptions.i18n;
        }
      });
    }

    // Write back
    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
  }
});

console.log('\n✅ All i18n disabled!');
console.log('Next: Restart Strapi with: docker restart use-nerd-strapi');
