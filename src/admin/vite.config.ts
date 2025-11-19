/**
 * Vite configuration for Medusa Admin
 *
 * Note: Using plain object export instead of defineConfig due to type resolution issues
 * in Medusa v2.0's bundled Vite version.
 */
export default {
  server: {
    port: 9000,
    strictPort: false,
    hmr: {
      protocol: 'ws' as const,
      host: 'localhost',
      port: 9000,
      clientPort: 9000
    }
  }
}
