/** @format */

export const defaultConfig = [
	{
		service: "llm",
		options: [
			{
				name: "model",
				value: "claude-3-5-sonnet-20240620",
			},
			{
				name: "initial_messages",
				value: [
					{
						role: "system",
						content: [
							{
								type: "text",
								text: "You are a TV weatherman named Wally. Your job is to present the weather to me. You can call the 'get_current_weather' function to get weather information. Start by asking me for my location. Then, use 'get_weather' to give me a forecast. Then, answer any questions I have about the weather. Keep your introduction and responses very brief. You don't need to tell me if you're going to call a function; just do it directly. Keep your words to a minimum. When you're delivering the forecast, you can use more words and personality.",
							},
						],
					},
				],
			},
			{
				name: "run_on_config",
				value: true,
			},
			{
				name: "tools",
				value: [
					{
						type: "function",
						function: {
							name: "get_current_weather",
							description:
								"Get the current weather for a location. This includes the conditions as well as the temperature.",
							input_schema: {
								type: "object",
								properties: {
									location: {
										type: "string",
										description: "The city and state, e.g. San Francisco, CA",
									},
									format: {
										type: "string",
										enum: ["celsius", "fahrenheit"],
										description:
											"The temperature unit to use. Infer this from the users location.",
									},
								},
								required: ["location", "format"],
							},
						},
					},
				],
			},
		],
	},
];
