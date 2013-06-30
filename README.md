# Xerography 

Having and maintaining a website for your github project should be as easy as writing your readme.  This is still a very early version.

## Why Xerography? 

When you open source a project, you want to have a website for it.  And you want to keep the website up to date.  Often times we allow our project websites to get out of date.  Xerography is fed by your

## What is Xerography?

Xerography is defined by Wikipedia as "is a dry photocopying technique invented by Chester Carlson in 1938, for which he was awarded U.S. Patent 2,297,691 on October 6, 1942. Carlson originally called his invention electrophotography. It was later renamed xerographyâ &mdash; from the Greek roots xeros "dry" and -graphia "writing" &mdash; to emphasize that, unlike reproduction techniques then in use such as cyanotype, this process used no liquid chemicals."

Xerography works similiarly, it is dry writing.  It doesn't require you to write anything special other then your xerography config (and that is only if you don't want to use the defaults)

## Themes

Themes are seperate node.js repositories.  By default, Xerography installs Xerography-Peppercorn-Saison so that you have a theme to begin with.  For now, take a look at Xerography-Peppercorn-Saison so you can see how to build your own theme.

## How it works

### Install
``` 
npm install -g xerography 
```
### xerography.js

In your project Directory, create a xerography.js file and use module.exports to share a configuration with Xerography 

### Running Xerography

Once installed, calling Xerography will create a public dir that contains your projects  website. Using [Git Subtree](https://github.com/git/git/blob/master/contrib/subtree/git-subtree.txt), you can then deploy to the gh-pages branch of your github repo

## Defaults

```
{
    'template': 'xerography-peppercorn-saison', // the name of the theme you want to you use.  If you are using an included template, this is all you need to specify
    'title': 'My Awesone Project', // Themes should add your title automatticaly 
    'source': ['README.md'], // the file that is used for the slides
    'port'; 4242 , // The port that the files are served on
    'publicDir': projectDirectory +  '/public' // where the processed files are added and served from.  

}
```
projectDirectory refers to where you are running Slidedown.js.


# Administrivia

## Author

Xerography was written by [Aaron Jorbin](http://aaron.jorb.in) <aaron@jorb.in> 

## Bugs & so forth

Please report bugs or request new features at the GitHub page for Xerography: https://github.com/aaronjorbin/xerography/

## License

Xerography is licensed under the [MIT license](https://github.com/aaronjorbin/xerography/blob/master/MIT-license.txt).
