---
layout: post
title: How to configure the hostname of the server
slug: how-to-configure-the-hostname-of-the-server
date: 2014-07-06T13:27:40-03:00
updated: 2014-07-06T13:27:40-03:00
comments: true
tags: [Linux, Ubuntu, Cloud]
lang: en
---

## Hostname X FQDN

<!-- more -->

### Hostname

Hostname is the name that you give to your machine.
It is used on your local network and is shown at terminal after the name of loged user,
ex: john@[hostname]. There is no way to access your server remotely with this name.

The name could be anything that start with a letter and can have numbers, undercore and dash.
Ex: "john-notebook" or "office-pc3" or "plato".

```bash
$ echo "machine-name" > /etc/hostname
$ hostname -F /etc/hostname
```

### FQDN

**Full Qualified Domain Name** is the domain that you pay to register.
It is the only way that you can access your machine by a name and not by an IP.

ex: company.com, myblog.net, or restaurant.com.br, it is your choice.
Configure it is mandatory when you want to have a valid reverse dns.

### Update /etc/hosts

Here you will configure your external IP followed by your FQDN and your hostname, in that order.
If yout dont follow that order, you can`t have your reverse dns working.

```bash
127.0.0.1 localhost.localdomain localhost
XXX.X.X.X machine-name.domain.tld machine-name
```
