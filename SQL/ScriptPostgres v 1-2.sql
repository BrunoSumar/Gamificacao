CREATE TABLE "Alunos" (
  "ID_aluno" SERIAL PRIMARY KEY,
  "ID_google" varchar(30) UNIQUE,
  "TXT_primeiro_nome" varchar(30),
  "TXT_ultimo_nome" varchar(30),
  "TXT_num_matricula" varchar(9) UNIQUE,
  "NR_moedas" int default 0
);

CREATE TABLE "Professores" (
  "ID_professor" SERIAL PRIMARY KEY,
  "ID_google" varchar(30) UNIQUE,
  "TXT_num_professor" varchar(9) UNIQUE,
  "TXT_primeiro_nome" varchar(20),
  "TXT_ultimo_nome" varchar(20),
  "FL_validado" boolean
);

CREATE TABLE "Aventuras" (
  "ID_aventura" SERIAL PRIMARY KEY,
  "FK_professor" bigint,
  "ID_google" bigint UNIQUE,
  "TXT_nome" varchar(50),
  "TXT_descricao" text,
  "FL_evento" boolean,
  "TXT_numero_classe" varchar(10),
  "DT_inicio" date,
  "DT_termino" date
);

CREATE TABLE "Avatar" (
  "ID_avatar" SERIAL PRIMARY KEY,
  "FK_aluno" bigint,
  "TXT_cor_rgb" varchar(11),
  "TP_avatar" int
);

CREATE TABLE "Itens" (
  "ID_item" SERIAL PRIMARY KEY,
  "TXT_name" varchar(50),
  "TXT_descricao" text,
  "NR_custo" int,
  "DT_criacao" date
);

CREATE TABLE "Conquistas" (
  "ID_conquista" SERIAL PRIMARY KEY,
  "TXT_nome" varchar(50),
  "TXT_descricao" text,
  "DT_criacao" date
);

CREATE TABLE "Conquistas_Alunos" (
  "ID_conquistaAluno" SERIAL PRIMARY KEY,
  "FK_conqusita" bigint,
  "FK_aluno" bigint,
  "DT_conquista" date,
  "TXT_info" text
);

CREATE TABLE "Itens_Alunos_Desafios" (
  "ID_item_aluno_desafio" SERIAL PRIMARY KEY,
  "FK_item" bigint,
  "FK_aluno" bigint,
  "FK_desafio" bigint,
  "DT_compra" date,
  "DT_uso" date
);

CREATE TABLE "Alunos_Aventuras" (
  "ID_aluno_aventura" SERIAL PRIMARY KEY,
  "FK_aluno" bigint,
  "FK_aventura" bigint,
  "NR_porcentagem_conclusao" float
);

CREATE TABLE "Missoes" (
  "ID_missao" SERIAL PRIMARY KEY,
  "FK_aventura" bigint,
  "TXT_titulo" varchar(50),
  "TXT_descricao" text,
  "FL_grupo" boolean,
  "DT_entrega_maxima" date
);

CREATE TABLE "Alunos_Missoes_Concluidas" (
  "ID_aluno_missao_concluida" SERIAL PRIMARY KEY,
  "FK_aluno" bigint,
  "FK_missao" bigint,
  "FK_grupo" bigint,
  "DT_concluido" date,
  "NR_porcentagem_conclusao" float
);

CREATE TABLE "Grupos" (
  "ID_grupo" SERIAL PRIMARY KEY,
  "FK_missao" bigint,
  "DT_criacao" date
);

CREATE TABLE "Grupos_Alunos" (
  "FK_grupo" bigint,
  "FK_aluno" bigint
);

CREATE TABLE "Desafios" (
  "NR_indice" int,
  "ID_desafio" SERIAL PRIMARY KEY,
  "FK_missao" bigint,
  "TXT_titulo" varchar(50),
  "TXT_descricao" text,
  "FL_grande_desafio" boolean
);

CREATE TABLE "Opcoes" (
  "ID_opcao" SERIAL PRIMARY KEY,
  "TXT_descricao" text,
  "FL_opcao_certa" boolean,
  "FK_desafio" bigint
);

CREATE TABLE "Conteudos" (
  "ID_conteudo" SERIAL PRIMARY KEY,
  "FK_desafio" bigint,
  "BLOB_arquivo" bytea,
  "TXT_video" text,
  "DT_inclusao" date
);

CREATE TABLE "Respostas" (
  "ID_resposta" SERIAL PRIMARY KEY,
  "FK_grupo" bigint,
  "FK_aluno" bigint,
  "FK_desafio" bigint,
  "FK_opcao" bigint,
  "BLOB_arquivo" bytea,
  "DT_resposta" date
);

CREATE TABLE "Medalhas" (
  "ID_medalha" SERIAL PRIMARY KEY,
  "TXT_titulo" varchar(50),
  "NR_minimo" float,
  "NR_maximo" float
);

CREATE TABLE "Comentarios" (
  "ID_comentario" SERIAL PRIMARY KEY,
  "FK_aluno" bigint,
  "FK_professor" bigint,
  "FK_aventura" bigint,
  "TXT_comentario" text,
  "DT_criacao" date,
  "FK_referencia" bigint
);

CREATE TABLE "Login" (
  "ID_login" SERIAL PRIMARY KEY,
  "FK_aluno" bigint,
  "FK_professor" bigint,
  "DT_criacao" date
);

ALTER TABLE "Login" ADD FOREIGN KEY ("FK_aluno") REFERENCES "Alunos" ("ID_aluno");

ALTER TABLE "Login" ADD FOREIGN KEY ("FK_professor") REFERENCES "Professores" ("ID_professor");

ALTER TABLE "Comentarios" ADD FOREIGN KEY ("FK_aluno") REFERENCES "Alunos" ("ID_aluno");

ALTER TABLE "Comentarios" ADD FOREIGN KEY ("FK_professor") REFERENCES "Professores" ("ID_professor");

ALTER TABLE "Comentarios" ADD FOREIGN KEY ("FK_aventura") REFERENCES "Aventuras" ("ID_aventura");

ALTER TABLE "Comentarios" ADD FOREIGN KEY ("FK_referencia") REFERENCES "Comentarios" ("ID_comentario");

ALTER TABLE "Respostas" ADD FOREIGN KEY ("FK_grupo") REFERENCES "Grupos" ("ID_grupo");

ALTER TABLE "Respostas" ADD FOREIGN KEY ("FK_aluno") REFERENCES "Alunos" ("ID_aluno");

ALTER TABLE "Respostas" ADD FOREIGN KEY ("FK_desafio") REFERENCES "Desafios" ("ID_desafio");

ALTER TABLE "Respostas" ADD FOREIGN KEY ("FK_opcao") REFERENCES "Opcoes" ("ID_opcao");

ALTER TABLE "Desafios" ADD FOREIGN KEY ("FK_missao") REFERENCES "Missoes" ("ID_missao");

ALTER TABLE "Conteudos" ADD FOREIGN KEY ("FK_desafio") REFERENCES "Desafios" ("ID_desafio");

ALTER TABLE "Opcoes" ADD FOREIGN KEY ("FK_desafio") REFERENCES "Desafios" ("ID_desafio");

ALTER TABLE "Grupos" ADD FOREIGN KEY ("FK_missao") REFERENCES "Missoes" ("ID_missao");

ALTER TABLE "Alunos_Missoes_Concluidas" ADD FOREIGN KEY ("FK_missao") REFERENCES "Missoes" ("ID_missao");

ALTER TABLE "Alunos_Missoes_Concluidas" ADD FOREIGN KEY ("FK_aluno") REFERENCES "Alunos" ("ID_aluno");

ALTER TABLE "Avatar" ADD FOREIGN KEY ("FK_aluno") REFERENCES "Alunos" ("ID_aluno");

ALTER TABLE "Aventuras" ADD FOREIGN KEY ("FK_professor") REFERENCES "Professores" ("ID_professor");

ALTER TABLE "Conquistas_Alunos" ADD FOREIGN KEY ("FK_conqusita") REFERENCES "Conquistas" ("ID_conquista");

ALTER TABLE "Conquistas_Alunos" ADD FOREIGN KEY ("FK_aluno") REFERENCES "Alunos" ("ID_aluno");

ALTER TABLE "Itens_Alunos_Desafios" ADD FOREIGN KEY ("FK_aluno") REFERENCES "Alunos" ("ID_aluno");

ALTER TABLE "Itens_Alunos_Desafios" ADD FOREIGN KEY ("FK_item") REFERENCES "Itens" ("ID_item");

ALTER TABLE "Alunos_Aventuras" ADD FOREIGN KEY ("FK_aluno") REFERENCES "Alunos" ("ID_aluno");

ALTER TABLE "Alunos_Aventuras" ADD FOREIGN KEY ("FK_aventura") REFERENCES "Aventuras" ("ID_aventura");

ALTER TABLE "Missoes" ADD FOREIGN KEY ("FK_aventura") REFERENCES "Aventuras" ("ID_aventura");
