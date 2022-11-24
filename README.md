# Productos Chain (frontend)
El frontend de la aplicación descentralizada (DApp) Productos Chain.

## Instalacíon

```
$ npm install
```

## Requerimientos
```
Node >= 14
Angular = 13
Metamask
```

## Descripción

Frontend del proyecto Productos Chain, un crud básico de productos y una sección de autenticación usando angular, ngrx, socket.io-client y metamask. 

Para que este proyecto funcione es requerido configurar previamente el [backend](https://github.com/alvaro-7x/productos-chain-backend) de Productos Chain.

Para notificar a los usuarios cuando una transacción exitosa es realizada se utiliza socket.io-client.


## Desplegar el proyecto

En ambos casos tanto en desarrollo como en producción, deberá tener instalado [Metamask](https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/).

En desarrollo
* Mostrar las redes de prueba:
  1. En el navegador haga clic en el icono de metamask ubicado en la parte superior derecha, esto abrirá una ventana pop-up.
 
  1. En la ventana pop-up recientemente abierta haga clic en el boton del medio,  el que se encuentra al lado derecho del icono de metamask, esto mostrará la sección de Redes (Networks), en este sección haga clic en **Mostrar/ocultar redes de prueba** (**Show/hide test networks**).
 
  1. Ahora se le mostrará otra sección **Avanzado** (**Advanced**), en esta sección habilite la opción **Mostrar redes de prueba** (**Show test networks**).
 
  1. Finalmente y seleccione la red **localhost:8545**.
 
* Debe tener configurado el [backend de desarrollo](https://github.com/alvaro-7x/productos-chain-backend).

* Abrir una terminal y dirijirse a la raiz del presente proyecto y ejecute el comando:
```
ng serve
```
Esto iniciará un servidor de desarrollo. Seguidamente abra su navegador de preferencia y navegue a **http://localhost:4200**.

* Obtener ethers de prueba para metamask. Hasta aquí se considera que ya tiene instalado metamask y configurado el [backend de desarrollo](https://github.com/alvaro-7x/productos-chain-backend). De esta manera con la terminal de ganache-cli ejecutanse se requiere que copie la **Private Key número 1**, puesto que la número 0 (cero) es utilizada para la migración del contrato.

 <img src="/images/ganache.jpg" width="400px"><br>

* Para importar la **Private Key número 1** en metamask siga los siguientes pasos:
 
  1. En el navegador haga clic en el icono de metamask ubicado en la parte superior derecha, esto abrirá una ventana pop-up.
 
  1. En la ventana pop-up recientemente abierta haga clic en el icono circular ubicado en la esquina superior derecha justo al lado del indicador de red.

  1. Seguidamente haga clic en **Import Account**.

  1. Ahora podrá ver la sección de importacion, aqui deberá pegar la **Private Key número 1** y finalmente hacer clic en **Import**. Ahora podra ver que ya cuenta con ethers de prueba para interactuar con la aplicación Productos Chain. [Ver ejemplo](https://metamask.zendesk.com/hc/en-us/articles/360015489331-How-to-import-an-Account).


En producción
* Configurar la variable **url** dentro del archivo **environment.prod.ts**.
* Abrir una terminal y dirijirse a la raiz del presente proyecto y ejecutar el comando:
```
ng build --aot --vendor-chunk --common-chunk --delete-output-path --build-optimizer --optimization --progress
```
 Esto construira el proyecto y el resultado lo almacenará en la carpeta `dist/`.


* **Las siguientes indicaciones son para `interactuar` con la aplicación, considerando que tanto backend y frontend están en producción.**

* Seleccionar la red de Goerli:
  1. En el navegador haga clic en el icono de metamask ubicado en la parte superior derecha, esto abrirá una ventana pop-up.
 
  1. En la ventana pop-up recientemente abierta haga clic en el boton del medio,  el que se encuentra al lado derecho del icono de metamask, esto mostrará la sección de Redes (Networks), en este sección haga clic en la red Goerli.
 

* Obtener [ethers de prueba](https://faucets.chain.link/) de la tesnet de Goerli.


## ¿Y ahora que sigue?

Este proyecto es solo el [**frontend**](https://github.com/alvaro-7x/productos-chain-frontend) del proyecto completo, para poder verlo en funcionamiento en un entorno de desarrollo deberá configurar el [**backend**](https://github.com/alvaro-7x/productos-chain-backend).

## Capturas

<img src="/images/productos-chain-1.png" width="400px"> 
<img src="/images/productos-chain-2.png" width="400px"><br>
<img src="/images/productos-chain-3.png" width="400px">
<img src="/images/productos-chain-4.png" width="400px"><br>
<img src="/images/productos-chain-5.png" width="400px">
<img src="/images/productos-chain-6.png" width="400px"><br>

## Ver proyecto
[Clic aquí para ver el proyecto completo en funcionamiento](https://productos-chain.up.railway.app/#/auth/login)

