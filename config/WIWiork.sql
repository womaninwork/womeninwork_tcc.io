CREATE SCHEMA IF NOT EXISTS `blpkdphhphnmf0o8ikdt` DEFAULT CHARACTER SET utf8 ;
USE `blpkdphhphnmf0o8ikdt` ;

-- -----------------------------------------------------
-- Table `blpkdphhphnmf0o8ikdt`.`cursos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `blpkdphhphnmf0o8ikdt`.`cursos` (
  `id_cursos` INT(11) NOT NULL,
  `descricao_cursos` MEDIUMTEXT NOT NULL,
  `nome_curso` VARCHAR(70) NOT NULL,
  `categoria_curso` VARCHAR(70) NOT NULL,
  `duraco_curso` CHAR(20) NOT NULL,
  `preco_curso` DOUBLE NOT NULL,
  PRIMARY KEY (`id_cursos`),
  UNIQUE INDEX `id_cursos_UNIQUE` (`id_cursos` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `blpkdphhphnmf0o8ikdt`.`forma de pagamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `blpkdphhphnmf0o8ikdt`.`forma de pagamento` (
  `id_forma_de_pagamento` INT(11) NOT NULL,
  PRIMARY KEY (`id_forma_de_pagamento`),
  UNIQUE INDEX `id_forma_de_pagamento_UNIQUE` (`id_forma_de_pagamento` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `blpkdphhphnmf0o8ikdt`.`pagamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `blpkdphhphnmf0o8ikdt`.`pagamento` (
  `id_pagamento` INT(11) NOT NULL,
  `pagamento_concluido` VARCHAR(45) NOT NULL,
  `pagamento_pendente` VARCHAR(45) NOT NULL,
  `pagamento_data` DATE NOT NULL,
  `valor_pagamento` DOUBLE NOT NULL,
  `forma de pagamento_id_forma_de_pagamento` INT(11) NOT NULL,
  PRIMARY KEY (`id_pagamento`),
  UNIQUE INDEX `id_pagamento_UNIQUE` (`id_pagamento` ASC) VISIBLE,
  INDEX `fk_pagamento_forma de pagamento1_idx` (`forma de pagamento_id_forma_de_pagamento` ASC) VISIBLE,
  CONSTRAINT `fk_pagamento_forma de pagamento1`
    FOREIGN KEY (`forma de pagamento_id_forma_de_pagamento`)
    REFERENCES `blpkdphhphnmf0o8ikdt`.`forma de pagamento` (`id_forma_de_pagamento`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `blpkdphhphnmf0o8ikdt`.`tipo_usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `blpkdphhphnmf0o8ikdt`.`tipo_usuario` (
  `id_tipo_usuario` INT(11) NOT NULL,
  `tipo_comum` VARCHAR(45) NOT NULL,
  `tipo_professor` VARCHAR(45) NOT NULL,
  `tipo_adm` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_tipo_usuario`),
  UNIQUE INDEX `id_tipo_usuario_UNIQUE` (`id_tipo_usuario` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `blpkdphhphnmf0o8ikdt`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `blpkdphhphnmf0o8ikdt`.`usuario` (
  `id_usuario` INT(11) NOT NULL,
  `nome_usuario` VARCHAR(70) NOT NULL,
  `email_usuario` VARCHAR(35) NOT NULL,
  `celular_usuario` CHAR(11) NOT NULL,
  `senha_usuario` VARCHAR(10) NOT NULL,
  `sobrenome_usuario` VARCHAR(70) NOT NULL,
  `tipo_usuario_id_tipo_usuario` INT(11) NOT NULL,
  `cursos_id_cursos` INT(11) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `id_usuario_UNIQUE` (`id_usuario` ASC) VISIBLE,
  UNIQUE INDEX `email_usuario_UNIQUE` (`email_usuario` ASC) VISIBLE,
  UNIQUE INDEX `senha_usuario_UNIQUE` (`senha_usuario` ASC) VISIBLE,
  INDEX `fk_usuario_tipo_usuario_idx` (`tipo_usuario_id_tipo_usuario` ASC) VISIBLE,
  INDEX `fk_usuario_cursos1_idx` (`cursos_id_cursos` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_tipo_usuario`
    FOREIGN KEY (`tipo_usuario_id_tipo_usuario`)
    REFERENCES `blpkdphhphnmf0o8ikdt`.`tipo_usuario` (`id_tipo_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

select * from usuario


-- -----------------------------------------------------
-- Table `blpkdphhphnmf0o8ikdt`.`aluno_tem_cursos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `blpkdphhphnmf0o8ikdt`.`aluno_tem_cursos` (
  `cursos_id_cursos` INT(11) NOT NULL,
  `usuario_id_usuario` INT(11) NOT NULL,
  `pagamento_id_pagamento` INT(11) NOT NULL,
  PRIMARY KEY (`cursos_id_cursos`, `usuario_id_usuario`),
  INDEX `fk_aluno_tem_cursos_usuario1_idx` (`usuario_id_usuario` ASC) VISIBLE,
  INDEX `fk_aluno_tem_cursos_pagamento1_idx` (`pagamento_id_pagamento` ASC) VISIBLE,
  CONSTRAINT `fk_aluno_tem_cursos_cursos1`
    FOREIGN KEY (`cursos_id_cursos`)
    REFERENCES `blpkdphhphnmf0o8ikdt`.`cursos` (`id_cursos`),
  CONSTRAINT `fk_aluno_tem_cursos_pagamento1`
    FOREIGN KEY (`pagamento_id_pagamento`)
    REFERENCES `blpkdphhphnmf0o8ikdt`.`pagamento` (`id_pagamento`),
  CONSTRAINT `fk_aluno_tem_cursos_usuario1`
    FOREIGN KEY (`usuario_id_usuario`)
    REFERENCES `blpkdphhphnmf0o8ikdt`.`usuario` (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `blpkdphhphnmf0o8ikdt`.`aulas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `blpkdphhphnmf0o8ikdt`.`aulas` (
  `idaulas` INT(11) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL DEFAULT NULL,
  `link_aula` VARCHAR(45) NULL DEFAULT NULL,
  `status` INT(11) NULL DEFAULT NULL,
  `cursos_id_cursos` INT(11) NOT NULL,
  PRIMARY KEY (`idaulas`),
  INDEX `fk_aulas_cursos1_idx` (`cursos_id_cursos` ASC) VISIBLE,
  CONSTRAINT `fk_aulas_cursos1`
    FOREIGN KEY (`cursos_id_cursos`)
    REFERENCES `blpkdphhphnmf0o8ikdt`.`cursos` (`id_cursos`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `blpkdphhphnmf0o8ikdt`.`chat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `blpkdphhphnmf0o8ikdt`.`chat` (
  `menssagem` LONGTEXT NOT NULL,
  `remetente_id_usuario` INT(11) NULL DEFAULT NULL,
  `destinatario_id_usuario` INT(11) NULL DEFAULT NULL,
  `usuario_id_usuario` INT(11) NOT NULL,
  INDEX `fk_chat_usuario1_idx` (`usuario_id_usuario` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `blpkdphhphnmf0o8ikdt`.`professor_tem_cursos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `blpkdphhphnmf0o8ikdt`.`professor_tem_cursos` (
  `usuario_id_usuario` INT(11) NOT NULL,
  `cursos_id_cursos` INT(11) NOT NULL,
  INDEX `fk_usuario_has_cursos_cursos1_idx` (`cursos_id_cursos` ASC) VISIBLE,
  INDEX `fk_usuario_has_cursos_usuario1_idx` (`usuario_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_has_cursos_cursos1`
    FOREIGN KEY (`cursos_id_cursos`)
    REFERENCES `blpkdphhphnmf0o8ikdt`.`cursos` (`id_cursos`),
  CONSTRAINT `fk_usuario_has_cursos_usuario1`
    FOREIGN KEY (`usuario_id_usuario`)
    REFERENCES `blpkdphhphnmf0o8ikdt`.`usuario` (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `blpkdphhphnmf0o8ikdt`.`usuario_avalia_cursos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `blpkdphhphnmf0o8ikdt`.`usuario_avalia_cursos` (
  `usuario_id_usuario` INT(11) NOT NULL,
  `cursos_id_cursos` INT(11) NOT NULL,
  PRIMARY KEY (`usuario_id_usuario`, `cursos_id_cursos`),
  INDEX `fk_usuario_avalia_cursos_cursos1_idx` (`cursos_id_cursos` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_avalia_cursos_cursos1`
    FOREIGN KEY (`cursos_id_cursos`)
    REFERENCES `blpkdphhphnmf0o8ikdt`.`cursos` (`id_cursos`),
  CONSTRAINT `fk_usuario_avalia_cursos_usuario1`
    FOREIGN KEY (`usuario_id_usuario`)
    REFERENCES `blpkdphhphnmf0o8ikdt`.`usuario` (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

