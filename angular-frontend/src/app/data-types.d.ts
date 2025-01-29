interface Base {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: 0;
}

export interface Poll extends Base {
  title: string;
  totalSubmissions: number;
  questions: Question[];
  isActive: boolean;
  expiresAt: string;
  createdBy: User;
}

export interface Question extends Base {
  question: string;
  isRequired: boolean;
  options: Option[];
}

export interface Option extends Base {
  option: string;
}

export interface User extends Base {
  firstName: string;
  lastName: string;
}
