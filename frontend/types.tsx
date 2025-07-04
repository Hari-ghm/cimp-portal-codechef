export interface Student {
  regno: string;
  name: string;
  password: string | null;
  role: string[]; 
}

export interface Faculty {
  empid: number;
  name: string;
  password: string | null;
  role: string[];
}

export interface Club {
  clubid: number;
  name: string;
  president_regno: string; 
  president_name:string;
  coordinator_name:string
  faculty_coordinator_empid: number;
  total_members: number;
  created_on: string; 
  description: string;
}

export interface ClubMember {
  clubid: number;
  regno: string; 
  doj: string;
}
