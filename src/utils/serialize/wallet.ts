const serialize = ({ id, createdAt, updatedAt, name, cpf, birthdate }) => ({
    address: id,
    name,
    cpf,
    birthdate,
    createdAt,
    updatedAt
});

const serializeTransaction = ({ id, datetime, value, sendTo, receiveFrom, currentCotation }) => ({
    value,
    datetime,
    sendTo,
    receiveFrom,
    currentCotation
});

const serializeCoin = ({ id, coin, fullname, amount, transactions }) => ({
    coin,
    fullname,
    amount,
    transactions: transactions.map(serializeTransaction)
});

const serializeGetAll = ({ id, createdAt, updatedAt, name, cpf, birthdate, coins }) => ({
    name,
    cpf,
    birthdate,
    address: id,
    coins: coins.map(serializeCoin),
    createdAt,
    updatedAt
});

const serializeGetById = ({ id, createdAt, updatedAt, name, cpf, birthdate, coins }) => ({
    name,
    cpf,
    birthdate,
    address: id,
    coins: coins.map(serializeCoin),
    createdAt,
    updatedAt
});

const serializeWallets = ({ wallets, total }) => ({
    wallet: wallets.map(serializeGetAll)
});

const serializeGetTransactions = ({ id, coin, fullname, amount, transactions }) => ({
    coin,
    transactions: transactions.map(serializeTransaction)
});

export { serialize, serializeWallets, serializeGetAll, serializeGetById, serializeGetTransactions };
