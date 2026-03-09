create type tp_sync_state AS ENUM ('Pending', 'Synced');
create cast	(varchar AS tp_sync_state) WITH INOUT AS IMPLICIT;

create type tp_account_state AS ENUM ('Temporary', 'Pending', 'Approved', 'Disabled');
create cast	(varchar AS tp_account_state) WITH INOUT AS IMPLICIT;

CREATE TABLE account (
	id int4 PRIMARY KEY,
	created_on timestamptz(6) NOT NULL,
	last_updated_on timestamptz(6) NOT NULL,
	"name" varchar(255) NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	state tp_account_state NOT NULL DEFAULT 'Temporary'
);
CREATE UNIQUE INDEX idx_account_uuid ON account ("uuid");

create type tp_shop_state AS ENUM ('Pending', 'Approved', 'Disabled');
create cast	(varchar AS tp_shop_state) WITH INOUT AS IMPLICIT;

CREATE TABLE shop (
	id int4 PRIMARY KEY,
	created_on timestamptz(6) NOT NULL,
	last_updated_on timestamptz(6) NOT NULL,
	"name" varchar(255) NULL,
	slug varchar(50) NOT NULL,
	state tp_shop_state NOT NULL DEFAULT 'Pending',
	sync_state tp_sync_state NOT NULL DEFAULT 'Synced',
	account_id int4 NOT NULL,
	CONSTRAINT fk_shop_account_id FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_shop_account_id ON shop (account_id);
CREATE INDEX idx_shop_sync_state ON shop (sync_state);
CREATE UNIQUE INDEX idx_shop_slug ON shop (slug);

create type tp_user_state AS ENUM ('Temporary', 'Active', 'Disabled');
create cast	(varchar AS tp_user_state) WITH INOUT AS IMPLICIT;

CREATE TABLE usr (
	id int4 PRIMARY KEY,
	created_on timestamptz(6) NOT NULL,
	last_updated_on timestamptz(6) NOT NULL,
	"name" varchar(255) NULL,
	oauth_subject varchar(10) NOT NULL,
	account_id int4 NOT NULL,
	state tp_user_state NOT NULL DEFAULT 'Temporary',
	sync_state tp_sync_state NOT NULL DEFAULT 'Synced',
	CONSTRAINT fk_usr_account_id FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_usr_account_id ON usr (account_id);
CREATE INDEX idx_usr_sync_state ON usr (sync_state);
CREATE UNIQUE INDEX idx_usr_oauth_subject ON usr (oauth_subject);
