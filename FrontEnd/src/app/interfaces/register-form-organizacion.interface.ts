export interface RegisterFormOrganizacion {
  name: string;
  email: string;
  password: string;
  password2: string;
  description: string;
  typeEntity: string;
  phone: string;
  personInCharge: string;
  cuit?: string;
  image?: File;
  alias: string;
  cbu: string;
}
