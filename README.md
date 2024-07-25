# Pokegrid

Esta página web obtiene dinámicamente la lista de Pokemon de la [PokeAPI](https://pokeapi.co/docs/v2) para presentarla mediante un sistema de grilla paginada.

En el Landing Page hay un globo del planeta con Icónos de Pokemones aleatoreos, estos pueden ser shiny y hacerles hover confirma este hecho.

Al hacer click en el botón de start la grilla con la lista de Pokemon se hace visible. Se puede avanzar a través de páginas mediante botones y filtrar los Pokemon según su nombre. También se pude activar a una pestaña con los pokemones marcados como favoritos.

Al hacer click en un Pokemon se puede acceder a su entrada Pokedex, donde se puede ver su información y escuchar su grito al hacer click en su sprite. Con los botones se puede volver a la lista, rotar el sprite, agregar a favoritos y ver las distintas descripciones del pokemón a través de los juegos (indicando su juego de origen) con las flechas.

## Instalación

Utilizar npm para instalar dependencias:

````shell
    npm i
````

## Uso

Se pueden utilizar comandos nativos de npm o los comandos simplificados del Makefile

````shell
# para acceder mediante localhost
    npm run dev
# --------------------
    make local

# para acceder mediante red
    npm run host
# --------------------
    make net
````
