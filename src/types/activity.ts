export interface Instructor {
  id: number;
  email: string;
  number: string;
  firstName: string;
  image: string;
}

export interface Activity {
  id: number;
  title: string;
  start: Date;        // convert string → Date
  end: Date;
  address: string;
  image: string;
  link: string;
  cancelled: boolean;
  instructors: Instructor[];  // convert null → []
}