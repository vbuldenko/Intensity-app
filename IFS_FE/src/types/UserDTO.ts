export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'client' | 'trainer' | 'admin';
}
