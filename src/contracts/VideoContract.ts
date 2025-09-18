
export interface VideoContract {
  _id?: string;          // mongo object id
  video_id?: number;     // optional numeric id
  title: string;
  description?: string;
  comments?: string;
  views?: number;
  likes?: number;
  url: string;           // embed url ideally: https://www.youtube.com/embed/...
  category_id?: number;
}