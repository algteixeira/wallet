const serialize = ({id, createdAt, updatedAt, name, cpf, birthdate}) => ({
    address : id,
    name,
    cpf,
    birthdate,
    createdAt,
    updatedAt
});

const serializeV2 = ({id, createdAt, updatedAt, name, cpf, birthdate}) => ({
    name,
    cpf,
    birthdate,
    address: id
});

const serializeV3 = ({id, createdAt, updatedAt, name, cpf, birthdate}) => ({
    name,
    cpf,
    birthdate,
    address: id,
    createdAt,
    updatedAt
});

const serializeWallets = ({wallets, total}) => ({
    wallet: wallets.map(serializeV2),

});

export { serialize, serializeWallets, serializeV3 };