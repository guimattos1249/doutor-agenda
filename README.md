Doutor Agenda é um projeto de Estudos, desenvolvido com Next.Js FullStack.

A plataforma foi desenvolvida usando TypeScript, Tailwind, DrizzleORM e com integração ao STRIPE.

Nesta plataforma, pode-se criar um usuário que tem uma clínica, cadastrar médicos, pacientes e realizar agendamentos.
Na integração com o Stipe, pode-se assinar e cancelar um plano.

## Iniciando o projeto

# Será necessário configurar as seguintes variáveis de ambiente:
```bash
DATABASE_URL
BETTER_AUTH_SECRET
BETTER_AUTH_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_PRODUCT_ID
NEXT_PUBLIC_APP_URL
STRIPE_ESSENTIAL_PLAN_PRICE_ID
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL
```

Instale as depêndencias do projeto
```bash
npm install --legacy-peer-deps
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) com seu browser para ver o reultado.
