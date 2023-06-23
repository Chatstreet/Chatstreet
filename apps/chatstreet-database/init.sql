-- priviliges for mise
GRANT ALL PRIVILEGES ON *.* TO 'backend-server'@'%' WITH GRANT OPTION;

-- database "chatstreet" already existend (created automatically in mariadb base image)

-- users table
CREATE TABLE IF NOT EXISTS chatstreet.`users` (
  `user_id` INT AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `tag` INT NOT NULL,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `recovery_email` VARCHAR(45) NULL COMMENT 'Optional',
  `phone_number` VARCHAR(45) NULL COMMENT 'Optional',
  `birthdate` DATE NULL,
  `registration_timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `password` VARCHAR(512) NOT NULL,
  PRIMARY KEY(`user_id`),
  UNIQUE INDEX(`user_id`),
  UNIQUE INDEX(`email`),
  UNIQUE INDEX(`recovery_email`)
);

-- violate_codes table
CREATE TABLE IF NOT EXISTS chatstreet.`violate_codes` (
  `user_id_fk` INT NOT NULL,
  `password_reset_code` VARCHAR(128) NULL,
  `email_verification_code` VARCHAR(128) NULL,
  PRIMARY KEY (`user_id_fk`),
  CONSTRAINT `fk_violate_codes_users`
    FOREIGN KEY(`user_id_fk`)
    REFERENCES chatstreet.`users`(`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- profiles table
CREATE TABLE IF NOT EXISTS chatstreet.`profiles` (
  `user_id_fk` INT NOT NULL,
  `description` VARCHAR(45) NOT NULL,
  `avatar` LONGTEXT NULL,
  `theme` ENUM("DARK", "LIGHT", "SYSTEM") NOT NULL,
  PRIMARY KEY (`user_id_fk`),
  CONSTRAINT `fk_table1_users1`
    FOREIGN KEY(`user_id_fk`)
    REFERENCES chatstreet.`users`(`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


-- collections table
CREATE TABLE IF NOT EXISTS chatstreet.`collections` (
  `collection_id` INT AUTO_INCREMENT,
  `user_fk` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`collection_id`),
  CONSTRAINT `fk_collections_users1`
    FOREIGN KEY(`user_fk`)
    REFERENCES chatstreet.`users`(`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- contacts_lookup table
CREATE TABLE IF NOT EXISTS chatstreet.`contacts_lookup` (
  `user_id_fk_1` INT NOT NULL,
  `contact_id_fk_2` INT NOT NULL,
  `relationship` ENUM("FRIENDS", "BLOCKED", "INVITED") NOT NULL,
  PRIMARY KEY (`user_id_fk_1`, `contact_id_fk_2`),
  CONSTRAINT `fk_users_has_users_users1`
    FOREIGN KEY(`user_id_fk_1`)
    REFERENCES chatstreet.`users`(`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_users_has_users_users2`
    FOREIGN KEY(`contact_id_fk_2`)
    REFERENCES chatstreet.`users`(`user_id`)
    ON DELETE NO ACTION -- info: maybe change in future to nullable
    ON UPDATE NO ACTION
);

-- collections_contacts_lookup table
CREATE TABLE IF NOT EXISTS chatstreet.`collections_contacts_lookup` (
  `collections_id_fk` INT NOT NULL,
  `contacts_lookup_id_fk_1` INT NOT NULL,
  `contacts_lookup_id_fk_2` INT NOT NULL,
  PRIMARY KEY (`collections_id_fk`, `contacts_lookup_id_fk_1`, `contacts_lookup_id_fk_2`),
  CONSTRAINT `fk_collections_has_contacts_lookup_collections1`
    FOREIGN KEY(`collections_id_fk`)
    REFERENCES chatstreet.`collections`(`collection_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_collections_has_contacts_lookup_contacts_lookup1`
    FOREIGN KEY(`contacts_lookup_id_fk_1` , `contacts_lookup_id_fk_2`)
    REFERENCES chatstreet.`contacts_lookup`(`user_id_fk_1` , `contact_id_fk_2`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- keys table
CREATE TABLE IF NOT EXISTS chatstreet.`keys` (
  `user_id_fk` INT NOT NULL,
  `private_key` TEXT NOT NULL COMMENT 'Salted and Hashed',
  `public_key` TEXT NOT NULL COMMENT 'Salted and Hashed',
  PRIMARY KEY (`user_id_fk`),
  CONSTRAINT `fk_keys_users1`
    FOREIGN KEY(`user_id_fk`)
    REFERENCES chatstreet.`users`(`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- messages table
CREATE TABLE IF NOT EXISTS chatstreet.`messages` (
  `contacts_lookup_id_fk_1` INT NOT NULL,
  `contacts_lookup_id_fk_2` INT NOT NULL,
  `user_content` LONGTEXT NOT NULL COMMENT 'copy of the contact_content just encrypted with the users own public key.',
  `contact_content` LONGTEXT NOT NULL COMMENT 'message encrypted with the contacts public key.',
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(`contacts_lookup_id_fk_1`, `contacts_lookup_id_fk_2`),
  CONSTRAINT `fk_messages_contacts_lookup1`
    FOREIGN KEY(`contacts_lookup_id_fk_1` , `contacts_lookup_id_fk_2`)
    REFERENCES chatstreet.`contacts_lookup`(`user_id_fk_1` , `contact_id_fk_2`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);