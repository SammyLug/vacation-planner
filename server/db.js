const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/vacation_planner_db');
const uuid = require('uuid');

// CREATE TABLES
const createTables = async() => {
  const SQL = `
  DROP TABLE IF EXISTS vacations;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS places;
  
  CREATE TABLE users(
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
  );
  CREATE TABLE places(
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
  );
  CREATE TABLE vacations(
    id UUID PRIMARY KEY,
    travel_date DATE DEFAULT now(),
    place_id UUID REFERENCES places(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL
  );
  `;
  await client.query(SQL);
};


// CREATE USER
const createUser = async({ name })=> {
  const SQL = `
  INSERT INTO users(id, name)
  VALUES($1, $2)
  RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

// CREATE PLACE
const createPlace = async({ name })=> {
  const SQL = `
  INSERT INTO places(id, name)
  VALUES($1, $2)
  RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

//  CREATE VACATION
const createVacation = async({ user_id, place_id, travel_date})=> {
  const SQL = `
  INSERT INTO vacations(id, user_id, place_id, travel_date)
  VALUES($1, $2, $3, $4)
  RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, place_id, travel_date]);
  return response.rows[0];
};

// FETCH USERS
const fetchUsers = async()=> {
  const SQL = `
  SELECT *
  FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// FETCH PLACES
const fetchPlaces = async()=> {
  const SQL = `
  SELECT *
  FROM places;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// FETCH VACATIONS
const fetchVacations = async()=> {
  const SQL = `
  SELECT *
  FROM vacations;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// DESTROY VACATION
const destroyVacation = async({ id, user_id })=> {
  const SQL = `
  DELETE FROM
  vacations
  WHERE id = $1 AND user_id = $2
  `;
  await client.query(SQL, [id, user_id]);
};

module.exports = {
  client,
  createTables,
  createUser,
  createPlace,
  createVacation,
  fetchUsers,
  fetchPlaces,
  fetchVacations,
  destroyVacation

};