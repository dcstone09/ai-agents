# Claude Tool Use Documentation

## Overview
Claude can interact with external tools through the Messages API. Tools allow Claude to:
- Execute functions and process their results
- Make decisions based on tool outputs
- Chain multiple tool calls together
- Maintain context across tool interactions

## Tool Definition Format
Tools require these fields:
- `type`: String identifying the tool type (e.g. "function")
- `name`: Unique identifier for the tool
- `description`: Clear explanation of the tool's purpose and usage
- `parameters`: JSON Schema defining expected inputs

Example:
```json
{
  "type": "function",
  "name": "get_weather",
  "description": "Get current weather for a location",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name or zip code"
      }
    },
    "required": ["location"]
  }
}
```

## How Tool Use Works
1. Include tool definitions in your API request
2. Claude analyzes if tools are needed for the user's request
3. If tools are needed, Claude will:
   - Choose the appropriate tool
   - Format parameters correctly 
   - Return a tool call with stop_reason="tool_use"
4. Your application should:
   - Execute the requested tool
   - Return results in a tool_results content block
   - Let Claude determine if more tool calls are needed

## Best Practices
- Write clear, specific tool descriptions
- Use JSON Schema to validate all parameters
- Handle errors gracefully with informative messages
- Consider rate limits and timeouts
- Test tools with various inputs
- Keep tools focused and single-purpose

## Limitations
- Tools must be stateless
- No persistent storage between calls
- Limited to defined parameter types
- Cannot modify tool definitions mid-conversation
- Tool definitions cannot be nested

## Security Considerations
- Validate all inputs thoroughly
- Limit tool permissions appropriately
- Monitor and log tool usage
- Handle sensitive data carefully
- Consider rate limiting
