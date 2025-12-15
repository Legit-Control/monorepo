export const maxDuration = 30;
export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log(messages);
  return new Response('Hello, world!');
}
