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

export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'expense' | 'deposit';
  isLoading: boolean;
}

export interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    description: string;
    amount: number;
    category: string;
    paymentMethod: string;
    date: string;
    type: 'expense' | 'deposit';
  }) => void;
}

export * from './redux'

