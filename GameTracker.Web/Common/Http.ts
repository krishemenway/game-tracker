export class Http {
	/**
	 * @param url Url path for get request.
	 * @param transformFunc Optional conversion function if you want something more complex than the response object stored.
	 * @template TResponse Describes the type for the json response
	 */
	public static get<TResponse, TTransformedData = TResponse>(url: string, transformFunc?: (response: TResponse) => TTransformedData): Promise<TTransformedData> {
		return fetch(url)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Received response status code: ${response.status}`);
				}

				return response.json().catch(() => {
					console.error(`JSON parsing failed for url ${url}`);
					throw new Error("Unknown response received from the server. Try again later.");
				});
			})
			.then((jsonResponse: TResponse) => {
				return transformFunc === undefined
					? jsonResponse as unknown as TTransformedData
					: transformFunc(jsonResponse);
			});
	}

	/**
	 * @param url Url path for post request
	 * @param request Request object to be JSON.stringified for the post body.
	 * @param transformFunc Optional conversion function if you want something more complex than the response object stored.
	 * @template TRequest Describes the type for the json request
	 * @template TResponse Describes the type for the json response
	 */
	public static post<TRequest, TResponse, TLoadableData>(url: string, request: TRequest, transformFunc?: (response: TResponse) => TLoadableData): Promise<TLoadableData> {
		const fetchRequest: RequestInit = {
			body: JSON.stringify(request),
			method: "post",
			headers: { "Content-Type": "application/json" },
		};

		return fetch(url, fetchRequest)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Received response status code: ${response.status}`);
				}

				return response.json().catch(() => {
					console.error(`JSON parsing failed for url ${url}`);
					throw new Error("Unknown response received from the server. Try again later.");
				});
			})
			.then((jsonResponse: TResponse) => {
				return transformFunc === undefined ? jsonResponse as unknown as TLoadableData : transformFunc(jsonResponse)
			});
	}
}
