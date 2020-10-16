DROP TABLE IF EXISTS menu_items CASCADE;
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  cost SMALLINT NOT NULL,
  time_to_make SMALLINT NOT NULL,
  picture_url VARCHAR(255) NOT NULL
);
