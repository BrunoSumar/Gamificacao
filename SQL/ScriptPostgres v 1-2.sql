--Feito
CREATE TABLE "Alunos" (
  "ID_aluno" SERIAL PRIMARY KEY,
  "ID_google" varchar(30) UNIQUE,
  "TXT_primeiro_nome" varchar(30),
  "TXT_ultimo_nome" varchar(30),
  "TXT_num_matricula" varchar(9) UNIQUE,
  "NR_moedas" int default 0
);

--Feito
CREATE TABLE "Professores" (
  "ID_professor" SERIAL PRIMARY KEY,
  "ID_google" varchar(30) UNIQUE,
  "TXT_num_professor" varchar(9) UNIQUE,
  "TXT_primeiro_nome" varchar(20),
  "TXT_ultimo_nome" varchar(20),
  "FL_validado" boolean
);

--Feito
CREATE TABLE "Aventuras" (
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
CREATE TABLE "Avatar" (
  "ID_avatar" SERIAL PRIMARY KEY,
  "FK_aluno" bigint UNIQUE,
  "TXT_cor_rgb" varchar(11),
  "TP_avatar" int
);

--Pendente planejamento
CREATE TABLE "Itens" (
  "ID_item" SERIAL PRIMARY KEY,
  "TXT_name" varchar(50),
  "TXT_descricao" text,
  "NR_custo" int,
  "DT_criacao" timestamp
);

--Pendente planejamento (provavelmente não)
CREATE TABLE "Conquistas" (
  "ID_conquista" SERIAL PRIMARY KEY,
  "TXT_nome" varchar(50),
  "TXT_descricao" text,
  "DT_criacao" timestamp
);

--Pendente planejamento (provavelmente não)
CREATE TABLE "Conquistas_Alunos" (
  "ID_conquistaAluno" SERIAL PRIMARY KEY,
  "FK_conqusita" bigint,
  "FK_aluno" bigint,
  "DT_conquista" timestamp,
  "TXT_info" text
);

--Pendente planejamento
CREATE TABLE "Itens_Alunos_Desafios" (
  "ID_item_aluno_desafio" SERIAL PRIMARY KEY,
  "FK_item" bigint,
  "FK_aluno" bigint,
  "FK_desafio" bigint,
  "DT_compra" timestamp,
  "DT_uso" timestamp
);

-- Precisa terminar (PROCENTAGEM)
CREATE TABLE "Alunos_Aventuras" (
  "ID_aluno_aventura" SERIAL PRIMARY KEY,
  "FK_aluno" bigint,
  "FK_aventura" bigint,
  "NR_porcentagem_conclusao" float,
  UNIQUE ("ID_aluno_aventura", "FK_aluno")
);

--Feito
CREATE TABLE "Missoes" (
  "ID_missao" SERIAL PRIMARY KEY,
  "FK_aventura" bigint,
  "TXT_titulo" varchar(50),
  "TXT_descricao" text,
  "FL_grupo" boolean,
  "DT_entrega_maxima" timestamp
);

-- Precisa fazer
CREATE TABLE "Alunos_Missoes_Concluidas" (
  "ID_aluno_missao_concluida" SERIAL PRIMARY KEY,
  "FK_aluno" bigint,
  "FK_missao" bigint,
  "FK_grupo" bigint,
  "DT_concluido" timestamp,
  "NR_porcentagem_conclusao" float
);

--Feito
CREATE TABLE "Grupos" (
  "ID_grupo" SERIAL PRIMARY KEY,
  "FK_missao" bigint,
  "DT_criacao" timestamp
);

--Feito
CREATE TABLE "Grupos_Alunos" ("FK_grupo" bigint, "FK_aluno" bigint);

--Precisa Fazer
CREATE TABLE "Desafios" (
  "NR_indice" int,
  "ID_desafio" SERIAL PRIMARY KEY,
  "FK_missao" bigint,
  "TXT_titulo" varchar(50),
  "TXT_descricao" text,
  "FL_grande_desafio" boolean
);

--Precisa fazer
CREATE TABLE "Opcoes" (
  "ID_opcao" SERIAL PRIMARY KEY,
  "TXT_descricao" text,
  "FL_opcao_certa" boolean,
  "FK_desafio" bigint
);

--Precisa fazer
CREATE TABLE "Conteudos" (
  "ID_conteudo" SERIAL PRIMARY KEY,
  "FK_desafio" bigint,
  "TXT_path_arquivo" text,
  "TXT_video" text,
  "DT_inclusao" timestamp
);

--Precisa fazer 
CREATE TABLE "Respostas" (
  "ID_resposta" SERIAL PRIMARY KEY,
  "FK_grupo" bigint,
  "FK_aluno" bigint,
  "FK_desafio" bigint,
  "FK_opcao" bigint,
  "TXT_path_arquivo" text,
  "DT_resposta" timestamp
);

--Feito
CREATE TABLE "Medalhas" (
  "ID_medalha" SERIAL PRIMARY KEY,
  "TXT_titulo" varchar(50),
  "NR_minimo" float UNIQUE
);

--Pendente planejamento (provavelmente não)
CREATE TABLE "Comentarios" (
  "ID_comentario" SERIAL PRIMARY KEY,
  "FK_aluno" bigint,
  "FK_professor" bigint,
  "FK_aventura" bigint,
  "TXT_comentario" text,
  "DT_criacao" timestamp,
  "FK_referencia" bigint,
  "FL_editado" boolean,
  "DT_editado" timestamp,
);

--Feito
CREATE TABLE "Login" (
  "ID_login" SERIAL PRIMARY KEY,
  "FK_aluno" bigint,
  "FK_professor" bigint,
  "DT_criacao" timestamp
);

--Precisa fazer 
CREATE TABLE "Administrador" (
  "ID_Administrador" SERIAL PRIMARY KEY,
  "TXT_USER" bigint,
  "TXT_HASH_PASSWORD" bigint,
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
  FOREIGN KEY ("FK_aventura") REFERENCES "Aventuras" ("ID_aventura");

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
  FOREIGN KEY ("FK_desafio") REFERENCES "Desafios" ("ID_desafio");

ALTER TABLE
  "Respostas"
ADD
  FOREIGN KEY ("FK_opcao") REFERENCES "Opcoes" ("ID_opcao");

ALTER TABLE
  "Desafios"
ADD
  FOREIGN KEY ("FK_missao") REFERENCES "Missoes" ("ID_missao");

ALTER TABLE
  "Conteudos"
ADD
  FOREIGN KEY ("FK_desafio") REFERENCES "Desafios" ("ID_desafio");

ALTER TABLE
  "Opcoes"
ADD
  FOREIGN KEY ("FK_desafio") REFERENCES "Desafios" ("ID_desafio");

ALTER TABLE
  "Grupos"
ADD
  FOREIGN KEY ("FK_missao") REFERENCES "Missoes" ("ID_missao");

ALTER TABLE
  "Alunos_Missoes_Concluidas"
ADD
  FOREIGN KEY ("FK_missao") REFERENCES "Missoes" ("ID_missao");

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
  FOREIGN KEY ("FK_aventura") REFERENCES "Aventuras" ("ID_aventura");

ALTER TABLE
  "Missoes"
ADD
  FOREIGN KEY ("FK_aventura") REFERENCES "Aventuras" ("ID_aventura");