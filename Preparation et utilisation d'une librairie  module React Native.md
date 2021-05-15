# Preparation et utilisation d'une librairie / module React Native

## Le tutoriel suivi

[https://javascript.plainenglish.io/want-to-publish-your-first-react-native-npm-package-these-are-the-exact-steps-64f965271cf8]: 	"Want To Publish Your First React Native npm Package? These Are the Exact Steps"



> Creating your own package is a great way to showcase your work, they say. Giving back to the community improves your chances on the job market, they say. Designing an idea and releasing a product that others can use helps you become a better developer, they say. Yet, publishing your first React Native npm package can be somewhat of a daunting task.
>
> This week, after numerous hours of trial and error, I finally managed to publish my first npm package. And looking back at the process now, it is actually quite simple to do.
>
> ![img](https://miro.medium.com/freeze/max/28/1*RqYkSRby8ur6CtdGVjxACQ.gif?q=20)
>
> ![img](https://miro.medium.com/max/231/1*RqYkSRby8ur6CtdGVjxACQ.gif)
>
> My package imported in an example project
>
> The package I published provides a single custom component that renders an enhanced SectionList with a bunch of options to customise its look & feel. The package, **which works for both Expo as well as React Native Cli projects**, can be found [here](https://github.com/hongkouHenk/react-native-expo-interactive-section-list). But I get it, you’re here for the how-to. So let’s get to it!
>
> **React Native Resources:** Are you a React Native developer and always on the lookout for resources to build better apps? Then perhaps I can interest you to [Signup for my newsletter](https://knowlephant.com/).
>
> # Build your resource
>
> To build something that others can use starts with creating something that you have used yourself inside your own project. Therefore, the starting point to building your npm package is any regular project that makes use of your candidate component, function or resource as a regular import.
>
> ```
> import SelectableSectionList from ‘../src/SelectableSectionList’;
> ```
>
> Now let’s assume that your candidate resource is complete, user-friendly and ready for publishing. The next step is be to setup a new project that will become your npm package.
>
> # Prepare your library
>
> Your package starts with a new folder that has your package name. Inside this folder, copy over the package project files from your working project. Make sure to only copy over the minimal required files and folders.
>
> ![img](https://miro.medium.com/max/60/1*c0l3j9mH_Bjr5Q2HrHzcgQ.png?q=20)
>
> ![img](https://miro.medium.com/max/504/1*c0l3j9mH_Bjr5Q2HrHzcgQ.png)
>
> Your new project should at least contain:
>
> - A *src* folder that at the bare minimum contains an index file from which your package’s resources are exported:
>
> ```
> export { default as SelectableSectionList } from ‘./SelectableSectionList’;
> ```
>
> - A *package.json* file, stripped from all dependencies that are not used in your package. Here, it’s important to realise that:
>
> ***dependencies\*** *include modules that are installed automatically when users run npm install on your package.*
>
> ***devDependencies\*** *include modules that are not installed when users run npm install on your package, unless they assign the — dev option to the install command.*
>
> ***peerDependencies\*** *include modules that must be installed manually by your package users. When running, if the dependency is missing, they get an error.*
>
> Also, inside your *package.json*, make sure to add the necessary ‘name’, ‘version’, ‘description’, ‘author’, ‘license’ and other required information. Without it, your package may get rejected.
>
> ![img](https://miro.medium.com/max/60/1*VNmcwB5uOoB3-n4Q7VxiGg.png?q=20)
>
> ![img](https://miro.medium.com/max/1198/1*VNmcwB5uOoB3-n4Q7VxiGg.png)
>
> Don’t worry about the ‘files’ and ‘scripts’ fields for now
>
> - A project’s ***tsconfig.json\*** file, if your package is written with TypeScript.
> - A ***.gitignore\*** file.
> - A ***README.md\*** file with package info and use instructions.
> - And optionally, the ESLint and prettier config files if applied to your setup.
>
> Once done copy-pasting your files and making the necessary modifications, open your command-prompt tool and run the install command:
>
> ```
> $ cd <your-package-folder> $ yarn install
> ```
>
> # Build a package module with bob
>
> This step took by far the most time to understand.
>
> Your library will be useless unless it gets compiled into a React Native library. Also, your library’s access point will be different as you are no longer building your project with Expo (if that was the case…). Moreover, if your project is written with TypeScript, it would be nice to have access to your package from TypeScript and JavaScript projects alike.
>
> To set this up manually would be a bit much to ask from us mere mortals, but after some searching, I found help [here](https://github.com/react-native-community/bob) and [here](https://github.com/brodybits/create-react-native-module). I noticed some of the other packages I use contained references to bob, so I decided bob would be a good option to get me through this step.
>
> What’s nice about bob is that it offers tools to create new projects from scratch and to configure an existing project like ours:
>
> **Step 1**: install bob as *devDependency*
>
> ```
> yarn add --dev @react-native-community/bob
> ```
>
> **Step 2**: configure bob
>
> At the bottom of your *package.json* add the following:
>
> ```
> “@react-native-community/bob”: {  “source”: “src”, // your project files's main folder  “output”: “dist”, // your chose output folder  “targets”: [“module”, “typescript”] // typescript is optional}
> ```
>
> *Note: if yours is not a TypeScript project, you can emit “typescript” from your “targets” field.*
>
> **Step 3:** add the “bob build” script to your *package.json*:
>
> ```
> “scripts”: {  “prepare”: “bob build”}
> ```
>
> **Step 4:** configure entry points inside your *package.json*
>
> ```
> //... other fields“main”: “dist/module/index.js”,“module”: “dist/module/index.js”,“react-native”: “src/index.ts”,“types”: “dist/typescript/src/index.d.ts”,“files”: [  “dist/”,  “src/”]
> ```
>
> *Note: if yours is not a TypeScript project, you can emit the “types” field. If yours is a TypeScript project, emitting the “types” field will result in warning messages.*
>
> **Step 5:** update *.gitignore*
>
> ```
> # generated files by bob
> lib/
> ```
>
> **Step 6:** build
>
> In the project folder inside your command-line tool, run:
>
> ```
> $ yarn run prepare
> ```
>
> # Test your library
>
> Your library is now ready for use, meaning it can be installed inside a project as if it were already an npm package. However, before we create an npm account and upload the package to the repository, let’s run it locally in an example project to make sure everything works as intended.
>
> For this, we’re going to package our module into a *.tgz* file and install it as such in our example project.
>
> Inside your package folder, run the following command in your command-line tool:
>
> ```
> $ npm pack
> ```
>
> Next, leave your package folder, cd into your example project folder and run the install command:
>
> ```
> $ yarn install </package_location/package_name.tgz>
> ```
>
> *Note: the package location points to the location of your .tgz file on your local machine.*
>
> You should now be able to…
>
> ```
> import Foo from ‘your-package-name’
> ```
>
> …and run your example project.
>
> # Publish your library
>
> Once your package is running successfully, it’s time to make it public.
>
> While not a must, most publishers decide to publish the source code of the package on Github. You probably know the drill, but to be concise, create a new repository on your Github account and push your project code with:
>
> ```
> git initgit add .git commit -m “Initial commit”git remote add origin https://github.com/<username>/<package_name>.gitgit push -u origin master
> ```
>
> Now you can add a reference to your github repo on your package’s npm detail page. This requires you to make a final change to your *package.json* file by adding:
>
> ```
> “repository”: “https://github.com/<username>/<packge_name>"
> ```
>
> ![img](https://miro.medium.com/max/52/1*xpx1URjyp5HNBv7bif5Y9A.jpeg?q=20)
>
> ![img](https://miro.medium.com/max/420/1*xpx1URjyp5HNBv7bif5Y9A.jpeg)
>
> You could also add your homepage in the same way…
>
> Next, it’s time to publish to npm. For this, a personal npm account is required. You can do this manually at [npmjs.com](https://www.npmjs.com/signup) or inside your command-line tool by running the following command and providing your details:
>
> ```
> $ npm adduser
> ```
>
> Make sure to confirm you email address, before running the publish command, or your deploy will fail. Once done, publish with:
>
> ```
> $ npm publish
> ```
>
> Your package is now live and ready to be installed from anywhere, with:
>
> ```
> $ npm install <project_name>or$ yarn install <project_name>
> ```
>
> # Conclusion
>
> Publishing a React Native package becomes incredibly easy by following the above series of steps. It took me a number of hours to publish my first npm React Native package, so I hope this article helps you save time and gets you motivated to publish your own npm packages. Make sure to put a link to it in the comments if you do!



## Retour après mise en place du tutoriel

Il faut utiliser yarn pour installer la dépendance (du moins en local), avec npm j'ai eu des problèmes, mon projet ne trouvait pas le module.



**Installation de la dépendance**

Apres modification dans la librairie sans changer le numéro de version, côté projet principal le module ne semble pas prendre les modifications effectuée, même après suppression de la dépendance. **Il faut appliquer la manipulation ci-dessous**. 

Si on ne monte pas la version de la lib, la supprimer des dépendances et faire :

```powershell
yarn upgrade  'PATH-LIB-PROJET\NOM-LIB-X.X.X.tgz'
```



**Faux problème de Hook**

Dans la librairie, à la suite des éléments contenus dans le package.json : 

```
"peerDependencies": {
    "react": "^16.11.0",
    "react-native": "^0.62.2"
}
```

Ceci permet de résoudre l'erreur :

> ```js
> Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
>     1. You might have mismatching versions of React and the renderer (such as React DOM)
>     2. You might be breaking the Rules of Hooks
>     3. You might have more than one copy of React in the same app
> ```

Dans notre cas, le problème était la version de react qui était en doublons.

En résumé, cela veut dire que notre lib va utiliser la version de react ajoutée dans le "peerDependencies" sans pour autant rentrer en conflit avec la version du projet qui l'importe.