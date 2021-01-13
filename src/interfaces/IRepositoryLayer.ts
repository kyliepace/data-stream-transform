export default interface IRepositoryLayer {
  client: any
  save<T>(...args: any): Promise<string | null>
  find<T>(...args: any): Promise<T | null>
}