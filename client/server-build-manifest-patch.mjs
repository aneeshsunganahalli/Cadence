import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// In ES modules, __dirname is not directly available
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the build manifest file
const manifestPath = join(__dirname, '.next', 'server', 'app-paths-manifest.json');

// Check if the file exists
if (existsSync(manifestPath)) {
  try {
    // Read the manifest
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    
    // Filter out any paths that include (auth)
    const filteredManifest = Object.fromEntries(
      Object.entries(manifest).filter(([key]) => !key.includes('(auth)'))
    );
    
    // Write back the filtered manifest
    writeFileSync(manifestPath, JSON.stringify(filteredManifest, null, 2));
    console.log('Successfully patched app-paths-manifest.json');
  } catch (error) {
    console.error('Error patching manifest:', error);
  }
}