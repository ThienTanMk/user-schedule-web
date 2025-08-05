export interface RoomResponse {
  name: string;
  location: string,
  capacity: number
}
export interface RoomRequest {
  name: string;
  location: string,
  capacity: number
}
export interface RoomWithStatus {
  name: string;
  location: string,
  capacity: number,
  status: string
}
