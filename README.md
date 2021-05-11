Zettelkasten/Digital garden [Hugo](https://gohugo.io/) theme. [Live example](https://notas.cristian.lat)

### 🚨 Recent changes

- [Bear app](https://bear.app) alike interface (because I'm in ❤️ with 🐻)
- Abstracted theme variables to their own file. This will allow better customization in the future
- Added support for spaces inside links
- Cleaned the project. <s>Temporally removed search feature</s>

### 🚧 toDo

- Allow choosing themes from config file
- Use pretty urls?
- Append Netlify deploy button to README.md
- <s>Bear highlight regex: `==highlighted==` && `::highlighted::`</s>
- <s>Code blocks</s>
- 🇪🇸 → 🇬🇧: <s>Change "privado" param key to "private"</s> and <s>find a way to localize theme strings.</s>
- <s>🐻 Bear alike search sidebar</s>
- Integrate zoom.js
- Polar Markup support?
- Thumbnails on search component
- Add support for Hugo tags

### Nice to have

- Obsidian alike nodes graph
- Bear nested tags renderer ❤️

### 💻 Installing

`git clone` this repo inside the "themes" folder or submodule it with `git submodule`.


```bash
git submodule add https://github.com/crisrojas/zettels.git themes/zettels
```

### ⚙️ Config file

You would want to add some elements inside your `config.toml` file to have all the features (uglyURLs, output json for search index, ...)

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

### 🔗 Linking notes

Linking through double-brackets syntax. 

Ex.: `[[wikilink]]`, where "wikilink" is the filename of the note to be linked.

I'll maybe add a feature to allow choosing linking from note's title instead of filename.

```html
<!-- Input -->
[[biology]]
<!-- Regex looks for markdown file... -->
biology.md
<!-- Output html -->
<a href="biology.html">biology</a>
```

Spaces in wikilinks are supported: `[[spaced link]]` outputs `<a href="spaced-link.html">spaced link</a>`

### 🔙 Backlinks

Title of referencing note is need for backlinking, so make sure you set a title for all your notes in the yaml metadata.

```
---
title: My awesome note
---

Hi! This is the content of my awesome note.
```
