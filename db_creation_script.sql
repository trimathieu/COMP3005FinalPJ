-- Database: comp3005pj

-- DROP DATABASE IF EXISTS comp3005pj;

CREATE DATABASE comp3005pj
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_Canada.1252'
    LC_CTYPE = 'English_Canada.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

COMMENT ON DATABASE comp3005pj
    IS 'COMP3005 Project database';

GRANT ALL ON DATABASE comp3005pj TO tristan;

GRANT ALL ON DATABASE comp3005pj TO postgres;

GRANT TEMPORARY, CONNECT ON DATABASE comp3005pj TO PUBLIC;