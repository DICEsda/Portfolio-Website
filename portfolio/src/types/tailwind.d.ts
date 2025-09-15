// tailwind.d.ts
import 'tailwindcss/tailwind.css'

declare module 'tailwindcss/tailwind.css' {
  export interface Theme {
    fontSize: {
      'fluid-sm': string
      'fluid-base': string
      'fluid-lg': string
      'fluid-xl': string
      'fluid-2xl': string
      'fluid-3xl': string
    }
  }
}
