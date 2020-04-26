export class Http {
	/**
	 * @param url Url path for get request
	 * @template TResponse Describes the type for the json response
	 */
	public static get<TResponse>(url: string): Promise<TResponse> {
		return new Promise<TResponse>((onFulfilled, onRejected) => {
			fetch(url)
				.then((response) => {
					if (!response.ok) {
						throw new Error(`Received response status code: ${response.status}`);
					}

					return response.json();
				})
				.then((jsonResponse) => {
					onFulfilled(jsonResponse as TResponse);
				}, (reason) => {
					onRejected(reason);
				});
		});
	}

	/**
	 * @param url Url path for get request
	 * @param request Request for the post body
	 * @template TRequest Describes the type for the json request
	 * @template TResponse Describes the type for the json response
	 */
	public static post<TRequest, TResponse>(url: string, request: TRequest): Promise<TResponse> {
		return new Promise<TResponse>((onFulfilled, onRejected) => {
			fetch(url, { 
				body: JSON.stringify(request),
				method: "post",
				headers: { "Content-Type": "application/json" },
			})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Received response status code: ${response.status}`);
				}

				return response.json();
			})
			.then((jsonResponse) => {
				onFulfilled(jsonResponse as TResponse);
			}, (reason) => {
				onRejected(reason);
			});
		});
	}
}
