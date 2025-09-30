// Minimal ambient module to make `import('fullpage.js')` type-safe
declare module 'fullpage.js' {
  const FullPage: any
  export default FullPage
}
