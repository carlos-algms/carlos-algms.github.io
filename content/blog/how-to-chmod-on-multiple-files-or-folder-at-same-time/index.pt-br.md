---
# TODO: rename to index.en.md when en is enabled
title: How to CHMOD on Multiple Files or Folder at Same Time
date: 2014-11-20T15:11:46-02:00
lastmod: 2014-11-20T15:11:46-02:00
comments: true
tags: [linux, ubuntu]
contentLang: en
---

Do chmod on multiple files could be hard if you only use chmod alone.
You can use find command to filter files and folder and apply chmod with only one simple line.

<!--more-->

Apply CHMOD to every folder and subfolder recursively

```bash
find clients/ -type d -print0 | xargs -0 chmod 755
```

Apply CHMOD to every file recursively

```bash
find clients/ -type f -print0 | xargs -0 chmod 644
```

The trick is <code>-type -d</code> and <code>-type -f</code> that tell to find command
to only find folders and files, respectively.
