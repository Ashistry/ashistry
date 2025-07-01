+++
date = '2025-06-28T19:32:05+02:00'
draft = true
title = 'SilverBullet: How I work with it, and how I publish some of it here!'
tags = ''
summary = 'Silver bullet is a self hosted, markdown-based knowledge management web-app that also supports Lua expressions. I used obsidian for a bit, but want to become more technologically independent. In this post I explore my setup, how I use it, and how I publish part of my knowledge-base right here on my blog.'
+++
## 1. Silver Bullet

Silver bullet is a self hosted, markdown-based knowledge management web-app that also supports Lua expressions. I used obsidian for a bit, but want to become more technologically independent. In this post I explore my setup, how I use it, and how I publish part of my knowledge-base right here on my blog.

P.S. I found out about SilverBullet and got the idea to publish select pages on my blog through the awesome [runtimeterror blog](https://runtimeterror.dev/), check it out!
## 2. The install process

SilverBullet comes in two forms: A binary and a Docker container.

Now, I have never used a container before (gasp!), but I figured this was a good a time as any to practice for when I got my own home server and would inevitably run a few.

So I created a seperate directory for my containers, then a folder for SilverBullet. 
In there, I created a docker-compose.yml, pasted SilverBullet's provided contents, and replaced the source for the container with the Docker Hub-hosted one (the GHCR one seems to be unreachable).

Then it was as easy as activating the docker services, setting them up to run automatically using systemctl, and starting the container!

Now, when I go to the assigned port on my localhost (3000 by default), I log in with my configured details, and SilverBullet is running and ready to use.

## 3. How I use it

I want to use SilverBullet as a personal knowledge base.


## 4. Select Publishing on my blog

John from runtimeterror uses git plug and quartz for fancier, nicer looking pages.
However, I run a static site deployed on github pages, and that is my *only* domain. 

I played around with renting a server, but felt uncomfortable not having HTTPS (could not figure out how to get self-signing to work), and didn't want to spend the money to get another domain for a certificate.

SilverBullet's publishing plugin is a bit too complicated for my taste. After all, SilverBullet already generates markdown, which is what Hugo (my SSG) posts are written in!