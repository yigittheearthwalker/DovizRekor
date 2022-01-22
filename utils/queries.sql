CREATE TABLE IF NOT EXISTS pulses(
	id VARCHAR(50) PRIMARY KEY,
	currency VARCHAR(10) NOT NULL,
	value FLOAT NOT NULL,
	receive_date DATE NOT NULL
);

INSERT INTO pulses(id, currency, value, receive_date) VALUES ($1, $2, $3, $4);