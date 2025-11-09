import { Config } from '@tanstack/router-cli'

const config: Config = {
  routesDirectory: './src/routes',
  generatedRouteTree: './src/routeTree.gen.ts',
  quoteStyle: 'single',
  semicolons: false,
  disableLogging: true,
  disableManifestGeneration: true,
}

export default config