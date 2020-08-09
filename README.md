Online Zettelkästen built with [Hugo](https://gohugo.io/)



If you like it, please consider supporting and buying it at  [Zettels Hugo Theme](https://gumroad.com/l/zettelkasten)

**Installing hugo**

See [hugo documentation](https://gohugo.io/getting-started/installing) to get started

**Install theme**

Put this theme inside the "themes" folder.

You would want to add some elements inside your config.toml file (uglyURLs, output json, ...) 

Here you have an example of a `config.toml` file that has all you need:

```toml
languageCode = "en-EN"
title = "Your site's title"
theme = "zettels"
uglyURLS=  true
publishDir = "public"
pygmentsUseClasses=true
googleAnalytics = "Your google analytics number"
# assetDir = "themes/zettels/assets"
[outputs]
  home = ["HTML", "RSS", "JSON"]
[params]
    favicon = "favicon.ico"
[markup.goldmark.renderer]
unsafe= true
```

**Start the server**

```
hugo server -D
```

### Linking notes

This theme includes [[wikilinks]] support. 

If you want to link a note, just put it's file name inside two brackets.

That means that for the note:

```
biology.md
```

You would link it like this

```
[[biology]] 
```

Output:

```html
<a href="biology.html">biology</a>
```

Make sure your filenames contain not spaces as this isn't supported by the regex yet.

**DO**

```
biologia-celular.md ✅
[[biologia-celular]] ✅ 
```

**DON'T**

```
biología celular.md ⛔️
[[biología celular]] ⛔️
```

**Your markdown notes go inside the `content` folder and need to comply with a valid yaml syntax if you're using metadata**

### Backlinks

Backlinks are supported right out the box. To use them properly you would want to give a title to each of your notes in the yaml header,  like so:

```
---
title: My awesome note
---

Hi! This is the content of my awesome note.
```

This way the note can be referenced in the backlinks section since the backlink function will look for the `title` key.
