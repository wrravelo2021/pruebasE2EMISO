## Pre-requisitos

### Tecnologías

- Node.js ≥ v15.14.0
- Ruby ≥ 2.6.5
- Ghost v3.3.0

### Credenciales

Para las pruebas se debe crear un usuario de Ghost que luego debe ser remplazado en los archivos de pruebas como se indican en las instrucciones.

## Playwright 🎭

A continuación se presentan las instrucciones para ejecutar las pruebas desarrolladas con playwright luego de clonar el repositorio desde la carpeta principal.

1. Ir a la carpeta con las pruebas de playwright

    ```bash
    cd playwright/
    ```

2. Instalar las dependencias

    ```bash
    npm install
    ```

3. Modificar URL y accesos del usuario

    En el archivo **/playwright/config.js** modificar la llave **url** y el objeto **credentials** con las credenciales correspondientes creadas anteriormente en ghost.

    ```json
    {
        "url": "http://localhost:2368/ghost",
        "credentials": {
            "email": "test@gmail.com",
            "password": "pruebasmiso"
        },
        "pathScreenshots": "./screenshots/3.42.5/",
        "viewportHeight": 600,
        "viewportWidth": 800
    }
    ```

4. Correr las pruebas

    ```bash
    npm test
    ```

## Kraken 🐙

A continuación se presentan las instrucciones para ejecutar las pruebas desarrolladas con kraken luego de clonar el repositorio desde la carpeta principal.

1. Ir a la carpeta con las pruebas de kraken

    ```bash
    cd kraken/
    ```

2. Instalar las dependencias

    ```bash
    bundle install
    ```

3. Modificar URL y accesos del usuario

    En el archivo **/kraken/features/web/step_definitions/web_steps.rb** modificar las lineas bajo el comentario **Credentials** con las correspondientes creadas anteriormente en ghost.

    ```ruby
    # Credentials
    page_url = 'http://localhost:2371/ghost' # URL donde esta desplegado Ghost
    user_email = 'test@gmail.com' # Email del usuario
    user_password = 'pruebasmiso' # Contraseña del usuario
    ```

4. Correr las pruebas

    ```bash
    bundle exec kraken-mobile run
    ```

## Reporte BackstopJS 🗄

A continuación se presentan las instrucciones para ejecutar el reporte generado por BackstopJS que se especificó para comparar las diferencias entre la versión 3.3.0 y 3.42.5 de Ghost para las funcionalidades F18 en Kraken y F10 en Playwright. La descripción de las funcionalidades se puede encontrar acá: [Listado escenarios](https://github.com/wrravelo2021/pruebasE2EMISO/wiki/Listado-de-escenarios-de-prueba).

1. Ir a la carpeta con las especificaciones de BackstopJS

  ```bash
  cd backstop/
  ```

2. Instalar BackstopJS

  ```bash
  npm install -g backstopjs
  ```

3. Guardar las imágenes de referencia

  ```bash
  backstop reference
  ```

4. Ejecutar pruebas y reporte

  ```bash
  backstop test
  ```
  
### Demo reporte BackstopJS

En el siguiente link se encuentra el resultado de la ejecución de backstop. [Demo](https://wrravelo2021.github.io/pruebasE2EMISO/backstop/backstop_data/html_report/index.html)

## Reporte ResembleJS 🤖

A continuación se presentan las instrucciones para ejecutar el reporte generado por ResembleJS que se especificó para comparar las diferencias entre la versión 3.3.0 y 3.42.5 de Ghost para las funcionalidades F03, F05, F07, F08, F14, F13, F19, F20. La descripción de las funcionalidades se puede encontrar acá: [Listado escenarios](https://github.com/wrravelo2021/pruebasE2EMISO/wiki/Listado-de-escenarios-de-prueba).

1. Ir a la carpeta con las especificaciones de ResembleJS

  ```bash
  cd vrt/
  ```
  
2. Instalar ResembleJS

  ```bash
  npm install -g resemblejs
  ```
  
3. Ejecutar reporte

  ```bash
  node report.js
  ```
  
### Demo reporte ResembleJS

En el siguiente link se encuentra el resultado de la ejecución de ResembleJS en Playwright. [Demo Playwright](https://raw.githack.com/wrravelo2021/pruebasE2EMISO/master/vrt/report-playwright.html)

En el siguiente link se encuentra el resultado de la ejecución de ResembleJS en Kraken. [Demo Kraken](https://raw.githack.com/wrravelo2021/pruebasE2EMISO/master/vrt/report-kraken.html)

## Funcionalidades y escenarios de prueba ⚙️

El listado de funcionalidades que se probaron en este proyecto se puede encontrar en la wiki de este repositorio. Se puede acceder a través del [siguiente link](https://github.com/wrravelo2021/pruebasE2EMISO/wiki/Listado-de-funcionalidades).

De la misma forma, el listado de escenarios de prueba se detalla en la wiki, con los casos de prueba de cada uno y el responsable de su desarrollo. Se puede acceder a través de [este link](https://github.com/wrravelo2021/pruebasE2EMISO/wiki/Listado-de-escenarios-de-prueba).
