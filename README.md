# MyAnimeHub

Catálogo de animes e mangás desenvolvido com Next.js 14, React 18, TypeScript e Tailwind CSS. Os dados são fornecidos pela [API GraphQL do AniList](https://docs.anilist.co/).

## Funcionalidades

- Busca de animes e mangás com filtros e paginação.
- Rankings, títulos em exibição e próximos lançamentos.
- Páginas de detalhes com personagens, equipe, recomendações e resumos de avaliações.
- Agenda semanal de episódios, organizada por dia em UTC.
- Seleção aleatória de títulos com o botão “Surprise me”.
- Metadados por página, compartilhamento em redes sociais e dados estruturados.

## Desenvolvimento

É necessário ter Node.js compatível com Next.js 14 e npm instalados.

```sh
npm install
npm run dev
```

Acesse [localhost:3000](http://localhost:3000).

As consultas públicas ao AniList não exigem chave de API nem variáveis de ambiente. Não é necessário criar um arquivo `.env` para executar o catálogo. A antiga variável `NEXT_PUBLIC_BASE_URL`, usada pelo Jikan, não é mais utilizada.

## Comandos

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Gera a versão de produção. |
| `npm run start` | Serve a versão de produção após o build. |
| `npm run preview` | Executa o build e inicia o servidor de produção. |
| `npm run lint` | Executa a análise estática com ESLint. |
| `npm run typecheck` | Verifica os tipos do TypeScript. |
| `node --test tests/*.test.cjs` | Executa os testes de integração de dados e SEO. |

Para executar em produção localmente:

```sh
npm run build
npm run start
```

## Estrutura do projeto

```text
app/              Rotas, páginas, layouts, sitemap e robots.txt
components/       Componentes de interface e provedores
config/           Configurações de SEO e serviços de dados
config/services/  Integração com AniList e adaptação dos dados
lib/              Utilitários, hooks e funções de SEO
public/           Imagens, ícones e outros arquivos estáticos
styles/           Estilos globais
tests/            Testes de dados e SEO
```

As diretrizes visuais estão em [DESIGN.md](./DESIGN.md).

## Integração com AniList

A integração principal está em [config/services/anilist.ts](./config/services/anilist.ts), que consulta a API e adapta as respostas ao modelo utilizado pela interface.

### Identificadores e filtros

- Os links usam IDs nativos, como `/anime/anilist-154587` e `/manga/anilist-30002`.
- Links legados com IDs numéricos do MyAnimeList são resolvidos pelo campo `idMal` do AniList.
- Os filtros de gênero usam nomes; os antigos IDs de gênero do MyAnimeList não são compatíveis.
- Os formatos de mangá disponíveis são Manga, Novel e Oneshot.
- As notas são convertidas da escala de 100 para 10. Notas ausentes permanecem sem valor.
- A paginação utiliza `hasNextPage`, sem exibir totais imprecisos da API.

### Comportamento das consultas

- A agenda considera a semana atual em UTC, consulta até 50 exibições por dia e mostra até 25 títulos distintos após a filtragem de conteúdo adulto.
- “Surprise me” seleciona um título das primeiras cinco páginas de popularidade do tipo escolhido, um conjunto de até 250 títulos. Se a página sorteada estiver vazia, consulta a primeira página.
- As listagens de mangás filtram conteúdo adulto no servidor da aplicação. Esse tratamento contorna o comportamento registrado no código em que `isAdult: false` retorna listas gerais de mangás vazias. Uma página pode mostrar menos itens após a filtragem; a navegação segue o `hasNextPage` da API.
- Consultas bem-sucedidas ficam em cache no servidor por uma hora. Requisições sem cache são espaçadas em 2,1 segundos por processo, com timeout de 15 segundos.
- O controle de requisições é local ao processo. Implantações com várias instâncias precisam de um controle compartilhado para limitar o volume total.
- Requisições de detalhes são deduplicadas durante a renderização. Falhas da API não são armazenadas como dados válidos e exibem um estado de erro com opção de tentar novamente.

Consulte os [limites de requisições](https://docs.anilist.co/guide/rate-limiting) e os [termos de uso do AniList](https://docs.anilist.co/guide/terms-of-use) antes de publicar. O projeto não implementa listas pessoais de usuários.

## SEO e publicação

A URL canônica de produção é `https://myanimehub.tiagogp.com`, definida em [config/seo.ts](./config/seo.ts). Atualize essa configuração ao publicar em outro domínio.

- Catálogos, rankings, dias da agenda e páginas de detalhes possuem metadados e URLs canônicas próprios. Listas paginadas preservam o número da página; URLs numéricas legadas apontam para a URL canônica com ID do AniList.
- Buscas internas e listas filtradas usam `noindex, follow`. Deploys de preview da Vercel também são excluídos da indexação.
- `/sitemap.xml` inclui as páginas principais e uma amostra sem duplicatas de títulos dos rankings, em exibição e futuros, com revalidação a cada hora. Se o AniList estiver indisponível, as páginas estáticas continuam no sitemap.
- `/robots.txt` informa o endereço do sitemap. `/social-image` gera a imagem padrão de compartilhamento em 1200 × 630; as páginas de detalhes usam a capa do título.
- A página inicial inclui dados estruturados `WebSite`. As páginas de detalhes incluem `CreativeWork`, `Movie` ou `TVSeries`, conforme o título, além de breadcrumbs, sem inventar contagens de avaliações.

Após a publicação, envie o sitemap do domínio configurado ao Google Search Console.

## Verificação

```sh
node --test tests/*.test.cjs
npm run lint
npm run typecheck
npm run build
```

Os testes cobrem identificadores e rotas, conversão de notas, paginação, filtros, erros GraphQL, seleção aleatória, metadados, URLs canônicas, dados estruturados, sitemap e regras de indexação.
