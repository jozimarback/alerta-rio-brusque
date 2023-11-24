# Alerta nível rio Brusque

Node app para notificar com alarme, quando nivel de rio de Brusque(Ponte Estaiada) ultrapassar limite de risco informado.

### Como utilizar:
- Instalar node:

    https://nodejs.org/en

- Clonar repo:
    ```shell
    git clone https://github.com/jozimarback/alerta-rio-brusque.git
    ```
- Instalar pacotes node antes da primeira execução:
    ```shell
    npm install
    ```
- Iniciar app via node:
    ```shell
    node index.js
    ```
- Informar local e valor em metros para monitorar:
![cmd-node](./docs/rodar_node.gif)

Ao atingir valor um som de sirene ira tocar em sua máquina.