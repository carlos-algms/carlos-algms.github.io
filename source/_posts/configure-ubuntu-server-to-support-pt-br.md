---
layout: post
title: "Configure Ubuntu Server to support pt-br"
date: 2014-07-06 20:01:32 -0300
updated: 2014-07-06 20:01:32 -0300
comments: true
tags: [Ubuntu, Linux, cloud, VM]
---

Every cloud that you use outside Brazil, does not come with pt-br support installed.
When you access your server via SSH, almost every command that you run on terminal,
will generate a warn that your language is not supported.

<!-- more -->

To avoid this annoying warning, you just need to install the language pack.

Note: This will not translate your Ubuntu, this will only add support to your 
language and remove the errors.


```bash
sudo apt-get install language-pack-pt-base
sudo dpkg-reconfigure locales
```

### Configure timezone

After install the language-pack, is a good pratice configure the clock of 
your Ubuntu to reflect the clock of your
location.


```bash
sudo dpkg-reconfigure tzdata
```

First chose America, then São Paulo, or your own city.

You can verify the current time by run the command:


```bash
date
```
