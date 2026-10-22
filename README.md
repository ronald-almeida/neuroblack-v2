# NeuroBlack — Checkout Pix

Checkout responsivo por R$ 397,70, com logo fornecida, SVGs fornecidos e pop-up para QR Code e Pix Copia e Cola. HTML/CSS/JavaScript e uma função Node para Vercel. Sem banco de dados, cookies, localStorage ou sessionStorage para Pix. A cobrança permanece apenas na memória da página; recarregar a página perde essa referência. A Black Cat mantém seus próprios registros de transações.

## Publicação

Importe este repositório na Vercel com preset Other e diretório de saída public. Configure BLACKCAT_API_KEY nas variáveis de ambiente do servidor e publique. Não coloque a chave em código público. As rotas / e /checkout abrem o checkout; POST /api/pix cria a cobrança.

A integração usa https://api.blackcatoficial.com/api/sales/create-sale, X-API-Key, paymentMethod pix e valor fixo 39770 no servidor. A resposta paymentData alimenta o pop-up. Não há confirmação automática de pagamento nem entrega automática de conteúdo; configure a entrega na operação do vendedor. Não são feitas retentativas automáticas em erros incertos.

## Fonte

O CSS declara Hotmart Sans e Hotmart Display com fallback Arial/Helvetica. Os arquivos licenciados dessas fontes não foram fornecidos, portanto navegadores sem essas fontes usam o fallback. Acrescente arquivos autorizados e regras @font-face para renderização exata.

## Verificação

Execute npm test. Testes simulam a operadora, validam o preço fixo, documentos, resposta de sucesso, falta de configuração e timeout. Nenhuma cobrança real é criada pelos testes. Validar geração real após configurar a chave.
