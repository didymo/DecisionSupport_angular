# Known Security Vulnerabilities

## Angular 18 Constraints
This project must remain on Angular 18. The following vulnerabilities require Angular 20+ to fix:

### Development Dependencies Only
- **esbuild** (moderate): Dev server vulnerability - mitigated by only running dev server on localhost
- **tmp** (low): CLI tooling issue - minimal risk in practice

These will be resolved when upgrading to Angular 20+ in the future.

Last updated: $(date)
