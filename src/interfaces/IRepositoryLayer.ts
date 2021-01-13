export default interface IRepositoryLayer {
  client: any
  save<T>(...args: any): Promise<void>
  find<T>(...args: any): Promise<T | null>
  get<T>(...args: any): Promise<any>
}