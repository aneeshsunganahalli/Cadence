import { existsSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// In ES modules, __dirname is not directly available
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the .next directory
const nextDir = join(__dirname, '.next');
const serverDir = join(nextDir, 'server');

// Files to check and patch
const filesToPatch = [
  'app-paths-manifest.json',
  'middleware-manifest.json',
  'pages-manifest.json'
];

// Check if the server directory exists
if (existsSync(serverDir)) {
  // Find all client-reference-manifest.js files that might reference auth
  try {
    const serverFiles = readdirSync(serverDir, { recursive: true });
    const authManifestFiles = serverFiles.filter(file => 
      typeof file === 'string' && 
      file.includes('(auth)') && 
      file.endsWith('client-reference-manifest.js')
    );
    
    // For each reference manifest file that contains (auth), create an empty version
    for (const file of authManifestFiles) {
      const fullPath = join(serverDir, file);
      writeFileSync(fullPath, 'export default {}');
      console.log(`Created empty manifest for: ${file}`);
    }
  } catch (err) {
    console.error('Error handling client reference manifests:', err);
  }
  
  // Process each manifest file
  for (const file of filesToPatch) {
    const manifestPath = join(serverDir, file);
    
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
        console.log(`Successfully patched ${file}`);
      } catch (error) {
        console.error(`Error patching ${file}:`, error);
      }
    }
  }
}

console.log('Manifest patching completed');

// Create empty files instead of trying to process them
const authRoutes = ['/dashboard', '/transactions', '/statistics'];

// Create empty HTML files for auth routes
authRoutes.forEach(route => {
  const routePath = join(__dirname, 'out', route);
  const indexHtml = join(routePath, 'index.html');
  
  try {
    // Create directory if it doesn't exist
    import('fs').then(fs => {
      if (!fs.existsSync(routePath)) {
        fs.mkdirSync(routePath, { recursive: true });
      }
      
      // Create a minimal HTML file that redirects to sign-in
      const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Redirecting...</title>
          <script>
            window.location.href = '/sign-in?redirect=${route}';
          </script>
        </head>
        <body>
          <p>Redirecting to sign in...</p>
        </body>
      </html>`;
      
      fs.writeFileSync(indexHtml, htmlContent);
      console.log(`Created redirect for ${route}`);
    });
  } catch (error) {
    console.error(`Error creating redirect for ${route}:`, error);
  }
});

console.log('Static build patching completed');