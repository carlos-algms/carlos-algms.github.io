---
title: cygwin - Memorizar senha do ssh no terminal como no Linux
slug: cygwin-memorizar-senha-do-ssh-no-terminal-como-no-linux
date: 2016-01-10T18:55:56-03:00
updated: 2016-01-10T18:55:56-03:00
tags: [windows, cygwin, ssh]
---

O Linux pode memoriza todas as senhas utilizadas no `SSH` até que o usuário faça logoff ou reinicie o computador.
As senhas ficam salvas no sistema de credenciais nativo do Linux.

O Windows não possui este recurso, sendo necessário alguns passos para conseguir o mesmo efeito.

<!-- more -->

O [cygwin][0] ou o [gitbash][1], possuem um recurso chamado `ssh-agent` que é iniciado ao fazer uma chamada ao comando `ssh`.
O que vamos fazer é iniciar um único `ssh-agent` que ficará rodando até que o usuário faça logoff ou reinicie o computador.

## Habilitar a pasta bin na home do usuário

Para armazenarmos os arquivos na pasta do próprio usuário, descomente as seguintes linhas:

`$ vim ~/.bash_profile`

```bash
# Set PATH so it includes user's private bin if it exists
if [ -d "${HOME}/bin" ] ; then
  PATH="${HOME}/bin:${PATH}"
fi
```

## Criar script customizado para usar o SSH sem senha

Nós vamos "enganar" o sistema criando um arquivo com o nome de `ssh` que fará toda a mágica:

`$ vim ~/bin/ssh`

```bash
#!/bin/bash

if [ -f ${HOME}/.ssh-agent ]; then
   . ${HOME}/.ssh-agent > /dev/null
fi

if [ -z "$SSH_AGENT_PID" -o -z "`/usr/bin/ps -a|/usr/bin/egrep \"^[ ]+$SSH_AGENT_PID\"`" ]; then
   /usr/bin/ssh-agent > ${HOME}/.ssh-agent
   . ${HOME}/.ssh-agent > /dev/null
   ssh-add
fi

/bin/ssh "$@"

```

O que o nosso script faz é bem simples:
Na linha **3** ele verifica se existe um arquivo do `ssh-agent` criado e o executa, na linha **4**, para carregar suas variáveis na memória.

Na linha **7** é feita uma verificação para garantir que os dados armazenados são realmente do agente que está rodando.
Caso não seja, as linhas **8** e **9** iniciam um novo agente e armazenam seus dados no arquivo.

A linha **10** inicia o processo que vai soliciar a senha e armazenar no agente para utilização futura.

O legal desse script é que só será solicitado a senha na primeira vez que o comando `ssh` for utilizado.
Encontrei outros scripts que solicitavam a senha da private.key mesmo que o `ssh` não fosse utilizado.
O agente também não será iniciado antes do comando `ssh` ser chamado.

Na linha **13** vamos chamar o verdadeiro `SSH` do sistema passando todos os parametros.

[0]: https://cygwin.com/install.html
[1]: https://git-scm.com/downloads
