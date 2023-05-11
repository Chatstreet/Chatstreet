# Chatstreet-Frontend
School project module - 347. Deployable chat application.

## Code - Guidelines

### Typescript
---
Instead of [JavaScript](https://www.javascript.com/) we use [TypeScript](https://www.typescriptlang.org/) in the frontend. For every object a type / interface needs to be defined. [VueJS](https://vuejs.org/) also supports [TypeScript](https://www.typescriptlang.org/) so make sure to use the generic Vue types / interfaces. 

### VueJS Composition API
---
[VueJS](https://vuejs.org/) should be used with the composition api. It is the modern way to create components and standarts sould be used.

### VueJS Components
---
Components are structured in the Atom - Molecule - Organsim - Template way. Pages are defined as views. 
Every view should use a template and inject the code. 

### Vuex
---
SSOT (Single State Of Truth) is implemented with [vuex](https://vuex.vuejs.org/). We differentiate between anonymous state and user state making use of modules. 

### REST API (Backend)
---
For REST requests we make use of the [axios](https://axios-http.com/) library. There are two [axios](https://axios-http.com/) instances available (post / get). Requests can only be triggered in store actions. 

### Styling Class Conventions
---
For styling classes we make use of the [BEM](https://getbem.com/naming/) naming convention. Make sure to read through the documentation if you have never used [BEM](https://getbem.com/naming/) before. We also make use uf the three elements rule. This means that [BEM](https://getbem.com/naming/) class names won't contain more than three elements. If the nesting inside of the html body is deeper than three elements we remove the first element of the class name.

The project uses a [SASS-Loader](https://sass-lang.com/) to compile stylesheets. Nested classes should only be used when the base elements of the component are not present in the class name anymore (due to the three elements rule). 

## Runing / Deploying the Application

### Run Frontend locally
---

There are two mandatory scripts to run the application:

_The following script runs a linter and cleans up your code_
```shell
npm run format
```

_The following script serves your application in dev mode_
```shell
npm run serve
```

Make sure you also have a backend instance running (and also database) locally or else the frontend wont be able to function correctily.

### Run Frontend with Docker

To build the frontend you can use the following command:
```shell
docker build -t chatstreet-frontend:latest .
```

Once the image has been created you can start it with:
```shell
docker run -d -p 8080:80 chatstreet-frontend:latest
```

<div style="border-top: 1px solid grey; display: flex; justify-content: space-between; align-items: center;">
	<p>Last Update:</p>
	<p>11.05.2023</p>
</div>