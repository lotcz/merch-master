ALTER TABLE shop_order_item ADD CONSTRAINT fk_shop_order_item_product_id
FOREIGN KEY (product_id) REFERENCES shop_product(id);
