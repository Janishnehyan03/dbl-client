export interface Address {
  place?: string;
  state?: string;
  country?: string;
}

export interface Contact {
  phone?: string;
  email?: string;
  website?: string;
}

export interface Publisher {
  _id: string;
  publisherName: string;
  address?: Address;
  contact?: Contact;
  establishedYear?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Author {
  _id?: string;
  name: string;
  email?: string;
  contactNumber?: string;
  website?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILocation {
  _id?: string;
  locationName: string;
}

export interface Member {
  _id: string;
  studentName?: string;
  teacherName?: string;
  admissionNumber?: string;
  class?: {
    className: string;
  };
  section?: {
    sectionName: string;
  };
}

export interface Book {
  id: string;
  title: string;
  accessionNumber: string;
  image?: string;
}

export interface Issue {
  _id: string;
  book: Book;
  issuedAt: string;
  returnDate: string;
  daysLate: number;
  fine: number;
}

export interface LibraryDetails {
  libraryName: string;
  libraryAddress?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface IQuote {
  id: string;
  text: string;
  author: string;
  // Add other fields if present in your CreateQuoteDto/UpdateQuoteDto
}

// types/category.ts
export interface ICategory {
  _id: string;
  name: string;
  description: string;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

export interface Section {
  _id: string;
  name: string;
  description?: string;
  hasDepartments: boolean;
}

export interface IClass {
  _id?: string;
  name: string;
  section: Section; // Section ID
}

export interface IDivision {
  _id: string;
  name: string;
}

export interface IDepartment {
  _id?: string;
  name: string;
  section: Section; // Section ID
}

export type Role = {
  _id: string;
  name: string;
  permissions: string[];
};

export type PermissionGroup = {
  name: string;
  permissions: string[];
};

export type Permission = {
  _id: string;
  name: string;
  description: string;
};

export type PermissionCategory = {
  _id: string;
  name: string;
  permissions: string[]; // Using string _IDs for simplicity in frontend
};

export type Role11 = {
  _id: string;
  name: string;
  permissions: string[]; // Using string IDs for simplicity in frontend
};

export interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  type: "student";
  section: Section;
  class: IClass;
  division: IDivision;
  department: IDepartment;
  role: Role11;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  type: "teacher";
  section: string;
}

export type Patron = Student | Teacher;

// types/bookTypes.ts

export interface BookFormData {
  title: string;
  accNumber: string;
  callNumber: string | null;
  publisher: string | null;
  pages?: number | null;
  authors?: Author[]; // Array of author IDs
  categories?: string[]; // Array of category IDs
  edition?: string | null;
  issn?: string | null;
  location?: string | null;
  language?: string | null;
  price?: number | null;
  isNewArrival?: boolean;
  available?: boolean;
  publishedDate?: string | null;
  isbn?: string | null;
  published: boolean;
  keywords?: string[];
}

export interface ILanguage {
  _id: string;
  name: string;
  code: string;
}

export interface IPublisher {
  _id: string;
  name: string;
  location?: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface Book {
  title: string;
  authors: Author[];
  categories: ICategory[];
  accNumber: string;
  pages?: number;
  edition?: string;
  issn?: string;
  location?: Location;
  publisher?: Publisher;
  callNumber?: string;
  language?: ILanguage;
  price?: number;
  isNewArrival?: boolean;
  available?: boolean;
  publishedDate?: string;
  isbn?: string;
  published?: boolean;
  keywords?: string[];
  createdAt?: string;
  updatedAt?: string;
  status:string
}

export type BookDocument = Book & { _id: string };
