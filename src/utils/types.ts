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
  firstName: string;
  lastName?: string;
  email?: string;
  contactNumber?: string;
  website?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ICategory {
  _id?: string;
  categoryName: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ILanguage {
  _id?: string;
  languageName: string;
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
