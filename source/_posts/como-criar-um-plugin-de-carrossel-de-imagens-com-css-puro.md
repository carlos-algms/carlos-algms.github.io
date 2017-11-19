---
title: Como criar um plugin de Carrossel de imagens com css puro
date: 2017-04-08 23:32:59
tags: [ css ]
---

Existem vários plugins para jquery para criar um carrossel de imagens, mas é possível criar utilizando apenas CSS puro.

## Elementos de um carrossel

{% asset_img carrossel-elements.png Print configuração do terminal intelliJ %}

- **Stage**: A área disponível para o carrossel
- **Item**: O item visível atualmente pelo usuário
- **Next/Prev Buttons**: Os botões para passar aos items anteriores/próximos, que normalmente estão ocultos

<!-- more -->

## Conceito
Vamos utilizar inputs do tipo <u>radio</u>, que estarão ocultos para os usuários, também será utilizada a tag <u>label</u> que em conjunto com o atributo <u>for=""</u>, ao ser clicada, automaticamente checa um radio que tenha o id correspondente.

Todos os input radio terão o mesmo atributo <u>name</u>, assim o próprio navegador se encarrega de desmarcar e marcar os radios sem a necessidade de JavaScript.


## Estrutura HTML

Utilizaremos 4 inputs do tipo rádio e 4 imagens aletórias do site http://lorempixel.com/.
Repare que o primeiro item não tem o botão "anterior" e o último não tem o botão "próximo".

```html
<section class="carousel">
  <input type="radio" name="carousel" id="carousel1" checked="checked" />
  <input type="radio" name="carousel" id="carousel2" />
  <input type="radio" name="carousel" id="carousel3" />
  <input type="radio" name="carousel" id="carousel4" />
  
  <main class="carousel__stage">  
    <aside class="carousel__item">      
      <img class="carousel__image" src="http://lorempixel.com/900/470/nature/4/" />
      <label for="carousel2" class="carousel__next"></label>
    </aside>
    
    <aside class="carousel__item">
      <label for="carousel1" class="carousel__prev"></label>
      <img class="carousel__image" src="http://lorempixel.com/900/470/nature/5/" />
      <label for="carousel3" class="carousel__next"></label>
    </aside>
    
    <aside class="carousel__item">
      <label for="carousel2" class="carousel__prev"></label>
      <img class="carousel__image" src="http://lorempixel.com/900/470/nature/8/" />
      <label for="carousel4" class="carousel__next"></label>
    </aside>
    
    <aside class="carousel__item">
      <label for="carousel3" class="carousel__prev"></label>
      <img class="carousel__image" src="http://lorempixel.com/900/470/nature/7/" />
    </aside>
  </main>
</section>
```

A primeira coisa que precisamos fazer é ocultar os inputs para o usuário.
Será utilizada a técnica de mover o elemento muitos pixels para esquerda da tela, pois alguns navegadores tratam inputs "ocultos" como estando desabilitados. Desta maneira o input fica invisível, mas ainda é um elemento válido para os navegadores.

```css
.carousel input {
  position: absolute;
  left: -10000px;
}
```

Vamos deixar o carrossel responsivo e utilizar todo o espaço disponível.


```css
.carousel {
  width: 100%;
  height: 100%;
}

.carousel__stage {
  overflow: hidden;
  font-size: 0;
  white-space: nowrap;
  width: 100%;
  height: 100%;
  transition: text-indent 600ms;
  position: relative;
}

.carousel__item {
  display: inline-block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-indent: 0;
  opacity: 0.6;
  text-align: center;
}

.carousel__image {
  height: 100%;
  width: auto;
  display: inline-block;
}
```

Posicionamento dos botões Próximo / Anterior. Repare que o elemento stage é quem tem posicionamento relative, então todos os botões serão alinhados a ele. Como os botões terão sua visibilidade oculta por padrão, ao movimentarmos de um item para o outro, vamos exibir os botões corretamente, dando uma ilusão para o usuário que o botão não mudou.

```css
.carousel__next,
.carousel__prev {
  display: none;
  position: absolute;
  top: 50%;
  color: #FFF;
  background: rgba(255, 255, 255, 0.15);
  z-index: 1;
  font-size: 1rem;
  padding: 20px;
  cursor: pointer;
}

.carousel__prev {
  left: 0;
}

.carousel__prev:after {
  content: ' << ';
  display: inline-block;
}

.carousel__next {
  right: 0;
}

.carousel__next:after {
  content: ' >> ';
  display: inline-block;
}
```

Agora é aonde a mágica começa.

Será utilizado o seletor **:checked** do css para sabermos qual é o input radio que está selecionado no momento.
Vamos começar apenas alterando a opacidade do item atual:

```css
#carousel1:checked ~ .carousel__stage .carousel__item:nth-child(1),
#carousel2:checked ~ .carousel__stage .carousel__item:nth-child(2), 
#carousel3:checked ~ .carousel__stage .carousel__item:nth-child(3), 
#carousel4:checked ~ .carousel__stage .carousel__item:nth-child(4) {
  opacity: 1;
}
```

Agora que já sabemos como o radio interfere nos elementos, podemos utilizar <u>text-indent</u> do próprio CSS para movimentarmos o stage e dar a impressão de animação.

Nesta etapa temos que fazer um seletor para cada "estado" da animação:

```css
#carousel1:checked ~ .carousel__stage {
  text-indent: 0;
}

#carousel2:checked ~ .carousel__stage {
  text-indent: -100%;
}

#carousel3:checked ~ .carousel__stage {
  text-indent: -200%;
}

#carousel4:checked ~ .carousel__stage {
  text-indent: -300%;
}
```

Para finalizar, vamos fazer a mágica de só mostrar os botões referentes ao item atual no stage:

```css
#carousel1:checked ~ .carousel__stage .carousel__item:nth-child(1) .carousel__prev,
#carousel1:checked ~ .carousel__stage .carousel__item:nth-child(1) .carousel__next,
#carousel2:checked ~ .carousel__stage .carousel__item:nth-child(2) .carousel__prev,
#carousel2:checked ~ .carousel__stage .carousel__item:nth-child(2) .carousel__next,
#carousel3:checked ~ .carousel__stage .carousel__item:nth-child(3) .carousel__prev,
#carousel3:checked ~ .carousel__stage .carousel__item:nth-child(3) .carousel__next,
#carousel4:checked ~ .carousel__stage .carousel__item:nth-child(4) .carousel__prev,
#carousel4:checked ~ .carousel__stage .carousel__item:nth-child(4) .carousel__next {
  display: block;
}
```

## Resultado final

<iframe height='600' scrolling='no' title='Responsive carousel plugin with pure CSS' src='//codepen.io/carlos-algms/embed/LWKobw/?height=600&theme-id=dark&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/carlos-algms/pen/LWKobw/'>Responsive carousel plugin with pure CSS</a> by Carlos Gomes (<a href='http://codepen.io/carlos-algms'>@carlos-algms</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>
