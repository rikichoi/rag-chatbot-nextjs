import {  LangChainAdapter , Message } from 'ai';
import { ChatOpenAI } from '@langchain/openai';

import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { vectorStore } from '@/lib/openai';
import { NextResponse } from 'next/server';
import { BufferMemory } from "langchain/memory";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const messages: Message[] = body.messages ?? [];
        const question = messages[messages.length - 1].content;

        const model = new ChatOpenAI({
            temperature: 0.8,
            streaming: true,
        });

        const retriever = vectorStore().asRetriever({
            "searchType": "mmr",
            "searchKwargs": { "fetchK": 10, "lambda": 0.25 }
        })
        const conversationChain = ConversationalRetrievalQAChain.fromLLM(model, retriever, {
            memory: new BufferMemory({
                memoryKey: "chat_history",
            }),
        })
        conversationChain.invoke({
            "question": question
        })

        const stream = await model.stream(question)

        return LangChainAdapter.toDataStreamResponse(stream);
    }
    catch (e) {
        return NextResponse.json({ message: 'Error Processing' + e }, { status: 500 });
    }
}