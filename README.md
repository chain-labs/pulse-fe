# To run the development server

```
npm run dev

pnpm run dev

yarn dev

bun run dev
```

# Folder structure

https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md

```
src
|
+-- app               # application layer containing:
|   |                 # this folder might differ based on the meta framework used
|   +-- routes        # application routes / can also be pages
|   +-- app.tsx       # main application component
|   +-- provider.tsx  # application provider that wraps the entire application with different global providers - this might also differ based on meta framework used
|   +-- router.tsx    # application router configuration
+-- assets            # assets folder can contain all the static files such as images, fonts, etc.
|
+-- components        # shared components used across the entire application
|
+-- config            # global configurations, exported env variables etc.
|
+-- features          # feature based modules
|
+-- hooks             # shared hooks used across the entire application
|
+-- lib               # reusable libraries preconfigured for the application
|
+-- stores            # global state stores
|
+-- test              # test utilities and mocks
|
+-- types             # shared types used across the application
|
+-- utils             # shared utility functions
```

# Prettier 

trivago configuration -  https://github.com/trivago/prettier-plugin-sort-imports

tailwindcss configuration - https://tailwindcss.com/blog/automatic-class-sorting-with-prettier

# File naming convention

only KEBAB_CASE - https://github.com/alan2207/bulletproof-react/blob/master/docs/project-standards.md#file-naming-conventions


# Typed routes

https://nextjs.org/docs/app/api-reference/next-config-js/typedRoutes

# Libraries

react icons - https://react-icons.github.io/react-icons/

framer motion - https://www.framer.com/motion/

zod - https://zod.dev/

zustand - https://zustand.docs.pmnd.rs/getting-started/introduction

