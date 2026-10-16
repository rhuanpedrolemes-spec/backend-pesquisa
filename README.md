# Tradição do Boleiro — Backend

API da pesquisa de satisfação da barbearia Tradição do Boleiro (Node.js + Express + Mongoose/MongoDB Atlas).

## Schema — modelo `Resposta`

| Campo                | Tipo    | Obrigatório | Observações                                                                 |
|-----------------------|---------|-------------|------------------------------------------------------------------------------|
| `clienteNome`         | String  | Sim         | Nome do cliente, coletado antes da primeira pergunta                        |
| `clienteWhatsapp`     | String  | Sim         | WhatsApp do cliente, coletado antes da primeira pergunta                    |
| `barbeiro`            | ObjectId| Sim         | Barbeiro que atendeu (ref. `Barbeiro`) — a avaliação fica vinculada a ele   |
| `notaBarbeiro`        | Number  | Sim         | Estrelas **inteiras de 1 a 5** dadas ao barbeiro                            |
| `clienteWhatsappNormalizado` | String | automático | Só dígitos do WhatsApp, usado para detectar envio duplicado           |
| `notaAtendimento`     | Number  | Não         | **Legado** (1 a 10) das respostas antigas, antes das estrelas por barbeiro   |
| `assinante`           | Boolean | Não         | **Legado** (questionário antigo)                                             |
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

> **Questionário atual:** a pesquisa só pergunta nome/WhatsApp, barbeiro e estrelas (1 a 5). Os campos `notaAtendimento`, `assinante`, `satisfacaoAssinatura`, `satisfacaoGeral`, `comentario`, `frequenciaCorte`, `objecao`, `interessePlano`, `indicacaoNome` e `indicacaoWhatsapp` são **legado**: não são mais enviados nem obrigatórios, e continuam no schema apenas para exibir as respostas antigas no painel. O `POST /api/respostas` só aceita `clienteNome`, `clienteWhatsapp`, `barbeiro` e `notaBarbeiro`.

### Modelo `Barbeiro` e ranking

Coleção `Barbeiro` (`nome`, `slug`), criada/completada automaticamente na inicialização do servidor (seed idempotente, nunca apaga nem altera avaliações). A foto de cada um fica no frontend em `/barbeiros/<slug>.jpg`.

`GET /api/barbeiros` (público) devolve os barbeiros já na ordem do ranking, com `totalAvaliacoes` e `media`:

1. mais avaliações primeiro (o ranking é por **quantidade**, não por nota);
2. empate → maior média;
3. novo empate → ordem alfabética pelo nome.

`media` = soma das notas ÷ quantidade (média aritmética, valores originais); o arredondamento para 1 casa (`4,8`) é feito só na exibição. Só contam avaliações válidas (`notaBarbeiro` inteira de 1 a 5 e barbeiro existente), cada resposta uma única vez. Recalculado a cada chamada, então exclusões e novas avaliações refletem na hora.

Envio duplicado: o `POST /api/respostas` responde `409` se o mesmo WhatsApp (ignorando formatação) avaliar o mesmo barbeiro de novo em menos de 10 minutos.

## Endpoints

| Método | Rota                    | Acesso                                  | Descrição                                        |
|--------|--------------------------|-------------------------------------------|---------------------------------------------------|
| POST   | `/api/respostas`         | Pública                                   | Registra uma nova resposta                         |
| GET    | `/api/barbeiros`         | Pública                                   | Barbeiros ordenados por ranking, com média e nº de avaliações |
| POST   | `/api/admin/login`       | Pública                                   | Autentica o administrador e retorna um JWT         |
| GET    | `/api/respostas`         | Protegida (header `Authorization: Bearer <token>`) | Lista todas as respostas, mais recentes primeiro |
| GET    | `/api/respostas/resumo`  | Protegida (header `Authorization: Bearer <token>`) | Total de respostas e médias de `notaBarbeiro`/`notaAtendimento` (legado)/`satisfacaoGeral` |
| DELETE | `/api/respostas/:id`     | Protegida (header `Authorization: Bearer <token>`) | Exclui uma resposta pelo id (`204` ao excluir, `404` se não existir) |

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
