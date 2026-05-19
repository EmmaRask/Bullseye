type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const apiUrl = process.env.TIVOLI_API_URL;
  const apiKey = process.env.TIVOLI_API_KEY;

  if (!apiUrl || !apiKey) {
    return Response.json(
      { error: "Missing Tivoli API configuration" },
      { status: 500 }
    );
  }

  const { id } = await context.params;
  const body = await request.json();

  const response = await fetch(`${apiUrl}/transactions/${id}/payout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: body.amount,
      api_key: apiKey,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return Response.json(data, { status: response.status });
  }

  return Response.json(data);
}