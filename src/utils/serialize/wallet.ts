const serialize = ({id, createdAt, updatedAt, name, cpf, birthdate}) => ({
    address : id,
    name,
    cpf,
    birthdate,
    createdAt,
    updatedAt
});

export { serialize };