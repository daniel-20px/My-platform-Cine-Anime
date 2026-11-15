# 🎬 Cine-Filme Anime Streaming & AI Hub

Uma plataforma moderna e futurista de streaming e interação para entusiastas de animes. O projeto combina o consumo de dados em tempo real de catálogos globais com um ecossistema de **Inteligência Artificial (LLM)**, proteção de API e comunicação bidirecional em tempo real.

---

## 🔗 Links do Projeto

- **Live Demo (Site no Ar):** [CLIQUE AQUI PARA ACESSAR](https://my-platform-cine-anime.onrender.com)

- **Repositório Oficial:** [CLIQUE AQUI PARA VER O CÓDIGO](https://github.com/daniel-20px/My-platform-Cine-Anime)

---

## 🤝 Metodologia de Desenvolvimento (Humano + IA)

Este projeto foi desenvolvido com **apoio de Inteligência Artificial como ferramenta de produtividade e pair programming**. Toda a arquitetura, regras de negócio, integração, estruturação de componentes e revisão de código foram conduzidas e implementadas por mim, utilizando a IA de forma estratégica para acelerar entregas, depurar problemas complexos e refinar boas práticas.

---

## 🚀 Diferenciais Técnicos, Segurança & Arquitetura

Este projeto foi construído utilizando conceitos modernos de engenharia de software, segurança de APIs e integração de IA generativa no ecossistema JavaScript:

### 🔒 Segurança e Performance no Backend
- **Política de CORS Restrita:** Configuração explícita de origens permitidas no Express, substituindo o acesso aberto anterior para proteger a API contra requisições não autorizadas de domínios externos.
- **Proteção contra Abuso (Rate Limiting):** Implementação de limitador de requisições por IP/usuário, bloqueando automaticamente tráfego excessivo caso ultrapasse o limite de **100 requisições por minuto**. Isso previne ataques de força bruta, spam e estouro de cota da API de IA.
- **Mecanismo Double-Layer de Resiliência (Smart Fallbacks):** O backend conta com interceptação de erros (`try/catch`). Caso o modelo de IA ou a API do Jikan sofram oscilações (como limites de requisições `429` ou indisponibilidade `503`), o sistema ativa um catálogo local de 16 títulos ou filtra por palavras-chave (**Romance, Sci-Fi, Comédia ou Ação**), evitando travamentos.

### 🧠 Inteligência Artificial & Real-Time
- **Recomendador Inteligente com Google Gemini:** Integração direta com o SDK `@google/genai`. O sistema interpreta o contexto em linguagem natural da pergunta do usuário e devolve uma recomendação precisa baseada no catálogo filtrado.
- **Engenharia de Prompt (Structured JSON Output):** Instruções de sistema estruturadas que forçam o modelo a responder em formato JSON limpo, sem blocos markdown, garantindo integridade na tipagem recebida pelo backend.
- **Sala de Chat Global Otimizada (WebSockets):** Comunicação bidirecional instantânea via `Socket.io`. O ciclo de vida (`useEffect`) do React foi isolado estrategicamente para manter a conexão estável, resolvendo a criação de "usuários fantasmas" enquanto o usuário digita seu apelido.

### 🎨 Interface, Mobile & Infraestrutura
- **Responsividade Dedicada para Mobile:** Layout adaptado especificamente para telas pequenas (smartphones), garantindo navegação fluida, ajuste proporcional de players e leitura confortável em dispositivos móveis.
- **Monorepo Otimizado para a Render (Ambiente Linux):** Estrutura de subdiretórios integrada onde o script de build compila o React e move os arquivos estáticos para o servidor Express via shell Linux (`mv`).

---

## 🗺️ Roadmap (Próximas Atualizações)

- [ ] **Menu Flutuante de Configurações (UI Implementada / Em Desenvolvimento):** Já está presente na interface um botão flutuante em formato de bolha com ícone de engrenagem. Atualmente atua como elemento visual preparatório e receberá funcionalidades interativas (como temas, preferências de player e ajustes de acessibilidade) nas próximas versões.

---

## 📁 Estrutura de Pastas do Projeto

```text
My-platform-Cine-Anime/    <-- Pasta Raiz do Repositório
├── meu-front-anime/       <-- Frontend em React.js (Vite)
├── API_IA/                <-- Servidor Backend em Node.js (Express & Socket.io)
│   ├── controllers/
│   ├── services/
│   ├── server.js
│   └── package.json
└── package.json           <-- Configurações globais do repositório
```

---

## 🛠️ Tecnologias Utilizadas

### Backend (`API_IA`)
- **Node.js** & **Express**
- **CORS & Express Rate Limit** (Segurança e controle de tráfego)
- **Socket.io** (Orquestração de WebSockets para o chat global)
- **@google/genai** (Integração com Google Gemini API)
- **Fetch API** (Consumo da API REST Jikan/MyAnimeList v4)

### Frontend (`meu-front-anime`)
- **React.js** (Single Page Application servida pelo backend)
- **Vite** (Build Tool de alta performance)
- **Socket.io-Client** (Comunicação em tempo real)
- **CSS3 Avançado & Media Queries** (Estética Cyberpunk/Sci-Fi com Glassmorphism, Neon Glow e responsividade mobile)

---

## 💻 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** instalado (v18+ recomendado)
- Uma **API Key do Google Gemini** (gerada no Google AI Studio)

### Passos para Inicialização Unificada
```bash
# 1. Clone o repositório
git clone https://github.com/daniel-20px/My-platform-Cine-Anime

# 2. Acesse a pasta do backend onde fica o orquestrador de build
cd My-platform-Cine-Anime/API_IA

# 3. Instale as dependências do servidor
npm install

# 4. Crie o arquivo .env na pasta API_IA com a chave da IA e a origem permitida no CORS
cat << 'EOF' > .env
GEMINI_API_KEY=sua_chave_aqui
FRONTEND_URL=http://localhost:3000
EOF

# 5. Execute o build unificado (Compila o React e move os arquivos para o servidor)
npm run build

# 6. Inicie a aplicação Fullstack
npm start
```
Acesse o endereço exibido no terminal (geralmente `http://localhost:3000`).

---

## 🚀 Como Configurar o Deploy na Render

Ao conectar o repositório do GitHub na plataforma **Render**, crie um **Web Service** e configure o painel com as seguintes opções:

1. **Root Directory:** `API_IA`
2. **Build Command:** `npm run build`
3. **Start Command:** `npm start`
4. **Environment Variables (Aba Advanced):**
   - `GEMINI_API_KEY`: Sua chave gerada no Google AI Studio.
   - `FRONTEND_URL`: `https://onrender.com`

*(Nota: O servidor gerencia o provisionamento da porta via `process.env.PORT` de forma automática na nuvem).*


---
Desenvolvido por **Daniel** (com assistência de IA) — Foco em Integração de LLMs, Segurança de APIs e Comunicação Real-time. 🎬🍿
