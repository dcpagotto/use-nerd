#!/usr/bin/env node

/**
 * Strapi Content Types Verification Script
 *
 * Verifies that all content types and components were created successfully
 * and tests API endpoints after Strapi restart.
 *
 * @version 1.0.0
 * @author USE Nerd Development Team
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const STRAPI_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(STRAPI_ROOT, 'src');
const API_DIR = path.join(SRC_DIR, 'api');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

// Expected content types and components
const EXPECTED_CONTENT_TYPES = [
  'hero-section',
  'banner',
  'page',
  'nerd-premiado',
  'featured-product',
  'site-setting',
  'blog-post'
];

const EXPECTED_COMPONENTS = [
  { category: 'shared', name: 'seo' },
  { category: 'shared', name: 'social-link' },
  { category: 'raffle', name: 'winner-announcement' }
];

// API endpoints to test
const API_ENDPOINTS = [
  { path: '/api/hero-section', type: 'single' },
  { path: '/api/banners', type: 'collection' },
  { path: '/api/pages', type: 'collection' },
  { path: '/api/nerd-premiado', type: 'single' },
  { path: '/api/featured-products', type: 'collection' },
  { path: '/api/site-setting', type: 'single' },
  { path: '/api/blog-posts', type: 'collection' }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function parseJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return { error: error.message };
  }
}

// ============================================================================
// VERIFICATION FUNCTIONS
// ============================================================================

/**
 * Verify content type schema files exist and are valid
 */
function verifyContentTypes() {
  log('\n=== Verifying Content Types ===\n', 'cyan');

  const results = [];

  for (const name of EXPECTED_CONTENT_TYPES) {
    const schemaPath = path.join(API_DIR, name, 'content-types', name, 'schema.json');

    if (!fileExists(schemaPath)) {
      log(`  ✗ Missing: ${name}`, 'red');
      results.push({ name, status: 'missing', path: schemaPath });
      continue;
    }

    const schema = parseJson(schemaPath);
    if (schema.error) {
      log(`  ✗ Invalid JSON: ${name} - ${schema.error}`, 'red');
      results.push({ name, status: 'invalid', error: schema.error });
      continue;
    }

    // Validate schema structure
    if (!schema.info || !schema.attributes) {
      log(`  ✗ Invalid structure: ${name}`, 'red');
      results.push({ name, status: 'invalid-structure' });
      continue;
    }

    log(`  ✓ Valid: ${name}`, 'green');
    results.push({ name, status: 'valid', path: schemaPath, schema });
  }

  return results;
}

/**
 * Verify component files exist and are valid
 */
function verifyComponents() {
  log('\n=== Verifying Components ===\n', 'cyan');

  const results = [];

  for (const { category, name } of EXPECTED_COMPONENTS) {
    const componentPath = path.join(COMPONENTS_DIR, category, `${name}.json`);

    if (!fileExists(componentPath)) {
      log(`  ✗ Missing: ${category}.${name}`, 'red');
      results.push({ category, name, status: 'missing', path: componentPath });
      continue;
    }

    const component = parseJson(componentPath);
    if (component.error) {
      log(`  ✗ Invalid JSON: ${category}.${name} - ${component.error}`, 'red');
      results.push({ category, name, status: 'invalid', error: component.error });
      continue;
    }

    // Validate component structure
    if (!component.info || !component.attributes) {
      log(`  ✗ Invalid structure: ${category}.${name}`, 'red');
      results.push({ category, name, status: 'invalid-structure' });
      continue;
    }

    log(`  ✓ Valid: ${category}.${name}`, 'green');
    results.push({ category, name, status: 'valid', path: componentPath, component });
  }

  return results;
}

/**
 * Test API endpoints (requires Strapi to be running)
 */
async function testApiEndpoints() {
  log('\n=== Testing API Endpoints ===\n', 'cyan');
  log(`Strapi URL: ${STRAPI_URL}`, 'yellow');

  const results = [];

  for (const { path: endpoint, type } of API_ENDPOINTS) {
    const url = `${STRAPI_URL}${endpoint}`;

    try {
      const response = await fetch(url);
      const status = response.status;

      if (status === 200) {
        const data = await response.json();
        log(`  ✓ ${endpoint} (${status})`, 'green');
        results.push({ endpoint, status: 'success', httpStatus: status, hasData: !!data.data });
      } else if (status === 403) {
        log(`  ⚠ ${endpoint} (403 Forbidden) - Configure permissions`, 'yellow');
        results.push({ endpoint, status: 'forbidden', httpStatus: status });
      } else if (status === 404) {
        log(`  ✗ ${endpoint} (404 Not Found) - Restart Strapi?`, 'red');
        results.push({ endpoint, status: 'not-found', httpStatus: status });
      } else {
        log(`  ⚠ ${endpoint} (${status})`, 'yellow');
        results.push({ endpoint, status: 'other', httpStatus: status });
      }
    } catch (error) {
      log(`  ✗ ${endpoint} - ${error.message}`, 'red');
      results.push({ endpoint, status: 'error', error: error.message });
    }
  }

  return results;
}

/**
 * Generate verification report
 */
function generateReport(contentTypeResults, componentResults, apiResults) {
  log('\n╔═══════════════════════════════════════════════════════════════╗', 'blue');
  log('║              STRAPI VERIFICATION REPORT                       ║', 'blue');
  log('╚═══════════════════════════════════════════════════════════════╝\n', 'blue');

  // Content Types Summary
  const ctValid = contentTypeResults.filter(r => r.status === 'valid').length;
  const ctMissing = contentTypeResults.filter(r => r.status === 'missing').length;
  const ctInvalid = contentTypeResults.filter(r => r.status !== 'valid' && r.status !== 'missing').length;

  log('Content Type Schemas:', 'cyan');
  log(`  ✓ Valid:   ${ctValid}/${EXPECTED_CONTENT_TYPES.length}`, ctValid === EXPECTED_CONTENT_TYPES.length ? 'green' : 'red');
  log(`  ✗ Missing: ${ctMissing}`, ctMissing > 0 ? 'red' : 'green');
  log(`  ✗ Invalid: ${ctInvalid}`, ctInvalid > 0 ? 'red' : 'green');

  // Components Summary
  const compValid = componentResults.filter(r => r.status === 'valid').length;
  const compMissing = componentResults.filter(r => r.status === 'missing').length;
  const compInvalid = componentResults.filter(r => r.status !== 'valid' && r.status !== 'missing').length;

  log('\nComponent Schemas:', 'cyan');
  log(`  ✓ Valid:   ${compValid}/${EXPECTED_COMPONENTS.length}`, compValid === EXPECTED_COMPONENTS.length ? 'green' : 'red');
  log(`  ✗ Missing: ${compMissing}`, compMissing > 0 ? 'red' : 'green');
  log(`  ✗ Invalid: ${compInvalid}`, compInvalid > 0 ? 'red' : 'green');

  // API Endpoints Summary
  if (apiResults.length > 0) {
    const apiSuccess = apiResults.filter(r => r.status === 'success').length;
    const apiForbidden = apiResults.filter(r => r.status === 'forbidden').length;
    const apiNotFound = apiResults.filter(r => r.status === 'not-found').length;
    const apiError = apiResults.filter(r => r.status === 'error').length;

    log('\nAPI Endpoints:', 'cyan');
    log(`  ✓ Working:   ${apiSuccess}/${API_ENDPOINTS.length}`, apiSuccess > 0 ? 'green' : 'reset');
    log(`  ⚠ Forbidden: ${apiForbidden}`, apiForbidden > 0 ? 'yellow' : 'green');
    log(`  ✗ Not Found: ${apiNotFound}`, apiNotFound > 0 ? 'red' : 'green');
    log(`  ✗ Error:     ${apiError}`, apiError > 0 ? 'red' : 'green');
  }

  // Overall Status
  const schemasValid = ctValid === EXPECTED_CONTENT_TYPES.length && compValid === EXPECTED_COMPONENTS.length;
  const apiWorking = apiResults.length > 0 && apiResults.filter(r => r.status === 'success' || r.status === 'forbidden').length > 0;

  log('\n' + '─'.repeat(65), 'blue');

  if (schemasValid && apiWorking) {
    log('\n✓ All verification checks passed!', 'green');
    log('✓ Schemas are valid and API is responding', 'green');
  } else if (schemasValid && apiResults.length === 0) {
    log('\n✓ Schemas are valid', 'green');
    log('⚠ API tests skipped (use --test-api flag)', 'yellow');
  } else if (schemasValid) {
    log('\n✓ Schemas are valid', 'green');
    log('✗ API issues detected - see details above', 'red');
  } else {
    log('\n✗ Verification failed - see details above', 'red');
  }

  return { schemasValid, apiWorking };
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const testApi = args.includes('--test-api') || args.includes('-a');

  log('\n╔═══════════════════════════════════════════════════════════════╗', 'blue');
  log('║         STRAPI CONTENT TYPES VERIFICATION                     ║', 'blue');
  log('╚═══════════════════════════════════════════════════════════════╝', 'blue');

  // Verify schemas
  const contentTypeResults = verifyContentTypes();
  const componentResults = verifyComponents();

  // Test API if requested
  let apiResults = [];
  if (testApi) {
    try {
      apiResults = await testApiEndpoints();
    } catch (error) {
      log(`\n✗ API test failed: ${error.message}`, 'red');
    }
  } else {
    log('\n⚠ Skipping API tests (use --test-api to enable)', 'yellow');
  }

  // Generate report
  const { schemasValid, apiWorking } = generateReport(contentTypeResults, componentResults, apiResults);

  // Next steps
  if (schemasValid && !testApi) {
    log('\n╔═══════════════════════════════════════════════════════════════╗', 'cyan');
    log('║                         NEXT STEPS                            ║', 'cyan');
    log('╚═══════════════════════════════════════════════════════════════╝\n', 'cyan');

    log('1. Restart Strapi server:', 'yellow');
    log('   docker restart use-nerd-strapi', 'green');

    log('\n2. Test API endpoints:', 'yellow');
    log('   node scripts/verify-setup.js --test-api', 'green');

    log('\n3. Configure permissions:', 'yellow');
    log('   http://localhost:1337/admin/settings/users-permissions/roles', 'green');
  } else if (schemasValid && apiResults.some(r => r.status === 'forbidden')) {
    log('\n╔═══════════════════════════════════════════════════════════════╗', 'cyan');
    log('║                    PERMISSION SETUP NEEDED                    ║', 'cyan');
    log('╚═══════════════════════════════════════════════════════════════╝\n', 'cyan');

    log('Configure API permissions in Strapi Admin:', 'yellow');
    log('1. Open: http://localhost:1337/admin', 'green');
    log('2. Go to: Settings → Users & Permissions → Roles → Public', 'green');
    log('3. Enable: find and findOne for all content types', 'green');
    log('4. Click: Save', 'green');
    log('\n5. Re-run verification:', 'yellow');
    log('   node scripts/verify-setup.js --test-api', 'green');
  } else if (schemasValid && apiResults.some(r => r.status === 'error')) {
    log('\n╔═══════════════════════════════════════════════════════════════╗', 'cyan');
    log('║                    STRAPI NOT RUNNING                         ║', 'cyan');
    log('╚═══════════════════════════════════════════════════════════════╝\n', 'cyan');

    log('Start Strapi server:', 'yellow');
    log('   docker start use-nerd-strapi', 'green');
    log('   # or', 'reset');
    log('   npm run develop', 'green');
  }

  log('\n');

  // Exit code
  process.exit(schemasValid ? 0 : 1);
}

// Execute
main().catch(error => {
  log(`\nFatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
