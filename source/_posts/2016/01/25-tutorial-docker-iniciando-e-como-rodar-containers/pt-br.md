---
title: tutorial docker iniciando e como rodar containers
slug: tutorial-docker-iniciando-e-como-rodar-containers
date: 2016-01-25T23:28:06-03:00
updated: 2016-01-25T23:28:06-03:00
tags: [docker]
lang: pt-br
---

![docker logo](docker.png)

## Rodando imagens

```shell
$ docker run ubuntu
```

Este comando vai seguir os seguintes passos:

- Baixar a última versão do Ubuntu disponível para Docker, caso você ainda não tenha
- Instalar a imagem em uma máquina virtual
- Finalizar a execução

É possível, ainda, escolher a versão da imagem

```shell
$ docker run ubuntu:14.04
```

O problema do comando run é que ele cria um container e morre, desligando assim a máquina virtual e deixando você sem acesso.

<!-- more -->

## O que é o docker

Docker é uma ferramenta que cria "micro maquinas virtuais" com a finalidade de não "sujar" o ambiente do desenvolvedor.
Desta forma você pode ter vários ambientes configurados sem um conflitar com o outro.

## Conceito de imagem X container

**Imagem**: É como se fosse uma ISO de um sistema operacional. Server para iniciar uma máquina virtual e se tornar um container.
As imagens podem ser limpas como as que você usa para formatar um computador ou customizadas com vários aplicativos pré-instalados, por exemplo apache, mysql, jenkins, nodeJS, etc. Qualquer coisa que possa ser feita por linha de comando pode servir como uma configuração para a imagem.

**Container**: É uma máquina virtual pronta para uso iniciada a partir de uma imagem. Trata-se de um ambiente completo que pode ser acessado via linha de comando. Containers ligam e desligam instantaneamente e podem ser "resetados" ao desligar ou manter as alterações para próxima vez que forem ligados.
Pense assim: Você baixa uma imagem ISO, formata seu computador, instala uns programas, e pronto, ele é um container.
O poder e a velocidade do Docker vem da vantagem de que todas as imagens já estão prontas para uso e não há a perda de tempo para formatação da máquina.
Então se você rodar uma imagem do mysql, o Docker vai fazer o download e sem nenhuma interação, o servidor já vai estar configurado e operacional. Mas nós estamos falando só do tempo de download, a imagem vem configurada pronta para rodar.

## Manter o container docker rodando

```shell
$ docker run ubuntu bash
```

Este comando vai montar toda a configuração e te dar acesso ao shell root do container.
Enquanto você não digitar `exit` e der enter, o container permanecerá rodando.

## Listando containers

Cada vez que você executa o comando `run`, o Docker vai criar um novo container do zero e armazenar em cache para utilização futura. Você não deve ficar utilizando o comando `run` toda hora.

```shell
$ docker ps -a
```

![docker ps -a](./docker-ps-a.jpg)

O Docker cria automaticamente um nome aleatório para cada container criado a partir do comando `run`, através deste nome você pode continuar a utilizar um container sem perder os dados a cada inicialização

## Rodando containers Docker já criados

```shell
$ docker start NOME_CONTAINER
```

O comando `start` só funciona com containers, portanto é **obrigatório** rodar o comando `run` pelo menos uma vez.
O container será iniciado e permanecerá rodando em segundo plano até o comando `stop` ser rodado. Por tanto você não terá acesso ao shell sem utilizar outro comando.

## Acessar containers Docker que já estão rodando

```shell
$ docker attach NOME_CONTAINER
```

## Renomear containers

O Docker se encarrega de dar nomes aleatórios para cada container, porém eles não são normalmente fáceis de lembrar.
Ou você acha que ` adoring_ardinghelli` é fácil de escrever e lembrar?

O Código segue o seguinte padrão: `$ docker rename NOME_ATUAL NOME_FACIL_DE_LEMBRAR
`

```shell
$ docker rename adoring_ardinghelli servidor-teste
```

E para rodar:

```shell
$ docker start servidor-teste
$ docker attach servidor-teste
```

## Parar container

```shell
$ docker stop servidor-teste
```

## Remover containers

A lista de containers vai acabar ficando extensa, e para liberar espaço você pode deletar os containers que não vai utilizar mais:

```shell
$ docker rm servidor-teste
```

É isso aí pessoal, espero que tenham gostado e não perca a próxima parte onde vamos falar de como criar uma imagem customizada e rodar seu Dockerfile.
