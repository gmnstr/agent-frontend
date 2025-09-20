import { installNodeFilterShim } from './src/polyfills/nodeFilter'

export default async () => {
  installNodeFilterShim()
}
