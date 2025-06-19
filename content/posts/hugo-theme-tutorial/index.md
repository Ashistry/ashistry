+++
date = '2025-06-18T17:22:06+02:00'
draft = true
title = 'Hugo Theme Tutorial'
tags = ''
comments = true
+++

Hello, as you may know, my name is Ash! Just like you, I want to create my own theme for my hugo site. I've started a version of this article before where I used Ananke as a base, but frankly, it got too chaotic for my taste _fast_.

So in this guide, you will follow along with me as I create a theme from scratch.

I will assume you have basic knowledge of the following:

- HTML
- JavaScript
- CSS
- Web Development principles
- npm
- The command line
- How to set up a hugo site

You may know that hugo also uses Go templating.
Go templates are not something I am hugely comfortable with myself, but it isn't too difficult. You can learn about it [here](https://golangdocs.com/templates-in-golang).

Let's do this!

## 1.1. Site setup

We will be creating a new hugo site for ease of development. If you want you can simply copy over your posts to the new site, but unimplemented functions will not work. A new hugo theme comes with some example posts by default, you can delete these from yourthemename/content/posts if you want.

Create a new site:

```bash
hugo new site yoursitename
```

Optionally, initialize a git repository.

Now open the created folder in the editor of your choice.

Then we create a new theme with this command:

```bash
hugo new theme yourthemename
```

I have chosen "ashistrytheme" as my name (very creative, right?).

Do your usual setup in your **site's** hugo.toml (aka its frontmatter) and set the theme to your theme.

## 1.2. npm setup

Now let's set up npm. You have a few options here!

- Set up npm in your site's root directory. This is best if your theme is not for publishing (although you can always move stuff around later).
  This is the method I will be using, as it allows us to easily set up npm scripts for build tasks we may want (such as sass or TypeScript).
- Set up npm in your theme's root directory. This is best if you have plans of publishing your theme.
- Set up a monorepo for both options. (advanced)

My guide is specifically for the first option. If you want a publishable theme, you can still follow along, but will want to use more Go templating and use some of your own knowledge to fill in gaps and change things.
This is the time to install any dependencies you want to use.
When using git, don't forget to add a .gitignore for your node_modules folder.

## 2.1 Exploring layouts

Let's run our development server once so everything we want to look at is generated.

A hugo theme consists largely of **layouts**.
These are, well, layouts for your site.

All the partials (layouts/\_partials) are parts of a basic HTML structure and are referenced in baseof.html.

All the non-partials are assigned to
`{{main}}`
Which as you know is also part of an HTML structure.

We can find info about how to create and reference layouts in the [hugo layout documentation.](https://gohugo.io/templates/)

Read at least the Introduction section (And at time of writing, the info about the v0.146.0 template system). But looking around a little is definitely beneficial.

## 2.2 Editing HTML

home.html is the "main" file for the `{{main}}` definition. Let's add something and see it change.

I will put a h1 right after `{{ define "main" }}`, but before `{{.Content}}`

```GO
{{ define "main" }}
<h1>test</h1>
  {{ .Content }}
  {{ range site.RegularPages }}
    <h2><a href="{{ .RelPermalink }}">{{ .LinkTitle }}</a></h2>
    {{ .Summary }}
  {{ end }}
{{ end }}
```

Wow! there it is! This is how you add html to layouts. Use common sense when placing things and what file to place them in, and also just change things and see what it does. Of course, there's always the layouts documentation.

## 3. The CSS

HTML is cool and all, but now it's time for some pizazz.
CSS for your theme goes in yourtheme/assets/css.

This is pretty straightforward. You know how CSS works.

If you add a second file (such as two.css), it will not be applied by default. We will change css.html to a loop structure, like so:

```GO
{{- $files := slice "css/main.css" "css/two.css" }}
{{- range $files }}
  {{- $file := . }}
  {{- with resources.Get $file }}
    {{- if hugo.IsDevelopment }}
      <link rel="stylesheet" href="{{ .RelPermalink }}">
    {{- else }}
      {{- with . | minify | fingerprint }}
        <link rel="stylesheet" href="{{ .RelPermalink }}" integrity="{{ .Data.Integrity }}" crossorigin="anonymous">
      {{- end }}
    {{- end }}
  {{- end }}
{{- end }}
```

Feel free to copy this over. Add any CSS files you add into the first line.

## 4. The JavaScript

Honestly? Same story as the CSS. JavaScript files go in yourthemename/assets/js.

To add multiple files, we need to edit layouts/\_partials/head/js.html.

```Go
{{- $files := slice "js/main.js" "js/another.js" }}
{{- range $files }}
  {{- $file := . }}
  {{- with resources.Get $file }}
    {{- $opts := dict
      "minify" (not hugo.IsDevelopment)
      "sourceMap" (cond hugo.IsDevelopment "external" "")
      "targetPath" $file
    }}
    {{- with . | js.Build $opts }}
      {{- if hugo.IsDevelopment }}
        <script src="{{ .RelPermalink }}"></script>
      {{- else }}
        {{- with . | fingerprint }}
          <script src="{{ .RelPermalink }}" integrity="{{ .Data.Integrity }}" crossorigin="anonymous"></script>
        {{- end }}
      {{- end }}
    {{- end }}
  {{- end }}
{{- end }}
```

Add files you create into the first line.

# 5. Content archetypes

When you create new content in the posts/ directory, hugo will look for the posts.md **archetype**. An archetype is a template for your content.
If there is no posts.md, it will default to default.md.

Similarly, you can create archetypes for other content types which will follow the same defaulting behaviour.

The frontmatter (what we will be editing) can be TOML, YAML or JSON.

Try creating posts.md and adding tags to the frontmatter section there now! Like so:

```TOML
+++
date = '{{ .Date }}'
draft = true
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
tags =  ''
+++

```

And create a new post with

```bash
hugo new content posts/yourpostname.md
```

If everything went right, it should contain your added field.

For more info about what you can put here, the hugo documentation's [front matter page](https://gohugo.io/content-management/front-matter/) will help.

The archetype used depends on the subdirectory passed to the new content command. Here we passed posts/, so it used the posts.md archetype.

But you can also specify the archetype to use like this:

```bash
hugo new content --kind tutorials posts/yourpostname.md
```

This will use a tutorials.md archetype, if it exists. If not, it will go to posts.md.

# 6.1. Functionalities

I've taught you how to make basic edits to your theme. Now, what if, for example, you wanted to add support for comments? or another "functionality"?
I'll go over a few common functionalities (as I'm calling them) for your site.

# 6.2. Comments

First, decide on your comment provider. Disqus is a popular choice and hugo ships with support for it, but here I will be using [Cusdis](https://cusdis.com/).

1. Sign up for Cusdis.
2. Add this directly to your baseof.html, right before the closing body tag:

```js
<script src="https://cusdis.com/js/cusdis.es.js" async></script>
```

3. Go to the layout(s) you want comments to appear on and add the following code wherever you see fit in the structure, in my case before the opening tag for the footer in the baseof.html file:

```html
<div
  id="cusdis"
  data-app-id="YOUR_APP_ID"
  data-page-id="{{ .Permalink }}"
  data-page-title="{{ .Title }}"
  data-page-url="{{ .Permalink }}"
></div>
```

4. Replace YOUR_APP_ID with the APP_ID you received from Cusdis (found in the embedded code section).

5. Add the following to the frontmatter of archetypes you want comments on:
```TOML
comments=true
```

6. You won't see Cusdis on your development server as it requires a publicly accessible url. however, if you see some empty spage rendered in a post with comments=true, and a 404 error trying to fetch Cusdis related things in your browser console's network section, you should be good!

7. Consider donating to Cusdis for their free, open source service. And if you need more than 100 comments a month, consider their cloud pro plan, which is only 12 dollars a year (not an ad!) or host your own instance for free.

8. You can moderate your comments (required, they won't be published otherwise) in their dashboard.

# 6.3 RSS

Hugo ships with RSS support. To enable it, do the following:

1.  Go to your theme's hugo.toml and add the following code : 
```TOML
[outputs]
  home = ['html', 'rss']
  section = ['html', 'rss']
```

2. If you want to disable rss for certain pages, add a line like this beneath our existing code:
```TOML
 taxonomy = ['html']
```
This explicitly sets the output to taxonomy (in this example) to just HTML.

Hugo has a built in RSS template. If you want to change it, add a home.rss.xml file and a section.rss.xml file in your layouts folder (and other types, as needed.)


3. To include a reference to your feed in your site's ```<head>``` tag, add the following to head.html :
```go
{{ with .OutputFormats.Get "rss" }}
  {{ printf `<link rel=%q type=%q href=%q title=%q>` .Rel .MediaType.Type .Permalink site.Title | safeHTML }}
{{ end }}
```

4. For ease of access, add an RSS menu item or something like that to your site pointing to www.yourdomainname.whatever/index.xml .

Now we have an RSS feed!

# 6.4 Deployment workflow (optional)

If you host your site on Github pages like me, we can create a workflow for it to be deployed to our pages site when the repo is synced to Github. 

Github Actions is not my specialty by any means. But I will try my best to create something semi competent. I'll be upfront, I used an LLM to create the base and then tinkered until I was happy.

In your **site**'s root directory, create a folder called ```.github```, and in that create a folder called ```workflows```. Now create a file called ```deploy.yml```.

Paste this code in there:
```yaml
name: Deploy Hugo Site to GitHub Pages

on:
  push:
    branches:
      - main  # Change this if your default branch is different

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'  # You can specify a version if needed

      - name: Build
        run: hugo --minify

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```
Before we sync to github, go to your repository settings. Here we will change the branch for our pages site to 'gh-pages'. If you're comfortable doing so, give it a test by syncing now.


# 7. Now what?

Now is the time for you to explore on your own and design your theme with the tools I've given you. Have fun, and good luck!

P.S.: Remember the documentation for specific needs!