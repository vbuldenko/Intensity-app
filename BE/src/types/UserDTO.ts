export interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'client' | 'trainer' | 'admin';
}
