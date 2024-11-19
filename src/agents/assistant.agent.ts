import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage } from '@langchain/core/messages';
import { StateGraph, MessagesAnnotation } from '@langchain/langgraph';

@Injectable()
export class AssistantAgent {
  private model: ChatAnthropic;
  private app: any; // The compiled workflow

  constructor(
    @InjectPinoLogger(AssistantAgent.name)
    private readonly logger: PinoLogger,
  ) {
    // Initialize the model
    this.model = new ChatAnthropic({
      modelName: 'claude-3-5-sonnet-20241022',
      temperature: 0,
    });

    // Create and compile the workflow
    this.initializeWorkflow();
  }

  private initializeWorkflow() {
    // Define the function that calls the model
    const callModel = async (state: typeof MessagesAnnotation.State) => {
      const response = await this.model.invoke(state.messages);
      return { messages: [response] };
    };

    // Create a basic workflow that just uses the model
    const workflow = new StateGraph(MessagesAnnotation)
      .addNode('agent', callModel)
      .addEdge('__start__', 'agent')
      .addEdge('agent', '__end__');

    // Compile the workflow
    this.app = workflow.compile();
  }

  async processMessage(message: string): Promise<string> {
    try {
      this.logger.info({ message }, 'Processing message');

      const finalState = await this.app.invoke({
        messages: [new HumanMessage(message)],
      });

      // Get the last message content
      const response =
        finalState.messages[finalState.messages.length - 1].content;

      this.logger.info({ response }, 'Generated response');
      return response;
    } catch (error) {
      this.logger.error({ error, message }, 'Error processing message');
      throw new Error(`Failed to process message: ${error.message}`);
    }
  }
}
