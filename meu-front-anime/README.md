# 🎬 Cine-Filme Anime Streaming & AI Hub

Uma plataforma moderna e futurista de streaming e interação para entusiastas de animes. O projeto combina o consumo de dados em tempo real de catálogos globais com um ecossistema de **Inteligência Artificial (LLM)** e comunicação bi-direcional em tempo real.

---

## 🔗 Links do Projeto

- **Live Demo (Site no Ar):** [CLIQUE AQUI PARA ACESSAR](INSIRA_O_LINK_DA_RENDER_AQUI)
- **Repositório Oficial:** [CLIQUE AQUI PARA VER O CÓDIGO](https://github.com/daniel-20px/My-platform-Cine-Anime.git)

---

## 🚀 Diferenciais Técnicos & Arquitetura (O que ganha destaque)

Este projeto foi construído utilizando conceitos modernos de engenharia de software e integração de IA generativa no ecossistema JavaScript:

- **Monorepo Otimizado para a Render (Sistemas Baseados em Linux):** O projeto utiliza uma estrutura de subdiretórios integrada. O script de build faz a ponte entre as pastas, instala as dependências do React, compila os arquivos de forma estática e move o resultado final para o servidor Express utilizando comandos multiplataforma (`mv`).
- **Recomendador Inteligente com Gemini 3.5 Flash:** Integração direta com o SDK `@google/genai`. O sistema interpreta o contexto da linguagem natural da pergunta do usuário e devolve uma recomendação precisa baseada estritamente no catálogo filtrado.
- **Engenharia de Prompt (Structural JSON Output):** Aplicação de instruções de sistema estruturadas para forçar o modelo de IA a responder estritamente em formato JSON limpo, sem blocos markdown, garantindo a integridade da tipagem no recebimento do backend.
- **Mecanismo Double-Layer de Resiliência (Smart Fallbacks):** O backend conta com um mecanismo inteligente de interceptação de erros (`try/catch`). Caso o modelo de IA ou a API do Jikan sofram oscilações (como erros de limite de requisições `429` ou indisponibilidade `503`), o sistema ativa um catálogo local robusto de 16 títulos ou faz filtragem por palavras-chave por categorias (**Romance, Sci-Fi, Comédia ou Ação**). Isso impede que a aplicação trave em loops ou telas pretas.
- **Sala de Chat Global Otimizada (WebSockets):** Comunicação bidirecional e instantânea gerenciada por `Socket.io`. O fluxo de efeitos do React foi travado estrategicamente para isolar a conexão, resolvendo o bug crítico de criação de "usuários duplicados/fantasmas" no servidor enquanto o usuário digita seu apelido.

---

## 📁 Estrutura de Pastas do Projeto

```text
my-site-api-integration/   <-- Pasta Raiz (Inicie o Git aqui)
├── meu-front-anime/       <-- Frontend em React.js (Vite)
└── API_IA/                <-- Servidor Backend em Node.js (Express & Socket.io)
    ├── controllers/
    ├── services/
    ├── server.js
    └── package.json
```

---

## 🛠️ Tecnologias Utilizadas

### Backend (`API_IA`)
- **Node.js** & **Express**
- **Socket.io** (Orquestração de WebSockets para o chat global)
- **@google/genai** (Integração com Google Gemini API)
- **Fetch API** (Consumo da API REST Jikan/MyAnimeList v4)

### Frontend (`meu-front-anime`)
- **React.js** (Single Page Application hospedada no servidor)
- **Vite** (Build Tool de alta performance)
- **Socket.io-Client** (Comunicação em tempo real)
- **CSS3 Avançado** (Estética Cyberpunk/Sci-Fi com efeito Glassmorphism e Neon Glow)

---

## 🧠 Engenharia de Resiliência: Como o Sistema reage a falhas?

Para garantir uma experiência de usuário sem interrupções (*Zero-Downtime Feel*), o fluxo de recomendação foi blindado logicamente:

1. O usuário faz uma pergunta no chat (ex: *"Quero ver um romance de escola"*).
2. O sistema tenta buscar dados atualizados via API REST e processar via inteligência artificial.
3. Se qualquer uma das conexões externas falhar por sobrecarga, a lógica limpa o texto, identifica as palavras-chave e entrega componentes com players de `/embed/` do YouTube funcionais e imagens indexadas anti-bloqueio.

---

## 💻 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js instalado
- Uma API Key do Google Gemini (obtida no Google AI Studio)

### Passos para Inicialização Unificada
```bash
# Clone o repositório
git clone https://github.com

# Acesse a pasta do backend onde fica o orquestrador de build
cd my-site-api-integration/API_IA

# Instale todas as dependências do servidor
npm install

# Crie um arquivo .env dentro da pasta API_IA e adicione sua chave do Gemini
GEMINI_API_KEY=sua_chave_aqui

# Execute o script de build unificado (Compila o React e move o conteúdo para o servidor)
npm run build

# Inicie a aplicação Fullstack unificada
npm start
```
Acesse o endereço indicado no terminal (geralmente `http://localhost:3000`).

---

## 🚀 Como Configurar o Deploy na Render

Ao conectar o seu repositório do GitHub na plataforma **Render**, crie um **Web Service** e configure o painel com as seguintes opções exatas:

1. **Root Directory:** `API_IA`
2. **Build Command:** `npm run build`
3. **Start Command:** `npm start`
4. **Environment Variables (Aba Advanced):** Adicione a chave `GEMINI_API_KEY` com o valor gerado no seu painel da Google AI Studio.

*(Nota: O servidor gerencia o provisionamento da porta via `process.env.PORT` de forma automática na nuvem).*

---
Desenvolvido com foco em Integração de LLMs, Performance de Estados e Comunicação Real-time. 🎬🍿
