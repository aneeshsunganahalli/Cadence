export interface User {
  _id?: string
  username?: string
  email?: string
  avatar?: string
}

export interface UserState {
  currentUser: User | null;
  error: string | null;
  loading: boolean;
}

export interface Expense {
  _id: string,
  description: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: string | null;
}


export * from './redux'

