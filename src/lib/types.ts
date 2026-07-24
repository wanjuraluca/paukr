export interface Topic {
  id: string;
  slug: string;
  name: string;
  is_premium: boolean;
  sort_order: number;
}

export interface Exam {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  topics: Topic[];
}
