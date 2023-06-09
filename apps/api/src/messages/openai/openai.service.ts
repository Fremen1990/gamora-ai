import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class OpenaiService {
  private CONTEXT_INSTRUCTION = 'Based on this context:';
  private INSTRUCTION = `As an expert in the fields of programming in JavaScript, TypeScript, React, React Query, StyledComponent and MaterialUI answer the questions below.`;
  private openai;
  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async createEmbedding(prompt) {
    const { data: embed } = await this.openai.createEmbedding({
      input: prompt,
      model: 'text-embedding-ada-002',
    });

    return embed;
  }

  async createCompletion(prompt, context) {
    const completion = await this.openai.createCompletion({
      // setup endpoint to chose from which model to use
      // model: 'gpt-3.5-turbo', // not working
      // model: 'gpt-4', // to get API and implement
      model: 'text-davinci-003',
      prompt: `${this.CONTEXT_INSTRUCTION}\n\n\nContext: "${context}" \n\n\n${this.INSTRUCTION} \n\n\n ${prompt}`,
      max_tokens: 250,
      temperature: 0.2,
    });

    return completion?.data.choices?.[0]?.text;
  }
}
