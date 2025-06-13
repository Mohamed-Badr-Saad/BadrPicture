/***
 * we used vite for the project because it is fast and easy to use and has a good dev experience 
 * vite: 
        * a build tool that focuses on speed and performance. 
        * It uses native ES modules in the browser to provide a fast development experience, 
        * and it uses Rollup for production builds to optimize the final output.
 * ************************************************************************************************ 
 * to install tailwind css:
        * npm install -D tailwindcss postcss autoprefixer
        * npx tailwindcss init -p
 * ************************************************************************************************
 * file structure:
 * assets folder should be in public folder
 * src folder contains:
       * main.tsx ==> entry point of the app
       * App.tsx ==> primary router component
       * _auth folder ==> contains all auth(private) components, contains AuthLayout.tsx, Forms folder for signup and signin 
       * _root folder ==> contains all public components,contains pages folder (ex.Home), and RootLayout.tsx
       * validation folder in lib folder ==> contains all zod validation schemas
       * components folder ==> contains all reusable components
       * shared folder inside components folder ==> contains all shared components
       * appwrite folder inside lib folder ==> contains all appwrite functions      
       * config.ts inside appwrite folder ==> contains the appwrite client configuration
       * api.ts inside appwrite folder ==> contains the appwrite functions
       * we should create .env.local file to store the appwrite endpoint and project id in order to use them in the appwrite functions without public access
       * we should create vite-env.d.ts file in src folder to define the types of the environment variables we are using in the appwrite functions
       * create a folder called types in src folder to store all types used in the app
       * create react-query folder in src folder to store all react-query functions
       * create constants folder in src folder to store all constants used in the app
       * create forms folder in components folder to store all forms used in the app
       * 
       * 
 * 
 * 
 * ************************************************************************************************
 * TO create react arrow function component using shortcut : rafce 
 * to manage react routes we used react-router-dom ==> npm install react-router-dom
 * *************************************************************************************************
 * we use Shadcn library for the UI components, 
 * in Shadcn , not all components are installed by default, instead, we need to install the components we need 
 * Shadcn uses React Hook Form to build forms , and Zod to validate forms
 * take care that shadcn overwrite global.css and tailwind.config.js files
 * ************************************************************************************************
 * we created bucket in appwrite where we would store client's images, posts, etc..
 * we should create database in appwrite to store the data of the app
 * after creating database we should create collections to store the data, then we should add attributes to the collections, then we should create indexes to the collections 
 * *************************************************************************************************
 * we want to sign the user into a session ==> using appwrite signIn function
 * after creating a session, we should store it in a react context
 * 
 * *************************************************************************************************
 * react query(tanstack) offers caching, infinite scrolls
 * 
 * 
 * 
 * 
 * 
 * 
 *************************************************************************************************




 
 */
