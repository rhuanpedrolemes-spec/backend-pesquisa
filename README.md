# Tradição do Boleiro — Backend

API da pesquisa de satisfação da barbearia Tradição do Boleiro (Node.js + Express + Mongoose/MongoDB Atlas).

## Schema — modelo `Resposta`

| Campo                | Tipo    | Obrigatório | Observações                                                                 |
|-----------------------|---------|-------------|------------------------------------------------------------------------------|
| `clienteNome`         | String  | Sim         | Nome do cliente, coletado antes da primeira pergunta                        |
| `clienteWhatsapp`     | String  | Sim         | WhatsApp do cliente, coletado antes da primeira pergunta                    |
| `notaAtendimento`     | Number  | Não         | 1 a 10                                                                       |
| `assinante`           | Boolean | Sim         |                                                                               |
| `satisfacaoAssinatura`| Number  | Não         | 1 a 10                                                                       |
| `satisfacaoGeral`     | Number  | Não         | 1 a 10                                                                       |
| `comentario`          | String  | Não         |                                                                               |
| `frequenciaCorte`     | String  | Não         | `"1 vez"` \| `"2 vezes"` \| `"3 vezes"` \| `"4 vezes ou mais"`               |
| `objecao`             | String  | Não         | `"Sairia muito caro"` \| `"Não tenho tempo"` \| `"Não vejo motivo de cortar mais vezes"` |
| `interessePlano`      | String  | Não         | `"Sim"` \| `"Não"`                                                          |
| `indicacaoNome`       | String  | Não         | Nome do amigo indicado                                                       |
| `indicacaoWhatsapp`   | String  | Não         | WhatsApp do amigo indicado                                                   |
| `criadoEm`            | Date    | automático  | timestamp de criação                                                         |

`clienteNome` e `clienteWhatsapp` são obrigatórios e não podem ser vazios (`minlength: 1` após `trim`) — o `POST /api/respostas` retorna `400` se estiverem ausentes ou em branco.

## Endpoints

| Método | Rota                    | Acesso                            | Descrição                                        |
|--------|--------------------------|------------------------------------|---------------------------------------------------|
| POST   | `/api/respostas`         | Pública                            | Registra uma nova resposta                         |
| GET    | `/api/respostas`         | Protegida (header `x-admin-pin`)   | Lista todas as respostas (todos os campos, incluindo `clienteNome`/`clienteWhatsapp`), mais recentes primeiro |
| GET    | `/api/respostas/resumo`  | Protegida (header `x-admin-pin`)   | Total de respostas e médias de `notaAtendimento`/`satisfacaoGeral` |

## Rodando localmente

```bash
npm install
cp .env.example .env   # preencha MONGODB_URI, ADMIN_PIN, ALLOWED_ORIGIN
npm run dev
```

## Deploy

Publicado no Render como Web Service — root directory é a raiz deste repositório, build command `npm install`, start command `npm start`. Veja as variáveis de ambiente em `.env.example`.
