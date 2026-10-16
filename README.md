# Portfólio · Gustavo Ribas Silestrino

Portfólio em formato de **desktop de sistema operacional**: janelas arrastáveis, cards soltos, avatar animado,
terminal, idioma PT/EN, tema claro/escuro e 9 paletas de cor. Também tem uma versão pensada para celular.

🔗 **https://portifolio-ribas2.vercel.app**

## Créditos

O conceito visual deste portfólio foi **inspirado no portfólio de [Jonathan Bergamo](https://www.linkedin.com/in/jonathanbergamo/)**
(jonathanbergamo.vercel.app). Todo o código, textos, imagens e conteúdo aqui são próprios.
Obrigado pela inspiração, Jonathan!

## Tecnologias

- React 19 + Vite
- Tailwind CSS 3
- Framer Motion
- Dados reais por APIs públicas: Open-Meteo (clima) e GitHub (atividade)
- Música via API oficial do YouTube

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera a pasta dist
```

## Onde editar o conteúdo

Quase tudo (textos, projetos, experiência, contatos, música) fica em [`src/data.js`](src/data.js).
