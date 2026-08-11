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

| Método | Rota                    | Acesso                                  | Descrição                                        |
|--------|--------------------------|-------------------------------------------|---------------------------------------------------|
| POST   | `/api/respostas`         | Pública                                   | Registra uma nova resposta                         |
| POST   | `/api/admin/login`       | Pública                                   | Autentica o administrador e retorna um JWT         |
| GET    | `/api/respostas`         | Protegida (header `Authorization: Bearer <token>`) | Lista todas as respostas, mais recentes primeiro |
| GET    | `/api/respostas/resumo`  | Protegida (header `Authorization: Bearer <token>`) | Total de respostas e médias de `notaAtendimento`/`satisfacaoGeral` |

## Autenticação do painel administrativo

O acesso às rotas administrativas não usa mais PIN — agora é login com usuário/senha, que retorna um token JWT (válido por 7 dias) a ser enviado em `Authorization: Bearer <token>` nas chamadas protegidas.

Variáveis de ambiente necessárias:

```
ADMIN_USERNAME=      # usuário do administrador, texto puro
ADMIN_PASSWORD_HASH= # hash bcrypt da senha (veja abaixo como gerar)
JWT_SECRET=          # string aleatória e secreta, usada para assinar/verificar o token
```

Para gerar o `ADMIN_PASSWORD_HASH` a partir de uma senha em texto puro:

```bash
node scripts/gerar-hash-senha.js "sua-senha-aqui"
```

O script imprime o hash bcrypt no terminal — copie o valor gerado e cole em `ADMIN_PASSWORD_HASH` no `.env` (local) ou nas variáveis de ambiente do Render (produção). `JWT_SECRET` pode ser qualquer string longa e aleatória (ex.: gerada com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).

## Rodando localmente

```bash
npm install
cp .env.example .env   # preencha MONGODB_URI, ALLOWED_ORIGIN, ADMIN_USERNAME, ADMIN_PASSWORD_HASH, JWT_SECRET
npm run dev
```

## Deploy

Publicado no Render como Web Service — root directory é a raiz deste repositório, build command `npm install`, start command `npm start`. Veja as variáveis de ambiente em `.env.example`.
