# PowerCap Smart Pro V4

MVP web/PWA para dimensionamento profissional de banco de capacitores, análise preliminar de harmônicas e pré-seleção de componentes.

## Principais módulos
- Correção do fator de potência e cálculo de kvar
- Corrente do banco e capacidade aparente liberada
- Proteção geral
- Pré-dimensionamento de cabos com temperatura, agrupamento, material, isolação e queda de tensão
- Verificação térmica adiabática simplificada em curto-circuito
- Estimativa de Icc pela impedância do transformador ou valor medido
- THDv, THDi e principais ordens harmônicas
- Triagem de banco convencional, 7%, 14% ou estudo específico
- Estimativa de ressonância
- Biblioteca inicial WEG / ABB / Schneider
- Lista de materiais e preços manuais
- Memorial técnico imprimível em PDF
- Salvamento local de projetos no navegador
- PWA instalável

## Publicar no GitHub
1. Crie um repositório novo.
2. Envie todos os arquivos desta pasta mantendo a estrutura.
3. Faça commit e push.

## Publicar no Vercel
1. Importe o repositório GitHub no Vercel.
2. Framework Preset: `Other`.
3. Build Command: deixe vazio.
4. Output Directory: deixe vazio.
5. Deploy.

O arquivo `vercel.json` já está preparado para servir a aplicação estática.

## Instalar no smartphone
1. Abra a URL publicada no Chrome/Edge.
2. Menu do navegador → `Adicionar à tela inicial` / `Instalar app`.
3. O service worker permite abrir a interface básica offline após o primeiro carregamento.

## Firebase futuro
A V4 atual usa `localStorage` para projetos salvos. Para transformar em SaaS:
- Firebase Authentication
- Firestore
- Storage para relatórios/logos
- regras por organização/usuário
- coleção `users`
- coleção `organizations`
- coleção `clients`
- coleção `projects`
- coleção `measurements`
- coleção `reports`

Use `firebase-config.example.js` apenas como modelo; não coloque segredos privados no frontend.

## Aviso técnico
Esta versão é de pré-dimensionamento profissional assistido. Antes de liberar fabricação/instalação, confirme dados reais de curto-circuito, seletividade, coordenação, método de instalação, tabelas normativas aplicáveis, ventilação, elevação térmica, catálogos vigentes e estudo de qualidade de energia quando necessário.
