function generateToken(user) {
    const token = btoa(JSON.stringify(user));
    return token;
}

function verifyToken(token) {
    const user = JSON.parse(atob(token));
    return user;
}

const user = {email: "gina", place: "paris"};
const token = generateToken(user);
console.log(token);
console.log(verifyToken(token));

const table = [
    "Pizza",
    "Pasta",
    "Tacos",
    "Kebab",
    "Quesadillas",
    "Mojito",
    "Tapas",
    "Planteur",
    "Coconut",
    "Mangue",
    "Jambon",
]

function filterTable(table, option) {
    return table.filter(item => item.charAt(0) === option);
};

const option = 'P';

console.log(filterTable(table, option));

