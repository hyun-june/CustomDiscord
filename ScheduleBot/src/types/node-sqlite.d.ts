declare module "node:sqlite" {
  export class DatabaseSync {
    constructor(path: string);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
  }

  export class StatementSync {
    run(...values: unknown[]): { changes: number; lastInsertRowid: number | bigint };
    all(...values: unknown[]): unknown[];
  }
}
