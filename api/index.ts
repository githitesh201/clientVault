export default async function handler(req: any, res: any): Promise<void> {
  const [{ app }, { connectDatabase }, { env }] = await Promise.all([
    import('../backend/src/app.js'),
    import('../backend/src/config/database.js'),
    import('../backend/src/config/env.js')
  ]);

  await connectDatabase(env.MONGO_URI);
  const handle = app as unknown as (request: any, response: any) => void;
  handle(req, res);
}
