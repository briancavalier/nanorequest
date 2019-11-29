export class Request<R, B, C> {
  constructor(public readonly request: R, public readonly perform: (b: B) => C) {}
}

export const map = <R, B, C, D> (f: (c: C) => D, r: Request<R, B, C>): Request<R, B, D> =>
  new Request(r.request, b => f(r.perform(b)))

export const lmap = <R, A, B, C> (f: (a: A) => B, r: Request<R, B, C>): Request<R, A, C> =>
  new Request(r.request, b => r.perform(f(b)))

export const createRequest = <R, A>(r: R): Request<R, A, A> =>
  new Request(r, a => a)

export const performRequest = <R, B> (r: Request<R, R, B>): B =>
  r.perform(r.request)

export type ZipRequests<R extends readonly Request<any, any, any>[]> = {
  [K in keyof R]: R[K] extends Request<infer A, any, any> ? A : never
}

export type ZipArgs<R extends readonly Request<any, any, any>[]> = {
  [K in keyof R]: R[K] extends Request<any, infer A, any> ? A : never
}

export type ZipReturns<R extends readonly Request<any, any, any>[]> = {
  [K in keyof R]: R[K] extends Request<any, any, infer A> ? A : never
}

export const zip = <Requests extends readonly Request<any, any, any>[]>(...requests: Requests): Request<ZipRequests<Requests>, ZipArgs<Requests>, ZipReturns<Requests>> =>
  new Request(requests.map(r => r.request) as any, inputs => requests.map((r, i) => r.perform(inputs[i])) as any)
