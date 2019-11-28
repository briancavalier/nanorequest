export class Request<R, A> {
  constructor(public readonly request: R, public readonly perform: (r: R) => A) {}

  map <B> (f: (a: A) => B): Request<R, B> {
    return new Request(this.request, r => f(this.perform(r)))
  }
}

export const createRequest = <R>(r: R): Request<R, R> =>
  new Request(r, r => r)

export const performRequest = <R, A> (r: Request<R, A>): A =>
  r.perform(r.request)

type Zip<R extends readonly Request<any, any>[]> = {
  [K in keyof R]: R[K] extends Request<any, infer A> ? A : never
}

export const zip = <Requests extends readonly Request<any, any>[], C>(f: (...args: Zip<Requests>) => C, ...requests: Requests): Request<typeof f, C> =>
  new Request(f, f => f(...requests.map(r => r.perform(r.request)) as any))
