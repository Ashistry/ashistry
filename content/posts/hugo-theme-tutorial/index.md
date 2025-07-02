+++

date = '2025-06-18T17:22:06+02:00'

draft = false

title = 'Creating your own Hugo theme'

tags = 'tutorials,webdev,frontend,html,css,javascript'

summary = 'In this guide, you will follow along with me as I create a basic hugo theme from scratch. I talk about some functionalities you can add and provide a word of advice on accessibility. Some basic webdev knowledge is required!'

outputs = ['html','rss']

+++

Hello, as you may know, my name is Ash! Just like you, I want to create my own theme for my Hugo site. I've started a version of this article before where I used Ananke as a base, but frankly, it got too chaotic for my taste fast.

So in this guide, you will follow along with me as I create a theme from scratch.

I will assume you have basic knowledge of the following:

- HTML

- JavaScript

- CSS

- Web development principles

- npm

- The command line

- How to set up a Hugo site

You may know that Hugo also uses Go templating.

Go templates are not something I am hugely comfortable with myself, but it isn't too difficult. You can learn about it [here](https://golangdocs.com/templates-in-golang).

Additionally, I urge you to try and keep your theme/site **accessible.** 

This means sufficient contrast, clear structure, dyslexic-friendly font, and large enough font size, for example. For an easy overview of considerations, I reccommend[ this article](https://quivo.co/uk/european-accessibility-act-2025/#c11261) about the European accessibility act. If you don't want to have your colors for high contrast by default, consider adding a high contrast mode that detects the user's preferences (There is a note about how to do this in this guide).

Also, [ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label) labels help screenreader users use your website. They're not always strictly neccesary for simple, well-structured sites, but it's a good idea and doesn't take much time.

Firefox and browsers based on it have a neat little built in accesibility inspector in your dev console, set the dropdown menu to "all issues". We all share the internet, including those with disabilities. 

(For editing the colors of code blocks, check out [this hugo doc](https://gohugo.io/quick-reference/syntax-highlighting-styles). "modus-vivendi" is the only default that meets the standards as far as I can tell.)

I will maybe talk about accessibility more in another post. I am not visually impaired, so I am less confident to speak to 100% correctness on how to do this.


Let's do this!

## 1. Site setup

We will be creating a new Hugo site for ease of development. If you want, you can simply copy over your posts to the new site later, but unimplemented functions will not work. A new Hugo theme comes with some example posts by default; you can delete these from yourthemename/content/posts if you want.

Create a new site:

```bash

hugo new site yoursitename

```

Optionally, initialize a Git repository.

Now open the created folder in the editor of your choice.

Then we create a new theme with this command:

```bash

hugo new theme yourthemename

```

I have chosen "ashistrytheme" as my name (very creative, right?).

Do your usual setup in your site's hugo.toml (aka its frontmatter) and set the theme to your theme.

### 1.1. (optional but recommended) npm setup

Want to work with additional dependencies such as CSS superset Sass? Let's set up npm. You have a few options here!

- Set up npm in your site's root directory. This is best if your theme is not for publishing (although you can always move stuff around later).

  This is the method I will be using, as it allows us to easily set up npm scripts for build tasks we may want (such as Sass or TypeScript).

- Set up npm in your theme's root directory. This is best if you have plans of publishing your theme.

- Set up a monorepo for both options. (advanced)

My guide is specifically for the first option. If you want a publishable theme, you can still follow along, but you will want to use more Go templating and use some of your own knowledge to fill in gaps and change things.

This is the time to install any dependencies you want to use.

When using Git, don't forget to add a .gitignore for your node_modules folder.

## 2. Exploring layouts

Let's run our development server once so everything we want to look at is generated.

A Hugo theme consists largely of layouts.

These are, well, layouts for your site.

All the partials (layouts/\_partials) are parts of a basic HTML structure and are referenced in baseof.html.

All the non-partials are assigned to

`{{main}}`

Which, as you know, is also part of an HTML structure.

We can find info about how to create and reference layouts in the [Hugo layout documentation.](https://gohugo.io/templates/)

Read at least the Introduction and Template Types sections (and, at the time of writing, the info about the v0.146.0 template system). But looking around a little is definitely beneficial.

### 2.1. Editing HTML

home.html is the "main" file for the `{{main}}` definition. Let's add something and see it change.

I will put an h1 right after `{{ define "main" }}`, but before `{{.Content}}`

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

Wow! There it is! This is how you add HTML to layouts. Use common sense when placing things and what file to place them in, and also just change things and see what it does. Of course, there's always the layouts documentation.

## 3. The CSS

HTML is cool and all, but now it's time for some pizzazz.

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

## 5. Content archetypes

When you create new content in the posts/ directory, Hugo will look for the posts.md archetype. An archetype is a template for your content.

If there is no posts.md, it will default to default.md.

Similarly, you can create archetypes for other content types, which will follow the same defaulting behavior.

The frontmatter (what we will be editing) can be TOML, YAML, or JSON.

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

For more info about what you can put here, the Hugo documentation's [front matter page](https://gohugo.io/content-management/front-matter/) will help.

The archetype used depends on the subdirectory passed to the new content command. Here we passed posts/, so it used the posts.md archetype.

But you can also specify the archetype to use like this:

```bash

hugo new content --kind tutorials posts/yourpostname.md

```

This will use a tutorials.md archetype, if it exists. If not, it will go to posts.md.

## 6. Functionalities (optional section)

I've taught you how to make basic edits to your theme. Now, what if, for example, you wanted to add support for comments? or another "functionality"?

I'll go over a few common functionalities (as I'm calling them) for your site.

### 6.1. Comments

First, decide on your comment provider. Disqus is a popular choice, and Hugo ships with support for it, but here I will be using [Cusdis](https://cusdis.com/).

1. Sign up for Cusdis.

2. Go to the layout(s) you want comments to appear on and add the following code wherever you see fit in the structure; for posts (where you most likely want it), this would be in page.html.

```html
<div
  id="cusdis_thread"
  aria-label="comment-form"
  data-host="https://cusdis.com"
  data-app-id="YOURIDHERE"
  data-page-id="{{ .File.UniqueID }}"
  data-page-url="{{ .Permalink }}"
  data-page-title="{{ .Title }}"
></div>

<script async defer src="https://cusdis.com/js/cusdis.es.js"></script>
```

(Thank you to [this post on the Hugo forums.](https://discourse.gohugo.io/t/free-and-open-source-comments-for-hugo/32940))


3. Replace YOURIDHERE with the app ID you received from Cusdis (found in the embedded code section).

4. Consider donating to Cusdis for their free, open-source service. And if you need more than 100 comments a month, consider their Cloud Pro plan, which is only 12 dollars a year (not an ad!). or host your own instance for free.

5. You can moderate your comments (required; they won't be published otherwise) in their dashboard.

It is likely you may have issues with Cusdis not displaying at full height. For now, you can add this script to your widget's location as a workaround:

```html
<script>
window.addEventListener('load', function () {
            setTimeout(() => {
                let scrollHeight = document.querySelector("#cusdis_thread iframe").contentWindow.document.body.scrollHeight;
                document.querySelector("#cusdis_thread iframe").style.height = scrollHeight + "px";
            }, 2000);
        });
</script>
```
Thank you to [4627488](https://github.com/djyde/cusdis/issues/283#issuecomment-2543119916) on github for the workaround.

Cusdis is **not perfect**. Styling the hosted version is a pain and I can't figure it out, so it's hard to see on dark mode on my site. I will be switching to self hosted comments eventually when I have spare hardware.
### 6.2. RSS

Hugo ships with RSS support. To enable it, do the following:

1. Go to your theme's hugo.toml and add the following code:

```TOML

[outputs]

  home = ['html', 'rss']

```

2. If you want to disable RSS for certain pages, add a line like this beneath our existing code:

```TOML

 taxonomy = ['html']

```

This explicitly sets the output for taxonomy (in this example) to just HTML. I'll be real; I don't know the fine details of this.

Hugo has a built-in RSS template. We will be changing it, as the default only shows your post previews!

create ```index.xml``` in your layouts folder and paste in the following (huge thanks to [rockyourcode's post](https://www.rockyourcode.com/til-how-to-create-full-text-rss-feed-for-hugo/))
```xml
{{- $pctx := . -}}
{{- if .IsHome -}}{{ $pctx = .Site }}{{- end -}}
{{- $pages := slice -}}
{{- if or $.IsHome $.IsSection -}}
{{- $pages = $pctx.RegularPages -}}
{{- else -}}
{{- $pages = $pctx.Pages -}}
{{- end -}}
{{- $limit := .Site.Config.Services.RSS.Limit -}}
{{- if ge $limit 1 -}}
{{- $pages = $pages | first $limit -}}
{{- end -}}
{{- printf "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>" | safeHTML }}
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{{ if eq  .Title  .Site.Title }}{{ .Site.Title }}{{ else }}{{ with .Title }}{{.}} on {{ end }}{{ .Site.Title }}{{ end }}</title>
    <link>{{ .Permalink }}</link>
    <description>Recent content {{ if ne  .Title  .Site.Title }}{{ with .Title }}in {{.}} {{ end }}{{ end }}on {{ .Site.Title }}</description>
    <generator>Hugo -- gohugo.io</generator>{{ with .Site.LanguageCode }}
    <language>{{.}}</language>{{end}}{{ with .Site.Author.email }}
    <managingEditor>{{.}}{{ with $.Site.Author.name }} ({{.}}){{end}}</managingEditor>{{end}}{{ with .Site.Author.email }}
    <webMaster>{{.}}{{ with $.Site.Author.name }} ({{.}}){{end}}</webMaster>{{end}}{{ with .Site.Copyright }}
    <copyright>{{.}}</copyright>{{end}}{{ if not .Date.IsZero }}
    <lastBuildDate>{{ .Date.Format "Mon, 02 Jan 2006 15:04:05 -0700" | safeHTML }}</lastBuildDate>{{ end }}
    {{- with .OutputFormats.Get "RSS" -}}
    {{ printf "<atom:link href=%q rel=\"self\" type=%q />" .Permalink .MediaType | safeHTML }}
    {{- end -}}
    {{ range $pages }}
    <item>
      <title>{{ .Title }}</title>
      <link>{{ .Permalink }}</link>
      <pubDate>{{ .Date.Format "Mon, 02 Jan 2006 15:04:05 -0700" | safeHTML }}</pubDate>
      {{ with .Site.Author.email }}<author>{{.}}{{ with $.Site.Author.name }} ({{.}}){{end}}</author>{{end}}
      <guid>{{ .Permalink }}</guid>
      <description>{{ .Content | html }}</description>

    </item>
    {{ end }}
  </channel>
</rss>
```

3. To include a reference to your feed in your site's `<head>` tag, add the following to head.html:

```go

{{ with .OutputFormats.Get "rss" }}

  {{ printf `<link rel=%q type=%q href=%q title=%q>` .Rel .MediaType.Type .Permalink site.Title | safeHTML }}

{{ end }}

```

4. For ease of access, add an RSS menu item or something like that to your site pointing to www.yourdomainname.whatever/index.xml .

Now we have an RSS feed!

### 6.3. Github deployment workflow 

Please refer to the official Hugo [tutorial](https://gohugo.io/host-and-deploy/host-on-github-pages/?ref=curiousmints.com).

### 6.4. Sass/Scss (And other supersets)

Hugo has built in support for Sass. Ain't that neat! I reccomend the built-in method.
Make sure to install the dart version of sass:
```bash
npm install dart-sass
```

In your css.html partial, replate the current contents the following:
```go
{{ $scssFiles := slice "scss/main.scss" "scss/another-file.scss" }} <!-- Add more SCSS files as needed -->
{{ $opts := dict
    "enableSourceMap" hugo.IsDevelopment
    "outputStyle" (cond hugo.IsDevelopment "expanded" "compressed")
    "targetPath" "css/main.css"
    "transpiler" "dartsass"
    "vars" site.Params.styles
    "includePaths" (slice "node_modules/bootstrap/scss")
}}

{{ range $scssFiles }}
  {{ with resources.Get . }}
    {{ with . | toCSS $opts }}
      {{ if hugo.IsDevelopment }}
        <link rel="stylesheet" href="{{ .RelPermalink }}">
      {{ else }}
        {{ with . | fingerprint }}
          <link rel="stylesheet" href="{{ .RelPermalink }}" integrity="{{ .Data.Integrity }}" crossorigin="anonymous">
        {{ end }}
      {{ end }}
    {{ end }}
  {{ end }}
{{ end }}

```
and in your theme's hugo.toml, add the following:

```toml
[build]
  writeStats = true
```

Alternatively, We can set an npm command to watch for changes to our scss files and then automatically spit out the css when they change.
Hugo will automatically detect this change to our css and rebuild our development environment site for us.

1. Create a directory in yourthemename/assets called "scss".
2. In there, create a file called "styles.css" (or whatever you want)
3. Go back to your css.html partial from earlier and add styles.**css** to the files used by the slice like I showed you.
4. Add the following command to your package.json:

``` bash
build-css": "sass themes/yourthemename/assets/scss/styles.scss:themes/yourthemename/assets/css/styles.css --watch
```

5. Run 
```bash
npm run build-css
```
6. In a seperate terminal, run your hugo development server.
7. Now whenever you save your scss, it should compile, and hugo should handle the new css automatically.

Sometimes fast render can cause issues with this method. If the built css is not loading on your dev server, pass the --disableFastRender argument to hugo server.

The processes for other supersets (such as TypeScript) should work similarly, pick the method depending on their support.
### 6.5. Auto detect color scheme preferences
We will set up dark mode and high contrast mode here.

In your css, add the following:

```css
/* Dark mode styles */
@media (prefers-color-scheme: dark) {
    body {
        background-color: black;
        color: white;
    }

    h1, h2, h3 {
        color: white;
    }

    p {
        color: white; 
    }
}

/* High contrast mode styles */
@media (prefers-contrast: more) {
    body {
        background-color: yellow;
        color: black;
    }

    h1, h2, h3, p {
        font-weight: bold
    }
}
```

As you can see, these media queries have a block. This means any style in that block is associated with that query.
Adding a toggle for color schemes is a good idea too, but this tutorial will not cover that.

### 6.6. A small note on menu links
When adding a menu item to a hugo.toml, do not use pageref for non-standard destinations. Use the url variable instead.

## 7. Now what?

Now is the time for you to explore on your own and design your theme with the tools I've given you. Have fun, and good luck!

P.S.: Remember the documentation for specific needs! If you can't figure it out, leave me a comment or [e-mail](mailto:ashistry@proton.me) me and I'll try to help.
