# L MARTINS — Barbearia

Site mobile-first da barbearia L MARTINS: vitrine de serviços, galeria de trabalhos e
venda de produtos por pedido no WhatsApp. Sem loja online, sem login, sem banco de dados.

## Estilo

Direção "Frosted brass": fundo marrom escuro, tipografia Anton / Inter / JetBrains Mono,
acentos dourado-latão e botões verdes do WhatsApp. Painéis em vidro fosco (backdrop-blur).

## Dados

- WhatsApp: (15) 98821-6391 → `wa.me/5515988216391` (mensagens pré-preenchidas por contexto)
- Endereço: R. Jaime Lopes da Silva, 49
- Horário padrão: 10h às 19h (segunda a sábado)

## Rotas

- `/` — Início: hero, destaques, produtos e galeria
- `/servicos` — cardápio completo com preços e agendamento
- `/produtos` — grade com "Pedir no WhatsApp" por produto
- `/galeria` — portfólio com "Quero esse corte"
- `/agendar` — serviço + dia + hora livres → confirma no WhatsApp
- `/contato` — endereço, horários, Google Maps e WhatsApp
- `/admin/horarios` — dono liga/desliga dias, horas e exceções por data (salva no navegador)

## Disponibilidade

- Padrão semanal em `src/data/horarios.ts` (`DEFAULT_SCHEDULE`, seg–sáb 10h–19h)
- Exceções por data (ex.: `2026-10-12` feriado fechado) em `DEFAULT_OVERRIDES`
- Admin persiste em `localStorage` e sincroniza entre abas em tempo real (evento `storage`)
- Para virar padrão do deploy, copie o JSON do admin para `horarios.ts`

## Técnico

- TanStack Start + Tailwind v4; tokens de cor em `src/styles.css` (formato oklch)
- Fontes via `<link>` no `__root.tsx`
- SEO (title, description, og) por página

## Deploy (Netlify, grátis)

O projeto usa `@netlify/vite-plugin-tanstack-start` — o build já sai pronto
para a Netlify. Para publicar:

1. Crie conta em netlify.com
2. Add new site → Import an existing project → GitHub → escolha este repo
3. Build settings são detectadas automaticamente (`npm run build`)
4. Deploy — você ganha uma URL `*.netlify.app` (dá para trocar o nome e/ou
   apontar domínio próprio depois)

## Rodar local

```bash
npm install
npm run dev -- --port 3000
npm run build
npm run preview -- --port 3127
```
