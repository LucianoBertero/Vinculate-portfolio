export class Usuario {
  constructor(
    public name: string,
    public email: string,
    public password?: string,
    public google?: boolean,
    public role?: string,
    public uid?: string,
    public img?: string
  ) {}
}
