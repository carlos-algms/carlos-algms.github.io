---
layout: post
title: Install Oracle java on Ubuntu
slug: install-oracle-java-on-ubuntu
date: 2014-11-20T15:30:00-02:00
updated: 2014-11-20T15:30:00-02:00
tags: [Linux, Ubuntu, Java]
---

Ubuntu comes with an opensource java installed. To use the oracle's java,
you need to remove the openjkd and install oracle's.

<!-- more -->

First we need to remove the openjdk from Ubuntu.

```bash
sudo apt-get purge openjdk*
```

Then add webupd8team repository, since Oracle still don't have an official repository.

```bash
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
```

After the update finished, we can install java via:

```bash
sudo apt-get install oracle-java8-installer
```
