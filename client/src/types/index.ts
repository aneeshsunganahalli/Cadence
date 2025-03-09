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

export interface Transaction {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: number;
  paymentMethod: string;
  type: 'expense' | 'deposit';
}

export interface TransactionCardProps extends Transaction {
  onUpdate: () => void;
}


export * from './redux'

