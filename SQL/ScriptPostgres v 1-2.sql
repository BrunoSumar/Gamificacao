--Feito
CREATE TABLE IF NOT EXISTS "Alunos" (
  "ID_aluno" SERIAL PRIMARY KEY,
  "ID_google" varchar(30) UNIQUE,
  "TXT_primeiro_nome" varchar(100),
  "TXT_ultimo_nome" varchar(100),
  "TXT_num_matricula" varchar(15) UNIQUE,
  "TXT_email" varchar(100) UNIQUE,
  "NR_moedas" int default 0,
  "FL_deletado" boolean,
  "DT_deletado" timestamp
);

--Feito
CREATE TABLE IF NOT EXISTS "Professores" (
  "ID_professor" SERIAL PRIMARY KEY,
  "ID_google" varchar(30) UNIQUE,
  "TXT_num_professor" varchar(15) UNIQUE,
  "TXT_primeiro_nome" varchar(100),
  "TXT_ultimo_nome" varchar(100),
  "TXT_email" varchar(100) UNIQUE,
  "FL_validado" boolean,
  "FL_deletado" boolean,
  "DT_deletado" timestamp
);

--Feito
CREATE TABLE IF NOT EXISTS "Aventuras" (
  "ID_aventura" SERIAL PRIMARY KEY,
  "FK_professor" bigint,
  "ID_google" bigint UNIQUE,
  "TXT_nome" varchar(50),
  "TXT_descricao" text,
  "FL_evento" boolean,
  "TXT_numero_classe" varchar(10),
  "DT_inicio" timestamp,
  "DT_termino" timestamp
);

--Feito
CREATE TABLE IF NOT EXISTS "Avatar" (
  "ID_avatar" SERIAL PRIMARY KEY,
  "FK_aluno" bigint UNIQUE,
  "TXT_cor_rgb" varchar(11),
  "TP_avatar" int
);

--Não feito
CREATE TABLE IF NOT EXISTS "Itens" (
  "ID_item" SERIAL PRIMARY KEY,
  "TXT_name" varchar(50),
  "TXT_descricao" text,
  "NR_custo" int,
  "DT_criacao" timestamp
);

--Não feito
CREATE TABLE IF NOT EXISTS "Conquistas" (
  "ID_conquista" SERIAL PRIMARY KEY,
  "TXT_nome" varchar(50),
  "TXT_descricao" text,
  "DT_criacao" timestamp
);

--Não feito
CREATE TABLE IF NOT EXISTS "Conquistas_Alunos" (
  "ID_conquistaAluno" SERIAL PRIMARY KEY,
  "FK_conqusita" bigint,
  "FK_aluno" bigint,
  "DT_conquista" timestamp,
  "TXT_info" text
);

--Não feito
CREATE TABLE IF NOT EXISTS "Itens_Alunos_Desafios" (
  "ID_item_aluno_desafio" SERIAL PRIMARY KEY,
  "FK_item" bigint,
  "FK_aluno" bigint,
  "FK_desafio" bigint,
  "DT_compra" timestamp,
  "DT_uso" timestamp
);

-- Feito
CREATE TABLE IF NOT EXISTS "Alunos_Aventuras" (
  "ID_aluno_aventura" SERIAL PRIMARY KEY,
  "FK_aluno" bigint,
  "FK_aventura" bigint,
  UNIQUE ("ID_aluno_aventura", "FK_aluno")
);

--Feito
CREATE TABLE IF NOT EXISTS "Missoes" (
  "ID_missao" SERIAL PRIMARY KEY,
  "FK_aventura" bigint,
  "TXT_titulo" varchar(50),
  "TXT_descricao" text,
  "FL_grupo" boolean,
  "DT_entrega_maxima" timestamp
);

-- Feito
CREATE TABLE IF NOT EXISTS "Alunos_Missoes_Concluidas" (
  "ID_aluno_missao_concluida" SERIAL PRIMARY KEY,
  "FK_aluno" bigint,
  "FK_missao" bigint,
  "FK_grupo" bigint,
  "DT_concluido" timestamp
);

--Feito
CREATE TABLE IF NOT EXISTS "Grupos" (
  "ID_grupo" SERIAL PRIMARY KEY,
  "FK_missao" bigint,
  "DT_criacao" timestamp
);

--Feito
CREATE TABLE IF NOT EXISTS "Grupos_Alunos" ("FK_grupo" bigint, "FK_aluno" bigint);

--Feito
CREATE TABLE IF NOT EXISTS "Desafios" (
  "ID_desafio" SERIAL PRIMARY KEY,
  "FK_missao" bigint,
  "TXT_titulo" varchar(50),
  "TXT_descricao" text,
  "FL_grande_desafio" boolean,
  "NR_nota_grande_desafio" float, 
  "NR_indice" int,
  "DT_desafio" timestamp,
  "FK_conteudo" bigint
);

--Feito
CREATE TABLE IF NOT EXISTS "Opcoes" (
  "ID_opcao" SERIAL PRIMARY KEY,
  "TXT_descricao" text,
  "FL_opcao_certa" boolean,
  "FK_desafio" bigint
);

-- feito
CREATE TABLE IF NOT EXISTS "Conteudos" (
  "ID_conteudo" SERIAL PRIMARY KEY,
  "TXT_path_arquivo" text,
  "DT_inclusao" timestamp
);

--FEITO
CREATE TABLE IF NOT EXISTS "Respostas" (
  "ID_resposta" SERIAL PRIMARY KEY,
  "FK_grupo" bigint,
  "FK_aluno" bigint,
  "FK_desafio" bigint,
  "FK_opcao" bigint,
  "FK_conteudo" bigint,
  "DT_resposta" timestamp
);

--Feito
CREATE TABLE IF NOT EXISTS "Medalhas" (
  "ID_medalha" SERIAL PRIMARY KEY,
  "TXT_titulo" varchar(50),
  "NR_minimo" float UNIQUE
);

--Feito 
CREATE TABLE IF NOT EXISTS "Comentarios" (
  "ID_comentario" SERIAL PRIMARY KEY,
  "FK_aluno" bigint,
  "FK_professor" bigint,
  "FK_aventura" bigint,
  "FK_referencia" bigint,
  "FL_editado" boolean,
  "FL_deletado" boolean,
  "TXT_comentario" text,
  "DT_editado" timestamp,
  "DT_criacao" timestamp,
  "DT_deletado" timestamp
);

--Feito
CREATE TABLE IF NOT EXISTS "Login" (
  "ID_login" SERIAL PRIMARY KEY,
  "FK_aluno" bigint,
  "FK_professor" bigint,
  "DT_criacao" timestamp
);

--Feito 
CREATE TABLE IF NOT EXISTS "Administrador" (
  "ID_Administrador" SERIAL PRIMARY KEY,
  "TXT_USER" text UNIQUE,
  "TXT_HASH_PASSWORD" text
);

ALTER TABLE
  "Login"
ADD
  FOREIGN KEY ("FK_aluno") REFERENCES "Alunos" ("ID_aluno");

ALTER TABLE
  "Login"
ADD
  FOREIGN KEY ("FK_professor") REFERENCES "Professores" ("ID_professor");

ALTER TABLE
  "Comentarios"
ADD
  FOREIGN KEY ("FK_aluno") REFERENCES "Alunos" ("ID_aluno");

ALTER TABLE
  "Comentarios"
ADD
  FOREIGN KEY ("FK_professor") REFERENCES "Professores" ("ID_professor");

ALTER TABLE
  "Comentarios"
ADD
  FOREIGN KEY ("FK_aventura") REFERENCES "Aventuras" ("ID_aventura") ON DELETE CASCADE;

ALTER TABLE
  "Comentarios"
ADD
  FOREIGN KEY ("FK_referencia") REFERENCES "Comentarios" ("ID_comentario");

ALTER TABLE
  "Respostas"
ADD
  FOREIGN KEY ("FK_grupo") REFERENCES "Grupos" ("ID_grupo");

ALTER TABLE
  "Respostas"
ADD
  FOREIGN KEY ("FK_aluno") REFERENCES "Alunos" ("ID_aluno");

ALTER TABLE
  "Respostas"
ADD
  FOREIGN KEY ("FK_desafio") REFERENCES "Desafios" ("ID_desafio") ON DELETE CASCADE;

ALTER TABLE
  "Respostas"
ADD
  FOREIGN KEY ("FK_opcao") REFERENCES "Opcoes" ("ID_opcao");

ALTER TABLE
  "Respostas"
ADD
  FOREIGN KEY ("FK_conteudo") REFERENCES "Conteudos" ("ID_conteudo") ON DELETE CASCADE;

ALTER TABLE
  "Desafios"
ADD
  FOREIGN KEY ("FK_missao") REFERENCES "Missoes" ("ID_missao") ON DELETE CASCADE;

ALTER TABLE
  "Desafios"
ADD
  FOREIGN KEY ("FK_conteudo") REFERENCES "Conteudos" ("ID_conteudo") ;

ALTER TABLE
  "Opcoes"
ADD
  FOREIGN KEY ("FK_desafio") REFERENCES "Desafios" ("ID_desafio") ON DELETE CASCADE;

ALTER TABLE
  "Grupos"
ADD
  FOREIGN KEY ("FK_missao") REFERENCES "Missoes" ("ID_missao") ON DELETE CASCADE;

ALTER TABLE
  "Alunos_Missoes_Concluidas"
ADD
  FOREIGN KEY ("FK_missao") REFERENCES "Missoes" ("ID_missao") ON DELETE CASCADE;

ALTER TABLE
  "Alunos_Missoes_Concluidas"
ADD
  FOREIGN KEY ("FK_aluno") REFERENCES "Alunos" ("ID_aluno");

ALTER TABLE
  "Avatar"
ADD
  FOREIGN KEY ("FK_aluno") REFERENCES "Alunos" ("ID_aluno");

ALTER TABLE
  "Aventuras"
ADD
  FOREIGN KEY ("FK_professor") REFERENCES "Professores" ("ID_professor");

ALTER TABLE
  "Conquistas_Alunos"
ADD
  FOREIGN KEY ("FK_conqusita") REFERENCES "Conquistas" ("ID_conquista");

ALTER TABLE
  "Conquistas_Alunos"
ADD
  FOREIGN KEY ("FK_aluno") REFERENCES "Alunos" ("ID_aluno");

ALTER TABLE
  "Itens_Alunos_Desafios"
ADD
  FOREIGN KEY ("FK_aluno") REFERENCES "Alunos" ("ID_aluno");

ALTER TABLE
  "Itens_Alunos_Desafios"
ADD
  FOREIGN KEY ("FK_item") REFERENCES "Itens" ("ID_item");

ALTER TABLE
  "Alunos_Aventuras"
ADD
  FOREIGN KEY ("FK_aluno") REFERENCES "Alunos" ("ID_aluno");

ALTER TABLE
  "Alunos_Aventuras"
ADD
  FOREIGN KEY ("FK_aventura") REFERENCES "Aventuras" ("ID_aventura") ON DELETE CASCADE;

ALTER TABLE
  "Missoes"
ADD
  FOREIGN KEY ("FK_aventura") REFERENCES "Aventuras" ("ID_aventura") ON DELETE CASCADE;
