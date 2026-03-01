const getUser = () => {
    const users = [
        {
            id: 1,
            name: "João",
            email: "joao@example.com",
            password: "123456",
        },
        {
            id: 2,
            name: "Maria",
            email: "maria@example.com",
            password: "654321",
        },
    ];

    return users;
};

module.exports = {
    getUser,
};
