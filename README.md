## Pre-requisitos

### Tecnología

- Node.js ≥ v15.14.0
- Ruby ≥ 2.6.5
- Ghost v3.3.0

### Credenciales 🎭

Para las pruebas se debe crear un usuario de Ghost que luego debe ser remplazado en los archivos de pruebas como se indican en las instrucciones.

## Playwright

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

    En el archivo **/playwright/test.js** modificar las lineas bajo el comentario **Credentials** con las credenciales correspondientes creadas anteriormente en ghost.

    ```jsx
    // Credentials
    const url = 'http://localhost:2368/ghost'; // URL donde esta desplegado Ghost
    let email = "test@gmail.com"; // Email del usuario
    let password = "pruebasmiso"; // Contraseña del usuario
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
    page_url = 'http://localhost:2371/ghost'
    user_email = 'test@gmail.com'
    user_password = 'pruebasmiso'
    ```

4. Correr las pruebas

    ```bash
    bundle exec kraken-mobile run
    ```
