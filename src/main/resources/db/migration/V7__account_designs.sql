ALTER TABLE design ADD COLUMN account_id int4 NULL;

CREATE INDEX idx_design_account_id ON design (account_id);

ALTER TABLE design ADD CONSTRAINT fk_design_account_id FOREIGN KEY (account_id) REFERENCES account(id);
