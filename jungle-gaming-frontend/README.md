# Jungle Gaming — Front-end MVP

Front-end simples em HTML, CSS e JavaScript puro para enviar apostas ao backend NestJS.

## Requisitos

- Backend rodando localmente, por padrão em `http://localhost:3000`.
- Navegador moderno.
- O backend precisa permitir requisições CORS da origem usada para abrir este front-end.

## Executarw

A forma mais simples é servir os arquivos com um servidor HTTP local. No Debian, com Python instalado:

```bash
cd jungle-gaming-frontend
python3 -m http.server 8080
```

Abra `http://localhost:8080`.

Não é obrigatório usar Python no projeto; ele serve apenas para disponibilizar os arquivos estáticos localmente. Também é possível usar uma extensão de servidor local no editor.

## Configuração da API

No painel “Conexão com a API”, informe a URL base, normalmente:

```text
http://localhost:3000
```

A interface envia `POST /wagering/transactions` com o cabeçalho `Idempotency-Key`.

O formulário usa os campos conhecidos do contrato atual: `providerId`, `externalTransactionId`, `playerId`, `currency`, `amount`, `roundId` e `gameId`. O endpoint e o DTO do backend devem ser conferidos antes de usar em outra versão do projeto.

## Uso de inteligência artificial

Este front-end foi desenvolvido com auxílio de uma ferramenta de inteligência artificial (IA). O código foi gerado como ponto de partida para o MVP e deve ser revisado, testado e ajustado conforme necessário para garantir sua integração correta com o backend.

## Observações

- O backend é a fonte da verdade para saldo e resultado financeiro.
- O formulário atual envia apostas BET, conforme a implementação inicial do backend.
- A interface não cria carteiras, não altera saldos e não simula histórico.
- Se o navegador informar erro de CORS, configure o CORS no NestJS para permitir a origem local do front-end.
- Não use credenciais ou segredos no código do navegador.
