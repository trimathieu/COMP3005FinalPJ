-- Function to be performed

CREATE OR REPLACE FUNCTION email_publisher()
RETURNS trigger AS
$$
BEGIN
        SELECT p.email from publisher;

    RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

-- TRIGGER Creation

CREATE TRIGGER inventory_trigger
  AFTER UPDATE
  ON BOOK
  FOR EACH ROW
  EXECUTE PROCEDURE email_publisher();


  