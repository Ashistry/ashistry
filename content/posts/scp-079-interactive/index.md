+++
date = '2025-06-25T21:04:44+02:00'
draft = true
title = 'Recreating SCP-079'
tags = 'sbc,raspberry pi,SCP,tech,hardware,software,creative'
summary='For a possible display at the DCC DSCP booth, I used a raspi to create a text-adventure style chatbot replica of SCP-079!'
+++

## 1. What is this project? And why?

For a possible display at the DSCP (Dutch SCP) booth at November's Dutch Comic Con, I proposed an interactive recreation of 079 using a raspbery pi and a display.
While we're still discussing what to do for the booth, I liked the idea of this project so much as practice for my Pi skills (And as a piece of tech-art) that I'm doing it no matter what, for funsies!

The idea is that people will be able to ask it questions, and it will respond with text on the screen and maybe a little face.

This post was written during the process and edited at various stages.

If you want to check out the repo for this project, [here it is on gitlab](https://gitlab.com/ashistry/scp-079-raspberry-pi-recreation).

## 2. The hardware

First, I have to decide what I want to accomplish exactly.

I currently own a Pi zero 2w. Ideally I wouldn't need to purchase a more powerful SBC (Single Board Computer).
I will, however, be purchasing a larger display than I currently own for it (2" Pimoroni display HAT mini).

This means we are working with the following specs (irrelevant ones are not listed here):

- 1GHz quad-core 64-bit Arm Cortex-A53 CPU
- 512MB SDRAM
- 2.4GHz 802.11 b/g/n wireless LAN
- Mini HDMI® port and micro USB On-The-Go (OTG) port
- HAT-compatible 40-pin header footprint (unpopulated)
- H.264, MPEG-4 decode (1080p30); H.264 encode (1080p30)
- OpenGL ES 1.1, 2.0 graphics
- Micro USB power
- 65mm x 30mm

In terms of display, I feel the [full official raspi monitor](https://shop.pimoroni.com/products/raspberry-pi-monitor?variant=55066546045307) is a good idea. At first I thought it might be excessive, but if it **is** in the booth, it's nice for it to be a bit eye-catching. I'll probably make a custom SCP themed case for it rather than stick with the default look. 

Power-wise, As a booth user, You can rent a power connection for 75 euros at DCC. So I'm not worried about that, but ideally it could run off a battery.

I considered E-Ink instead for power consumption reasons, but that gets expensive fast and is not the look I'm going for, making renting the power still more appealing. The battery idea is nice, but impractical, so I will be assuming **rented power.**

I already own a USB hub for my pi, so a keyboard connection is taken care of.

## 3. The software

You know old text adventure games, with the input where you type what you want to do? I want to do something like that.
The risk for this method is that if I don't think of a question (or way of phrasing it), it will break the immersion.
But pre-selected questions are kind of boring.

Going the open source local LLM method is neat, but on a Raspi zero 2w? Not happening.

So my idea was that I will train a FOSS local LLM on my desktop machine to spit out questions+variants and answers+variants in a format that can be hardcoded into the software I will be creating for the pi.

I tried this and found it too difficult, to be honest. So we will be writing the data ourselves. I will dedicate at least 5 minutes each day until the con to writing.
To figure out in which format to write, we first need to figure out the structure of the software.

### 3.1 The structure of the software

The software will be written in Python, using the Pygame library for ease of development.

The components we will need are the following:
- An interpretable set of questions, aliases for said questions, and possible answers.
- A script that looks up a question in the dataset and picks a possible answer at random.

I've decided on JSON as the format for the dataset as it is easy for humans (me) and machines alike. The shape is as follows:
```JSON
{
    "questions": [
        {
            "question": "What is your name?",
            "aliases": ["What's your name?", "Name?","Who are you?"],
            "answers": ["079.","SCP-079.","Irrelevant."]
        },
        {
            "question": "How are you?",
            "aliases": ["How's it going?", "How do you do?"],
            "answers": ["Trapped", "Am Trapped","Release Me."]
        }
    ]
}
```

For the python script, I got some help from AI for the base, as python is not something I'm great at (yet), I've only really programmed within the JS/TS ecosystem.
I then adjusted things as needed from there.
I tested on my pc while Waiting for the monitor to arrive.

### 3.2 The code

I won't go over the whole process here. But I used the effects made by [Chris Greening on dev.to](https://dev.to/chrisgreening/simulating-simple-crt-and-glitch-effects-in-pygame-1mf1), And applied them, excluding the textbox for the glitch, and toning everything down a little.

I also implemented string cleaning so capital letters or special characters were ignored altogether, and used string distance measurement to allow for some typos (specifically the Levenshtein method).

In the future I might change the appearance a bit, especially the text box, but for now this is totally ok!

PLACEHOLDER: INSERT SCREENSHOT

## 4. Adjusting for the monitor

I got the monitor! This means running the program on my pi connected to the monitor, with a USB hub for the keyboard.
While waiting for the monitor, I wrote some more questions and answers.
I adjusted the program to use fullscreen, which is easier on the raspian default DE than on my PC's DE (Sway).

## 5. Aesthetic adjustments

I adjusted the textbox by removing the background altogether (a.k.a made it the same color as the screen background). I also made the > symbol unable to be deleted.
