# Rural Producers Management

# How to run
```bash
docker compose up
npm run prisma:generate
npm run prisma:push
npm run start:dev
```

# Checking database
```bash
npm run prisma:studio
```

# Testing
```bash
npm run test:e2e
```
* with swagger: go to http://localhost:3000/api
* sign up a user
* authenticate
* make requests

# **Checklist de Tarefas**

## Banco de Dados
- [x] **Estrutura Inicial**
  - [x] Criar tabelas no PostgreSQL com Prisma:
    - [x] `Producer` (produtores rurais).
    - [x] `Property` (propriedades rurais).
    - [x] `Crop` (culturas plantadas).
  - [x] Configurar relacionamentos:
    - [x] Produtor -> Propriedades rurais.
    - [x] Propriedade -> Culturas plantadas.

## Backend
- [x] **Configuração Inicial**
  - [x] Configurar backend com Nestjs e Prisma.
  - [x] Criar rotas e controladores para cada recurso:
    - [x] Produtores rurais.
    - [x] Propriedades rurais.
    - [x] Culturas plantadas.
    - [x] Admin

- [x] **Endpoints e Lógicas de Validação**
  - [x] **Produtores Rurais**
    - [x] Criar endpoint para cadastro de produtores.
    - [x] Criar endpoint para edição de produtores.
    - [] Criar endpoint para exclusão de produtores.
    - [x] Validar formato de CPF e CNPJ no backend.
  - [x] **Propriedades Rurais**
    - [x] Criar endpoint para cadastro de propriedades.
    - [x] Criar endpoint para edição de propriedades.
    - [] Criar endpoint para exclusão de propriedades.
    - [x] Validar que `arableArea + vegetationArea <= totalArea`.
  - [x] **Culturas Plantadas**
    - [x] Criar endpoint para registro de culturas plantadas por safra.
    - [x] Criar endpoint para listagem de culturas por propriedade.
  - [x] **Relatórios e Dashboards**
    - [x] Criar endpoint para total de fazendas cadastradas.
    - [x] Criar endpoint para total de hectares registrados.
    - [x] Criar endpoints para gerar dados para os gráficos:
      - [x] Por estado.
      - [x] Por cultura plantada.
      - [ ] Por uso do solo (área agricultável e vegetação). (Não consegui visualizar o gráfico)

# Estrutura de pastas
src

  http
  
    controllers
    
  database
  
    ..
    
  domain
  
    entities
    
    ..
    
    repositories
    
    ..

# O que faria se houvesse mais tempo
1. Transferência de propriedades
2. Documentação mais abrangente com melhores exemplos com o swagger
3. Para as métricas eu criaria uma query SQL para fazer a busca por cultura plantada
4. Separação por caso de uso
5. Testes unitários
6. Mais testes e2e
7. Ambiente isolado para testes e2e
8. Presenters para os controllers
9. Separação dos controllers
10. Daria um pouco mais de atenção a estrutura de pastas
11. Testaria mais extensivamente a aplicação para detectar possíveis bugs.
12. RBAC (Producer poderia logar e fazer algumas coisas como adicionar culturas)
13. Subir no Render com um banco de dados postgres free.
