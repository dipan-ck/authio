export type Providers = 'postgres' | 'sqlite' | 'mysql';

export interface PrismaAdapterOptions {
   db: any;
   provider: Providers;
}
