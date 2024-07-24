# Pokegrid

Esta página web obtiene dinámicamente la lista de Pokemon de la [PokeAPI](https://pokeapi.co/docs/v2) para presentarla mediante un sistema de grilla paginada. La grilla se hace visible al hacer click en el botón de start. Se puede avanzar en las páginas mediante botones y filtrar los Pokemon según su nombre. Al hacer click en un Pokemon se puede acceder a su entrada Pokedex, donde se puede ver su información y escuchar su grito al hacer click en su imagen.

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
