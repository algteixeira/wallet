const serialize = ({id, createdAt, updatedAt, name, cpf, birthdate}) => ({
    address : id,
    name,
    cpf,
    birthdate,
    createdAt,
    updatedAt
});
const serializeCoin = ({id, coin, fullname, amount}) => ({coin, fullname, amount});

const serializeGetAll = ({id, createdAt, updatedAt, name, cpf, birthdate, coins}) => ({
    name,
    cpf,
    birthdate,
    address: id,
    coins: coins.map(serializeCoin)
});

const serializeGetById = ({id, createdAt, updatedAt, name, cpf, birthdate, coins}) => ({
    name,
    cpf,
    birthdate,
    address: id,
    coins: coins.map(serializeCoin),
    createdAt,
    updatedAt
});

const serializeWallets = ({wallets, total}) => ({
    wallet: wallets.map(serializeGetAll),

});

export { serialize, serializeWallets, serializeGetAll, serializeGetById };