export async function POST(request: Request) {
  const apiUrl = process.env.TIVOLI_API_URL;

  if (!apiUrl) {
    return Response.json(
      { error: "Missing Tivoli API URL" },
      { status: 500 }
    );
  }

  const body = await request.json();

  const response = await fetch(`${apiUrl}/identity-tokens/${body.token}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    return Response.json(data, { status: response.status });
  }

  return Response.json(data);
}