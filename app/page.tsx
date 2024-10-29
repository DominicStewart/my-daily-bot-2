/** @format */

"use client";

import { useEffect, useState } from "react";
import { FunctionCallParams, LLMHelper, RTVIClient } from "realtime-ai";
import { DailyTransport } from "realtime-ai-daily";
import { RTVIClientAudio, RTVIClientProvider } from "realtime-ai-react";

import App from "./App";
import { defaultConfig } from "./rtvi.config";

export default function Home() {
	const [voiceClient, setVoiceClient] = useState<RTVIClient | null>(null);

	useEffect(() => {
		if (voiceClient) {
			return;
		}

		const newVoiceClient = new RTVIClient({
			transport: new DailyTransport(),
			params: {
				baseUrl: `/api`,
				requestData: {
					services: {
						stt: "deepgram",
						tts: "cartesia",
						llm: "anthropic",
					},
				},
				endpoints: {
					connect: "/connect",
					action: "/actions",
				},
				config: [
					{
						service: "tts",
						options: [
							{
								name: "voice",
								value: "79a125e8-cd45-4c13-8a67-188112f4dd22",
							},
						],
					},
					...defaultConfig,
				],
			},
		});

		const llmHelper = newVoiceClient.registerHelper(
			"llm",
			new LLMHelper({
				callbacks: {},
			})
		) as LLMHelper;

		llmHelper.handleFunctionCall(async (fn: FunctionCallParams) => {
			console.log("++++ handle function call", fn);
			const args = fn.arguments as any;
			console.log("++++ args", args);
			if (fn.functionName === "get_current_weather" && args.location) {
				const response = await fetch(
					`/api/weather?location=${encodeURIComponent(args.location)}`
				);
				console.log("++++ response", response);
				const json = await response.json();
				console.log("++++ json", json);
				return json;
			} else {
				return { error: "couldn't fetch weather" };
			}
		});

		setVoiceClient(newVoiceClient);
	}, [voiceClient]);

	return (
		<RTVIClientProvider client={voiceClient!}>
			<>
				<main className="flex min-h-screen flex-col items-center justify-between p-24">
					<div className="flex flex-col gap-4 items-center">
						<h1 className="text-4xl font-bold">My First Daily Bot</h1>
						<App />
					</div>
				</main>
				<RTVIClientAudio />
			</>
		</RTVIClientProvider>
	);
}
