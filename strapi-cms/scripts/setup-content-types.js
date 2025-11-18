#!/usr/bin/env node

/**
 * Strapi Content Types and Components Automated Setup Script
 *
 * This script automatically generates all required Content Types and Components
 * for the USE Nerd e-commerce platform using Strapi's file-based schema method.
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

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// ============================================================================
// CONTENT TYPE SCHEMAS
// ============================================================================

const contentTypeSchemas = {
  'hero-section': {
    kind: 'singleType',
    collectionName: 'hero_section',
    info: {
      singularName: 'hero-section',
      pluralName: 'hero-sections',
      displayName: 'Hero Section',
      description: 'Homepage hero banner configuration'
    },
    options: {
      draftAndPublish: false
    },
    pluginOptions: {
      i18n: {
        localized: true
      }
    },
    attributes: {
      title: {
        type: 'string',
        required: true,
        maxLength: 100,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      subtitle: {
        type: 'text',
        required: false,
        maxLength: 250,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      backgroundImage: {
        type: 'media',
        multiple: false,
        required: true,
        allowedTypes: ['images']
      },
      ctaButtonText: {
        type: 'string',
        required: false,
        maxLength: 50,
        default: 'Explorar Rifas',
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      ctaButtonLink: {
        type: 'string',
        required: false,
        default: '/rifas'
      },
      isActive: {
        type: 'boolean',
        default: true,
        required: true
      }
    }
  },

  'banner': {
    kind: 'collectionType',
    collectionName: 'banners',
    info: {
      singularName: 'banner',
      pluralName: 'banners',
      displayName: 'Banner',
      description: 'Promotional banners and marketing campaigns'
    },
    options: {
      draftAndPublish: true
    },
    pluginOptions: {
      i18n: {
        localized: true
      }
    },
    attributes: {
      title: {
        type: 'string',
        required: true,
        maxLength: 100,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      description: {
        type: 'text',
        required: false,
        maxLength: 500,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      image: {
        type: 'media',
        multiple: false,
        required: true,
        allowedTypes: ['images']
      },
      link: {
        type: 'string',
        required: false
      },
      buttonText: {
        type: 'string',
        required: false,
        maxLength: 50,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      placement: {
        type: 'enumeration',
        enum: ['homepage', 'category', 'product', 'raffle', 'global'],
        default: 'homepage',
        required: true
      },
      priority: {
        type: 'integer',
        default: 0,
        required: true
      },
      startDate: {
        type: 'datetime',
        required: false
      },
      endDate: {
        type: 'datetime',
        required: false
      },
      isActive: {
        type: 'boolean',
        default: true,
        required: true
      }
    }
  },

  'page': {
    kind: 'collectionType',
    collectionName: 'pages',
    info: {
      singularName: 'page',
      pluralName: 'pages',
      displayName: 'Page',
      description: 'Custom static pages (About, Terms, Privacy, etc.)'
    },
    options: {
      draftAndPublish: true
    },
    pluginOptions: {
      i18n: {
        localized: true
      }
    },
    attributes: {
      title: {
        type: 'string',
        required: true,
        maxLength: 200,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      slug: {
        type: 'uid',
        targetField: 'title',
        required: true
      },
      content: {
        type: 'richtext',
        required: true,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      excerpt: {
        type: 'text',
        required: false,
        maxLength: 300,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      coverImage: {
        type: 'media',
        multiple: false,
        required: false,
        allowedTypes: ['images']
      },
      seo: {
        type: 'component',
        repeatable: false,
        component: 'shared.seo'
      },
      isPublic: {
        type: 'boolean',
        default: true,
        required: true
      }
    }
  },

  'nerd-premiado': {
    kind: 'singleType',
    collectionName: 'nerd_premiado',
    info: {
      singularName: 'nerd-premiado',
      pluralName: 'nerd-premiados',
      displayName: 'Nerd Premiado',
      description: 'Special raffle campaign page configuration'
    },
    options: {
      draftAndPublish: true
    },
    pluginOptions: {
      i18n: {
        localized: true
      }
    },
    attributes: {
      title: {
        type: 'string',
        required: true,
        maxLength: 100,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      description: {
        type: 'richtext',
        required: true,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      heroImage: {
        type: 'media',
        multiple: false,
        required: true,
        allowedTypes: ['images']
      },
      prizeDescription: {
        type: 'text',
        required: true,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      prizeValue: {
        type: 'decimal',
        required: false
      },
      ticketPrice: {
        type: 'decimal',
        required: true
      },
      totalTickets: {
        type: 'integer',
        required: true
      },
      drawDate: {
        type: 'datetime',
        required: true
      },
      rules: {
        type: 'richtext',
        required: true,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      winnerAnnouncement: {
        type: 'component',
        repeatable: false,
        component: 'raffle.winner-announcement'
      },
      seo: {
        type: 'component',
        repeatable: false,
        component: 'shared.seo'
      },
      isActive: {
        type: 'boolean',
        default: true,
        required: true
      }
    }
  },

  'featured-product': {
    kind: 'collectionType',
    collectionName: 'featured_products',
    info: {
      singularName: 'featured-product',
      pluralName: 'featured-products',
      displayName: 'Featured Product',
      description: 'Curated product highlights for homepage and campaigns'
    },
    options: {
      draftAndPublish: true
    },
    attributes: {
      productId: {
        type: 'string',
        required: true,
        unique: true
      },
      priority: {
        type: 'integer',
        default: 0,
        required: true
      },
      placement: {
        type: 'enumeration',
        enum: ['homepage-hero', 'homepage-grid', 'category-featured', 'new-arrivals', 'best-sellers'],
        default: 'homepage-grid',
        required: true
      },
      customTitle: {
        type: 'string',
        required: false,
        maxLength: 100,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      customDescription: {
        type: 'text',
        required: false,
        maxLength: 300,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      badge: {
        type: 'enumeration',
        enum: ['new', 'hot', 'sale', 'limited', 'exclusive'],
        required: false
      },
      startDate: {
        type: 'datetime',
        required: false
      },
      endDate: {
        type: 'datetime',
        required: false
      },
      isActive: {
        type: 'boolean',
        default: true,
        required: true
      }
    }
  },

  'site-setting': {
    kind: 'singleType',
    collectionName: 'site_settings',
    info: {
      singularName: 'site-setting',
      pluralName: 'site-settings',
      displayName: 'Site Settings',
      description: 'Global site configuration and branding'
    },
    options: {
      draftAndPublish: false
    },
    pluginOptions: {
      i18n: {
        localized: true
      }
    },
    attributes: {
      siteName: {
        type: 'string',
        required: true,
        default: 'USE Nerd',
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      siteDescription: {
        type: 'text',
        required: true,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      logo: {
        type: 'media',
        multiple: false,
        required: true,
        allowedTypes: ['images']
      },
      favicon: {
        type: 'media',
        multiple: false,
        required: false,
        allowedTypes: ['images']
      },
      contactEmail: {
        type: 'email',
        required: true
      },
      contactPhone: {
        type: 'string',
        required: false
      },
      socialLinks: {
        type: 'component',
        repeatable: true,
        component: 'shared.social-link'
      },
      footerText: {
        type: 'richtext',
        required: false,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      maintenanceMode: {
        type: 'boolean',
        default: false,
        required: true
      },
      maintenanceMessage: {
        type: 'text',
        required: false,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      defaultSeo: {
        type: 'component',
        repeatable: false,
        component: 'shared.seo'
      }
    }
  },

  'blog-post': {
    kind: 'collectionType',
    collectionName: 'blog_posts',
    info: {
      singularName: 'blog-post',
      pluralName: 'blog-posts',
      displayName: 'Blog Post',
      description: 'Blog articles, news, and content marketing'
    },
    options: {
      draftAndPublish: true
    },
    pluginOptions: {
      i18n: {
        localized: true
      }
    },
    attributes: {
      title: {
        type: 'string',
        required: true,
        maxLength: 200,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      slug: {
        type: 'uid',
        targetField: 'title',
        required: true
      },
      excerpt: {
        type: 'text',
        required: true,
        maxLength: 300,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      content: {
        type: 'richtext',
        required: true,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      coverImage: {
        type: 'media',
        multiple: false,
        required: true,
        allowedTypes: ['images']
      },
      author: {
        type: 'string',
        required: true
      },
      category: {
        type: 'enumeration',
        enum: ['news', 'tutorial', 'raffle-results', 'product-showcase', 'community'],
        default: 'news',
        required: true
      },
      tags: {
        type: 'json',
        required: false
      },
      publishedDate: {
        type: 'datetime',
        required: false
      },
      featured: {
        type: 'boolean',
        default: false,
        required: true
      },
      viewCount: {
        type: 'integer',
        default: 0,
        required: true
      },
      seo: {
        type: 'component',
        repeatable: false,
        component: 'shared.seo'
      }
    }
  }
};

// ============================================================================
// COMPONENT SCHEMAS
// ============================================================================

const componentSchemas = {
  'shared': {
    'seo': {
      collectionName: 'components_shared_seos',
      info: {
        displayName: 'SEO',
        description: 'SEO metadata component for pages and content',
        icon: 'search'
      },
      options: {},
      attributes: {
        metaTitle: {
          type: 'string',
          required: true,
          maxLength: 60
        },
        metaDescription: {
          type: 'text',
          required: true,
          maxLength: 160
        },
        keywords: {
          type: 'text',
          required: false
        },
        metaImage: {
          type: 'media',
          multiple: false,
          required: false,
          allowedTypes: ['images']
        },
        metaRobots: {
          type: 'string',
          required: false,
          default: 'index, follow'
        },
        canonicalURL: {
          type: 'string',
          required: false
        },
        structuredData: {
          type: 'json',
          required: false
        }
      }
    },
    'social-link': {
      collectionName: 'components_shared_social_links',
      info: {
        displayName: 'Social Link',
        description: 'Social media link configuration',
        icon: 'share'
      },
      options: {},
      attributes: {
        platform: {
          type: 'enumeration',
          enum: ['facebook', 'instagram', 'twitter', 'youtube', 'tiktok', 'discord', 'telegram', 'whatsapp'],
          required: true
        },
        url: {
          type: 'string',
          required: true
        },
        label: {
          type: 'string',
          required: false,
          maxLength: 50
        },
        isActive: {
          type: 'boolean',
          default: true,
          required: true
        }
      }
    }
  },
  'raffle': {
    'winner-announcement': {
      collectionName: 'components_raffle_winner_announcements',
      info: {
        displayName: 'Winner Announcement',
        description: 'Raffle winner announcement component',
        icon: 'trophy'
      },
      options: {},
      attributes: {
        winnerName: {
          type: 'string',
          required: true,
          maxLength: 100
        },
        winnerPhoto: {
          type: 'media',
          multiple: false,
          required: false,
          allowedTypes: ['images']
        },
        announcementDate: {
          type: 'datetime',
          required: true
        },
        message: {
          type: 'richtext',
          required: false
        },
        blockchainTxHash: {
          type: 'string',
          required: false
        },
        ticketNumber: {
          type: 'string',
          required: true
        },
        isVerified: {
          type: 'boolean',
          default: false,
          required: true
        }
      }
    }
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Log a message with color formatting
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Create a directory recursively if it doesn't exist
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
}

/**
 * Write JSON file with pretty formatting
 */
function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Check if a file already exists
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// ============================================================================
// CONTENT TYPE GENERATION
// ============================================================================

/**
 * Generate a single content type
 */
function generateContentType(name, schema) {
  try {
    const contentTypePath = path.join(API_DIR, name, 'content-types', name);
    const schemaPath = path.join(contentTypePath, 'schema.json');

    // Check if already exists
    if (fileExists(schemaPath)) {
      log(`  ⚠ Content type '${name}' already exists, skipping...`, 'yellow');
      return { name, status: 'skipped', path: schemaPath };
    }

    // Create directories
    const created = ensureDir(contentTypePath);

    // Write schema file
    writeJsonFile(schemaPath, schema);

    log(`  ✓ Created content type: ${name}`, 'green');
    return { name, status: 'created', path: schemaPath, dirCreated: created };
  } catch (error) {
    log(`  ✗ Error creating content type '${name}': ${error.message}`, 'red');
    return { name, status: 'error', error: error.message };
  }
}

/**
 * Generate all content types
 */
function generateAllContentTypes() {
  log('\n=== Generating Content Types ===\n', 'cyan');

  const results = [];

  for (const [name, schema] of Object.entries(contentTypeSchemas)) {
    const result = generateContentType(name, schema);
    results.push(result);
  }

  return results;
}

// ============================================================================
// COMPONENT GENERATION
// ============================================================================

/**
 * Generate a single component
 */
function generateComponent(category, name, schema) {
  try {
    const componentPath = path.join(COMPONENTS_DIR, category);
    const schemaPath = path.join(componentPath, `${name}.json`);

    // Check if already exists
    if (fileExists(schemaPath)) {
      log(`  ⚠ Component '${category}.${name}' already exists, skipping...`, 'yellow');
      return { category, name, status: 'skipped', path: schemaPath };
    }

    // Create directory
    const created = ensureDir(componentPath);

    // Write component file
    writeJsonFile(schemaPath, schema);

    log(`  ✓ Created component: ${category}.${name}`, 'green');
    return { category, name, status: 'created', path: schemaPath, dirCreated: created };
  } catch (error) {
    log(`  ✗ Error creating component '${category}.${name}': ${error.message}`, 'red');
    return { category, name, status: 'error', error: error.message };
  }
}

/**
 * Generate all components
 */
function generateAllComponents() {
  log('\n=== Generating Components ===\n', 'cyan');

  const results = [];

  for (const [category, components] of Object.entries(componentSchemas)) {
    for (const [name, schema] of Object.entries(components)) {
      const result = generateComponent(category, name, schema);
      results.push(result);
    }
  }

  return results;
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

/**
 * Generate and display summary report
 */
function generateReport(contentTypeResults, componentResults) {
  log('\n╔═══════════════════════════════════════════════════════════════╗', 'blue');
  log('║              STRAPI SETUP COMPLETION REPORT                   ║', 'blue');
  log('╚═══════════════════════════════════════════════════════════════╝\n', 'blue');

  // Content Types Summary
  log('Content Types:', 'cyan');
  const ctCreated = contentTypeResults.filter(r => r.status === 'created').length;
  const ctSkipped = contentTypeResults.filter(r => r.status === 'skipped').length;
  const ctErrors = contentTypeResults.filter(r => r.status === 'error').length;

  log(`  ✓ Created: ${ctCreated}`, 'green');
  log(`  ⊘ Skipped: ${ctSkipped}`, 'yellow');
  log(`  ✗ Errors:  ${ctErrors}`, ctErrors > 0 ? 'red' : 'green');

  // Components Summary
  log('\nComponents:', 'cyan');
  const compCreated = componentResults.filter(r => r.status === 'created').length;
  const compSkipped = componentResults.filter(r => r.status === 'skipped').length;
  const compErrors = componentResults.filter(r => r.status === 'error').length;

  log(`  ✓ Created: ${compCreated}`, 'green');
  log(`  ⊘ Skipped: ${compSkipped}`, 'yellow');
  log(`  ✗ Errors:  ${compErrors}`, compErrors > 0 ? 'red' : 'green');

  // List created items
  if (ctCreated > 0) {
    log('\nCreated Content Types:', 'magenta');
    contentTypeResults
      .filter(r => r.status === 'created')
      .forEach(r => log(`  • ${r.name}`, 'reset'));
  }

  if (compCreated > 0) {
    log('\nCreated Components:', 'magenta');
    componentResults
      .filter(r => r.status === 'created')
      .forEach(r => log(`  • ${r.category}.${r.name}`, 'reset'));
  }

  // List errors if any
  const allErrors = [...contentTypeResults, ...componentResults].filter(r => r.status === 'error');
  if (allErrors.length > 0) {
    log('\nErrors encountered:', 'red');
    allErrors.forEach(r => {
      const identifier = r.category ? `${r.category}.${r.name}` : r.name;
      log(`  ✗ ${identifier}: ${r.error}`, 'red');
    });
  }

  return {
    contentTypes: { created: ctCreated, skipped: ctSkipped, errors: ctErrors },
    components: { created: compCreated, skipped: compSkipped, errors: compErrors },
    totalErrors: ctErrors + compErrors
  };
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

/**
 * Main script execution
 */
function main() {
  log('\n╔═══════════════════════════════════════════════════════════════╗', 'blue');
  log('║   STRAPI CONTENT TYPES & COMPONENTS AUTOMATED SETUP           ║', 'blue');
  log('║   USE Nerd E-commerce Platform                                ║', 'blue');
  log('╚═══════════════════════════════════════════════════════════════╝\n', 'blue');

  log(`Strapi Root: ${STRAPI_ROOT}`, 'cyan');
  log(`Source Directory: ${SRC_DIR}`, 'cyan');

  // Ensure base directories exist
  log('\nEnsuring base directories exist...', 'yellow');
  ensureDir(API_DIR);
  ensureDir(COMPONENTS_DIR);
  log('✓ Base directories ready', 'green');

  // Generate all content types
  const contentTypeResults = generateAllContentTypes();

  // Generate all components
  const componentResults = generateAllComponents();

  // Generate report
  const summary = generateReport(contentTypeResults, componentResults);

  // Next steps instructions
  log('\n╔═══════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                         NEXT STEPS                            ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════════╝\n', 'cyan');

  if (summary.totalErrors === 0) {
    log('1. Restart Strapi server:', 'yellow');
    log('   • If using Docker:', 'reset');
    log('     docker restart use-nerd-strapi', 'green');
    log('   • If running locally:', 'reset');
    log('     npm run develop', 'green');

    log('\n2. Verify in Strapi Admin:', 'yellow');
    log('   • Open: http://localhost:1337/admin', 'reset');
    log('   • Navigate to Content-Type Builder', 'reset');
    log('   • Verify all content types and components are visible', 'reset');

    log('\n3. Configure API Permissions:', 'yellow');
    log('   • Settings → Users & Permissions Plugin → Roles', 'reset');
    log('   • Set permissions for Public and Authenticated roles', 'reset');

    log('\n4. Test API Endpoints:', 'yellow');
    log('   curl http://localhost:1337/api/hero-section', 'green');
    log('   curl http://localhost:1337/api/banners', 'green');
    log('   curl http://localhost:1337/api/pages', 'green');

    log('\n✓ Setup completed successfully!', 'green');
  } else {
    log('⚠ Setup completed with errors. Please review the error messages above.', 'red');
    log('\nCommon issues:', 'yellow');
    log('  • Check file permissions', 'reset');
    log('  • Ensure Strapi is not running during setup', 'reset');
    log('  • Verify directory structure matches Strapi v4 conventions', 'reset');
  }

  log('\n');
}

// ============================================================================
// EXECUTE SCRIPT
// ============================================================================

// Verify we're in the correct directory
if (!fs.existsSync(path.join(STRAPI_ROOT, 'package.json'))) {
  log('Error: This script must be run from the strapi-cms/scripts directory', 'red');
  log(`Current path: ${STRAPI_ROOT}`, 'yellow');
  log('Please navigate to the correct directory and try again.', 'yellow');
  process.exit(1);
}

// Run the main function
main();
