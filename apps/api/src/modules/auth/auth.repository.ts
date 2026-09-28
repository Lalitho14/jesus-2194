interface UserDB {
  id: string;
  name: string;
  email: string;
  password: string;
  balance: number;
}

const users: UserDB[] = [];

export function find_user_by_email(email: string) {
  return users.find((user) => user.email === email);
}

export function find_user_by_id(id: string) {
  return users.find((user) => user.id === id);
}

export function create_user(user: UserDB) {
  users.push(user);

  console.log(users);

  return user;
}

export function update_balance(id: string, amount: number) {
  const user = find_user_by_id(id);

  if (!user) return null;

  user.balance += amount;

  return user;
}
