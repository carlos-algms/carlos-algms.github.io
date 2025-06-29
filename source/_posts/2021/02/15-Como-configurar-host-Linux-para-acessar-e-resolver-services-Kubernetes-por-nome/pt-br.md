---
title: Como configurar host Linux para acessar e resolver services Kubernetes por nome dns
slug: como-configurar-host-linux-para-acessar-e-resolver-services-kubernetes-por-nome
date: 2021-02-17T22:10:00-03:00
updated: 2021-02-17T22:10:00-03:00
tags: [kubernetes, linux, dns]
lang: pt-br
---

<main lang="pt-BR">

Neste post vou explicar como configurar um host Ubuntu para ter acesso aos serviços de um Cluster Kubernetes instalado utilizando [microk8s](https://microk8s.io/).

### Como funciona o DNS interno do Kubernetes

Todos os <em lang="eng">Pods</em> e <em lang="eng">Services</em> estão conectados em uma mesma rede virtual privada com IPs da faixa `10.x.x.x` e o host aonde o Kubernetes está instalado não está conectado a esta rede, e por isso não tem acesso nem aos services nem aos pods.

<!-- more -->

Digamos que você tenha criado um banco de dados qualquer e que tenha exposto este banco de dados através de um serviço chamado simplesmente de `my-db`.

```yaml service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-db
```

Como descrito na [documentação](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/), O Kubernetes vai criar um nome completo para este serviço no formato:
`[service-name].[namespace].svc.cluster.local`

Que neste exemplo será: `my-db.default.svc.cluster.local`.

Internamente os Pods conseguirão encontrar este serviço, por que o sistema de nomes (DNS) do Kubernetes vai converter este nome em um IP da faixa `10.x.x.x`.

Não é obrigatório digitar o súfixo `.default.svc.cluster.local` por que o servidor DNS também está configurado para auto-completar este sufixo.

### Como conectar na rede privada do Kubernetes

Existe um Add-on para microk8s chamado [host-access](https://microk8s.io/docs/addon-host-access), que vai conectar o host à rede privada do Kubernetes e liberar o acesso a todos os IPs internos do cluster.

A descrição oficial é a seguinte:

> <cite lang="eng">The host-access addon enables access to services running on the host machine via a fixed IP.</cite>

<span class="grey-text text-darken-1">"O Add-on `host-access` habilita o acesso a serviços rodando na máquina hospedeira através de um IP fixo."</span> em tradução literal.

Para habilitar o add-on host-access, é só executar o comando:

```shell
microk8s enable host-access
```

Uma nova interface de rede será criada na máquina host com o nome `lo:microk8s` e com o IP `10.0.1.1` conectando o host à rede privada do Kubernetes.

Agora que estamos conectados, o acesso por IP já é possível, porém a resolução de nomes ainda precisa ser configurada.

### Como descobrir o IP do servidor DNS do cluster Kubernetes

Precisamos descobrir qual é o IP do serviço que está convertendo os nomes em IPs para o Kubernetes para que possamos utilizar o mesmo em nosso host.

Para descobrir o IP do servidor DNS interno do Kubernetes, basta listar os serviços que estão rodando no <em lang="en">namespace</em> `kube-system`:

```shell
$ microk8s.kubectl get service --namespace kube-system
NAME          TYPE            CLUSTER-IP
kube-dns      ClusterIP       10.152.183.10
```

Várious outros serviços podem estar rodando, mas o único importante é o `kube-dns` e o seu IP, que neste caso é `10.152.183.10`.

**OBS:** Existe a possíbilidade deste IP ser diferente em outras instalações, por tanto é necessário rodar o comando acima para encontrar o IP correto.

### Configurar a resolução de DNS para services Kubernetes

O Ubuntu, desde a versão 16.04, utiliza o serviço `systemd-resolved` para gerenciar os servidores DNS utilizados, e é na pasta deste serviço que vamos fazer as alterações.

Dois arquivos são gerados automáticamente pelo serviço `systemd-resolved`:

`/run/systemd/resolve/stub-resolv.conf`
`/run/systemd/resolve/resolv.conf`

O primeiro é apenas um arquivo vazio e não tem efeito nenhum, enquanto o segundo é o arquivo que realmente contém as configurações.

O sistema UNIX lê o arquivo `/etc/resolv.conf` para descobrir quais são os servidores DNS disponíveis.

Se analisármos este arquivo no Ubuntu rodando o seguinte comando:

```shell
$ ls -l /etc | grep resolv
> resolv.conf -> /run/systemd/resolve/stub-resolv.conf
```

É possível identificar que este arquivo é apenas um link simbólico apontando para a configuração <em lang="eng">stub</em>, citada acima, e que não contém nenhum DNS, deixando assim a responsabilidade de resolver nomes em IPs para o servidor DHCP da rede, que por sua vez, não tem nenhum conhecimento sobre os serviços que estão rodando dentro do Kubernetes.

Vamos remover o link simbólico atual e criar outro apontando para o arquivo certo:

```shell
$ sudo rm /etc/resolv.conf
$ sudo ln -s /run/systemd/resolve/resolv.conf /etc/resolv.conf
```

Por padrão, o `systemd-resolved` vem com apenas 1 arquivo de configuração no Ubuntu:
`/etc/systemd/resolve.conf`, porém alterações feitas neste arquivo serão perdidas em uma a próxima atualização do sistema, sendo assim NÃO é recomendado alterar este arquivo.

A solução para não perder as configurações, é criar uma nova pasta e colocar o arquivo de configuração dentro desta nova pasta.

Este novo arquivo pode ter qualquer nome, desde que termine com a extensão `.conf`.

```shell
$ sudo mkdir -p /etc/systemd/resolved.conf.d
$ sudo vim /etc/systemd/resolved.conf.d/00-k8s-dns-resolver.conf
```

```properties /etc/systemd/resolved.conf.d/00-k8s-dns-resolver.conf
[Resolve]
Cache=yes
DNS=10.152.183.10
Domains=default.svc.cluster.local svc.cluster.local cluster.local
```

Explicação de cada linha:

- **`Cache=yes`**: manter na memória os nomes de serviços já resolvidos para ser mais rápido nas resoluções seguintes;
- **`DNS=10.152.183.10`**: É o IP do servidor de DNS interno do Kubernetes, que foi encontrado no passo anterior;
- **`Domains=default.svc.cluster.local svc.cluster.local cluster.local`**: Instrui ao servidor DNS, que caso o nome não seja encontrado, tente novamente adicionando estes domínios ao fim do nome;

Para finalizar e carregar as configurações, reinicie o serviço `systemd-resolved`:

```shell
$ sudo service systemd-resolved restart
```

### Testando a configuração

Agora é a hora de testar se é possível encontrar o service citado no começo do post, o `my-db`.

Vamos simplesmente rodar o `ping` para saber se se o nome `my-db` será convertido no IP correto:

```shell
$ ping my-db
PING my-db.default.svc.cluster.local (10.152.183.5) 56(84) bytes of data.
64 bytes from my-db.default.svc.cluster.local (10.152.183.5): icmp_seq=1 ttl=64 time=0.028 ms
64 bytes from my-db.default.svc.cluster.local (10.152.183.5): icmp_seq=2 ttl=64 time=0.048 ms
64 bytes from my-db.default.svc.cluster.local (10.152.183.5): icmp_seq=3 ttl=64 time=0.045 ms
```

Como você pode ver pela resposta do comando `ping`, `my-db` foi resolvido para seu nome completo, também chamado de <em lang="en">[Full Qualified Domain Name (FQDN)](https://en.wikipedia.org/wiki/Fully_qualified_domain_name)</em>, e para o IP `10.152.183.5`.

Como a configuração foi feita incluindo múltiplos domínios, todos estes comandos são válidos:

```shell
ping my-db
ping my-db.default
ping my-db.default.svc
```

Caso você tenha vários namespaces e não só o default, basta incluir outro domínio no arquivo `/etc/systemd/resolved.conf.d/00-k8s-dns-resolver.conf`.

Espero que essa post possa te ajudar a configurar um cluster Kubernetes para seu ambiente de trabalhou ou até mesmo para criar um servidor Cloud próprio, quem sabe.

</main>
